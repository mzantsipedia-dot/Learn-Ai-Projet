---
doc: spec
status: approved
---

# Salary Check — Technical Spec

## How This Works, In Plain Language
Salary Check is **one web page** that works on a phone, built from three kinds of files:
- **HTML** is the structure: the boxes, dropdowns, buttons, and headings.
- **CSS** is the style: Klimt golds, reds, greens, and starry blues, with decorative headings.
- **JavaScript** is the brains: it adds up your purchases, works out your spending pace, and decides when to turn red.

Everything you type is saved in **local storage**, a sticky note the phone's browser keeps just for this app. When you close the app and open it again, the page reads that sticky note and puts everything back. Nothing is sent to the internet, and there are no accounts or passwords.

We build and test it on the computer first. Then we put it online for free with **GitHub Pages**, which gives it a link. You open the link on your phone and tap **Add to Home Screen**, and it gets an icon and opens like an app.

**Why this shape:** a real app-store app would need heavy extra software, developer accounts (Apple charges a yearly fee), and store approval, which would use up the hackathon before the salary warning works. A web page gives the same everyday experience for a proof of concept.

**The tradeoff you accepted:** your data lives on one phone. It doesn't sync between devices, and clearing the browser's data wipes it.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.

1. **First open:** the phone loads `index.html`. `app.js` checks local storage, finds nothing, and shows blank boxes with R signs. The status says "Enter your salary and salary date first."
2. **Set up once:** you type your salary, frequency, and next salary date, plus your debit orders. Each change is saved to local storage straight away. `calc.js` works out what's left and the status updates.
3. **Add a purchase:** you type R600, choose "Fuel", and tap Add. `app.js` checks that the amount is a real positive number, adds it to the purchases list, and saves it.
4. **See the answer:** `calc.js` works out what's left, your pace per day, and the days until salary. If what's left won't cover your pace until salary day, `app.js` shows the red "Running low" message.
5. **Close and come back:** next time, `app.js` reads everything back from local storage and redraws the screen.
6. **New month:** if today is on or after the salary date, a reminder shows. Tapping **Reset** asks "Are you sure?", clears purchases only, starts the count from today, and suggests the next salary date one month (or week) later, which you can change.

