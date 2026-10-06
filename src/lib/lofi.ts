/**
 * Generative lo-fi engine.
 *
 * Everything is synthesised at runtime with the Web Audio API: pads, bass,
 * soft drums, vinyl crackle and a generated convolution reverb. No audio files
 * are shipped, so nothing to license, nothing to buffer, and it works offline.
 *
 * Scheduling uses the standard lookahead pattern: a coarse timer wakes up every
 * `LOOKAHEAD_MS` and schedules any notes falling inside the next window, so
 * timing is driven by the audio clock rather than setInterval jitter.
 */

const A4 = 440
const LOOKAHEAD_MS = 25
const SCHEDULE_AHEAD = 0.12

/** MIDI note number → frequency in Hz (A4 = 69 = 440Hz). */
const hz = (midi: number): number => A4 * Math.pow(2, (midi - 69) / 12)

/** Chord voicings as MIDI note numbers, roughly in the F3–C5 register. */
type Voicing = readonly number[]

interface Track {
  readonly id: string
  readonly title: string
  readonly bpm: number
  /** Bars per chord. Higher numbers = slower harmonic movement. */
  readonly barsPerChord: number
  readonly voicing: (index: number) => Voicing
  readonly root: (index: number) => number
  readonly cutoff: number
  readonly swing: number
  readonly crackle: number
  readonly color: string
}

const TRACKS: readonly Track[] = [
  {
    id: 'midnight',
    title: 'midnight loops',
    bpm: 72,
    barsPerChord: 2,
    cutoff: 1150,
    swing: 0.14,
    crackle: 0.055,
    color: 'phos',
    // Fmaj9 → Dm9 → Bbmaj7 → C6
    voicing: (i) => {
      const sets: readonly Voicing[] = [
        [53, 57, 60, 64, 67],
        [50, 53, 57, 60, 64],
        [46, 53, 57, 62, 65],
        [48, 55, 57, 64, 67],
      ]
      return sets[i % sets.length] ?? sets[0]!
    },
    root: (i) => {
      const roots = [41, 38, 34, 36]
      return roots[i % roots.length] ?? 41
    },
  },
  {
    id: 'addis',
    title: 'addis morning',
    bpm: 84,
    barsPerChord: 1,
    cutoff: 1700,
    swing: 0.1,
    crackle: 0.03,
    color: 'amber',
    // Amaj7 → F#m7 → Dmaj7 → E
    voicing: (i) => {
      const sets: readonly Voicing[] = [
        [52, 56, 59, 63, 66],
        [49, 52, 56, 59, 63],
        [50, 54, 57, 61, 64],
        [48, 52, 56, 59, 64],
      ]
      return sets[i % sets.length] ?? sets[0]!
    },
    root: (i) => {
      const roots = [40, 42, 38, 40]
      return roots[i % roots.length] ?? 40
    },
  },
  {
    id: 'deep',
    title: 'deep focus',
    bpm: 62,
    barsPerChord: 3,
    cutoff: 780,
    swing: 0.06,
    crackle: 0.085,
    color: 'violet',
    // Am9 → Fmaj7 → Cmaj7 → G
    voicing: (i) => {
      const sets: readonly Voicing[] = [
        [45, 52, 55, 59, 64],
        [41, 48, 52, 57, 60],
        [36, 43, 47, 52, 55],
        [43, 50, 55, 59, 62],
      ]
      return sets[i % sets.length] ?? sets[0]!
    },
    root: (i) => {
      const roots = [33, 29, 24, 31]
      return roots[i % roots.length] ?? 33
    },
  },
]

export const tracks = TRACKS.map((t, i) => ({ id: t.id, title: t.title, color: t.color, index: i }))

export type TrackId = (typeof tracks)[number]['id']

/** Narrows an arbitrary CLI argument to a known track id. */
export function isTrackId(value: string): value is TrackId {
  return TRACKS.some((t) => t.id === value)
}

/** Short white-noise buffer, reused for hats, snare and crackle. */
function makeNoise(ctx: AudioContext, seconds = 2): AudioBuffer {
  const frames = Math.floor(ctx.sampleRate * seconds)
  const buffer = ctx.createBuffer(1, frames, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < frames; i += 1) {
    data[i] = Math.random() * 2 - 1
  }
  return buffer
}

