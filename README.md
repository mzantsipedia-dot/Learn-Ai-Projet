# Salary Check

A colourful, one-screen budgeting app for anyone whose salary is stretched thin. It answers one question: **"Will my money last until my next salary?"**

Enter your salary, your next salary date and your debit orders, then add purchases as you spend. The status box shows what you've spent, what's left, and the days until your next salary. If, at your current pace, the money won't last until salary day, it turns red with a plain "Running low" message.

The styling is inspired by Gustav Klimt's *The Kiss*: golds, reds, greens and starry blues. Amounts are always in South African rand.

## How to open it

No installation needed. It's plain HTML, CSS and JavaScript.

- Download or clone this repository, then double-click `index.html` to open it in your browser.
- Everything you type is saved in your browser's **local storage** on that device. Nothing is sent to the internet, and there are no accounts. Clearing your browser data wipes it.

## How to put it on your phone

1. Publish this repository with **GitHub Pages** (Settings → Pages → Deploy from a branch → `main`, folder `/ (root)`).
2. Open `https://<your-username>.github.io/<repo-name>/` on your phone.
3. Tap **Add to Home Screen**. It gets its own icon and opens like an app.

## How it works

| File | What it does |
|---|---|
| `index.html` | The single screen: salary, debit orders, status, add a purchase, this month's purchases, Reset |
| `styles.css` | Klimt colours, the decorative mosaic heading, phone-first layout |
| `calc.js` | The money maths only: what's left, spending pace, running low or on track, rand formatting |
| `app.js` | Reads what you type, saves and loads it, and redraws the screen |
| `manifest.webmanifest`, `icon.svg` | Name, icon and colours for Add to Home Screen |
| `tests/calc.test.js` | Automatic checks for the maths |

**The warning rule:** what's left = salary − debit orders − purchases. Your pace = purchases ÷ days since the period started. If what's left is less than your pace × days until salary, the status turns red.

## Checking the maths

With [Node.js](https://nodejs.org/) installed, run this in the project folder:

```
node --test
```

## What's not in this proof of concept

Receipt scanning, savings tips, month-to-month comparisons and sharing with family are ideas for later.
