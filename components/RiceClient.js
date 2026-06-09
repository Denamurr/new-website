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
      className="w-[80px] border-none bg-transparent text-[13px] text-gray-900 outline-none py-0.5 border-b border-transparent focus:border-gray-200 placeholder-gray-300 transition-colors"
    />
  )
}

export default function RiceClient() {
  const [features,     setFeatures]     = useState([])
  const [sessionName,  setSessionName]  = useState('Q2 Prioritization')
  const [editingId,    setEditingId]    = useState(null)
  const [loaded,       setLoaded]       = useState(false)
  const focusNextId = useRef(null)

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

  useEffect(() => {
    if (!loaded) return
    try { localStorage.setItem('rice:features', JSON.stringify(features)) } catch {}
  }, [features, loaded])

  const scored = useMemo(
    () => features.map(f => ({ ...f, score: calcScore(f) })),
    [features]
  )

  const display = useMemo(() => {
    if (editingId !== null) return scored
    return [...scored].sort((a, b) => b.score - a.score)
  }, [scored, editingId])

  const maxScore = useMemo(() => Math.max(...display.map(f => f.score), 1), [display])

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

  function clearAll() {
    setFeatures([newRow()])
    setEditingId(null)
  }

  useEffect(() => {
    if (!focusNextId.current) return
    const el = document.querySelector(`[data-rowid="${focusNextId.current}"] .name-input`)
    el?.focus()
    focusNextId.current = null
  })

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
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '72px 40px 80px' }}>

      {/* Intro */}
      <div style={{ maxWidth: 680, paddingTop: 28, marginBottom: 48 }}>
        <span style={{
          display: 'inline-block', fontFamily: '"Inter", sans-serif',
          fontSize: 12, fontWeight: 600, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: '#fff',
          background: '#2bb673', padding: '5px 12px', borderRadius: 999,
          marginBottom: 20
        }}>Product</span>
        <h1 style={{
          fontFamily: '"Anton", sans-serif', fontWeight: 400,
          fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 0.96,
          letterSpacing: '-0.015em', margin: '0 0 24px', color: 'var(--ink)'
        }}>
          RICE Prioritization Tool
        </h1>
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, lineHeight: 1.65, color: '#444', margin: '0 0 14px' }}>
          Score and rank features by Reach, Impact, Confidence, and Effort.
          The highest score is the most value for the least work — useful when a roadmap
          conversation starts going in circles.
        </p>
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, lineHeight: 1.65, color: '#444', margin: '0 0 28px' }}>
          Enter a feature name, estimate reach over 3 months, set impact and confidence,
          then pick effort in person-weeks. Export to CSV when you're done.
        </p>
        <a href="/blog/rice-framework-age-of-ai" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 600,
          color: 'var(--ink)', background: 'var(--yellow)',
          border: '2px solid var(--ink)', borderRadius: 999,
          padding: '9px 18px', textDecoration: 'none'
        }}>
          Using RICE for AI features? Read this first ↗
        </a>
      </div>

      {/* Session header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <input
            type="text"
            value={sessionName}
            onChange={e => {
              setSessionName(e.target.value)
              try { localStorage.setItem('rice:session', e.target.value) } catch {}
            }}
            style={{
              fontFamily: '"Anton", sans-serif', fontWeight: 400, fontSize: 22,
              letterSpacing: '-0.01em', outline: 'none', border: 'none',
              borderBottom: '2px solid transparent', background: 'transparent',
              color: 'var(--ink)', padding: '0 0 2px',
              minWidth: '12ch', width: `${Math.max(sessionName.length + 2, 12)}ch`,
              transition: 'border-color 0.15s'
            }}
            onFocus={e => e.target.style.borderBottomColor = '#ddd'}
            onBlur={e => e.target.style.borderBottomColor = 'transparent'}
          />
          {!isEmpty && (
            <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: '#aaa' }}>
              {features.length} feature{features.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={clearAll}
            style={{
              fontFamily: '"Inter", sans-serif', fontSize: 13, padding: '7px 14px',
              borderRadius: 6, border: '1px solid #e5e7eb', color: '#999',
              background: '#fff', cursor: 'pointer'
            }}
          >
            Clear
          </button>
          <button
            onClick={exportCSV}
            disabled={isEmpty}
            style={{
              fontFamily: '"Inter", sans-serif', fontSize: 13, padding: '7px 14px',
              borderRadius: 6, border: '1px solid #e5e7eb', color: '#666',
              background: '#fff', cursor: isEmpty ? 'not-allowed' : 'pointer',
              opacity: isEmpty ? 0.35 : 1
            }}
          >
            Export CSV
          </button>
          <button
            onClick={() => addRow(true)}
            style={{
              fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600,
              padding: '7px 16px', borderRadius: 6,
              background: 'var(--ink)', color: '#fff', border: 'none', cursor: 'pointer'
            }}
          >
            + Add feature
          </button>
        </div>
      </div>

      {isEmpty ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '80px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontFamily: '"Inter", sans-serif', fontSize: 14, color: '#bbb' }}>
            <span>Reach × Impact × Confidence</span>
            <div style={{ width: 200, height: 1, background: '#e5e7eb' }} />
            <span>Effort</span>
          </div>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, color: '#bbb', margin: 0 }}>Score and rank features. Add your first one to get started.</p>
          <button
            onClick={() => addRow(true)}
            style={{
              fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600,
              padding: '9px 20px', borderRadius: 6,
              background: 'var(--ink)', color: '#fff', border: 'none', cursor: 'pointer'
            }}
          >
            + Add your first feature
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                  {[
                    { label: 'Feature', sub: null, minW: 180, w: '28%', pl: 0 },
                    { label: 'Reach', sub: 'per qtr', minW: 80 },
                    { label: 'Impact', sub: null, minW: 100 },
                    { label: 'Confidence', sub: null, minW: 190 },
                    { label: 'Effort', sub: 'person-wks', minW: 80 },
                    { label: 'Score', sub: null, minW: 120 },
                  ].map(col => (
                    <th key={col.label} style={{ textAlign: 'left', paddingBottom: 10, paddingLeft: col.pl ?? 8, paddingRight: 8, minWidth: col.minW, width: col.w }}>
                      <span style={{ display: 'block', fontFamily: '"Inter", sans-serif', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1 }}>{col.label}</span>
                      {col.sub && <span style={{ display: 'block', fontFamily: '"Inter", sans-serif', fontSize: 10, color: '#bbb', marginTop: 3 }}>{col.sub}</span>}
                    </th>
                  ))}
                  <th style={{ width: 32 }} />
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
                      <td className="py-1.5 pr-2 pl-0">
                        <input
                          type="text"
                          className="name-input w-full border-none bg-transparent text-[13px] text-gray-900 outline-none py-0.5 border-b border-transparent focus:border-gray-200 placeholder-gray-300 transition-colors"
                          value={f.name}
                          placeholder="Feature name…"
                          onChange={e => update(f.id, 'name', e.target.value)}
                          onFocus={() => setEditingId(f.id)}
                          onBlur={() => setEditingId(null)}
                        />
                      </td>

                      {/* Reach */}
                      <td className="py-1.5 px-2">
                        <ReachInput
                          value={f.reach}
                          onChange={v => update(f.id, 'reach', v)}
                          onFocus={() => setEditingId(f.id)}
                          onBlur={() => setEditingId(null)}
                        />
                      </td>

                      {/* Impact */}
                      <td className="py-1.5 px-2">
                        <select
                          value={f.impact}
                          onChange={e => {
                            update(f.id, 'impact', parseFloat(e.target.value))
                            setEditingId(null)
                          }}
                          className="border-none bg-transparent text-[13px] text-gray-900 outline-none cursor-pointer appearance-none py-0.5 pr-5"
                          style={selectStyle}
                        >
                          {IMPACT_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </td>

                      {/* Confidence */}
                      <td className="py-1.5 px-2">
                        <div className="flex gap-0.5">
                          {CONFIDENCE_OPTIONS.map(c => (
                            <button
                              key={c}
                              onClick={() => { update(f.id, 'confidence', c); setEditingId(null) }}
                              className={`px-1 py-0.5 text-[11px] rounded border transition-all ${
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
                      <td className="py-1.5 px-2">
                        <select
                          value={f.effort}
                          onChange={e => {
                            update(f.id, 'effort', parseFloat(e.target.value))
                            setEditingId(null)
                          }}
                          className="border-none bg-transparent text-[13px] text-gray-900 outline-none cursor-pointer appearance-none py-0.5 pr-5"
                          style={selectStyle}
                        >
                          {EFFORT_OPTIONS.map(o => (
                            <option key={o} value={o}>{effortLabel(o)}</option>
                          ))}
                        </select>
                      </td>

                      {/* Score */}
                      <td className="py-1.5 px-2">
                        <div className="relative h-6 flex items-center rounded bg-gray-50 overflow-hidden min-w-[90px]">
                          <div
                            className="absolute inset-0 bg-gray-100 rounded transition-all duration-300"
                            style={{ width: `${barPct.toFixed(1)}%` }}
                          />
                          <span className="relative text-[12px] font-semibold text-gray-700 px-2 z-10 tabular-nums">
                            {scoreLabel}
                          </span>
                        </div>
                      </td>

                      {/* Delete */}
                      <td className="py-1.5 px-1">
                        <button
                          onClick={() => deleteRow(f.id)}
                          className="opacity-0 group-hover:opacity-100 text-[11px] text-gray-400 hover:text-red-400 hover:bg-red-50 px-1.5 py-1 rounded transition-all"
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

          <p style={{ marginTop: 20, fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#bbb' }}>
            Reach is per quarter · Effort in person-weeks · {features.length} feature{features.length !== 1 ? 's' : ''}
          </p>
          <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid #f0f0f0' }}>
            <a href="/blog/rice-framework-age-of-ai" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 600,
              color: 'var(--ink)', background: 'var(--yellow)',
              border: '2px solid var(--ink)', borderRadius: 999,
              padding: '9px 18px', textDecoration: 'none'
            }}>
              Using RICE for AI features? Read this first ↗
            </a>
          </div>
        </>
      )}
    </div>
  )
}
