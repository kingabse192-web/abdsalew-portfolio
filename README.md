# Absalew — portfolio

My portfolio. A terminal-themed personal site: React, TypeScript, Vite, and Tailwind,
deployed to GitHub Pages.

**Live:** <https://kingabse192-web.github.io/abdsalew-portfolio/>

## What is in here

- **A working shell.** The navigation *is* a terminal. Type `help` for the command list —
  `projects`, `stack`, `timeline`, `open <section>`, `music`, `whoami`, `sudo`. Tab completes,
  `↑`/`↓` walk history, `ctrl+l` clears, `/` jumps focus.
- **A generative lo-fi player.** No audio files. Pads, bass, drums, and vinyl crackle are
  synthesised at runtime with the Web Audio API, so nothing is copyrighted.
- **Real content.** Projects, stack, and a dated timeline of what I have actually built.

## Stack

| Layer | Choice |
| --- | --- |
| UI | React 18, TypeScript 5 (strict, no `any`) |
| Build | Vite 5, Tailwind CSS 3 |
| Audio | Web Audio API, hand-written synth engine |
| Deploy | GitHub Pages via GitHub Actions |

## Development

```bash
npm install
npm run dev       # local dev server
npm run typecheck # tsc --noEmit
npm run build     # typecheck, then production build to dist/
npm run preview   # serve the production build
```

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main`: it installs, typechecks, builds,
and publishes `dist/` to GitHub Pages. Vite is configured with `base: './'` so the build works
from a project-path URL.

## Layout

```
src/
├── components/   # Boot, Nav, Hero, Terminal, Projects, Stack, Timeline, LoFi, Contact, Footer
├── data/         # typed profile content — the only place to edit copy
├── lib/          # lofi.ts (audio engine), commands.ts (shell), useShell.ts, hooks.ts
├── App.tsx       # composition, shell wiring, audio control
└── main.tsx
```

All copy lives in `src/data/profile.ts`. The terminal commands in `src/lib/commands.ts` read
from that same data, so the shell and the page can never disagree.

## Contact

Reach me on [GitHub](https://github.com/kingabse192-web). Based in Addis Ababa, Ethiopia.
