// Salary Check — screen logic: reads what you type, keeps it, and redraws the status and list.
(function () {
  const CATEGORY_NAMES = {
    groceries: "Groceries",
    electricity: "Electricity",
    fuel: "Fuel",
    clothing: "Clothing",
    other: "Other",
  };

  const DEBIT_ROWS = 5;
  const STORAGE_KEY = "salaryCheck.v1";

  // Everything the app knows. Same shape as the saved data in spec.md > Data Model.
  const state = {
    salary: { amount: 0, frequency: "monthly", nextDate: "" },
    debitOrders: [],
    purchases: [],
    cycleStart: null,
  };

  const el = (id) => document.getElementById(id);

  // Local storage: the browser's sticky note for this app. If the browser blocks it
  // (e.g. private browsing), the app still works but shows a note that nothing is kept.
  let canSave = true;

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved) {
        Object.assign(state.salary, saved.salary || {});
        state.debitOrders = Array.isArray(saved.debitOrders) ? saved.debitOrders : [];
        state.purchases = Array.isArray(saved.purchases) ? saved.purchases : [];
        state.cycleStart = saved.cycleStart || null;
      }
    } catch (error) {
      canSave = false;
    }
    while (state.debitOrders.length < DEBIT_ROWS) {
      state.debitOrders.push({ name: "", amount: 0, frequency: "monthly" });
    }
  }

  function save() {
    if (!canSave) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      canSave = false;
      el("storage-note").hidden = false;
    }
  }

  // Today's date as "YYYY-MM-DD" in the phone's own time zone.
  function todayText() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  }

  // Turns "R1,200.50", "450" or " 600 " into a number. Anything else gives NaN.
  function parseAmount(text) {
    const cleaned = String(text).replace(/[Rr\s,]/g, "");
    if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return NaN;
    return Number(cleaned);
  }

  function daysWord(n) {
    return n === 1 ? "1 day" : `${n} days`;
  }

  function renderStatus() {
    const s = Calc.summary(state, todayText());
    const R = Calc.formatRand;
    const card = el("status");
    card.dataset.status = s.status;

    const ready = s.status !== "setup";
    el("status-spent").textContent = ready ? R(s.spent) : "R0";
    el("status-left").textContent = ready ? R(s.left) : "R0";
    el("status-days").textContent = ready ? String(Math.max(0, s.daysLeft)) : "–";

    const messages = {
      setup: "Enter your salary and salary date first.",
      "salary-day": "Your salary date has arrived. Reset when your salary comes in (button at the bottom).",
      "no-purchases": `${R(s.left)} left, ${daysWord(s.daysLeft)} until salary. Add purchases to see your pace.`,
      "running-low": `Running low: ${R(s.left)} left, ${daysWord(s.daysLeft)} until salary. At your pace you need about ${R(s.needed)}.`,
      "on-track": `On track: ${R(s.left)} left, ${daysWord(s.daysLeft)} until salary. At your pace you need about ${R(s.needed)}.`,
    };
    el("status-message").textContent = messages[s.status];
  }

  function renderPurchases() {
    const list = el("purchase-list");
    list.innerHTML = "";
    const newestFirst = [...state.purchases].reverse();
    for (const p of newestFirst) {
      const item = document.createElement("li");
      const label = p.category === "other" && p.label ? p.label : CATEGORY_NAMES[p.category] || p.category;
      const name = document.createElement("span");
      name.textContent = label;
      const amount = document.createElement("span");
      amount.className = "amount";
      amount.textContent = Calc.formatRand(p.amount);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove";
      remove.textContent = "✕";
      remove.setAttribute("aria-label", `Delete ${label} ${Calc.formatRand(p.amount)}`);
      remove.addEventListener("click", () => {
        state.purchases = state.purchases.filter((other) => other.id !== p.id);
        render();
      });
      item.append(name, " ", amount, remove);
      list.append(item);
    }
    el("purchase-empty").hidden = state.purchases.length > 0;

    // Totals per category, biggest first.
    const totalsList = el("category-totals");
    totalsList.innerHTML = "";
    const totals = Object.entries(Calc.categoryTotals(state.purchases)).sort((a, b) => b[1] - a[1]);
    for (const [category, total] of totals) {
      const item = document.createElement("li");
      item.innerHTML = `<span></span> <strong></strong>`;
      item.querySelector("span").textContent = CATEGORY_NAMES[category] || category;
      item.querySelector("strong").textContent = Calc.formatRand(total);
      totalsList.append(item);
    }
    totalsList.hidden = totals.length === 0;
  }

  // Reset: only when you say so, because salary can land late (e.g. a weekend salary paid on Monday).
  // The "Are you sure?" question is part of the page, not a browser pop-up,
  // because some browsers and home-screen apps silently block pop-ups.
  function showResetConfirm(show) {
    el("reset-button").hidden = show;
    el("reset-confirm").hidden = !show;
    if (show) el("reset-yes").focus();
  }

  el("reset-button").addEventListener("click", () => showResetConfirm(true));
  el("reset-cancel").addEventListener("click", () => showResetConfirm(false));
  el("reset-yes").addEventListener("click", () => {
    Object.assign(state, Calc.resetCycle(state, todayText()));
    el("salary-date").value = Calc.formatDayMonth(state.salary.nextDate);
    showResetConfirm(false);
    render();
  });

  function render() {
    el("debit-total").textContent = Calc.formatRand(state.salary.nextDate ? Calc.debitTotal(state) : 0);
    renderStatus();
    renderPurchases();
    save();
  }

  // Five debit-order rows: name, amount, monthly/weekly. Built once, then filled from saved data.
  function buildDebitRows() {
    const container = el("debit-rows");
    state.debitOrders.forEach((order, i) => {
      const row = document.createElement("div");
      row.className = "debit-row";
      row.innerHTML = `
        <input type="text" maxlength="24" autocomplete="off" aria-label="Debit order ${i + 1} name" placeholder="e.g. Car">
        <span class="rand-input"><span aria-hidden="true">R</span><input type="text" inputmode="decimal" autocomplete="off" aria-label="Debit order ${i + 1} amount"></span>
        <select aria-label="Debit order ${i + 1} how often">
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>`;
      const [nameInput, amountInput] = row.querySelectorAll("input");
      const frequencySelect = row.querySelector("select");

      nameInput.value = order.name || "";
      amountInput.value = Number(order.amount) > 0 ? order.amount : "";
      frequencySelect.value = order.frequency || "monthly";

      const update = () => {
        const amount = parseAmount(amountInput.value);
        state.debitOrders[i] = {
          name: nameInput.value.trim(),
          amount: Number.isNaN(amount) ? 0 : amount,
          frequency: frequencySelect.value,
        };
        render();
      };
      nameInput.addEventListener("input", update);
      amountInput.addEventListener("input", update);
      frequencySelect.addEventListener("change", update);
      container.append(row);
    });
  }

  // Put saved salary details back into the boxes.
  function fillSalaryInputs() {
    if (state.salary.amount > 0) el("salary-amount").value = state.salary.amount;
    el("salary-frequency").value = state.salary.frequency || "monthly";
    el("salary-date").value = Calc.formatDayMonth(state.salary.nextDate);
  }

  // Salary inputs: update the state and redraw on every change.
  // The date is typed as day/month ("25/10"); the year is worked out for you.
  function readSalary() {
    const amount = parseAmount(el("salary-amount").value);
    state.salary.amount = Number.isNaN(amount) ? 0 : amount;
    state.salary.frequency = el("salary-frequency").value;
    const dateText = el("salary-date").value.trim();
    state.salary.nextDate = Calc.dayMonthToDate(dateText, todayText());
    el("date-note").hidden = true;
    render();
  }

  // Only complain about the date once you've finished typing it.
  function checkSalaryDate() {
    const dateText = el("salary-date").value.trim();
    el("date-note").hidden = dateText === "" || state.salary.nextDate !== "";
    if (state.salary.nextDate) el("salary-date").value = Calc.formatDayMonth(state.salary.nextDate);
  }

  el("salary-amount").addEventListener("input", readSalary);
  el("salary-frequency").addEventListener("change", readSalary);
  el("salary-date").addEventListener("input", readSalary);
  el("salary-date").addEventListener("blur", checkSalaryDate);

  // Choosing "Other" opens a small box to type what it was.
  el("purchase-category").addEventListener("change", () => {
    const isOther = el("purchase-category").value === "other";
    el("purchase-other").hidden = !isOther;
    if (isOther) el("purchase-other").focus();
  });

  // Add a purchase: only real positive amounts get in.
  el("add-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = el("purchase-amount");
    const amount = parseAmount(input.value);
    if (Number.isNaN(amount) || amount <= 0) {
      el("add-note").hidden = false;
      input.focus();
      return;
    }
    el("add-note").hidden = true;
    const purchase = {
      id: "p" + Date.now() + Math.floor(Math.random() * 1000),
      amount,
      category: el("purchase-category").value,
      date: todayText(),
    };
    const otherName = el("purchase-other").value.trim();
    if (purchase.category === "other" && otherName) purchase.label = otherName;
    state.purchases.push(purchase);
    input.value = "";
    el("purchase-other").value = "";
    input.focus();
    render();
  });

  el("purchase-amount").addEventListener("input", () => {
    el("add-note").hidden = true;
  });

  load();
  el("storage-note").hidden = canSave;
  buildDebitRows();
  fillSalaryInputs();
  render();
})();
