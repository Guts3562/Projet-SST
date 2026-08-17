import React, { useState, useEffect } from "react";
import "./Quiz.css";
import { api } from "../lib/api";

const QUIZ_SIZE = 10;

const letters = ["A", "B", "C", "D"];

function Quiz({ user, profile }) {
  // Shuffle options
  const shuffleOptions = (q) => {
    const indices = [0, 1, 2, 3];
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return {
      ...q,
      options: indices.map((i) => q.options[i]),
      correct: indices.indexOf(q.correct),
    };
  };

  const [sessionData, setSessionData] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await api.quiz.getQuestions();
        console.log("Fetched questions from API:", data);
        const shuffled = data.slice(0, QUIZ_SIZE).map(shuffleOptions);
        setSessionData({
          sessionQuestions: shuffled,
          answers: new Array(QUIZ_SIZE).fill(null),
          currentQ: 0,
          saved: false,
        });
      } catch (error) {
        console.error("Failed to load questions:", error);
        setLoadError(error.message);
      }
    };
    loadQuestions();
  }, []);

  const answered = sessionData
    ? sessionData.answers.filter((a) => a !== null).length
    : 0;
  const isFinished = sessionData ? answered === QUIZ_SIZE : false;

  // Save results to PostgreSQL when finished
  useEffect(() => {
    if (sessionData && isFinished && user && !sessionData.saved) {
      const { sessionQuestions, answers } = sessionData;
      const score = answers.filter(
        (a, i) => a === sessionQuestions[i].correct,
      ).length;
      const saveResult = async () => {
        try {
          await api.quiz.saveResult({
            noun: profile?.full_name || user?.email || "Anonyme",
            role: profile?.role || "Utilisateur",
            score: score,
            total: QUIZ_SIZE,
          });
          setSessionData((prev) => ({ ...prev, saved: true }));
          console.log("Score saved to PostgreSQL!");
        } catch (error) {
          console.error("Error saving score:", error);
        }
      };
      saveResult();
    }
  }, [isFinished, user, profile, sessionData]);

  if (loadError)
    return (
      <div className="quiz-error">
        <h3>Erreur de chargement</h3>
        <p>{loadError}</p>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );

  if (!sessionData)
    return <div className="quiz-loading">Préparation de l'évaluation en cours...</div>;

  const { sessionQuestions, answers, currentQ, saved } = sessionData;

  if (sessionQuestions.length === 0)
    return (
      <div className="quiz-error">
        <h3>Aucune question disponible</h3>
        <p>
          La banque de questions est actuellement indisponible. Veuillez réessayer ultérieurement.
        </p>
      </div>
    );

  const selectAnswer = (idx) => {
    if (answers[currentQ] !== null) return;
    setSessionData((prev) => ({
      ...prev,
      answers: prev.answers.map((a, i) => (i === currentQ ? idx : a)),
    }));
  };

  const nextQ = () => {
    if (answers[currentQ] === null) return;
    if (currentQ < sessionQuestions.length - 1) {
      setSessionData((prev) => ({ ...prev, currentQ: prev.currentQ + 1 }));
    }
  };

  const prevQ = () => {
    if (currentQ > 0) {
      setSessionData((prev) => ({ ...prev, currentQ: prev.currentQ - 1 }));
    }
  };

  const goToQ = (i) => {
    const firstUnanswered = answers.findIndex((a) => a === null);
    if (i <= firstUnanswered || firstUnanswered === -1) {
      setSessionData((prev) => ({ ...prev, currentQ: i }));
    }
  };

  const resetQuiz = () => {
    setSessionData(null);
    const loadQuestions = async () => {
      try {
        const data = await api.quiz.getQuestions();
        const shuffled = data.slice(0, QUIZ_SIZE).map(shuffleOptions);
        setSessionData({
          sessionQuestions: shuffled,
          answers: new Array(shuffled.length).fill(null),
          currentQ: 0,
          saved: false,
        });
      } catch (error) {
        console.error("Failed to load questions:", error);
      }
    };
    loadQuestions();
  };

  const progressPercent = (answered / QUIZ_SIZE) * 100;

  if (isFinished) {
    const score = answers.filter(
      (a, i) => a === sessionQuestions[i].correct,
    ).length;
    const pct = Math.round((score / QUIZ_SIZE) * 100);

    let grade, gradeColor, msg, msgIcon;
    if (pct === 100) {
      grade = "Excellent";
      gradeColor = "#1A8754";
      msgIcon = <i className="bi bi-trophy"></i>;
      msg = "Excellent. Vous démontrez une maîtrise complète des normes SST en vigueur en Tunisie.";
    } else if (pct >= 80) {
      grade = "Très bien";
      gradeColor = "#27AE60";
      msgIcon = <i className="bi bi-thumbs-up"></i>;
      msg = "Très bien. Quelques points méritent une révision pour atteindre l'excellence.";
    } else if (pct >= 60) {
      grade = "Passable";
      gradeColor = "#E67E22";
      msgIcon = <i className="bi bi-book"></i>;
      msg = "Résultat satisfaisant. Nous vous invitons à consulter les ressources CNSS avant de renouveler l'évaluation.";
    } else {
      grade = "Insuffisant";
      gradeColor = "#C0392B";
      msgIcon = <i className="bi bi-exclamation-triangle-fill"></i>;
      msg = "La sécurité est primordiale. Nous vous invitons à consulter le guide et les ressources disponibles.";
    }

    const catMap = {};
    sessionQuestions.forEach((q, i) => {
      if (!catMap[q.category]) catMap[q.category] = { total: 0, correct: 0 };
      catMap[q.category].total++;
      if (answers[i] === q.correct) catMap[q.category].correct++;
    });
    const catHtml = Object.entries(catMap).map(([cat, d]) => {
      const cpct = Math.round((d.correct / d.total) * 100);
      return (
        <div key={cat} className="cat-row">
          <span className="cat-name">{cat}</span>
          <div className="cat-bar-outer">
            <div
              className="cat-bar-inner"
              style={{
                width: `${cpct}%`,
                background: cpct >= 70 ? "#27AE60" : "#E74C3C",
              }}
            ></div>
          </div>
          <span className="cat-score">
            {d.correct}/{d.total}
          </span>
        </div>
      );
    });

    const detailHtml = sessionQuestions.map((q, i) => {
      const ok = answers[i] === q.correct;
      return (
        <div key={i} className="result-item">
          <div className="result-icon">{ok ? <i className="bi bi-check-circle-fill"></i> : <i className="bi bi-x-circle-fill"></i>}</div>
          <div className="result-item-text">
            <strong>
              Q{i + 1}. {q.text}
            </strong>
            {ok ? (
              <em><i className="bi bi-check"></i> {q.options[q.correct]}</em>
            ) : (
              <span className="wrong-ans">
                Votre réponse : {q.options[answers[i]]} &nbsp;|&nbsp; Correcte :{" "}
                {q.options[q.correct]}
              </span>
            )}
          </div>
        </div>
      );
    });

    return (
      <div id="quiz" className="page active">
        <div className="section-header">
          <span className="section-label amber">Quiz SST</span>
          <h2>Évaluation de vos connaissances</h2>
          <p>
            Cette évaluation comprend 10 questions sélectionnées aléatoirement parmi 31, couvrant la législation, les urgences, les EPI et les bonnes pratiques. Chaque session est unique.
          </p>
        </div>

        <div className="quiz-wrap">
          <div className="quiz-progress-bar-outer">
            <div
              className="quiz-progress-bar-inner"
              style={{ width: "100%" }}
            ></div>
          </div>

          <div className="quiz-card">
            <div className="results-wrap">
              <div
                className="results-score-ring"
                style={{ "--pct": `${pct * 3.6}deg` }}
              >
                <div className="results-score-inner">
                  <div className="results-num" style={{ color: gradeColor }}>
                    {score}/{QUIZ_SIZE}
                  </div>
                  <div className="results-denom">{pct}%</div>
                </div>
              </div>
              <div className="results-grade" style={{ color: gradeColor }}>
                {grade}
              </div>
              <div className="results-title">Session terminée</div>
              <div className="results-msg">{msgIcon} {msg}</div>
              {user && saved && (
                <div
                  className="auth-alert success"
                  style={{ margin: "12px auto", maxWidth: "300px" }}
                >
                  <i className="bi bi-cloud"></i> Résultat enregistré dans votre espace sécurisé.
                </div>
              )}
              {!user && (
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    margin: "12px 0",
                  }}
                >
                  Connectez-vous pour sauvegarder vos résultats d'évaluation.
                </p>
              )}
              <div className="results-pool-note">
                Banque de questions dynamique · 10 questions sélectionnées aléatoirement
              </div>
              <div className="cat-breakdown">{catHtml}</div>
              <button
                className="btn btn-primary"
                onClick={resetQuiz}
                style={{ margin: "24px auto 0", display: "block" }}
              >
                <i className="bi bi-shuffle"></i> Nouvelle session
              </button>
              <div className="results-detail">
                <h4>Détail des réponses</h4>
                {detailHtml}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const q = sessionQuestions[currentQ];
  const userAnswer = answers[currentQ];
  const isAnswered = userAnswer !== null;

  const optionsHtml = q.options.map((opt, idx) => {
    let cls = "";
    if (isAnswered) {
      cls += " locked";
      if (idx === q.correct) cls += " correct";
      else if (idx === userAnswer) cls += " wrong";
    }
    return (
      <div
        key={idx}
        className={`quiz-option${cls}`}
        onClick={() => selectAnswer(idx)}
      >
        <div className="quiz-opt-letter">{letters[idx]}</div>
        <div className="quiz-opt-text">{opt}</div>
      </div>
    );
  });

  let feedbackHtml = null;
  if (isAnswered) {
    const ok = userAnswer === q.correct;
    feedbackHtml = (
      <div className={`quiz-feedback ${ok ? "good" : "bad"}`}>
        <div className="quiz-feedback-icon">{ok ? <i className="bi bi-check-circle-fill"></i> : <i className="bi bi-x-circle-fill"></i>}</div>
        <div className="quiz-feedback-text">
          <strong>{ok ? "Réponse correcte." : "Réponse incorrecte."}</strong>
          <p>{q.explanation}</p>
        </div>
      </div>
    );
  }

  const dotsHtml = Array.from({ length: QUIZ_SIZE }, (_, i) => {
    let dotCls = "quiz-dot";
    if (i === currentQ) dotCls += " dot-current";
    else if (answers[i] !== null) {
      dotCls +=
        answers[i] === sessionQuestions[i].correct
          ? " dot-correct"
          : " dot-wrong";
    }
    return (
      <span
        key={i}
        className={dotCls}
        onClick={() => goToQ(i)}
        title={`Question ${i + 1}`}
      ></span>
    );
  });

  const prevDisabled = currentQ === 0;
  const isLastQ = currentQ === QUIZ_SIZE - 1;
  const nextLabel = isLastQ ? <span>Voir les résultats <i className="bi bi-check"></i></span> : <span>Suivant</span>;
  const nextDisabled = !isAnswered;

  return (
    <div id="quiz" className="page active">
      <div className="section-header">
        <span className="section-label amber">Évaluation</span>
        <h2>Quiz SST Tunisie</h2>
        <p>
          Cette évaluation comprend 10 questions sélectionnées aléatoirement parmi 41, couvrant la législation, les urgences, les EPI et les bonnes pratiques. Chaque session est unique.
        </p>
      </div>

      <div className="quiz-wrap">
        <div className="quiz-progress-bar-outer">
          <div
            className="quiz-progress-bar-inner"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <div className="quiz-card">
          <div className="quiz-meta">
            <span className="quiz-counter">
              Question <strong>{currentQ + 1}</strong> / {QUIZ_SIZE}
            </span>
            <span className="quiz-category">{q.category}</span>
          </div>
          <div className="quiz-dot-nav">{dotsHtml}</div>
          <div className="quiz-q">{q.text}</div>
          <div className="quiz-options">{optionsHtml}</div>
          {feedbackHtml}
          <div className="quiz-actions">
            <button
              className="btn btn-secondary"
              onClick={prevQ}
              disabled={prevDisabled}
            >
              <i className="bi bi-arrow-left"></i> Précédent
            </button>
            <button
              className="btn btn-primary"
              onClick={nextQ}
              disabled={nextDisabled}
            >
              {nextLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
