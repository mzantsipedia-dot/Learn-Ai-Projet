---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. Enter your salary, add a purchase, and see whether your money will last**
  Becomes usable: Open `index.html`, type a salary, frequency and next salary date, add purchases (amount + category), and the status card shows spent, left, days until salary, and turns red with a specific "Running low" message when the pace won't last. Bad amounts are rejected with a friendly note. Nothing is saved yet; plain clean styling with the Klimt colour palette.
  Why now: This is the unique kernel — the "will my money last?" answer. Building it first (scaffold included) proves the whole idea works before anything else is added, and the maths gets automatic checks from day one.
  PRD ref: `prd.md > The Core Journey` (steps 1–4), `prd.md > Salary and Salary Date`, `prd.md > Adding a Purchase`, `prd.md > The Salary Warning (the kernel)`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components` (Page Structure, Salary Section, Status Card, Add a Purchase Row, Calculations), `spec.md > File Structure`, `spec.md > Look and Feel`, `spec.md > Important Failure Modes`
  Build: Create `index.html`, `styles.css` (palette, phone-width column, readable inputs), `calc.js` (`daysBetween`, `cycleStart`, `debitTotal`, `summary`, `formatRand`, `nextSalaryDate`), `app.js` (salary inputs, add-a-purchase row with validation, simple purchase list, status card rendering all states), and `tests/calc.test.js` covering the PRD demo moment (R500 left, 14 days, ~R1,000/week fuel → running low) and the "one more purchase tips it red" case.
  Verify (mechanical): `node --test` passes; open `index.html` in a browser, enter R20,000 monthly with a date ~14 days away, add purchases until the status flips from on track to running low; confirm a blank/negative/letter amount is rejected; no console errors.
  Learner check: Double-click `index.html`. Type your salary and next salary date, then add a few purchases like "R600, Fuel". Watch the status box: does it show what's spent, what's left and the days to go? Keep adding purchases — does it turn red with a "Running low" message when it should? Try typing "abc" as an amount and see what happens.
  Commit: `Add salary entry, purchases, and running-low warning`

- [x] **2. Debit orders count, and everything is still there when you come back**
  Becomes usable: Five debit-order rows (name, amount, monthly/weekly) reduce what's left. Salary, debit orders and purchases are saved in local storage and come back after closing and reopening the page. If saving is blocked, a small note says so.
  Why now: Debit orders are the last piece of "set up once" and change the kernel's answer, so they belong right after it. Saving is what makes it usable day to day, and it's where the data shape could be wrong — cheap to find now.
  PRD ref: `prd.md > Debit Orders`, `prd.md > The Core Journey` (step 5), `prd.md > States and Boundaries` (what persists)
  Spec ref: `spec.md > Debit Orders Section`, `spec.md > Storage (app.js)`, `spec.md > Data Model`, `spec.md > Calculations (calc.js)` (`debitTotal`), `spec.md > Important Failure Modes`
  Build: Add the debit-orders section, include `debitTotal` in `left`, add `load()`/`save()` under `salaryCheck.v1`, save on every change, redraw from saved data on open, and show the storage-blocked note. Extend tests for monthly/weekly debit-order conversion.
  Verify (mechanical): `node --test` passes; in the browser enter salary, two debit orders and a purchase, reload the page and confirm all values return and "left" includes the debit orders; confirm the `salaryCheck.v1` entry matches the spec's data model.
  Learner check: Add two of your real debit orders (e.g. car, insurance) and watch "left" go down. Then close the browser tab completely, double-click `index.html` again, and check your salary, debit orders and purchases are all still there.
  Commit: `Add debit orders and save details between visits`

- [ ] **3. Manage the month: category totals, delete a mistake, and Reset**
  Becomes usable: The purchases list shows newest first with a ✕ to delete, plus a total per category. From the salary date onward a reminder appears; Reset asks "Are you sure?", clears purchases only, starts the count from today, and suggests the next salary date (still editable).
  Why now: Depends on saved purchases from slice 2. It completes the full month cycle in the core journey, so after this the whole journey can be tried end to end.
  PRD ref: `prd.md > Adding a Purchase` (category totals), `prd.md > Reset and Reminder`, `prd.md > The Core Journey` (step 6), `prd.md > Product Decisions` (assumptions)
  Spec ref: `spec.md > Purchases List`, `spec.md > Reset`, `spec.md > Status Card` (reset reminder), `spec.md > Calculations (calc.js)` (`cycleStart`, `nextSalaryDate`)
  Build: Category totals above the compact purchase tags, ✕ delete on each tag, reset reminder in the status card, Reset with confirm that clears purchases, sets `cycleStart`, and moves the salary date forward one period if it has passed. Extend tests for `nextSalaryDate` and post-reset `cycleStart`.
  Verify (mechanical): `node --test` passes; in the browser add two fuel purchases and confirm the fuel total is their sum; delete one and confirm totals and status update; set the salary date to today, confirm the reminder shows, Reset, and confirm purchases are empty, spent is R0, debit orders and salary remain, and the date moved forward.
  Learner check: Add two fuel purchases and check the fuel total adds up. Delete one with the ✕. Then change your salary date to today — do you see the reminder? Press Reset, say yes, and check the purchases are gone but your salary and debit orders stayed.
  Commit: `Add category totals, delete, and monthly reset`

- [ ] **4. Klimt look and ready for your phone's home screen**
  Becomes usable: The decorative "Salary Check" heading in Cinzel Decorative gold on a Klimt-style mosaic band, polished cards and colours, phone-first layout, plus `manifest.webmanifest`, `icon.svg` and a `README.md` so it can be added to a home screen later.
  Why now: The behaviour is all in place, so styling won't be redone by later changes. Your early feedback on slice 1's look feeds straight into this.
  PRD ref: `prd.md > Look and Feel`, `prd.md > Screens and Layout`
  Spec ref: `spec.md > Look and Feel`, `spec.md > Add-to-Home-Screen Bits`, `spec.md > File Structure`, `spec.md > External Services and Dependencies`
  Build: Finish `styles.css` (mosaic heading band, palette, red only for warnings, green for on track), link the Google Font with Georgia fallback, add `manifest.webmanifest`, `icon.svg`, and `README.md` (what it is, how to open it, how to put it on a phone).
  Verify (mechanical): `node --test` passes; open in the browser at phone width (~375px) and confirm no sideways scrolling, the heading font loads (or falls back to Georgia), the manifest and icon load without errors, and the full journey still works.
  Learner check: Open `index.html` and use your browser's phone view (or just make the window narrow). Does it feel like Klimt — golds, blues, the patterned heading — while the numbers stay easy to read? Run through the whole journey once more.
  Commit: `Add Klimt styling, home-screen icon, and README`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 1 (the running-low warning), so feedback on the kernel and the look can shape slices 2–4
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence:
Route and stops:
Edit outcome:
Reflection:
Activity mode:

## Revisions

- Salary row made compact, with the date typed as day/month (25/10) instead of a full date picker — learner feedback at the slice 1 checkpoint: the inputs were too big, and the year isn't needed.
- "Other" purchases get a small box to type what they were (stored as `label`) — learner feedback at the slice 1 checkpoint.
- Purchases list shown as compact side-by-side tags instead of one tall row each — learner feedback at the slice 1 checkpoint: a busy month would make the list far too long.
- Running-low rule kept as planned (pace-based, no fixed R3,000 line) — the learner considered a R3,000 threshold and chose to keep the original kernel.
