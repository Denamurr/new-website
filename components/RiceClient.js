'use client'

import { useState, useEffect, useMemo, useRef } from 'react'

const IMPACT_OPTIONS = [
  { label: 'Massive', value: 3    },
  { label: 'High',    value: 2    },
  { label: 'Medium',  value: 1    },
  { label: 'Low',     value: 0.5  },
  { label: 'Minimal', value: 0.25 },
]
const EFFORT_OPTIONS     = [0.25, 0.5, 1, 2, 4, 8]
const CONFIDENCE_OPTIONS = [50, 60, 70, 80, 90, 100]

const CHEVRON_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23bbb'/%3E%3C/svg%3E")`

function uid()  { return Math.random().toString(36).slice(2, 10) }
function newRow() {
  return { id: uid(), name: '', reach: '', impact: 2, confidence: 80, effort: 1 }
}
function calcScore(f) {
  const reach = parseFloat(f.reach) || 0
  if (!reach) return 0
  return (reach * f.impact * (f.confidence / 100)) / f.effort
}
function effortLabel(v) {
  if (v === 0.25) return '¼w'
  if (v === 0.5)  return '½w'
  return `${v}w`
}
function formatNumber(n) {
  const v = parseFloat(n)
  if (!v) return ''
  return v.toLocaleString()
}

// ── Reach input — shows comma-formatted on blur ───────────────────────────────
function ReachInput({ value, onChange, onFocus, onBlur }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type="text"
      inputMode="numeric"
      value={focused ? value : formatNumber(value)}
      placeholder="0"
      onChange={e => onChange(e.target.value.replace(/,/g, ''))}
      onFocus={() => { setFocused(true); onFocus?.() }}
      onBlur={() => { setFocused(false); onBlur?.() }}
      className="w-[90px] border-none bg-transparent text-[14px] text-gray-900 outline-none py-0.5 border-b border-transparent focus:border-gray-200 placeholder-gray-300 transition-colors"
    />
  )
}

