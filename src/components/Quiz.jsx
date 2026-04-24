import React, { useState } from 'react'
import { QUESTION_BANK, QUIZ_SIZE } from '../data'

const letters = ['A', 'B', 'C', 'D']

function Quiz() {
  // Fisher-Yates shuffle
  const shuffle = (arr) => {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  // Shuffle options
  const shuffleOptions = (q) => {
    const indices = [0, 1, 2, 3]
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }
    return {
      ...q,
      options: indices.map(i => q.options[i]),
      correct: indices.indexOf(q.correct)
    }
  }

  // Initialize session questions
  const initializeSession = () => {
    const shuffled = shuffle(QUESTION_BANK).slice(0, QUIZ_SIZE).map(shuffleOptions)
    return {
      sessionQuestions: shuffled,
      answers: new Array(QUIZ_SIZE).fill(null),
      currentQ: 0
    }
  }

  const [sessionData, setSessionData] = useState(initializeSession)

  const { sessionQuestions, answers, currentQ } = sessionData

  const selectAnswer = (idx) => {
    if (answers[currentQ] !== null) return
    setSessionData(prev => ({
      ...prev,
      answers: prev.answers.map((a, i) => i === currentQ ? idx : a)
    }))
  }

  const nextQ = () => {
    if (answers[currentQ] === null) return
    if (currentQ < QUIZ_SIZE - 1) {
      setSessionData(prev => ({ ...prev, currentQ: prev.currentQ + 1 }))
    } else {
      // Show results
    }
  }

  const prevQ = () => {
    if (currentQ > 0) {
      setSessionData(prev => ({ ...prev, currentQ: prev.currentQ - 1 }))
    }
  }

  const goToQ = (i) => {
    const firstUnanswered = answers.findIndex(a => a === null)
    if (i <= firstUnanswered || firstUnanswered === -1) {
      setSessionData(prev => ({ ...prev, currentQ: i }))
    }
  }

  const resetQuiz = () => {
    setSessionData(initializeSession())
  }

  if (sessionQuestions.length === 0) return <div>Loading...</div>

  const answered = answers.filter(a => a !== null).length
  const progressPercent = (answered / QUIZ_SIZE) * 100

  if (answered === QUIZ_SIZE) {
    // Render results
    const score = answers.filter((a, i) => a === sessionQuestions[i].correct).length
    const pct = Math.round((score / QUIZ_SIZE) * 100)

    let grade, gradeColor, msg
    if (pct === 100) {
      grade = 'Excellent'
      gradeColor = '#1A8754'
      msg = '🏆 Parfait ! Vous maîtrisez parfaitement la SST en Tunisie !'
    } else if (pct >= 80) {
      grade = 'Très bien'
      gradeColor = '#27AE60'
      msg = '👍 Très bien ! Quelques points à revoir pour atteindre l\'excellence.'
    } else if (pct >= 60) {
      grade = 'Passable'
      gradeColor = '#E67E22'
      msg = '📚 Passable. Révisez les ressources CNSS et retentez le quiz.'
    } else {
      grade = 'Insuffisant'
      gradeColor = '#C0392B'
      msg = '⚠️ La sécurité est primordiale — consultez le guide et les ressources !'
    }

    const catMap = {}
    sessionQuestions.forEach((q, i) => {
      if (!catMap[q.category]) catMap[q.category] = { total: 0, correct: 0 }
      catMap[q.category].total++
      if (answers[i] === q.correct) catMap[q.category].correct++
    })
    const catHtml = Object.entries(catMap).map(([cat, d]) => {
      const cpct = Math.round((d.correct / d.total) * 100)
      return (
        <div key={cat} className="cat-row">
          <span className="cat-name">{cat}</span>
          <div className="cat-bar-outer">
            <div className="cat-bar-inner" style={{ width: `${cpct}%`, background: cpct >= 70 ? '#27AE60' : '#E74C3C' }}></div>
          </div>
          <span className="cat-score">{d.correct}/{d.total}</span>
        </div>
      )
    })

    const detailHtml = sessionQuestions.map((q, i) => {
      const ok = answers[i] === q.correct
      return (
        <div key={i} className="result-item">
          <div className="result-icon">{ok ? '✅' : '❌'}</div>
          <div className="result-item-text">
            <strong>Q{i + 1}. {q.text}</strong>
            {ok ? (
              <em>✓ {q.options[q.correct]}</em>
            ) : (
              <span className="wrong-ans">
                Votre réponse : {q.options[answers[i]]} &nbsp;|&nbsp; Correcte : {q.options[q.correct]}
              </span>
            )}
          </div>
        </div>
      )
    })

    return (
      <div id="quiz" className="page active">
        <div className="section-header">
          <span className="section-label amber">Quiz SST</span>
          <h2>Évaluation de vos<br/>connaissances</h2>
          <p>10 questions tirées aléatoirement parmi 31 — législation, urgences, EPI et bonnes pratiques. Chaque session est unique !</p>
        </div>

        <div className="quiz-wrap">
          <div className="quiz-progress-bar-outer">
            <div className="quiz-progress-bar-inner" style={{ width: '100%' }}></div>
          </div>

          <div className="quiz-card">
            <div className="results-wrap">
              <div className="results-score-ring" style={{ '--pct': `${pct * 3.6}deg` }}>
                <div className="results-score-inner">
                  <div className="results-num" style={{ color: gradeColor }}>{score}/{QUIZ_SIZE}</div>
                  <div className="results-denom">{pct}%</div>
                </div>
              </div>
              <div className="results-grade" style={{ color: gradeColor }}>{grade}</div>
              <div className="results-title">Session terminée</div>
              <div className="results-msg">{msg}</div>
              <div className="results-pool-note">Banque de questions : {QUESTION_BANK.length} questions · {QUIZ_SIZE} tirées aléatoirement</div>
              <div className="cat-breakdown">{catHtml}</div>
              <button className="btn btn-primary" onClick={resetQuiz} style={{ margin: '24px auto 0', display: 'block' }}>
                🔀 Nouvelle session aléatoire
              </button>
              <div className="results-detail">
                <h4>Détail de vos réponses</h4>
                {detailHtml}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const q = sessionQuestions[currentQ]
  const userAnswer = answers[currentQ]
  const isAnswered = userAnswer !== null

  const optionsHtml = q.options.map((opt, idx) => {
    let cls = ''
    if (isAnswered) {
      cls += ' locked'
      if (idx === q.correct) cls += ' correct'
      else if (idx === userAnswer) cls += ' wrong'
    }
    return (
      <div key={idx} className={`quiz-option${cls}`} onClick={() => selectAnswer(idx)}>
        <div className="quiz-opt-letter">{letters[idx]}</div>
        <div className="quiz-opt-text">{opt}</div>
      </div>
    )
  })

  let feedbackHtml = null
  if (isAnswered) {
    const ok = userAnswer === q.correct
    feedbackHtml = (
      <div className={`quiz-feedback ${ok ? 'good' : 'bad'}`}>
        <div className="quiz-feedback-icon">{ok ? '✅' : '❌'}</div>
        <div className="quiz-feedback-text">
          <strong>{ok ? 'Bonne réponse !' : 'Réponse incorrecte'}</strong>
          <p>{q.explanation}</p>
        </div>
      </div>
    )
  }

  const dotsHtml = Array.from({ length: QUIZ_SIZE }, (_, i) => {
    let dotCls = 'quiz-dot'
    if (i === currentQ) dotCls += ' dot-current'
    else if (answers[i] !== null) {
      dotCls += answers[i] === sessionQuestions[i].correct ? ' dot-correct' : ' dot-wrong'
    }
    return (
      <span key={i} className={dotCls} onClick={() => goToQ(i)} title={`Question ${i + 1}`}></span>
    )
  })

  const prevDisabled = currentQ === 0
  const isLastQ = currentQ === QUIZ_SIZE - 1
  const nextLabel = isLastQ ? 'Voir les résultats ✓' : 'Suivant →'
  const nextDisabled = !isAnswered

  return (
    <div id="quiz" className="page active">
      <div className="section-header">
      <span className="section-label amber">Évaluation</span>
      <h2>Quiz SST Tunisie</h2>
      <p>10 questions tirées aléatoirement parmi 31 — législation, urgences, EPI et bonnes pratiques. Chaque session est unique !</p>
      </div>

      <div className="quiz-wrap">
        <div className="quiz-progress-bar-outer">
          <div className="quiz-progress-bar-inner" style={{ width: `${progressPercent}%` }}></div>
        </div>

        <div className="quiz-card">
          <div className="quiz-meta">
            <span className="quiz-counter">Question <strong>{currentQ + 1}</strong> / {QUIZ_SIZE}</span>
            <span className="quiz-category">{q.category}</span>
          </div>
          <div className="quiz-dot-nav">{dotsHtml}</div>
          <div className="quiz-q">{q.text}</div>
          <div className="quiz-options">{optionsHtml}</div>
          {feedbackHtml}
          <div className="quiz-actions">
            <button className="btn btn-secondary" onClick={prevQ} disabled={prevDisabled}>← Précédent</button>
            <button className="btn btn-primary" onClick={nextQ} disabled={nextDisabled}>{nextLabel}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quiz