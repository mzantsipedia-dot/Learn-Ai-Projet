---
doc: prd
status: approved
---

# Salary Check — Product Requirements

A colourful, one-screen budgeting app for someone in South Africa whose salary is stretched thin. It answers one question: **"Will my money last until my next salary?"**
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`.

## The Core Journey
Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

1. **First open:** the screen is blank, with empty boxes showing the rand sign (R), ready to fill in.
2. **Set up once:** enter your salary, how often it's paid (monthly or weekly), and your next salary date. Then enter your fixed debit orders (name, amount, monthly or weekly).
3. **Day to day:** in the single "add a purchase" row, type what you spent (e.g. R600), choose a category from the dropdown (groceries, electricity, fuel, clothing, other), and add it.
4. **See the answer:** the status area shows how much has been spent, how much is left, and how many days until your next salary. It works out your spending pace and turns **red with a "running low" message** if, at that pace, the money won't last until your salary date.
5. **Close and come back:** salary, salary date, and debit orders are still there. Purchases are too, until you reset.
6. **New month:** once your salary date has arrived, the app reminds you to reset. You press **Reset** when the money actually comes in, which clears the purchases and starts a fresh count.

## Screens and Layout
One screen, scrolling top to bottom:

1. **Heading:** "Salary Check" in a decorative, Klimt-style heading.
2. **Salary:** one compact row: amount (R), the salary date typed as day/month (e.g. 25/10), and a monthly/weekly dropdown.
3. **Debit orders:** about five rows, each with a name, an amount (R), and a monthly/weekly dropdown.
4. **Status:** spent, left, days until the next salary, and the on-track or running-low message.
5. **Add a purchase:** one compact row with amount (R), category dropdown, and an Add button.
6. **This month's purchases:** compact tags side by side (e.g. "Clothing R700 · Fuel R5,000") so a busy month still fits on a phone screen, with a total per category.
7. **Reset button:** clears purchases for the new month.

## Look and Feel
Source: `scope.md > Inspiration & Identity`.
- **Colours:** inspired by Gustav Klimt's *The Kiss*: bright golds and yellows, bright reds, greens, and starry blues.
- **Headings only:** elegant, decorative, "beautiful and patterny," like Klimt's gold patterns.
- **Everything else:** clean and simple, easy to read. Let the colours do the work.
- **Money:** always shown in South African rand (e.g. R20,000).
- **Red** is kept for warnings so it stands out.

## Features and Behavior

### Salary and Salary Date
- Enter salary amount, frequency (monthly/weekly), and the next salary date as day/month (e.g. 25/10). The year is worked out automatically.
- These stay saved until you change them yourself, e.g. after a raise or a new job with a different pay date.
  - [ ] After entering salary R20,000, monthly, and a date, then closing and reopening the app, the same values are still there.
  - [ ] Changing the salary amount or date updates the status straight away.

### Debit Orders
- About five rows for fixed payments that go off regularly (name, amount, monthly/weekly).
- Saved until you change them, and never cleared by Reset.
  - [ ] Debit orders reduce the "left" amount in the status.
  - [ ] Debit orders are still there after Reset.

### Adding a Purchase
- One row: amount + category dropdown (groceries, electricity, fuel, clothing, other) + Add.
- Choosing **Other** opens a small box to type what it was (e.g. "haircut"), which is shown in the purchases list.
- Each purchase is specific: "fuel R600" one day, "fuel R1,000" another.
  - [ ] Adding "R600, fuel" shows it in this month's purchases and raises "spent" by R600.
  - [ ] The fuel total for the month shows the sum of all fuel purchases.

### The Salary Warning (the kernel)
Source: `scope.md > The Unique Kernel`.
- **Left** = salary − debit orders − purchases since the last reset.
- **Pace** = how much you've spent per day since the last reset.
- **Running low** (red): if what's left won't cover your pace for the days remaining until the salary date. The message should be plain and specific, e.g. *"Running low: R500 left, 14 days until salary. At your pace you need about R2,000."*
- **On track:** a calm, positive message when the money left covers your pace.
  - [ ] Demo moment: with R500 left, 14 days to go, and fuel spending of about R1,000 a week, the status is red with a running-low message.
  - [ ] Adding one more purchase that tips the balance turns the status from on track to red, right away.

### Reset and Reminder
- The Reset button clears this month's purchases only. Salary, salary date, and debit orders stay.
- The app never resets on its own, because salary can land late (e.g. a weekend salary date paid on Monday).
- From the salary date onward, until reset, a reminder appears: *"Your salary date has arrived. Reset when your salary comes in."*
  - [ ] After Reset, the purchases list is empty and "spent" shows R0.
  - [ ] When the salary date is today or has passed, the reset reminder is visible.

## States and Boundaries
- **First use:** blank boxes with R signs. The status area asks you to enter your salary and salary date first instead of showing numbers.
- **No purchases yet:** the status shows what's left and the days until salary, and says to add purchases to see your pace.
- **Invalid amount** (blank, zero, negative, or letters): the purchase isn't added, and a short, friendly note asks for an amount in rands.
- **Salary date reached, not yet reset:** reset reminder (see Reset and Reminder).
- **What persists:** salary, frequency, salary date, debit orders, and the current purchases all stay when you close and reopen the app. Only Reset clears purchases.

## Product Decisions
- **Blank start with R signs:** no example numbers.
- **Monthly/weekly dropdowns** beside salary and debit orders, because some payments are weekly.
- **Fixed details stay until changed manually:** "once you've entered it, it shouldn't change up until you physically change it yourself."
- **Reset is manual, with a reminder:** salary can arrive late after a weekend, so auto-reset would be wrong.
- **Specific purchase entries:** the app works out the pace from real spending rather than you pre-setting budgets per category.
- **One compact entry row with a category dropdown**, so the screen doesn't fill up. Categories: groceries, electricity, fuel, clothing, other.
- **Decorative headings only**; everything else clean and simple.
- **Rands everywhere.**

**Assumptions (agent-suggested, confirmed by the learner):**
- The status area sits between the debit orders and the add-a-purchase row.
- You can delete a purchase from the list if you typed it wrong.
- Reset asks "Are you sure?" before clearing.
- After a reset, the app suggests the next salary date (one month or one week later), and you can change it.
- Weekly debit orders are counted for each week until the next salary date.

## What We're Building
Everything in **Features and Behavior** and **States and Boundaries**: one screen with salary and date, debit orders, the purchase entry row and list, the salary warning with its red running-low message, Reset with a reminder, saved details between visits, rand formatting, and Klimt-inspired styling.

## Deferred From the POC
- **Receipt photo scanning:** needs an AI image service and an account key. Later.
- **Junk-food spotting and savings tips:** depends on item-level receipt detail.
- **3-month comparison** with green when you spend less than last month: needs saved history across months.
- **Sharing with family and friends:** needs each person to have their own copy or account.

## Possible Later Enhancements
- Smarter tips per category ("fuel is your biggest cost this month").
- History of past months after each reset.

## Non-Goals
- **South African store price comparisons:** need live store data, far beyond a proof of concept.
- **Connecting to a bank account:** everything is typed in by you.
- **Multiple users or logins:** this proof of concept is for one person on one device.

## Open Questions
- None blocking `4-spec`.