## Stack
- **Plain HTML, CSS, and JavaScript, with no framework and nothing to install.** Chosen with the learner: it's the simplest thing that runs on any phone, and there's no extra tooling to set up or debug. Docs: [MDN HTML](https://developer.mozilla.org/en-US/docs/Web/HTML), [MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS), [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).
- **Local storage** (the browser's built-in sticky note) for saving. Chosen with the learner over accounts or an online database. Docs: [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- **GitHub Pages** for a free phone link. Chosen with the learner; they already have a GitHub account. Docs: [GitHub Pages quickstart](https://docs.github.com/en/pages/quickstart).
- **Google Fonts** for the decorative heading font (Cinzel Decorative), falling back to Georgia if offline. Docs: [Google Fonts](https://fonts.google.com/specimen/Cinzel+Decorative).
- **Node's built-in test runner** to check the money calculations automatically. This is for building only; the app itself doesn't need Node. Node v24 is already installed. Docs: [Node test runner](https://nodejs.org/api/test.html).

## Where It Runs and How Someone Tries It
- **During the build:** open `index.html` in a browser on the computer by double-clicking it. Nothing to start. To see the phone size, use the browser's phone view.
- **Checking the calculations:** run `node --test` in the project folder.
- **On a phone (optional deployment, chosen by the learner):** push the project to a **public** GitHub repository. Turn on GitHub Pages under Settings → Pages → "Deploy from a branch" → `main`, folder `/ (root)`. Open `https://<username>.github.io/<repo-name>/` on the phone, then tap Add to Home Screen. `6-ship` handles this.
- **Demo video:** record either the phone or the computer browser in phone view. Show: set salary and date → add debit orders → add purchases → status turns red → Reset reminder and Reset.
- **Submission needs** a short demo video and a public GitHub repository. The Pages link is a bonus, not a replacement.
- **Public GitHub repository:** https://github.com/mzantsipedia-dot/Learn-Ai-Projet (branch `main`).

## Look and Feel
From `prd.md > Look and Feel` and `scope.md > Inspiration & Identity`.
- **Palette (CSS variables):** gold `#d4a017`, yellow `#e8c547`, red `#c0392b` (warnings only), green `#2e8b57` (on-track), starry blue `#1f3a8a`, warm cream background `#fffaf0`, dark ink text `#2a2118`.
- **Headings only:** Cinzel Decorative in gold, framed by a Klimt-style mosaic band made with CSS patterns (small gold squares and circles on blue). "Beautiful and patterny."
- **Everything else:** clean system font (`system-ui`), large, easy-to-tap inputs and buttons, generous spacing, white cards on cream.
- **Phone first:** a single column up to about 480px wide, centred on bigger screens.
- **Money format:** always `R20,000`, or `R1,234.50` when cents are entered.
- **Copy tone:** plain, kind, specific. "Running low: R500 left, 14 days until salary. At your pace you need about R11,800."

## Components

### Page Structure (`index.html`)
The single screen, top to bottom: heading → Salary → Debit orders → Status → Add a purchase → This month's purchases → Reset.
PRD ref: `prd.md > Screens and Layout`.

### Salary Section
One compact row: amount input (R), salary date typed as day/month (`25/10`, year worked out as the nearest one to today), and a monthly/weekly dropdown. Saves on every change. A friendly note appears if the date can't be read.
PRD ref: `prd.md > Salary and Salary Date`.

### Debit Orders Section
Five rows: name, amount (R), monthly/weekly. Saves on every change. Never cleared by Reset.
PRD ref: `prd.md > Debit Orders`.

### Status Card
Shows spent, left, days until salary, and one message: set-up prompt, "add purchases to see your pace," on track (green), or running low (red). Also shows the reset reminder when the salary date has arrived.
PRD ref: `prd.md > The Salary Warning (the kernel)`, `prd.md > States and Boundaries`.

### Add a Purchase Row
Amount input + category dropdown (Groceries, Electricity, Fuel, Clothing, Other) + Add button. Choosing Other shows a small text box for what it was, saved as the purchase's `label`. Rejects blank, zero, negative, or non-number amounts with a friendly note.
PRD ref: `prd.md > Adding a Purchase`.

### Purchases List
This cycle's purchases as compact tags that wrap side by side ("Fuel R5,500"), newest first, each with a delete (✕) button. A total per category above the list.
PRD ref: `prd.md > Adding a Purchase`, `prd.md > Product Decisions` (delete assumption).

### Reset
Button → "Are you sure?" → clears purchases, sets the cycle start to today, and moves the salary date forward one period if it has passed (editable).
PRD ref: `prd.md > Reset and Reminder`.

### Calculations (`calc.js`)
Pure maths, with no screen code, so it can be tested on its own:
- `daysBetween(a, b)`: whole days between two dates.
- `cycleStart(state)`: the last reset date. Before any reset, it's one period before the next salary date (one month or one week back). That way, setting up mid-month still counts the days already gone.
- `debitTotal(state)`: monthly debit orders count once per monthly salary. Weekly ones count once for each week in the salary period (rounded up). With a weekly salary, monthly debit orders count as amount × 12 ÷ 52 per week.
- `summary(state, today)` → `{ spent, left, daysLeft, daysGone, pacePerDay, needed, status }`, where:
  - `left` = salary − debit orders − purchases
  - `pacePerDay` = purchases ÷ days gone (at least 1)
  - `needed` = pace × days left, rounded to the nearest R50
  - `status`: `setup` (no salary or date) · `salary-day` (days left ≤ 0) · `no-purchases` · `running-low` (left < needed, or left < 0) · `on-track`
- `formatRand(n)` → `"R20,000"` / `"R1,234.50"`.
- `nextSalaryDate(date, frequency)` → one month or one week later.
- `dayMonthToDate(text, today)` → `"25/10"` becomes a full date in the year nearest today; `formatDayMonth(date)` shows it back as `25/10`.

PRD ref: `prd.md > The Salary Warning (the kernel)`.

### Storage (`app.js`)
`load()` and `save()` wrap local storage under one key, `salaryCheck.v1`. If storage isn't available, the app still works, with a small note that changes won't be saved.
PRD ref: `prd.md > States and Boundaries` (what persists).

### Add-to-Home-Screen Bits
`manifest.webmanifest` + `icon.svg` give the app a name, icon, and colours when added to a phone home screen.
PRD ref: `scope.md > What "Working" Looks Like` (phone use from `4-spec`).

## Data Model
Everything lives in one local storage entry, `salaryCheck.v1`:

```json
{
  "salary": { "amount": 20000, "frequency": "monthly", "nextDate": "2026-10-31" },
  "debitOrders": [
    { "name": "Car", "amount": 4500, "frequency": "monthly" }
    // up to 5 rows; empty rows ignored
  ],
  "purchases": [
    { "id": "p1729000000000", "amount": 600, "category": "fuel", "date": "2026-10-15" },
    { "id": "p1729000000001", "amount": 150, "category": "other", "label": "haircut", "date": "2026-10-15" }
  ],
  "cycleStart": null   // set to the reset date after the first Reset
}
```

| Data | Updated when | After closing and coming back |
|---|---|---|
| Salary, frequency, salary date | You change it | Still there |
| Debit orders | You change them | Still there, and kept by Reset |
| Purchases | Add or ✕ delete | Still there until Reset |
| Cycle start | Reset | Still there |

## File Structure

```
learn-ai-project/
├── index.html             # the single screen (structure)
├── styles.css             # Klimt colours, decorative headings, phone layout
├── calc.js                # money maths only: left, pace, needed, status, rand format
├── app.js                 # screen logic: reads inputs, saves/loads, draws status & list
├── manifest.webmanifest   # name/icon/colours for "Add to Home Screen"
├── icon.svg               # app icon (gold Klimt-style mosaic)
├── tests/
│   └── calc.test.js       # automatic checks for calc.js (run: node --test)
├── README.md              # what it is, how to open it, how to put it on a phone
├── .gitignore             # keeps learner-profile and secrets out of GitHub
└── devpost/               # planning docs (scope, PRD, spec, checklist)
```

`calc.js` works both in the browser and in Node tests, so the same maths that runs on the phone is the maths that gets tested.

## External Services and Dependencies
- **Google Fonts** (Cinzel Decorative): one `<link>` tag, free, no key. If it fails to load, Georgia is used.
- **GitHub Pages:** free for public repositories, no key; set up in `6-ship`.
- No APIs, no accounts, no costs.

## Important Failure Modes
- **Local storage blocked** (e.g. private browsing) → the app still works, with a small note: "Your details won't be saved in this browser mode."
- **Bad amount typed** (blank, 0, negative, letters) → nothing is added, and a note says "Please enter an amount in rands, like 450."
- **Salary date in the past at setup, or today** → status shows the reset reminder instead of a pace message, and you can fix the date.

## What Was Simplified and Why
- **A phone web app** instead of an app-store app. It's the same daily experience without store accounts, fees, or approval. A store app later would need a wrapper like Capacitor, plus developer accounts.
- **Local storage** instead of an online database with logins. One person, one phone, no passwords. Sharing with family later would need accounts or a sync service.
- **Fixed five debit-order rows** instead of add/remove rows. This keeps the screen simple and matches "about five" from the PRD.
- **Simple pace** (total spent ÷ days gone) instead of per-category forecasting. It's enough to catch "R500 left with two weeks to go," and smarter per-category tips are deferred in the PRD.

## Decisions and Open Issues
**Learner decisions:**
- Phone is the main device. Viewing on a computer is fine but not required.
- Phone-friendly web app + local storage + GitHub Pages. The learner accepted the agent's recommendation and its tradeoff (data on one phone only).
- Uses their existing GitHub account.

**Implementation details derived from those (agent):**
- File split (`calc.js` separate from `app.js`) so the maths can be tested.
- Before the first Reset, the cycle start is one period before the salary date, so mid-month setup counts real days gone.
- Debit-order frequency conversion rules (see Calculations).
- Rounding "needed" to the nearest R50 so the message reads naturally.

**Learner uncertainty:** none identified. The learner said, "Nothing is unclear… I actually understand most of it." If questions come up during the build (e.g. how local storage works), `5-build` explains them as they arise.

**Open issues:** none blocking. Check early in the build that the Google Font loads, and that the date picker behaves well on the learner's phone browser.
