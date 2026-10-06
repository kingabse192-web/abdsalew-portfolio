import { useCallback, useEffect, useRef, useState } from 'react'
import {
  complete,
  findCommand,
  sections,
  type Action,
  type Output,
  type SectionId,
} from './commands'

export interface Entry {
  id: number
  kind: 'input' | 'output' | 'error'
  /** Raw text for input lines. */
  text?: string
  output?: Output
}

export interface ShellResult {
  action?: Action | undefined
  arg?: string | undefined
  scrollTo?: SectionId | undefined
}

const MAX_ENTRIES = 200

export function useShell(onResult: (result: ShellResult) => void) {
  const [entries, setEntries] = useState<readonly Entry[]>([])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<readonly string[]>([])
  /** -1 means "not currently browsing history". */
  const [historyIndex, setHistoryIndex] = useState(-1)
  const idRef = useRef(0)
  const handlerRef = useRef(onResult)
  handlerRef.current = onResult

  const push = useCallback((entry: Omit<Entry, 'id'>) => {
    idRef.current += 1
    setEntries((prev) => {
      const next = [...prev, { ...entry, id: idRef.current }]
      return next.length > MAX_ENTRIES ? next.slice(next.length - MAX_ENTRIES) : next
    })
  }, [])

  const run = useCallback(
    (raw: string) => {
      const line = raw.trim()
      push({ kind: 'input', text: raw })

      if (!line) return

      const [token = '', ...args] = line.split(/\s+/)
      const command = findCommand(token)

      if (!command) {
        const suggestion = complete(token.slice(0, 3))[0]
        push({
          kind: 'error',
          output: {
            kind: 'text',
            text: suggestion
              ? `${token}: command not found. Did you mean '${suggestion}'?`
              : `${token}: command not found. Type 'help'.`,
          },
        })
        return
      }

      const output = command.run(args)
      push({ kind: 'output', output })
      handlerRef.current({
        action: output.action,
        arg: output.arg,
        scrollTo: output.scrollTo,
      })
    },
    [push],
  )

  const submit = useCallback(() => {
    const line = input
    setInput('')
    setHistoryIndex(-1)
    if (line.trim()) {
      setHistory((prev) => [line, ...prev.filter((h) => h !== line)].slice(0, 50))
    }
    run(line)
  }, [input, run])

  /** Arrow up/down, tab completion, and Ctrl+L / Ctrl+C. */
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        submit()
        return
      }

      if (event.key === 'Tab') {
        event.preventDefault()
        const [token = ''] = input.split(/\s+/)
        const matches = complete(token)
        if (matches.length === 1) {
          const rest = input.slice(token.length)
          setInput(`${matches[0]!}${rest.startsWith(' ') ? rest : ' '}`)
        } else if (matches.length > 1) {
          push({ kind: 'output', output: { kind: 'text', text: matches.join('  ') } })
        }
        return
      }

      if (event.key === 'l' && event.ctrlKey) {
        event.preventDefault()
        setEntries([])
        return
      }

      if (event.key === 'c' && event.ctrlKey) {
        event.preventDefault()
        push({ kind: 'input', text: `${input}^C` })
        setInput('')
        setHistoryIndex(-1)
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        if (history.length === 0) return
        const next = historyIndex === -1 ? 0 : Math.min(historyIndex + 1, history.length - 1)
        setHistoryIndex(next)
        setInput(history[next] ?? '')
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (historyIndex === -1) return
        const next = historyIndex - 1
        setHistoryIndex(next)
        setInput(next === -1 ? '' : (history[next] ?? ''))
      }
    },
    [history, historyIndex, input, push, submit],
  )

  const clear = useCallback(() => setEntries([]), [])

  /** Runs the section command for a nav click, so nav and CLI stay in sync. */
  const runSection = useCallback(
    (id: SectionId) => {
      const target = sections.find((s) => s.id === id)
      if (target) run(target.command)
    },
    [run],
  )

  useEffect(() => {
    const onGlobalKey = (event: KeyboardEvent) => {
      const target = event.target
      if (target instanceof HTMLElement) {
        const tag = target.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return
      }
      if (event.key === '/') {
        event.preventDefault()
        document.getElementById('shell-input')?.focus()
      }
    }
    window.addEventListener('keydown', onGlobalKey)
    return () => window.removeEventListener('keydown', onGlobalKey)
  }, [])

  return { entries, input, setInput, onKeyDown, submit, clear, run, runSection }
}