export default function RiceClient() {
  const [features,     setFeatures]     = useState([])
  const [sessionName,  setSessionName]  = useState('Q2 2025 Prioritization')
  const [editingId,    setEditingId]    = useState(null)
  const [loaded,       setLoaded]       = useState(false)
  const focusNextId = useRef(null)

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const name = localStorage.getItem('rice:session')
      if (name) setSessionName(name)
      const raw  = localStorage.getItem('rice:features')
      const saved = raw ? JSON.parse(raw) : null
      setFeatures(Array.isArray(saved) && saved.length ? saved : [newRow()])
    } catch {
      setFeatures([newRow()])
    }
    setLoaded(true)
  }, [])

  // ── Save ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return
    try { localStorage.setItem('rice:features', JSON.stringify(features)) } catch {}
  }, [features, loaded])

  // ── Computed ──────────────────────────────────────────────────────────────
  const scored = useMemo(
    () => features.map(f => ({ ...f, score: calcScore(f) })),
    [features]
  )

  // While editing a text/reach cell keep insertion order to avoid mid-type jumps
  const display = useMemo(() => {
    if (editingId !== null) return scored
    return [...scored].sort((a, b) => b.score - a.score)
  }, [scored, editingId])

  const maxScore = useMemo(() => Math.max(...display.map(f => f.score), 1), [display])

  // ── Mutations ──────────────────────────────────────────────────────────────
  function update(id, field, value) {
    setFeatures(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f))
  }

  function addRow(focus = true) {
    const row = newRow()
    if (focus) focusNextId.current = row.id
    setFeatures(prev => [...prev, row])
    setEditingId(null)
  }

  function deleteRow(id) {
    setFeatures(prev => prev.filter(f => f.id !== id))
  }

  // Focus the name input of a newly added row
  useEffect(() => {
    if (!focusNextId.current) return
    const el = document.querySelector(`[data-rowid="${focusNextId.current}"] .name-input`)
    el?.focus()
    focusNextId.current = null
  })

  // ── Export CSV ────────────────────────────────────────────────────────────
  function exportCSV() {
    const headers = ['Feature', 'Reach', 'Impact', 'Confidence (%)', 'Effort (wks)', 'RICE Score']
    const rows = [...display].sort((a, b) => b.score - a.score).map(f => {
      const impactLabel = IMPACT_OPTIONS.find(o => o.value === f.impact)?.label ?? f.impact
      return [f.name, f.reach, impactLabel, f.confidence, f.effort, Math.round(f.score)]
    })
    const csv = [headers, ...rows]
      .map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `${sessionName.replace(/\s+/g, '-')}.csv`
    a.click()
  }

  const selectStyle = {
    backgroundImage: CHEVRON_SVG,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 4px center',
  }

  const isEmpty = features.length === 0

  return (
    <div className="max-w-[1100px] mx-auto px-8 pt-[72px] pb-16">

      {/* Intro */}
      <div className="mb-5 pt-5">
        <p className="text-[13px] text-gray-400 leading-relaxed max-w-2xl">
          RICE is a prioritization framework I keep coming back to whenever a roadmap conversation
          starts going in circles. It forces the debate onto numbers — how many people does this
          reach, how much does it move the needle, how confident are we, how long will it take.
          I built this so I could pull it up during planning without hunting for a spreadsheet.
        </p>
        <div className="flex items-center gap-2 mt-3 text-[12px] text-gray-300 font-mono">
          <span className="text-gray-500">Reach</span>
          <span>×</span>
          <span className="text-gray-500">Impact</span>
          <span>×</span>
          <span className="text-gray-500">Confidence</span>
          <span>÷</span>
          <span className="text-gray-500">Effort</span>
          <span className="ml-2 text-gray-300 font-sans not-italic">= RICE Score</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-baseline justify-between gap-4 mb-5 flex-wrap">
        <div className="flex flex-col gap-1">
          <input
            type="text"
            value={sessionName}
            onChange={e => {
              setSessionName(e.target.value)
              try { localStorage.setItem('rice:session', e.target.value) } catch {}
            }}
            className="text-[18px] font-semibold tracking-tight outline-none border-b border-transparent focus:border-gray-200 pb-px transition-colors bg-transparent"
            style={{ minWidth: '12ch', width: `${Math.max(sessionName.length + 2, 12)}ch` }}
          />
          {!isEmpty && (
            <span className="text-[13px] text-gray-500">
              {features.length} feature{features.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={exportCSV}
            disabled={isEmpty}
            className="text-[13px] px-3.5 py-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Export CSV
          </button>
          <button
            onClick={() => addRow(true)}
            className="text-[13px] px-3.5 py-1.5 rounded-md bg-gray-900 text-white hover:bg-gray-700 transition-colors"
          >
            + Add feature
          </button>
        </div>
      </div>

      {isEmpty ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center gap-5 py-24 text-gray-500">
          <div className="flex flex-col items-center gap-1.5 text-[14px]">
            <span className="text-gray-400">Reach × Impact × Confidence</span>
            <div className="w-52 h-px bg-gray-200" />
            <span className="text-gray-400">Effort</span>
          </div>
          <p className="text-[13px] text-gray-400">Score and rank features. Add your first one to get started.</p>
          <button
            onClick={() => addRow(true)}
            className="text-[13px] px-3.5 py-1.5 rounded-md bg-gray-900 text-white hover:bg-gray-700 transition-colors"
          >
            + Add your first feature
          </button>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest pb-2.5 pr-3 pl-0 whitespace-nowrap min-w-[220px] w-[30%]">
                    Feature
                  </th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest pb-2.5 px-3 whitespace-nowrap min-w-[100px]">
                    Reach <span className="font-normal normal-case tracking-normal text-gray-400">per quarter</span>
                  </th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest pb-2.5 px-3 whitespace-nowrap min-w-[120px]">
                    Impact
                  </th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest pb-2.5 px-3 whitespace-nowrap min-w-[220px]">
                    Confidence
                  </th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest pb-2.5 px-3 whitespace-nowrap min-w-[110px]">
                    Effort <span className="font-normal normal-case tracking-normal text-gray-400">person-weeks</span>
                  </th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest pb-2.5 px-3 whitespace-nowrap min-w-[140px]">
                    RICE Score
                  </th>
                  <th className="w-9" />
                </tr>
              </thead>
              <tbody>
                {display.map((f, i) => {
                  const hasReach   = parseFloat(f.reach) > 0
                  const barPct     = f.score > 0 ? (f.score / maxScore) * 100 : 0
                  const scoreLabel = f.score > 0 ? Math.round(f.score).toLocaleString() : (hasReach ? '0' : 'add reach')
                  const isLast     = i === display.length - 1

                  return (
                    <tr
                      key={f.id}
                      data-rowid={f.id}
                      className="group border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                      onKeyDown={e => {
                        if (e.key === 'Tab' && !e.shiftKey && isLast) {
                          e.preventDefault()
                          addRow(true)
                        }
                      }}
                    >
                      {/* Feature name */}
                      <td className="py-2 pr-3 pl-0">
                        <input
                          type="text"
                          className="name-input w-full border-none bg-transparent text-[14px] text-gray-900 outline-none py-0.5 border-b border-transparent focus:border-gray-200 placeholder-gray-300 transition-colors"
                          value={f.name}
                          placeholder="Feature name…"
                          onChange={e => update(f.id, 'name', e.target.value)}
                          onFocus={() => setEditingId(f.id)}
                          onBlur={() => setEditingId(null)}
                        />
                      </td>

                      {/* Reach */}
                      <td className="py-2 px-3">
                        <ReachInput
                          value={f.reach}
                          onChange={v => update(f.id, 'reach', v)}
                          onFocus={() => setEditingId(f.id)}
                          onBlur={() => setEditingId(null)}
                        />
                      </td>

                      {/* Impact */}
                      <td className="py-2 px-3">
                        <select
                          value={f.impact}
                          onChange={e => {
                            update(f.id, 'impact', parseFloat(e.target.value))
                            setEditingId(null)
                          }}
                          className="border-none bg-transparent text-[14px] text-gray-900 outline-none cursor-pointer appearance-none py-0.5 pr-5"
                          style={selectStyle}
                        >
                          {IMPACT_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </td>

                      {/* Confidence */}
                      <td className="py-2 px-3">
                        <div className="flex gap-0.5">
                          {CONFIDENCE_OPTIONS.map(c => (
                            <button
                              key={c}
                              onClick={() => { update(f.id, 'confidence', c); setEditingId(null) }}
                              className={`px-1.5 py-0.5 text-[11px] rounded border transition-all ${
                                f.confidence === c
                                  ? 'bg-gray-900 border-gray-900 text-white'
                                  : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                              }`}
                            >
                              {c}%
                            </button>
                          ))}
                        </div>
                      </td>

                      {/* Effort */}
                      <td className="py-2 px-3">
                        <select
                          value={f.effort}
                          onChange={e => {
                            update(f.id, 'effort', parseFloat(e.target.value))
                            setEditingId(null)
                          }}
                          className="border-none bg-transparent text-[14px] text-gray-900 outline-none cursor-pointer appearance-none py-0.5 pr-5"
                          style={selectStyle}
                        >
                          {EFFORT_OPTIONS.map(o => (
                            <option key={o} value={o}>{effortLabel(o)}</option>
                          ))}
                        </select>
                      </td>

                      {/* Score */}
                      <td className="py-2 px-3">
                        <div className="relative h-7 flex items-center rounded bg-gray-50 overflow-hidden min-w-[100px]">
                          <div
                            className="absolute inset-0 bg-gray-100 rounded transition-all duration-300"
                            style={{ width: `${barPct.toFixed(1)}%` }}
                          />
                          <span className="relative text-[13px] font-semibold text-gray-700 px-2.5 z-10 tabular-nums">
                            {scoreLabel}
                          </span>
                        </div>
                      </td>

                      {/* Delete */}
                      <td className="py-2 px-1">
                        <button
                          onClick={() => deleteRow(f.id)}
                          className="opacity-0 group-hover:opacity-100 text-[12px] text-gray-500 hover:text-red-400 hover:bg-red-50 px-1.5 py-1 rounded transition-all"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <p className="mt-6 text-[12px] text-gray-500">
            Reach is per quarter · Effort in person-weeks · {features.length} feature{features.length !== 1 ? 's' : ''}
          </p>
        </>
      )}
    </div>
  )
}
