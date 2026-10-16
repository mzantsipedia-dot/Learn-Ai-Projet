---
doc: scope
status: approved
---

# Salary Check (working name)

A colourful little budgeting app that tells you whether your money will last until your next salary.

## The Unique Kernel
Most budgeting apps ask "did you go over your grocery limit?" This one asks the question that actually keeps you up at night: **"Will my money last until the next salary?"** It compares how much money is left with how many days are left until the next salary. If, say, it's two weeks after salary day and the cash is nearly gone, it lights up red.

## Who It's For
Me first: someone in South Africa whose salary gets "stretched thin" across debit orders, groceries, electricity, and fuel, and who wants to see exactly where the money went before running out mid-month. Then family and friends in the same position, like two friends whose cars recently broke down and who would have benefited from "knowing exactly where your money is and where you can cut costs."

## The Core Loop
1. Set up once: enter the salary, the pay date, and the fixed debit orders that go off every month.
2. Day to day: type in each purchase as it happens (amount + category, e.g. R450, groceries).
3. Open the app and see at a glance: where the money went, how much has been spent, how much is left, and whether it's on track to last until the next salary. Red means trouble.

You come back every time you spend, because the answer to "am I going to make it?" changes with each purchase.

## Inspiration & Identity
- Vibrant and painterly, inspired by **Gustav Klimt**, especially *The Kiss*: bright golds and yellows, bright reds, greens, and starry blues. ([The Kiss, Wikipedia](https://en.wikipedia.org/wiki/The_Kiss_(Klimt)))
- Clear, honest numbers in South African rand (R), with obvious highlighting so you can tell at a glance how things stand.

## Why This Matters to the Learner
"I need to juggle my salary between a lot of things… stretching the money thin." This is meant for everyday use, and later for family, friends, and others who need to know where their money goes.

## What "Working" Looks Like
A one-minute demo on one screen: the pay date and salary at the top, the fixed debit orders listed, and expenses entered at the bottom. As expenses are added, the app shows what's spent, what's left, and the days until the next salary. **The "oh, that's useful" moment:** adding one more purchase turns the status red, because the money won't last until the next salary.

## The POC Boundary
- Enter salary and pay date
- Enter fixed monthly debit orders (around five)
- Type in purchases with an amount and a category (groceries, electricity, fuel)
- Show total spent, money left, and days until the next salary
- Red warning when the money is running out faster than the days
- Rand currency and Klimt-inspired vibrant styling

## Later
- Photographing receipts so the app reads them and categorises spending
- Spotting junk food and sweets, and suggesting where you could have saved
- 3-month spending comparison, with green highlighting when you spend less than last month
- Sharing the app with family and friends

## Explicitly Cut
- **Receipt scanning, for now:** it needs an AI image service, an account and secret key, and possibly a per-scan cost. That would use up the 2–4 hours before the salary warning works. Moved to Later.
- **South African store price comparisons:** these need live price data from stores, which is far beyond a proof of concept.

