import { useCallback, useRef, useState } from 'react'
import Boot from '@/components/Boot'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import LoFi, { type LoFiHandle } from '@/components/LoFi'
import Nav from '@/components/Nav'
import Projects from '@/components/Projects'
import Stack from '@/components/Stack'
import Terminal from '@/components/Terminal'
import Timeline from '@/components/Timeline'
import { isTrackId } from '@/lib/lofi'
import { useShell, type ShellResult } from '@/lib/useShell'

export default function App() {
  const [booted, setBooted] = useState(false)
  const [playing, setPlaying] = useState(false)

  // The shell and the nav both need to drive the player without forcing
  // re-renders, so the handle lives in a ref and play state is lifted here.
  const playerRef = useRef<LoFiHandle | null>(null)
  const clearRef = useRef<() => void>(() => undefined)

  const handleShellResult = useCallback((result: ShellResult) => {
    switch (result.action) {
      case 'clear':
        clearRef.current()
        return
      case 'toggle-music':
        playerRef.current?.toggle()
        return
      case 'stop-music':
        playerRef.current?.stop()
        return
      case 'play-music': {
        const arg = result.arg
        if (arg && isTrackId(arg)) playerRef.current?.play(arg)
        else playerRef.current?.play()
        return
      }
      default:
        break
    }
    if (result.scrollTo) {
      document.getElementById(result.scrollTo)?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const shell = useShell(handleShellResult)
  clearRef.current = shell.clear

  const handlePlayerReady = useCallback((handle: LoFiHandle) => {
    playerRef.current = handle
  }, [])

  const handlePlayingChange = useCallback((next: boolean) => {
    setPlaying(next)
  }, [])

  const handleToggleMusic = useCallback(() => {
    playerRef.current?.toggle()
  }, [])

  return (
    <div className="crt min-h-screen">
      {booted ? null : <Boot onDone={() => setBooted(true)} />}

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[130] focus:border focus:border-phos focus:bg-void focus:px-4 focus:py-2 focus:text-xs focus:text-phos"
      >
        Skip to content
      </a>

      <Nav playing={playing} onToggleMusic={handleToggleMusic} />

      <main id="main">
        <Hero booted={booted} />
        <Projects />
        <Stack />
        <Timeline />

        <section id="terminal" className="section border-b border-line bg-panel/40">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label">
                <span className="text-phos">04</span> / terminal
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                The navigation is a shell
              </h2>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-muted">
              Type{' '}
              <kbd className="border border-line px-1.5 py-0.5 text-phos">help</kbd> for the command
              list. Tab completes, ↑ walks history, ctrl+l clears.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
            <Terminal
              entries={shell.entries}
              input={shell.input}
              onInput={shell.setInput}
              onKeyDown={shell.onKeyDown}
              onRun={shell.run}
            />

            <div className="space-y-5">
              <LoFi onReady={handlePlayerReady} onPlayingChange={handlePlayingChange} />

              <div className="win p-5">
                <p className="label">try these</p>
                <ul className="mt-3 space-y-2 text-xs">
                  {(
                    [
                      ['projects portfolio', 'full detail for one project'],
                      ['stack systems', 'the low-level work'],
                      ['open contact', 'jump down the page'],
                      ['sudo rm -rf /', 'it is handled'],
                    ] as const
                  ).map(([cmd, note]) => (
                    <li key={cmd}>
                      <button
                        onClick={() => shell.run(cmd)}
                        className="group flex w-full items-baseline justify-between gap-3 text-left"
                      >
                        <span className="text-phos underline decoration-dotted underline-offset-4 group-hover:text-fg">
                          {cmd}
                        </span>
                        <span className="text-2xs text-dim">{note}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <Contact />
      </main>

      <Footer />
    </div>
  )
}