/**
 * Generated impulse response: exponentially decaying noise. Sounds like a
 * small plate reverb, which is what lo-fi is usually printed through.
 */
function makeImpulse(ctx: AudioContext, seconds = 2.4, decay = 3.2): AudioBuffer {
  const frames = Math.floor(ctx.sampleRate * seconds)
  const buffer = ctx.createBuffer(2, frames, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch += 1) {
    const data = buffer.getChannelData(ch)
    for (let i = 0; i < frames; i += 1) {
      const t = i / frames
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay)
    }
  }
  return buffer
}

export class LoFiEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private analyser: AnalyserNode | null = null
  private filter: BiquadFilterNode | null = null
  private verb: ConvolverNode | null = null
  private verbSend: GainNode | null = null
  private noise: AudioBuffer | null = null
  private padGain: GainNode | null = null

  private timer: number | null = null
  private nextNoteTime = 0
  private step = 0
  private current: Track = TRACKS[0]!
  private playing = false
  private volume = 0.7

  get isPlaying(): boolean {
    return this.playing
  }

  get trackTitle(): string {
    return this.current.title
  }

  get trackIndex(): number {
    return TRACKS.indexOf(this.current)
  }

  get analyserNode(): AnalyserNode | null {
    return this.analyser
  }

  /** Must be called from a user gesture — browsers block audio otherwise. */
  async play(trackId?: TrackId): Promise<void> {
    if (trackId) {
      const found = TRACKS.find((t) => t.id === trackId)
      if (found) this.current = found
    }

    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.buildGraph(this.ctx)
    }

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume()
    }

    this.playing = true
    this.nextNoteTime = this.ctx.currentTime + 0.08
    this.step = 0
    this.timer = window.setInterval(() => this.scheduler(), LOOKAHEAD_MS)
  }

  stop(): void {
    this.playing = false
    if (this.timer !== null) {
      window.clearInterval(this.timer)
      this.timer = null
    }
    if (this.master && this.ctx) {
      // Fade out rather than cut, so the reverb tail is not clipped off.
      const now = this.ctx.currentTime
      this.master.gain.cancelScheduledValues(now)
      this.master.gain.setValueAtTime(this.master.gain.value, now)
      this.master.gain.linearRampToValueAtTime(0.0001, now + 0.25)
    }
  }

  setVolume(value: number): void {
    this.volume = Math.min(1, Math.max(0, value))
    if (this.master && this.ctx && this.playing) {
      this.master.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.02)
    }
  }

  getVolume(): number {
    return this.volume
  }

  /** Fully tears down the graph and closes the context. */
  dispose(): void {
    this.stop()
    if (this.ctx) {
      void this.ctx.close()
      this.ctx = null
    }
  }

  private buildGraph(ctx: AudioContext): void {
    this.master = ctx.createGain()
    this.master.gain.value = 0

    this.analyser = ctx.createAnalyser()
    this.analyser.fftSize = 256
    this.analyser.smoothingTimeConstant = 0.82

    this.filter = ctx.createBiquadFilter()
    this.filter.type = 'lowpass'
    this.filter.frequency.value = this.current.cutoff
    this.filter.Q.value = 0.7

    this.verb = ctx.createConvolver()
    this.verb.buffer = makeImpulse(ctx)

    this.verbSend = ctx.createGain()
    this.verbSend.gain.value = 0.3

    this.padGain = ctx.createGain()
    this.padGain.gain.value = 0.22

    this.noise = makeNoise(ctx)

    // pad → filter → master, with a parallel send into the reverb
    this.padGain.connect(this.filter)
    this.filter.connect(this.master)
    this.filter.connect(this.verbSend)
    this.verbSend.connect(this.verb)
    this.verb.connect(this.master)

    this.master.connect(this.analyser)
    this.analyser.connect(ctx.destination)

    // Slow filter drift gives the tape-wobble character.
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.07
    const lfoDepth = ctx.createGain()
    lfoDepth.gain.value = this.current.cutoff * 0.16
    lfo.connect(lfoDepth)
    lfoDepth.connect(this.filter.frequency)
    lfo.start()

    // Fade the master up once the graph is live.
    this.master.gain.setTargetAtTime(this.volume, ctx.currentTime, 0.5)
  }

  private scheduler(): void {
    if (!this.ctx || !this.playing) return
    while (this.nextNoteTime < this.ctx.currentTime + SCHEDULE_AHEAD) {
      this.scheduleStep(this.nextNoteTime)
      this.advance()
    }
  }

  private advance(): void {
    const secondsPerStep = 60 / this.current.bpm / 2 // eighth notes
    const swung = this.step % 2 === 1 ? secondsPerStep * (1 + this.current.swing) : secondsPerStep
    this.nextNoteTime += swung
    this.step += 1
  }

  private scheduleStep(time: number): void {
    const ctx = this.ctx
    if (!ctx) return

    const step = this.step
    const bar = Math.floor(step / 8)
    const beat = step % 8

    if (beat === 0) {
      this.scheduleChord(bar, time)
    }

    // Soft kick on 0 and 6
    if (beat === 0 || beat === 6) this.kick(time)
    // Rim/hat on every eighth, accented off-beats
    this.hat(time, beat % 2 === 1 ? 0.05 : 0.028)
    // Snare-ish brush on 2 and 5, barely there
    if (beat === 2 || beat === 5) this.brush(time)

    if (Math.random() < this.current.crackle) this.crackle(time)
  }

  private scheduleChord(bar: number, time: number): void {
    const ctx = this.ctx
    if (!ctx) return

    const index = Math.floor(bar / this.current.barsPerChord)
    const notes = this.current.voicing(index)

    for (const midi of notes) {
      // Two slightly detuned saws per note: warmth plus a chorus shimmer.
      for (const detune of [-6, 6]) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sawtooth'
        osc.frequency.value = hz(midi)
        osc.detune.value = detune

        const fade = 0.9
        gain.gain.setValueAtTime(0.0001, time)
        gain.gain.exponentialRampToValueAtTime(0.05, time + fade)
        gain.gain.setValueAtTime(0.05, time + fade + 1.4)
        gain.gain.exponentialRampToValueAtTime(0.0001, time + fade + 2.6)

        osc.connect(gain)
        gain.connect(this.padGain!)
        osc.start(time)
        osc.stop(time + fade + 2.8)
      }
    }

    // Sub bass on the root
    const bass = ctx.createOscillator()
    const bassGain = ctx.createGain()
    bass.type = 'sine'
    bass.frequency.value = hz(this.current.root(index))
    bassGain.gain.setValueAtTime(0.0001, time)
    bassGain.gain.exponentialRampToValueAtTime(0.16, time + 0.06)
    bassGain.gain.exponentialRampToValueAtTime(0.0001, time + 1.5)
    bass.connect(bassGain)
    bassGain.connect(this.master!)
    bass.start(time)
    bass.stop(time + 1.6)
  }

  private kick(time: number): void {
    const ctx = this.ctx
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(120, time)
    osc.frequency.exponentialRampToValueAtTime(44, time + 0.11)
    gain.gain.setValueAtTime(0.24, time)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.24)
    osc.connect(gain)
    gain.connect(this.master!)
    osc.start(time)
    osc.stop(time + 0.26)
  }

  private hat(time: number, level: number): void {
    const ctx = this.ctx
    if (!ctx || !this.noise) return
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const band = ctx.createBiquadFilter()
    band.type = 'highpass'
    band.frequency.value = 7200
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(level, time)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05)
    src.connect(band)
    band.connect(gain)
    gain.connect(this.master!)
    src.start(time, Math.random() * 1.5)
    src.stop(time + 0.07)
  }

  private brush(time: number): void {
    const ctx = this.ctx
    if (!ctx || !this.noise) return
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const band = ctx.createBiquadFilter()
    band.type = 'bandpass'
    band.frequency.value = 1800
    band.Q.value = 0.6
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.045, time)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.16)
    src.connect(band)
    band.connect(gain)
    gain.connect(this.master!)
    gain.connect(this.verbSend!)
    src.start(time, Math.random() * 1.5)
    src.stop(time + 0.18)
  }

  /** Single-sample click: the pop of a stylus hitting dust. */
  private crackle(time: number): void {
    const ctx = this.ctx
    if (!ctx || !this.noise) return
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const gain = ctx.createGain()
    const level = 0.02 + Math.random() * 0.05
    gain.gain.setValueAtTime(level, time)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.012)
    src.connect(gain)
    gain.connect(this.master!)
    src.start(time, Math.random() * 1.5)
    src.stop(time + 0.02)
  }
}
