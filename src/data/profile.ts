export type SkillLevel = 'primary' | 'working' | 'learning'

export interface Skill {
  readonly name: string
  readonly level: SkillLevel
  readonly note?: string
}

export interface SkillGroup {
  readonly id: string
  readonly title: string
  readonly blurb: string
  readonly skills: readonly Skill[]
}

export interface ProjectLink {
  readonly label: string
  readonly href: string
}

export interface Project {
  readonly id: string
  readonly name: string
  readonly kind: string
  readonly period: string
  readonly status: 'live' | 'shipped' | 'active' | 'archived'
  readonly summary: string
  readonly detail: readonly string[]
  readonly stack: readonly string[]
  readonly links: readonly ProjectLink[]
}

export interface Milestone {
  readonly id: string
  readonly date: string
  readonly title: string
  readonly body: string
  readonly tags: readonly string[]
}

export interface Fact {
  readonly label: string
  readonly value: string
}

export const profile = {
  name: 'Absalew',
  handle: 'abdsalew',
  role: 'Full-stack & systems engineer',
  location: 'Addis Ababa, Ethiopia',
  tagline:
    'I build things that run — web apps on React, services on Node, and the Linux and container plumbing underneath both.',
  summary: [
    "I'm a 17-year-old developer working out of Addis Ababa. Most of my time goes to two things: building full-stack web applications, and the infrastructure that keeps them honest.",
    'I work primarily in the terminal — WSL and Termux — and I would rather understand a system end to end than ship a black box. That habit is why most of my projects end up with a Dockerfile, a compose file, and a deploy pipeline I actually understand.',
  ],
  availability: 'Open to internships, freelance work, and collaboration',
  // Left empty on purpose: I only link a real inbox here, never a placeholder.
  email: '',
  github: 'https://github.com/kingabse192-web',
  githubHandle: 'kingabse192-web',
  resumeNote: 'Available on request',
} as const

export const facts: readonly Fact[] = [
  { label: 'location', value: 'addis_ababa -- ISO 3166: ET' },
  { label: 'shell', value: 'zsh · WSL2 · Termux' },
  { label: 'editor', value: 'nvim' },
  { label: 'stack', value: 'react · typescript · node · docker' },
  { label: 'deploy', value: 'github actions → pages' },
  { label: 'audio', value: 'lo-fi, always' },
]

export const skillGroups: readonly SkillGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    blurb: 'Interfaces I can build and maintain without reaching for a framework I have not read.',
    skills: [
      { name: 'React', level: 'primary' },
      { name: 'TypeScript', level: 'primary', note: 'strict mode, no any' },
      { name: 'Vite', level: 'primary' },
      { name: 'Tailwind CSS', level: 'primary' },
      { name: 'JavaScript', level: 'primary' },
      { name: 'HTML', level: 'primary' },
      { name: 'CSS', level: 'primary' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & data',
    blurb: 'Enough server to make the frontend honest.',
    skills: [
      { name: 'Node.js', level: 'primary' },
      { name: 'Express', level: 'working' },
      { name: 'Firebase', level: 'working', note: 'auth, firestore' },
      { name: 'REST design', level: 'working' },
    ],
  },
  {
    id: 'infra',
    title: 'Infrastructure',
    blurb: 'The layer most people skip. I do not.',
    skills: [
      { name: 'Docker', level: 'primary' },
      { name: 'Docker Compose', level: 'working' },
      { name: 'Linux', level: 'primary', note: 'WSL2 · Termux' },
      { name: 'GitHub Actions', level: 'working' },
      { name: 'GitHub Pages', level: 'primary', note: 'static hosting' },
    ],
  },
  {
    id: 'automation',
    title: 'Automation & scripting',
    blurb: 'If a human does it twice, it should be a script.',
    skills: [
      { name: 'Python', level: 'primary' },
      { name: 'subprocess', level: 'working' },
      { name: 'yt-dlp', level: 'working' },
      { name: 'Bash', level: 'primary' },
    ],
  },
  {
    id: 'ai',
    title: 'Local AI',
    blurb: 'Running models and agents on hardware I control, not rented GPUs.',
    skills: [
      { name: 'OpenClaw', level: 'working' },
      { name: 'Hermes Agent', level: 'working' },
      { name: 'Local inference', level: 'learning' },
    ],
  },
  {
    id: 'systems',
    title: 'Systems & recovery',
    blurb: 'Low-level work: media, boot sectors, and boards that refuse to boot.',
    skills: [
      { name: 'Rufus / Ventoy', level: 'primary' },
      { name: 'diskpart · exFAT', level: 'working' },
      { name: 'Chromebook PHASER recovery', level: 'working' },
      { name: 'Bootable USB authoring', level: 'primary' },
    ],
  },
]

