// Automatic checks for the money maths. Run with: node --test
const test = require("node:test");
const assert = require("node:assert");
const Calc = require("../calc.js");

const TODAY = "2026-10-15";

function stateWith(salaryAmount, purchases) {
  return {
    salary: { amount: salaryAmount, frequency: "monthly", nextDate: "2026-10-29" }, // 14 days away
    debitOrders: [],
    purchases: purchases.map((p, i) => ({ id: "p" + i, date: TODAY, ...p })),
    cycleStart: null,
  };
}

test("formatRand shows rands with thousands commas and cents only when needed", () => {
  assert.strictEqual(Calc.formatRand(20000), "R20,000");
  assert.strictEqual(Calc.formatRand(1234.5), "R1,234.50");
  assert.strictEqual(Calc.formatRand(0), "R0");
  assert.strictEqual(Calc.formatRand(-500), "-R500");
});

test("dates: days between and one period forward/back", () => {
  assert.strictEqual(Calc.daysBetween("2026-10-15", "2026-10-29"), 14);
  assert.strictEqual(Calc.nextSalaryDate("2026-10-25", "monthly"), "2026-11-25");
  assert.strictEqual(Calc.nextSalaryDate("2026-01-31", "monthly"), "2026-02-28");
  assert.strictEqual(Calc.nextSalaryDate("2026-10-25", "weekly"), "2026-11-01");
});

test("before setup, status asks for salary and date", () => {
  const s = Calc.summary({ salary: { amount: 0, frequency: "monthly", nextDate: "" }, purchases: [] }, TODAY);
  assert.strictEqual(s.status, "setup");
});

test("no purchases yet: shows what's left and asks for purchases", () => {
  const s = Calc.summary(stateWith(20000, []), TODAY);
  assert.strictEqual(s.status, "no-purchases");
  assert.strictEqual(s.left, 20000);
  assert.strictEqual(s.daysLeft, 14);
});

test("PRD demo moment: R500 left, 14 days to go, R1,000-a-week fuel → running low", () => {
  const s = Calc.summary(
    stateWith(4500, [
      { amount: 1000, category: "fuel" },
      { amount: 1000, category: "fuel" },
      { amount: 2000, category: "groceries" },
    ]),
    TODAY
  );
  assert.strictEqual(s.left, 500);
  assert.strictEqual(s.daysLeft, 14);
  assert.strictEqual(s.status, "running-low");
  assert.ok(s.needed > s.left);
});

test("one more purchase tips the status from on track to running low", () => {
  const purchases = [{ amount: 8000, category: "groceries" }];
  const before = Calc.summary(stateWith(20000, purchases), TODAY);
  assert.strictEqual(before.status, "on-track");

  const after = Calc.summary(stateWith(20000, [...purchases, { amount: 5500, category: "fuel" }]), TODAY);
  assert.strictEqual(after.status, "running-low");
  assert.strictEqual(after.left, 6500);
  assert.strictEqual(after.needed, 11800);
});

test("salary date today or passed → salary-day status", () => {
  const state = stateWith(20000, [{ amount: 100, category: "other" }]);
  state.salary.nextDate = TODAY;
  assert.strictEqual(Calc.summary(state, TODAY).status, "salary-day");
});

test("salary date typed as day/month picks the nearest year", () => {
  assert.strictEqual(Calc.dayMonthToDate("25/10", "2026-10-15"), "2026-10-25");
  assert.strictEqual(Calc.dayMonthToDate("5/1", "2026-12-20"), "2027-01-05");
  assert.strictEqual(Calc.dayMonthToDate("28/12", "2027-01-03"), "2026-12-28");
  assert.strictEqual(Calc.dayMonthToDate("25.10", "2026-10-15"), "2026-10-25");
  assert.strictEqual(Calc.dayMonthToDate("31/02", "2026-10-15"), "");
  assert.strictEqual(Calc.dayMonthToDate("abc", "2026-10-15"), "");
  assert.strictEqual(Calc.formatDayMonth("2026-10-05"), "05/10");
});
