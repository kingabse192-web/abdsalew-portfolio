import { useEffect, useRef } from 'react'
import { banner, milestones, profile, promptHost, promptUser, projects, skillGroups } from '@/data/profile'
import type { Entry } from '@/lib/useShell'

interface TerminalProps {
  entries: readonly Entry[]
  input: string
  onInput: (value: string) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onRun: (command: string) => void
}

const STATUS_COLOR: Record<string, string> = {
  live: 'text-phos',
  active: 'text-cyan',
  shipped: 'text-amber',
  archived: 'text-dim',
}


function OutputBlock({ entry, onRun }: { entry: Entry; onRun: (command: string) => void }) {
  const output = entry.output
  if (!output) return null

  if (output.kind === 'text') {
    return (
      <pre className="whitespace-pre-wrap break-words text-fg">{output.text}</pre>
    )
  }

  if (output.kind === 'help') {
    return (
      <div className="space-y-1">
        <p className="text-muted">available commands:</p>
        <ul className="mt-2 space-y-0.5">
          {(output.items ?? []).map((item) => {
            const [usage = '', ...rest] = item.split(/(?<= {2,})/)
            return (
              <li key={usage} className="flex flex-wrap gap-x-3 text-xs">
                <span className="text-phos">{usage.trim()}</span>
                <span className="text-muted">{rest.join(' ')}</span>
              </li>
            )
          })}
        </ul>
        <p className="mt-3 text-xs text-dim">
          tab completes · ↑/↓ walks history · ctrl+l clears
        </p>
      </div>
    )
  }

  if (output.kind === 'kv') {
    return (
      <dl className="space-y-0.5 text-xs">
        {(output.pairs ?? []).map((pair) => (
          <div key={pair.key} className="flex gap-3">
            <dt className="w-28 shrink-0 text-dim">{pair.key}</dt>
            <dd className="min-w-0 break-all text-fg">{pair.value}</dd>
          </div>
        ))}
      </dl>
    )
  }

  if (output.kind === 'projects') {
    return (
      <ul className="space-y-1.5">
        {(output.items ?? []).map((id) => {
          const project = projects.find((p) => p.id === id)
          if (!project) return null
          return (
            <li key={id} className="flex flex-wrap items-baseline gap-x-3 text-xs">
              <button
                onClick={(event) => {
                  event.stopPropagation()
                  onRun(`projects ${id}`)
                }}
                className="text-phos underline decoration-dotted underline-offset-4 hover:text-fg"
              >
                {id}
              </button>
              <span className="text-muted">{project.summary.split('.')[0]}.</span>
              <span className={`text-2xs ${STATUS_COLOR[project.status] ?? 'text-muted'}`}>
                [{project.status}]
              </span>
            </li>
          )
        })}
        <li className="pt-1 text-2xs text-dim">run: projects &lt;id&gt;</li>
      </ul>
    )
  }

  if (output.kind === 'skills') {
    return (
      <div className="space-y-2">
        {(output.items ?? []).map((id) => {
          const group = skillGroups.find((g) => g.id === id)
          if (!group) return null
          return (
            <p key={id} className="text-xs">
              <span className="text-phos">{group.id.padEnd(12)}</span>
              <span className="text-muted">
                {group.title} — {group.skills.length} tools
              </span>
            </p>
          )
        })}
        <p className="pt-1 text-2xs text-dim">run: stack &lt;group&gt;</p>
      </div>
    )
  }

  if (output.kind === 'timeline') {
    return (
      <ol className="space-y-3">
        {(output.items ?? []).map((id) => {
          const milestone = milestones.find((m) => m.id === id)
          if (!milestone) return null
          return (
            <li key={id} className="flex flex-wrap gap-x-3 text-xs">
              <span className="w-24 shrink-0 text-phos">{milestone.date}</span>
              <span className="min-w-0 flex-1">
                <span className="text-fg">{milestone.title}</span>
                <span className="block text-muted">{milestone.body}</span>
              </span>
            </li>
          )
        })}
      </ol>
    )
  }

  if (output.kind === 'links') {
    return (
      <pre className="whitespace-pre-wrap break-words text-fg">{(output.items ?? []).join('\n')}</pre>
    )
  }

  return null
}

export default function Terminal({ entries, input, onInput, onKeyDown, onRun }: TerminalProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const node = scrollRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [entries])

  return (
    <div className="win" onClick={() => inputRef.current?.focus()}>
      <div className="win__bar">
        <span className="win__dot bg-coral/70" />
        <span className="win__dot bg-amber/70" />
        <span className="win__dot bg-phos/70" />
        <span className="win__title">
          {promptUser}@{promptHost} — zsh
        </span>
        <span className="ml-auto hidden text-2xs text-dim sm:block">{profile.handle}/portfolio</span>
      </div>

      <div
        ref={scrollRef}
        className="h-[26rem] overflow-y-auto px-4 py-4 font-mono text-xs sm:h-[30rem] sm:text-[0.8125rem]"
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
      >
        <pre className="mb-4 overflow-x-auto text-2xs leading-tight text-phos opacity-80">{banner}</pre>

        {entries.map((entry) =>
          entry.kind === 'input' ? (
            <p key={entry.id} data-entry="input" className="mt-3 flex flex-wrap gap-x-2 break-all">
              <span className="prompt">{promptUser}@{promptHost}</span>
              <span className="text-dim">:~$</span>
              <span className="text-fg">{entry.text}</span>
            </p>
          ) : (
            <div
              key={entry.id}
              data-entry={entry.kind}
              className={`mt-2 ${entry.kind === 'error' ? 'text-coral' : 'text-fg'}`}
            >
              <OutputBlock entry={entry} onRun={onRun} />
            </div>
          ),
        )}

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2">
          <span className="prompt">{promptUser}@{promptHost}</span>
          <span className="text-dim">:~$</span>
          <div className="flex min-w-[3rem] flex-1 items-baseline">
            <input
              id="shell-input"
              ref={inputRef}
              value={input}
              onChange={(event) => onInput(event.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              aria-label="Terminal input"
              className="min-w-0 flex-1 border-0 bg-transparent p-0 font-mono text-xs text-fg outline-none focus:ring-0 sm:text-[0.8125rem]"
            />
            <span className="caret -ml-[0.1ch]" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-t border-line-soft px-4 py-2.5">
        <span className="label mr-1">try</span>
        {['help', 'about', 'projects portfolio', 'stack infra', 'timeline', 'uname -a', 'sudo rm -rf /'].map((cmd) => (
          <button
            key={cmd}
            onClick={(event) => {
              event.stopPropagation()
              onRun(cmd)
              inputRef.current?.focus()
            }}
            className="border border-line px-2 py-0.5 text-2xs text-muted transition-colors hover:border-phos hover:text-phos"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  )
}