export const projects: readonly Project[] = [
  {
    id: 'portfolio',
    name: 'abdsalew-portfolio',
    kind: 'this site',
    period: '2026',
    status: 'live',
    summary:
      'A terminal-interactive developer portfolio. The CLI is the navigation, not a gimmick — real command history, tab completion, and structured output.',
    detail: [
      'Interactive shell with 14 commands, command history on arrow keys, and tab completion.',
      'Generative lo-fi engine built on the Web Audio API — synthesised chords, vinyl crackle, and a live spectrum analyser. No audio files, no copyright issues, works offline.',
      'Phosphor CRT treatment with scanlines, flicker, and a full reduced-motion escape hatch.',
      'Deployed to GitHub Pages by GitHub Actions on every push.',
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Web Audio API', 'GitHub Actions'],
    links: [
      { label: 'live', href: 'https://kingabse192-web.github.io/abdsalew-portfolio/' },
      { label: 'source', href: 'https://github.com/kingabse192-web/abdsalew-portfolio' },
    ],
  },
  {
    id: 'messaging',
    name: 'single-page messaging app',
    kind: 'full-stack',
    period: 'Jul 2026',
    status: 'active',
    summary:
      'A local single-page messaging application with a Node.js and Express backend. Built to understand the request lifecycle, not to ship a product.',
    detail: [
      'Node.js and Express API handling sessions, message routing, and state.',
      'Client-side single-page interface that stays in sync without a framework doing the work for me.',
      'Runs entirely on localhost — the point was owning the whole path from socket to screen.',
    ],
    stack: ['Node.js', 'Express', 'JavaScript'],
    links: [],
  },
  {
    id: 'firebase-app',
    name: 'full-stack web application',
    kind: 'web app',
    period: 'May 2026',
    status: 'shipped',
    summary:
      'A deployed, fully responsive web application — the first project where I owned the stack from component tree to production build.',
    detail: [
      'React, TypeScript, Vite, and Tailwind on the front end.',
      'Firebase for auth and persistence on the back end.',
      'Responsive across mobile, tablet, and desktop, and deployed to GitHub Pages.',
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Firebase'],
    links: [],
  },
  {
    id: 'media-automation',
    name: 'media automation scripts',
    kind: 'python',
    period: 'Feb – Mar 2026',
    status: 'shipped',
    summary:
      'A Python toolkit that drives yt-dlp through subprocess to fetch, convert, and organise media — turning a manual afternoon into one command.',
    detail: [
      'Python driving yt-dlp through subprocess with structured error handling.',
      'Batch downloads, format conversion, and automatic file organisation by metadata.',
      'Written because I got tired of doing it by hand.',
    ],
    stack: ['Python', 'subprocess', 'yt-dlp'],
    links: [],
  },
  {
    id: 'first-site',
    name: 'first live website',
    kind: 'deployment',
    period: 'Dec 2025',
    status: 'shipped',
    summary:
      'My first repository deployed to GitHub Pages. Small, but it taught me the part most tutorials skip — how static hosting actually works.',
    detail: [
      'Repository, build output, and deployment pipeline wired up end to end.',
      'Learned the constraints of static hosting the hard way, which is why routing and relative paths have never surprised me since.',
    ],
    stack: ['GitHub Pages', 'HTML', 'CSS'],
    links: [],
  },
]

export const milestones: readonly Milestone[] = [
  {
    id: 'm1',
    date: 'Dec 2025',
    title: 'First site live on GitHub Pages',
    body: 'Shipped my first repository to static hosting and learned what a build actually produces.',
    tags: ['GitHub Pages', 'Deployment'],
  },
  {
    id: 'm2',
    date: 'Feb – Mar 2026',
    title: 'Automation and removable media',
    body: 'Wrote Python tooling around yt-dlp, and built bootable drives with Rufus and Ventoy.',
    tags: ['Python', 'subprocess', 'yt-dlp', 'Rufus', 'Ventoy'],
  },
  {
    id: 'm3',
    date: 'May 2026',
    title: 'Full-stack app deployed',
    body: 'React, TypeScript, Vite, Tailwind, and Firebase — responsive end to end and live.',
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Firebase'],
  },
  {
    id: 'm4',
    date: 'Jul 2026',
    title: 'Express-backed messaging app',
    body: 'A single-page messaging client over a Node.js and Express API, running locally.',
    tags: ['Node.js', 'Express'],
  },
  {
    id: 'm5',
    date: '2026',
    title: 'Local AI agents',
    body: 'Running OpenClaw and Hermes Agent locally, plus system-level recovery work down to the board.',
    tags: ['OpenClaw', 'Hermes Agent', 'PHASER recovery'],
  },
]

/** ASCII banner. Rendered in a <pre>, so the glyphs are load-bearing. */
export const banner = String.raw`
 ▄▀█ ▄▀█ ▄▀█ █▄░█ ▄▀█ █░█ █▀█ ▄▀█ █▀█ █▀▀ █▀▀ █▀█
 █▀█ █▀█ █▀▄ █░▀█ █▀█ █▄█ █▄█ █▀█ ▄▀█ █▄▄ █▄▄ █▄█
`

export const promptUser = 'abdsalew'
export const promptHost = 'portfolio'
