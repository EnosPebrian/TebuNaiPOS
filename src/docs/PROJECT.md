# Tebu Commerce

## Vision

Build a reusable commerce engine for Tebu Nai.

The commerce engine must support:

- Beverage
- Snacks
- Main Course
- Dessert

without architecture changes.

---

# Architecture

Architecture is frozen.

Never rename domain concepts.

Never redesign without explicit instruction.

---

# Domain

Catalog
Category
Product
Package
Topping
Preset

ConfiguredProduct

Pricing

Cart

Checkout

Order

Promotion

Money

Customer

Fulfillment

---

# Folder Structure

src/

app/

components/

domain/

theme/

config/

hooks/

lib/

types/

utils/

---

# Component Rules

Every component lives inside its own folder.

Example

Button/

Button.tsx

index.ts

Never place components directly as \*.tsx files.

---

# Coding Rules

- TypeScript strict
- No any
- No duplicated code
- Small reusable components
- Composition over inheritance
- Domain Driven Design
- Repository pattern
- No architecture discussion
- Every feature compiles

---

# UI

Material UI

Premium look

Apple / Linear inspired

No Bootstrap

No Tailwind

---

# Commerce Rules

ConfiguredProduct is immutable.

Pricing Engine calculates totals.

Cart stores ConfiguredProducts.

Order is created only during checkout.

---

# Git

feat(...)

fix(...)

refactor(...)

---

# Done Criteria

Every feature:

✅ Compiles

✅ Mobile responsive

✅ Accessible

✅ Uses existing folder structure

✅ No TODO
