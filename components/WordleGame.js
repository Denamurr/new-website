'use client'

import { useState, useEffect, useCallback } from 'react'

const WORDS = [
  'ABOUT', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER',
  'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALLOW', 'ALONE',
  'ALONG', 'ANGEL', 'ANGER', 'ANKLE', 'APART', 'APPLE', 'APPLY', 'ARENA',
  'ARGUE', 'ARISE', 'ARMOR', 'ARRAY', 'ARSON', 'ASIDE', 'ASSET', 'AVOID',
  'AWARD', 'AWARE', 'AWFUL', 'BASIC', 'BATCH', 'BEACH', 'BEING', 'BELOW',
  'BENCH', 'BIRTH', 'BLAZE', 'BLEED', 'BLEND', 'BLESS', 'BLIND', 'BLOCK',
  'BLOOD', 'BLOOM', 'BOARD', 'BOOST', 'BOUND', 'BRAIN', 'BRAND', 'BRAVE',
  'BREAD', 'BREAK', 'BREED', 'BRICK', 'BRIDE', 'BRIEF', 'BRING', 'BROKE',
  'BROWN', 'BRUSH', 'BUILD', 'BUILT', 'BUNCH', 'BURST', 'CARRY', 'CATCH',
  'CAUSE', 'CHAIN', 'CHAIR', 'CHAOS', 'CHARM', 'CHART', 'CHASE', 'CHEAP',
  'CHECK', 'CHEER', 'CHESS', 'CHEST', 'CHIEF', 'CHILD', 'CIVIC', 'CLAIM',
  'CLASS', 'CLEAN', 'CLEAR', 'CLICK', 'CLIMB', 'CLOCK', 'CLONE', 'CLOSE',
  'CLOUD', 'COACH', 'COAST', 'COUNT', 'COURT', 'COVER', 'CRACK', 'CRAFT',
  'CRANE', 'CRASH', 'CRAZY', 'CREAM', 'CRIME', 'CRISP', 'CROSS', 'CROWD',
  'CROWN', 'CRUSH', 'CURVE', 'CYCLE', 'DAILY', 'DANCE', 'DEATH', 'DEPTH',
  'DIRTY', 'DOUBT', 'DRAFT', 'DRAIN', 'DRAMA', 'DRAWN', 'DREAM', 'DRESS',
  'DRIFT', 'DRINK', 'DRIVE', 'DROVE', 'DROWN', 'EAGER', 'EARLY', 'EARTH',
  'EIGHT', 'ELITE', 'EMPTY', 'ENEMY', 'ENJOY', 'EQUAL', 'EVOKE', 'EXACT',
  'EXIST', 'EXTRA', 'FAINT', 'FAITH', 'FALSE', 'FANCY', 'FATAL', 'FAULT',
  'FEAST', 'FENCE', 'FEVER', 'FIELD', 'FIFTH', 'FIFTY', 'FIGHT', 'FINAL',
  'FIRST', 'FIXED', 'FLAME', 'FLASH', 'FLEET', 'FLESH', 'FLOAT', 'FLOOD',
  'FLOOR', 'FLUID', 'FOCUS', 'FORCE', 'FORGE', 'FORTH', 'FOUND', 'FRAME',
  'FRANK', 'FRAUD', 'FRESH', 'FRONT', 'FROST', 'FRUIT', 'FULLY', 'FUNNY',
  'GHOST', 'GIANT', 'GIVEN', 'GLASS', 'GLOBE', 'GLOOM', 'GLOVE', 'GRACE',
  'GRADE', 'GRAIN', 'GRAND', 'GRANT', 'GRASP', 'GRASS', 'GRAVE', 'GREAT',
  'GREEN', 'GRIEF', 'GRIND', 'GROAN', 'GROSS', 'GROUP', 'GROWN', 'GUARD',
  'GUESS', 'GUEST', 'GUIDE', 'GUILT', 'HAPPY', 'HARSH', 'HEART', 'HEAVY',
  'HERBS', 'HINGE', 'HONOR', 'HORSE', 'HOTEL', 'HOUSE', 'HUMAN', 'HUMOR',
  'HURRY', 'IDEAL', 'IMAGE', 'INDEX', 'INNER', 'INPUT', 'ISSUE', 'JUDGE',
  'JUICE', 'KNIFE', 'KNOCK', 'KNOWN', 'LABEL', 'LARGE', 'LASER', 'LATER',
  'LAUGH', 'LAYER', 'LEARN', 'LEAVE', 'LEGAL', 'LEMON', 'LEVEL', 'LIGHT',
  'LIMIT', 'LIVER', 'LOCAL', 'LODGE', 'LOGIC', 'LOOSE', 'LOVER', 'LOWER',
  'LUCKY', 'LUNAR', 'LUNCH', 'MAGIC', 'MAJOR', 'MAKER', 'MAPLE', 'MARCH',
  'MARRY', 'MATCH', 'MAYOR', 'MEDIA', 'MERCY', 'MERIT', 'METAL', 'MIGHT',
  'MINOR', 'MODEL', 'MONEY', 'MONTH', 'MORAL', 'MOUNT', 'MOUSE', 'MOUTH',
  'MOVIE', 'MUSIC', 'NAIVE', 'NERVE', 'NEVER', 'NIGHT', 'NOBLE', 'NOISE',
  'NORTH', 'NOVEL', 'NURSE', 'OCCUR', 'OCEAN', 'OFFER', 'OFTEN', 'OLIVE',
  'OPERA', 'ORBIT', 'ORDER', 'OTHER', 'OUTER', 'OWNER', 'PAINT', 'PANEL',
  'PANIC', 'PAPER', 'PARTY', 'PASTA', 'PATCH', 'PAUSE', 'PEACE', 'PEARL',
  'PHASE', 'PHONE', 'PHOTO', 'PIANO', 'PIECE', 'PILOT', 'PITCH', 'PIXEL',
  'PIZZA', 'PLACE', 'PLAIN', 'PLANE', 'PLANT', 'PLATE', 'POINT', 'POUND',
  'POWER', 'PRESS', 'PRICE', 'PRIDE', 'PRIME', 'PRINT', 'PRIOR', 'PROOF',
  'PROUD', 'PROVE', 'PULSE', 'PUNCH', 'PURSE', 'QUEEN', 'QUERY', 'QUEST',
  'QUICK', 'QUIET', 'QUOTE', 'RADAR', 'RADIO', 'RAISE', 'RALLY', 'RANCH',
  'RANGE', 'RAPID', 'REACH', 'READY', 'REALM', 'REBEL', 'REFER', 'REIGN',
  'RELAX', 'REPLY', 'RIDER', 'RIDGE', 'RIGHT', 'RISKY', 'RIVAL', 'RIVER',
  'ROBOT', 'ROUGH', 'ROUND', 'ROUTE', 'ROYAL', 'RULER', 'RURAL', 'SAINT',
  'SALAD', 'SAUCE', 'SCALE', 'SCARE', 'SCENE', 'SCOPE', 'SCORE', 'SENSE',
  'SERVE', 'SEVEN', 'SHADE', 'SHAKE', 'SHAME', 'SHAPE', 'SHARE', 'SHARK',
  'SHARP', 'SHELF', 'SHELL', 'SHIFT', 'SHINE', 'SHIRT', 'SHOCK', 'SHORE',
  'SHORT', 'SHOUT', 'SIGHT', 'SKILL', 'SLEEP', 'SLICE', 'SLIDE', 'SLOPE',
  'SMALL', 'SMART', 'SMILE', 'SMOKE', 'SNAKE', 'SOLAR', 'SOLID', 'SOLVE',
  'SORRY', 'SOUTH', 'SPACE', 'SPARE', 'SPARK', 'SPEAK', 'SPEED', 'SPEND',
  'SPINE', 'SPORT', 'SPRAY', 'STACK', 'STAFF', 'STAGE', 'STAND', 'STARK',
  'START', 'STATE', 'STEAM', 'STEEL', 'STEEP', 'STICK', 'STILL', 'STOCK',
  'STONE', 'STORE', 'STORM', 'STORY', 'STRIP', 'STUCK', 'STUDY', 'STUFF',
  'STYLE', 'SUGAR', 'SUITE', 'SUNNY', 'SURGE', 'SWEAR', 'SWEET', 'SWIFT',
  'SWING', 'SWORD', 'TABLE', 'TASTE', 'TEACH', 'TEETH', 'THANK', 'THEIR',
  'THEME', 'THICK', 'THING', 'THINK', 'THIRD', 'THORN', 'THREE', 'THROW',
  'THUMB', 'TIGER', 'TIGHT', 'TIMER', 'TIRED', 'TITLE', 'TODAY', 'TOKEN',
  'TORCH', 'TOTAL', 'TOUCH', 'TOUGH', 'TOWEL', 'TOWER', 'TOXIC', 'TRACK',
  'TRADE', 'TRAIL', 'TRAIN', 'TRASH', 'TREAT', 'TREND', 'TRIAL', 'TRIBE',
  'TRICK', 'TROOP', 'TRUCK', 'TRULY', 'TRUNK', 'TRUST', 'TRUTH', 'ULTRA',
  'UNCLE', 'UNDER', 'UNION', 'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN',
  'USUAL', 'VALID', 'VALUE', 'VALVE', 'VIDEO', 'VIRAL', 'VIRUS', 'VISIT',
  'VITAL', 'VIVID', 'VOICE', 'VOTER', 'WASTE', 'WATCH', 'WATER', 'WEAVE',
  'WEIRD', 'WHALE', 'WHEAT', 'WHEEL', 'WHERE', 'WHITE', 'WHOLE', 'WOMAN',
  'WORLD', 'WORRY', 'WORSE', 'WORTH', 'WOULD', 'WOUND', 'WRIST', 'WRITE',
  'WRONG', 'YACHT', 'YIELD', 'YOUNG', 'YOUTH', 'ZEBRA',
]

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
]

function getRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)]
}

// Handles duplicate letters correctly: first mark greens, then yellows
function evaluateGuess(guess, target) {
  const result = Array(5).fill('gray')
  const targetArr = target.split('')
  const guessArr = guess.split('')

  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === targetArr[i]) {
      result[i] = 'green'
      targetArr[i] = null
      guessArr[i] = null
    }
  }

  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === null) continue
    const idx = targetArr.indexOf(guessArr[i])
    if (idx !== -1) {
      result[i] = 'yellow'
      targetArr[idx] = null
    }
  }

  return result
}

const WIN_MESSAGES = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!']

export default function WordleGame() {
  const [target, setTarget] = useState(() => getRandomWord())
  const [guesses, setGuesses] = useState([]) // [{ word, colors }]
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [message, setMessage] = useState('')

  // Build the best known color for each letter from all submitted guesses
  const letterColors = {}
  const colorPriority = { green: 3, yellow: 2, gray: 1 }
  for (const { word, colors } of guesses) {
    for (let i = 0; i < 5; i++) {
      const letter = word[i]
      const color = colors[i]
      if (!letterColors[letter] || colorPriority[color] > colorPriority[letterColors[letter]]) {
        letterColors[letter] = color
      }
    }
  }

  const showMessage = (msg, duration = 2000) => {
    setMessage(msg)
    if (duration) setTimeout(() => setMessage(''), duration)
  }

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== 5) {
      showMessage('Not enough letters')
      return
    }

    const colors = evaluateGuess(currentGuess, target)
    const newGuesses = [...guesses, { word: currentGuess, colors }]
    setGuesses(newGuesses)
    setCurrentGuess('')

    if (currentGuess === target) {
      setWon(true)
      setGameOver(true)
      showMessage(WIN_MESSAGES[Math.min(guesses.length, 5)], 0)
    } else if (newGuesses.length === 6) {
      setGameOver(true)
      showMessage(`The word was ${target}`, 0)
    }
  }, [currentGuess, guesses, target])

  const handleKey = useCallback((key) => {
    if (gameOver) return
    if (key === 'ENTER') {
      submitGuess()
    } else if (key === '⌫' || key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1))
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key)
    }
  }, [gameOver, currentGuess, submitGuess])

  useEffect(() => {
    const onKeyDown = (e) => {
      const key = e.key.toUpperCase()
      if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
        handleKey(key === 'BACKSPACE' ? '⌫' : key)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleKey])

  const resetGame = () => {
    setTarget(getRandomWord())
    setGuesses([])
    setCurrentGuess('')
    setGameOver(false)
    setWon(false)
    setMessage('')
  }

  const getTileStyle = (submitted, color, hasLetter) => {
    if (submitted) {
      if (color === 'green') return 'bg-green-500 border-green-500 text-white'
      if (color === 'yellow') return 'bg-yellow-400 border-yellow-400 text-white'
      return 'bg-gray-500 border-gray-500 text-white'
    }
    if (hasLetter) return 'border-gray-500 text-gray-900 bg-white'
    return 'border-gray-300 bg-white'
  }

  const getKeyStyle = (key) => {
    const color = letterColors[key]
    if (color === 'green') return 'bg-green-500 text-white'
    if (color === 'yellow') return 'bg-yellow-400 text-white'
    if (color === 'gray') return 'bg-gray-400 text-white'
    return 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  }

  return (
    <div className="flex flex-col items-center py-10 px-4 min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="w-full max-w-sm border-b border-gray-200 pb-4 mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 tracking-wide">WORDLE</h1>
        <p className="text-xs text-gray-500 mt-1">Guess the 5-letter word in 6 tries</p>
      </div>

      {/* Message banner */}
      <div className={`mb-4 h-8 flex items-center justify-center`}>
        {message && (
          <span className="px-4 py-1.5 bg-gray-900 text-white text-sm font-semibold rounded-full">
            {message}
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="grid gap-1.5 mb-6">
        {Array.from({ length: 6 }, (_, r) => {
          const submitted = r < guesses.length
          const isActive = r === guesses.length && !gameOver
          const word = submitted ? guesses[r].word : isActive ? currentGuess : ''
          const colors = submitted ? guesses[r].colors : Array(5).fill(null)

          return (
            <div key={r} className="flex gap-1.5">
              {Array.from({ length: 5 }, (_, c) => {
                const letter = word[c] || ''
                return (
                  <div
                    key={c}
                    className={`w-14 h-14 border-2 flex items-center justify-center text-xl font-bold uppercase rounded transition-colors duration-150 ${getTileStyle(submitted, colors[c], !!letter)}`}
                  >
                    {letter}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* New Game button */}
      {gameOver && (
        <button
          onClick={resetGame}
          className="mb-6 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
        >
          New Game
        </button>
      )}

      {/* Keyboard */}
      <div className="flex flex-col gap-1.5">
        {KEYBOARD_ROWS.map((row, i) => (
          <div key={i} className="flex gap-1 justify-center">
            {row.map(key => (
              <button
                key={key}
                onClick={() => handleKey(key)}
                className={`h-14 rounded font-semibold text-sm flex items-center justify-center cursor-pointer transition-colors select-none ${key === 'ENTER' ? 'px-2.5 text-xs' : key === '⌫' ? 'w-10' : 'w-9'} ${getKeyStyle(key)}`}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Back link */}
      <a href="/" className="mt-10 text-sm text-gray-400 hover:text-blue-600 transition-colors">
        ← Back to site
      </a>
    </div>
  )
}
