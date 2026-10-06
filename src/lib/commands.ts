import { facts, milestones, profile, projects, skillGroups } from '../data/profile'

export type OutputKind = 'text' | 'list' | 'kv' | 'projects' | 'skills' | 'facts' | 'timeline' | 'links' | 'help'

export interface Line {
  id: number
  kind: 'input' | 'output' | 'error'
}

export const sections = [
  { id: 'about', command: 'about' },
  { id: 'projects', command: 'projects' },
  { id: 'stack', command: 'stack' },
  { id: 'timeline', command: 'timeline' },
  { id: 'terminal', command: 'help' },
  { id: 'contact', command: 'contact' },
] as const

export type SectionId = (typeof sections)[number]['id']

export type Action = 'clear' | 'toggle-music' | 'stop-music' | 'play-music'

export interface Output {
  kind: OutputKind
  text?: string
  items?: readonly string[]
  pairs?: readonly { key: string; value: string }[]
  /** Scrolls the page to a section when the command runs. */
  scrollTo?: SectionId
  /** Side effect the shell performs after printing. */
  action?: Action
  /** Argument for the action, e.g. a track id. */
  arg?: string
}

export interface Command {
  name: string
  aliases: readonly string[]
  summary: string
  usage: string
  run: (args: readonly string[]) => Output
}

const HELP: readonly { name: string; usage: string; summary: string }[] = [
  { name: 'help', usage: 'help [command]', summary: 'List commands, or explain one' },
  { name: 'about', usage: 'about', summary: 'Who I am and what I do' },
  { name: 'projects', usage: 'projects [id]', summary: 'Project list, or one in detail' },
  { name: 'stack', usage: 'stack [group]', summary: 'Skills by group' },
  { name: 'timeline', usage: 'timeline', summary: 'What I have built, and when' },
  { name: 'contact', usage: 'contact', summary: 'How to reach me' },
  { name: 'whoami', usage: 'whoami', summary: 'Identity of the current user' },
  { name: 'ls', usage: 'ls', summary: 'List the sections of this site' },
  { name: 'open', usage: 'open <section>', summary: 'Scroll to a section' },
  { name: 'theme', usage: 'theme', summary: 'Toggle the lo-fi player' },
  { name: 'music', usage: 'music [track]', summary: 'Play, stop, or switch tracks' },
  { name: 'date', usage: 'date', summary: 'Current date and time' },
  { name: 'uname', usage: 'uname [-a]', summary: 'System information' },
  { name: 'sudo', usage: 'sudo <anything>', summary: 'Try it. I dare you.' },
  { name: 'clear', usage: 'clear', summary: 'Clear the terminal' },
]

