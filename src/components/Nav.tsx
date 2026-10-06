import { useEffect, useState } from 'react'
import { profile, promptHost, promptUser } from '@/data/profile'
import { sections } from '@/lib/commands'
import { useScrolled, useScrollLock } from '@/lib/hooks'

interface NavProps {
  playing: boolean
  onToggleMusic: () => void
}

export default function Nav({ playing, onToggleMusic }: NavProps) {
  const scrolled = useScrolled()
  const [open, setOpen] = useState(false)
  useScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-colors duration-200 ${
          scrolled || open ? 'border-b border-line bg-void/92 backdrop-blur' : 'border-b border-transparent'
        }`}
      >
        <nav className="mx-auto flex w-full max-w-6xl items-center gap-4 px-5 py-3 sm:px-8" aria-label="Primary">
          <a href="#top" className="group flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
            <span className="grid h-7 w-7 place-content-center border border-phos text-2xs font-bold text-phos transition-shadow group-hover:shadow-phos-sm">
              {profile.name.slice(0, 1)}
            </span>
            <span className="hidden text-sm sm:block">
              <span className="text-fg">{promptUser}</span>
              <span className="text-dim">@</span>
              <span className="text-phos">{promptHost}</span>
              <span className="text-dim">:~$</span>
            </span>
          </a>

          <ul className="ml-auto hidden items-center gap-1 lg:flex">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="rounded-sm px-2.5 py-1.5 text-xs text-muted transition-colors hover:bg-raised hover:text-phos"
                >
                  <span className="text-dim">./</span>
                  {section.id}
                </a>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-2 lg:ml-4">
            <button
              onClick={onToggleMusic}
              aria-pressed={playing}
              className="flex items-center gap-2 border border-line px-2.5 py-1.5 text-2xs uppercase tracking-terminal text-muted transition-colors hover:border-phos hover:text-phos"
            >
              <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`w-[2px] origin-bottom bg-current ${playing ? 'animate-barPulse' : ''}`}
                    style={{
                      height: '100%',
                      animationDelay: `${i * 110}ms`,
                      transform: playing ? undefined : 'scaleY(0.25)',
                    }}
                  />
                ))}
              </span>
              {playing ? 'lo-fi on' : 'lo-fi off'}
            </button>
            <a
              href={`${profile.github}?tab=repositories`}
              target="_blank"
              rel="noreferrer noopener"
              className="hidden border border-phos bg-phos px-3 py-1.5 text-2xs font-semibold uppercase tracking-terminal text-void transition-colors hover:bg-transparent hover:text-phos sm:block"
            >
              github
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="grid h-9 w-9 place-content-center border border-line text-sm text-muted lg:hidden"
            >
              <span className="sr-only">Toggle navigation</span>
              <span aria-hidden="true">{open ? '×' : '='}</span>
            </button>
          </div>
        </nav>
      </header>

      {open ? (
        <div
          id="mobile-nav"
          className="fixed inset-0 top-[57px] z-[79] overflow-y-auto bg-void px-5 pt-6 lg:hidden"
        >
          <ul className="space-y-1">
            {sections.map((section, i) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-3 border-b border-line-soft py-3.5 text-lg text-fg"
                >
                  <span className="text-2xs text-dim">{String(i).padStart(2, '0')}</span>
                  <span>./{section.id}</span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-6 inline-block text-sm text-phos underline underline-offset-4"
          >
            {profile.github} ↗
          </a>
        </div>
      ) : null}
    </>
  )
}
