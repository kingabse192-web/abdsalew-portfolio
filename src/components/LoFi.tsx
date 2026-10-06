import { useCallback, useEffect, useRef, useState } from 'react'
import { isTrackId, LoFiEngine, tracks, type TrackId } from '@/lib/lofi'

export interface LoFiHandle {
  toggle: () => void
  /** Resumes playback, switching track when an id is given. */
  play: (id?: TrackId) => void
  stop: () => void
}

interface LoFiProps {
  /** Receives a stable control handle once, on mount. */
  onReady: (handle: LoFiHandle) => void
  /** Reports the authoritative play state, since the shell can also change it. */
  onPlayingChange: (playing: boolean) => void
}

const BUCKETS = 28

export default function LoFi({ onReady, onPlayingChange }: LoFiProps) {
  const [playing, setPlaying] = useState(false)
  const [activeId, setActiveId] = useState<TrackId>('midnight')
  const [volume, setVolume] = useState(0.7)

  const engineRef = useRef<LoFiEngine | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  const active = tracks.find((t) => t.id === activeId) ?? tracks[0]!

  const getEngine = useCallback((): LoFiEngine => {
    if (!engineRef.current) engineRef.current = new LoFiEngine()
    return engineRef.current
  }, [])

  /**
   * `playingRef` is the single source of truth for play state. The shell can
   * call these controls at any time, so reading React state from a callback
   * closure would go stale.
   */
  const playingRef = useRef(false)
  const activeRef = useRef<TrackId>('midnight')
  const reportRef = useRef(onPlayingChange)
  reportRef.current = onPlayingChange

  const setPlayingState = useCallback((next: boolean) => {
    playingRef.current = next
    setPlaying(next)
    reportRef.current(next)
  }, [])

  const play = useCallback(
    async (id?: TrackId) => {
      const target = id && isTrackId(id) ? id : activeRef.current
      activeRef.current = target
      setActiveId(target)
      await getEngine().play(target)
      setPlayingState(true)
    },
    [getEngine, setPlayingState],
  )

  const stop = useCallback(() => {
    engineRef.current?.stop()
    setPlayingState(false)
  }, [setPlayingState])

  const toggle = useCallback(() => {
    if (playingRef.current) stop()
    else void play(activeRef.current)
  }, [play, stop])

  // Hand the controls up once. Stable identity, so the parent can hold it in a ref.
  const handle = useRef<LoFiHandle>({ toggle, play, stop })
  handle.current = { toggle, play, stop }

  useEffect(() => {
    onReady(handle.current)
    return () => engineRef.current?.dispose()
  }, [onReady])

  const handleVolume = useCallback((value: number) => {
    setVolume(value)
    engineRef.current?.setVolume(value)
  }, [])

  // Visualiser: read the analyser every frame while audio is running.
  useEffect(() => {
    if (!playing) return

    const canvas = canvasRef.current
    const analyser = engineRef.current?.analyserNode
    if (!canvas || !analyser) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const data = new Uint8Array(analyser.frequencyBinCount)
    const dpr = window.devicePixelRatio || 1

    const resize = (): void => {
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = (): void => {
      analyser.getByteFrequencyData(data)
      const w = canvas.width
      const h = canvas.height
      const gap = 2 * dpr
      const barW = (w - gap * (BUCKETS - 1)) / BUCKETS

      ctx.clearRect(0, 0, w, h)

      // Only the lower third of bins is useful for a lo-fi spectrum.
      const usable = Math.floor(data.length * 0.42)

      for (let i = 0; i < BUCKETS; i += 1) {
        const from = Math.floor((i / BUCKETS) * usable)
        const to = Math.max(from + 1, Math.floor(((i + 1) / BUCKETS) * usable))
        let sum = 0
        for (let j = from; j < to; j += 1) sum += data[j] ?? 0
        const avg = sum / (to - from) / 255
        const barH = Math.max(2 * dpr, avg * h * 0.94)

        ctx.fillStyle = 'rgba(201, 242, 77, 0.75)'
        ctx.fillRect(i * (barW + gap), h - barH, barW, barH)
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [playing])

  return (
    <div className="win">
      <div className="win__bar">
        <span className="win__dot bg-coral/70" />
        <span className="win__dot bg-amber/70" />
        <span className="win__dot bg-phos/70" />
        <span className="win__title">lo-fi — synthesised in-browser, no files</span>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={toggle}
            aria-pressed={playing}
            className="grid h-12 w-12 shrink-0 place-content-center border border-phos text-phos transition-all hover:bg-phos hover:text-void hover:shadow-phos"
            style={playing ? { boxShadow: '0 0 18px rgba(201,242,77,0.4)' } : undefined}
          >
            <span className="sr-only">{playing ? 'Pause lo-fi' : 'Play lo-fi'}</span>
            <span aria-hidden="true" className="text-sm">
              {playing ? '❚❚' : '▶'}
            </span>
          </button>

          <div className="min-w-[9rem] flex-1">
            <p className="truncate font-display text-sm text-fg">{active.title}</p>
            <p className="label mt-0.5">
              {playing ? 'now playing · generated live' : 'paused'}
            </p>
          </div>

          <label className="flex w-full items-center gap-3 sm:w-44">
            <span className="label shrink-0">vol</span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(volume * 100)}
              onChange={(event) => handleVolume(Number(event.target.value) / 100)}
              className="h-1 w-full cursor-pointer appearance-none border-0 bg-line accent-phos"
              aria-label="Volume"
            />
            <span className="w-8 shrink-0 text-right text-2xs text-dim">
              {Math.round(volume * 100)}
            </span>
          </label>
        </div>

        <canvas
          ref={canvasRef}
          className="mt-5 h-16 w-full"
          aria-hidden="true"
          role="presentation"
        />

        {/* Non-canvas fallback: gives screen readers and no-WebGL cases a state. */}
        <div className="sr-only" aria-live="polite">
          {playing ? `Playing ${active.title}` : 'Lo-fi player paused'}
        </div>

        <ul className="mt-5 grid gap-2 sm:grid-cols-3">
          {tracks.map((track) => {
            const isActive = track.id === activeId
            return (
              <li key={track.id}>
                <button
                  onClick={() => void play(track.id)}
                  className={`w-full border px-3 py-2 text-left transition-colors ${
                    isActive
                      ? 'border-phos bg-phos/10 text-phos'
                      : 'border-line text-muted hover:border-phos/50 hover:text-fg'
                  }`}
                >
                  <span className="block text-xs">{track.title}</span>
                  <span className="label mt-0.5 block">
                    {isActive && playing ? 'playing' : 'tap to play'}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
