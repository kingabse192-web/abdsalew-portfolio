import { useEffect, useState } from 'react'
import { profile } from '@/data/profile'
import { usePrefersReducedMotion } from '@/lib/hooks'

const LINES: readonly string[] = [
  'POST /boot',
  'mounting /dev/local-ai ................ ok',
  'loading openclaw agent runtime ........ ok',
  'starting hermes scheduler ............. ok',
  'resolving node v22.22.1 ............... ok',
  'mounting docker socket ................ ok',
  'starting composer ..................... ok',
  `authenticating user '${profile.handle}' ... ok`,
]

export default function Boot({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReducedMotion()
  const [line, setLine] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (reduced) {
      onDone()
      return
    }

    const step = Math.max(90, 460 / LINES.length)
    const id = window.setInterval(() => {
      setLine((prev) => {
        if (prev >= LINES.length) {
          window.clearInterval(id)
          window.setTimeout(() => setFading(true), 220)
          return prev
        }
        return prev + 1
      })
    }, step)

    const done = window.setTimeout(() => onDone(), step * (LINES.length + 1) + 420)
    return () => {
      window.clearInterval(id)
      window.clearTimeout(done)
    }
  }, [reduced, onDone])

  return (
    <div
      className={`fixed inset-0 z-[120] flex flex-col justify-center bg-void px-6 font-mono text-sm transition-opacity duration-500 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="mx-auto w-full max-w-xl">
        <pre className="mb-6 overflow-x-auto text-2xs leading-relaxed text-phos glow">
          {LINES.slice(0, line).join('\n')}
          {line < LINES.length ? <span className="caret" /> : null}
        </pre>
        <div className="h-px w-full overflow-hidden bg-line">
          <div
            className="h-full bg-phos transition-[width] duration-200 ease-out"
            style={{ width: `${(line / LINES.length) * 100}%` }}
          />
        </div>
        <p className="label mt-3">
          {line >= LINES.length ? 'starting session…' : `booting ${profile.handle}-dev`}
        </p>
      </div>
    </div>
  )
}
