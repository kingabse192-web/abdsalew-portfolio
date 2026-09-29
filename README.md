# abdsalew-portfolio

**School registration landing page** — React + Vite, hand-built design system, and a
four-step application form with real validation.

[![Live demo](https://img.shields.io/badge/live%20demo-visit%20site-12362a?style=flat-square)](https://kingabse192-web.github.io/abdsalew-portfolio/)
[![Deploy](https://github.com/kingabse192-web/abdsalew-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/kingabse192-web/abdsalew-portfolio/actions/workflows/deploy.yml)
[![React](https://img.shields.io/badge/react-18-61dafb?style=flat-square&logo=react&logoColor=61dafb)](https://react.dev)
[![Vite](https://img.shields.io/badge/vite-5-646cff?style=flat-square&logo=vite&logoColor=646cff)](https://vitejs.dev)

### ▶️ Live demo

**https://kingabse192-web.github.io/abdsalew-portfolio/**

Deployed automatically to GitHub Pages on every push to `main`. Form submission is simulated
client-side, so the multi-step flow, validation, and success state are all safe to click through.

---

Built for **Northfield Academy**, a fictional independent K–12 school in Portland, Oregon, used
here as realistic content. No UI framework and no component library — the design system is plain
CSS custom properties. All copy, pricing, dates, and FAQ answers live in `src/data/content.js`
and can be swapped for a real school without touching a component.

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
and publishes `dist/` to GitHub Pages. Pages is already configured to use the workflow as its
source, so a push is all it takes.

1. `git push`
2. Watch the run in the [Actions tab](https://github.com/kingabse192-web/abdsalew-portfolio/actions/workflows/deploy.yml).
3. The site updates at https://kingabse192-web.github.io/abdsalew-portfolio/

The Vite config sets `base: './'`, so the project-site URL works without further changes.

If you fork this, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**
once, then update the live demo links above.

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