export const commands: readonly Command[] = [
  {
    name: 'help',
    aliases: ['?'],
    summary: 'List commands, or explain one',
    usage: 'help [command]',
    run: (args) => {
      const target = args[0]
      if (target) {
        const found = commands.find((c) => c.name === target || c.aliases.includes(target))
        if (!found) return { kind: 'text', text: `help: no such command: ${target}` }
        return {
          kind: 'text',
          text: [
            `${found.usage}`,
            '',
            found.summary,
            found.aliases.length ? `aliases: ${found.aliases.join(', ')}` : '',
          ]
            .filter(Boolean)
            .join('\n'),
        }
      }
      return {
        kind: 'help',
        items: HELP.map((h) => `${h.usage.padEnd(24)}${h.summary}`),
      }
    },
  },
  {
    name: 'about',
    aliases: [],
    summary: 'Who I am and what I do',
    usage: 'about',
    run: () => ({
      kind: 'text',
      text: [
        `${profile.name} — ${profile.role}`,
        `${profile.location}`,
        '',
        profile.tagline,
        '',
        ...profile.summary.flatMap((p) => [p, '']),
        `availability: ${profile.availability}`,
      ].join('\n'),
    }),
  },
  {
    name: 'projects',
    aliases: ['ls', 'work'],
    summary: 'Project list, or one in detail',
    usage: 'projects [id]',
    run: (args) => {
      const id = args[0]
      if (id) {
        const found = projects.find((p) => p.id === id || p.id.startsWith(id))
        if (!found) {
          const names = projects.map((p) => p.id).join(', ')
          return { kind: 'text', text: `projects: unknown id '${id}'\navailable: ${names}` }
        }
        return {
          kind: 'text',
          text: [
            `${found.name}  [${found.kind}]`,
            `period:  ${found.period}    status: ${found.status}`,
            '',
            found.summary,
            '',
            ...found.detail.map((d) => `  • ${d}`),
            '',
            `stack: ${found.stack.join(' · ')}`,
            found.links.length ? `links: ${found.links.map((l) => `${l.label} → ${l.href}`).join('  ')}` : 'links: none published',
          ].join('\n'),
        }
      }
      return { kind: 'projects', items: projects.map((p) => p.id) }
    },
  },
  {
    name: 'stack',
    aliases: ['skills', 'tools'],
    summary: 'Skills by group',
    usage: 'stack [group]',
    run: (args) => {
      const group = args[0]
      if (group) {
        const found = skillGroups.find((g) => g.id === group || g.title.toLowerCase() === group)
        if (!found) {
          const names = skillGroups.map((g) => g.id).join(', ')
          return { kind: 'text', text: `stack: unknown group '${group}'\navailable: ${names}` }
        }
        return {
          kind: 'text',
          text: [
            `${found.title}`,
            '',
            found.blurb,
            '',
            ...found.skills.map((s) => `  ${s.name.padEnd(22)}${s.level}${s.note ? `  (${s.note})` : ''}`),
          ].join('\n'),
        }
      }
      return { kind: 'skills', items: skillGroups.map((g) => g.id) }
    },
  },
  {
    name: 'timeline',
    aliases: ['log', 'history'],
    summary: 'What I have built, and when',
    usage: 'timeline',
    run: () => ({ kind: 'timeline', items: milestones.map((m) => m.id) }),
  },
  {
    name: 'contact',
    aliases: ['email', 'reach'],
    summary: 'How to reach me',
    usage: 'contact',
    run: () => ({
      kind: 'links',
      items: [`email    ${profile.email}`, `github   ${profile.github}`, `resume   ${profile.resumeNote}`, ``, profile.availability],
    }),
  },
  {
    name: 'whoami',
    aliases: [],
    summary: 'Identity of the current user',
    usage: 'whoami',
    run: () => ({
      kind: 'text',
      text: [
        `${profile.name}  <${profile.handle}>`,
        `${profile.role}`,
        `${profile.location}`,
      ].join('\n'),
    }),
  },
  {
    name: 'open',
    aliases: ['goto'],
    summary: 'Scroll to a section',
    usage: 'open <section>',
    run: (args) => {
      const target = args[0]
      if (!target) {
        return { kind: 'text', text: `usage: open <section>\nsections: ${sections.map((s) => s.id).join(', ')}` }
      }
      const found = sections.find((s) => s.id === target)
      if (!found) return { kind: 'text', text: `open: no such section '${target}'` }
      return { kind: 'text', text: `scrolling to ${found.id}…`, scrollTo: found.id }
    },
  },
  {
    name: 'theme',
    aliases: [],
    summary: 'Toggle the lo-fi player',
    usage: 'theme',
    run: () => ({ kind: 'text', text: 'toggling the player…', action: 'toggle-music' }),
  },
  {
    name: 'music',
    aliases: ['play'],
    summary: 'Play, stop, or switch tracks',
    usage: 'music [track|stop]',
    run: (args) => {
      const target = args[0]
      if (target === 'stop' || target === 'off') return { kind: 'text', text: 'stopped.', action: 'stop-music' }
      if (!target) return { kind: 'text', text: 'starting…', action: 'toggle-music' }
      return { kind: 'text', text: `switching to ${target}…`, action: 'play-music', arg: target }
    },
  },
  {
    name: 'date',
    aliases: [],
    summary: 'Current date and time',
    usage: 'date',
    run: () => ({ kind: 'text', text: new Date().toString() }),
  },
  {
    name: 'uname',
    aliases: [],
    summary: 'System information',
    usage: 'uname [-a]',
    run: (args) => {
      const full = args.includes('-a')
      const base = `${profile.name.toLowerCase()}-dev`
      return {
        kind: 'text',
        text: full
          ? `${base} portfolio 6.9.0-1-main #1 SMP x86_64 GNU/Linux`
          : 'Linux',
      }
    },
  },
  {
    name: 'sudo',
    aliases: [],
    summary: 'Try it. I dare you.',
    usage: 'sudo <anything>',
    run: (args) => ({
      kind: 'text',
      text: args.length
        ? `${profile.handle} is not in the sudoers file. This incident has been reported.`
        : 'usage: sudo <command>',
    }),
  },
  {
    name: 'clear',
    aliases: ['cls'],
    summary: 'Clear the terminal',
    usage: 'clear',
    run: () => ({ kind: 'text', text: '', action: 'clear' }),
  },
]

export function findCommand(token: string): Command | undefined {
  return commands.find((c) => c.name === token || c.aliases.includes(token))
}

/** Commands whose name starts with `prefix` — drives tab completion. */
export function complete(prefix: string): readonly string[] {
  if (!prefix) return []
  return commands.map((c) => c.name).filter((n) => n.startsWith(prefix))
}

export const systemFacts = facts
