# Northfield Academy — Admissions Landing Page

A landing page for school registration, built with React and Vite. No UI framework, no
component library — just a hand-built design system in CSS custom properties.

**Northfield Academy** is a fictional independent K–12 school in Portland, Oregon, used here as
realistic content. All copy is in `src/data/content.js` and can be swapped for a real school
without touching any component.

## Features

**Design**

- Warm paper-and-ink palette with a single deep pine primary and an ochre accent
- Two typefaces: Fraunces (display) and Instrument Sans (UI)
- Asymmetric editorial layouts, hairline rules, tabular numerals
- Deliberately varied section rhythm — rails, dense tables, expandable rows, one large pull-quote

**Interaction**

- Live countdown to the application deadline in the utility bar
- Tappable document checklist in the hero card that drives a progress ring
- Filterable program list with expandable detail panels
- Tuition table with residency and payment-plan toggles that recalculate
- Four-step application form with per-step validation, an error summary that focuses fields,
  review-and-edit, drag-and-drop upload, simulated submit, and a success state
- Accordion FAQ, mobile drawer navigation, scroll-triggered reveals

**Accessibility**

- Semantic landmarks, skip link, visible focus rings
- `aria-invalid` and inline error text on every failing field
- Roving state on the form progress rail, `aria-expanded` on all disclosures
- Full `prefers-reduced-motion` support, and the body locks scroll behind the mobile drawer

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

## Deploying to GitHub Pages

A workflow is included at `.github/workflows/deploy.yml`. It builds on every push to `main`
and publishes `dist/` to GitHub Pages.

1. Push this repository to GitHub.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push again, or run the `Deploy to GitHub Pages` workflow manually from the Actions tab.

The site will be live at `https://<your-username>.github.io/<repo-name>/`. The Vite config
already sets `base: './'`, so a project-site URL works without further changes.

## Project structure

```
src/
  App.jsx                  page composition
  main.jsx                 entry point
  data/content.js          all copy, pricing, dates, FAQ — edit here
  hooks/index.js           useReveal, useStuck, useCountdown, useBodyLock, useEscape
  styles/
    tokens.css             color, type, spacing, radius, shadow, motion tokens
    base.css               reset, typography, layout primitives, reveal animation
    ui.css                 components and sections
  components/
    Chrome.jsx             utility bar, nav, mobile drawer, marquee, footer, icons
    Sections.jsx           hero, steps, programs, tuition, quote, people, dates, FAQ, CTA
    ApplyForm.jsx          the multi-step application form
```

## Making it yours

- **Content**: edit `src/data/content.js`. Every string, price, date, and FAQ answer lives there.
- **Colors**: change the custom properties at the top of `src/styles/tokens.css`.
- **Type**: swap the two font families in `tokens.css` and the `<link>` in `index.html`.
- **The form**: `ApplyForm.jsx` validates client-side and simulates a submit. To make it real,
  post the `data` object in the `setTimeout` inside `next()` to your endpoint.
