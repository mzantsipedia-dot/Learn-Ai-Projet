// Salary Check — money maths only. No screen code here, so it can be tested on its own.
// Works in the browser (as window.Calc) and in Node tests (via require).
(function (root) {
  const DAY_MS = 24 * 60 * 60 * 1000;

  // Dates are kept as "YYYY-MM-DD" text. Parse them as UTC so daylight-saving never shifts a day.
  function parseDate(text) {
    const [y, m, d] = text.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  }

  function toDateText(ms) {
    return new Date(ms).toISOString().slice(0, 10);
  }

  // Whole days from date a to date b (negative if b is before a).
  function daysBetween(a, b) {
    return Math.round((parseDate(b) - parseDate(a)) / DAY_MS);
  }

  // Move a date one period forward (steps = 1) or back (steps = -1).
  // Monthly keeps the same day of the month, clamped to the month's last day (e.g. 31 Jan → 28 Feb).
  function addPeriod(dateText, frequency, steps) {
    if (frequency === "weekly") {
      return toDateText(parseDate(dateText) + steps * 7 * DAY_MS);
    }
    const [y, m, d] = dateText.split("-").map(Number);
    const target = new Date(Date.UTC(y, m - 1 + steps, 1));
    const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
    target.setUTCDate(Math.min(d, lastDay));
    return toDateText(target.getTime());
  }

  function nextSalaryDate(dateText, frequency) {
    return addPeriod(dateText, frequency, 1);
  }

  // When this salary period started: the last Reset, or (before any Reset)
  // one period before the next salary date, so a mid-month setup counts the days already gone.
  function cycleStart(state) {
    if (state.cycleStart) return state.cycleStart;
    return addPeriod(state.salary.nextDate, state.salary.frequency, -1);
  }

  // Debit orders that come off this salary period.
  function debitTotal(state) {
    const salaryFrequency = state.salary.frequency;
    const orders = (state.debitOrders || []).filter((o) => Number(o.amount) > 0);
    let total = 0;
    for (const order of orders) {
      const amount = Number(order.amount);
      if (salaryFrequency === "weekly") {
        total += order.frequency === "weekly" ? amount : (amount * 12) / 52;
      } else if (order.frequency === "weekly") {
        const periodDays = daysBetween(cycleStart(state), state.salary.nextDate);
        total += amount * Math.max(1, Math.ceil(periodDays / 7));
      } else {
        total += amount;
      }
    }
    return total;
  }

  function roundTo50(n) {
    return Math.round(n / 50) * 50;
  }

  // The answer to "will my money last until my next salary?"
  function summary(state, today) {
    const salary = state.salary || {};
    const salaryAmount = Number(salary.amount) || 0;
    if (salaryAmount <= 0 || !salary.nextDate) {
      return { spent: 0, left: 0, daysLeft: 0, daysGone: 0, pacePerDay: 0, needed: 0, status: "setup" };
    }

    const spent = (state.purchases || []).reduce((sum, p) => sum + Number(p.amount), 0);
    const left = salaryAmount - debitTotal(state) - spent;
    const daysLeft = daysBetween(today, salary.nextDate);
    const daysGone = Math.max(1, daysBetween(cycleStart(state), today));
    const pacePerDay = spent / daysGone;
    const needed = roundTo50(pacePerDay * Math.max(0, daysLeft));

    let status;
    if (daysLeft <= 0) status = "salary-day";
    else if (left < 0) status = "running-low";
    else if (spent === 0) status = "no-purchases";
    else if (left < needed) status = "running-low";
    else status = "on-track";

    return { spent, left, daysLeft, daysGone, pacePerDay, needed, status };
  }

  // 20000 → "R20,000"; 1234.5 → "R1,234.50"; -500 → "-R500"
  function formatRand(n) {
    const value = Math.round(Number(n) * 100) / 100;
    const sign = value < 0 ? "-" : "";
    const abs = Math.abs(value);
    const hasCents = abs % 1 !== 0;
    const text = abs.toLocaleString("en-US", {
      minimumFractionDigits: hasCents ? 2 : 0,
      maximumFractionDigits: hasCents ? 2 : 0,
    });
    return sign + "R" + text;
  }

  // "25/10" → a full date. The year isn't typed, so pick the year that puts the date
  // closest to today (e.g. typed in December, "05/01" means next January). Returns "" if invalid.
  function dayMonthToDate(text, today) {
    const match = String(text).trim().match(/^(\d{1,2})\s*[\/.\-]\s*(\d{1,2})$/);
    if (!match) return "";
    const day = Number(match[1]);
    const month = Number(match[2]);
    if (month < 1 || month > 12 || day < 1) return "";
    const year = Number(today.slice(0, 4));
    let best = "";
    for (const y of [year - 1, year, year + 1]) {
      const lastDay = new Date(Date.UTC(y, month, 0)).getUTCDate();
      if (day > lastDay) continue;
      const candidate = toDateText(Date.UTC(y, month - 1, day));
      if (!best || Math.abs(daysBetween(today, candidate)) < Math.abs(daysBetween(today, best))) {
        best = candidate;
      }
    }
    return best;
  }

  // "2026-10-25" → "25/10"
  function formatDayMonth(dateText) {
    if (!dateText) return "";
    const [, m, d] = dateText.split("-");
    return `${d}/${m}`;
  }

  // { fuel: 1600, groceries: 2000 } — the month's spending per category.
  function categoryTotals(purchases) {
    const totals = {};
    for (const p of purchases || []) {
      totals[p.category] = (totals[p.category] || 0) + Number(p.amount);
    }
    return totals;
  }

  // Reset for a new salary period: purchases cleared, the count starts today, and the salary date
  // moves forward (one period at a time) if it has arrived. Salary and debit orders are kept.
  function resetCycle(state, today) {
    let nextDate = state.salary.nextDate;
    if (nextDate) {
      while (daysBetween(today, nextDate) <= 0) {
        nextDate = nextSalaryDate(nextDate, state.salary.frequency);
      }
    }
    return {
      ...state,
      salary: { ...state.salary, nextDate },
      purchases: [],
      cycleStart: today,
    };
  }

  const api = {
    daysBetween, addPeriod, nextSalaryDate, cycleStart, debitTotal, summary, formatRand,
    dayMonthToDate, formatDayMonth, categoryTotals, resetCycle,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.Calc = api;
  }
})(this);
