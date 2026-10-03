import React, { useState, useEffect, useCallback } from "react";
import "./Quiz.css";
import { api } from "../lib/api";

const QUIZ_SIZE = 10;

const letters = ["A", "B", "C", "D"];

const shuffleOptions = (question) => {
  const indices = question.options.map((_, index) => index);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    ...question,
    options: indices.map((index) => question.options[index]),
    optionOrder: indices,
  };
};

function Quiz({ user }) {
  const [sessionData, setSessionData] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const loadQuestions = useCallback(async () => {
    setLoadError(null);
    try {
      const data = await api.quiz.getQuestions();
      if (!Array.isArray(data) || data.length < QUIZ_SIZE) {
        throw new Error(`Le quiz nécessite au moins ${QUIZ_SIZE} questions.`);
      }
      const shuffled = data.slice(0, QUIZ_SIZE).map(shuffleOptions);
      setSessionData({
        sessionId: `${Date.now()}-${Math.random()}`,
        sessionQuestions: shuffled,
        answers: new Array(shuffled.length).fill(null),
        currentQ: 0,
        grading: false,
        grade: null,
        saveError: null,
        saved: false,
      });
    } catch (error) {
      console.error("Failed to load questions:", error);
      setSessionData(null);
      setLoadError(
        error.message.startsWith("Le quiz nécessite")
          ? error.message
          : "Impossible de charger le quiz. Vérifiez votre connexion puis réessayez.",
      );
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const answered = sessionData
    ? sessionData.answers.filter((a) => a !== null).length
    : 0;
  const isFinished = sessionData ? answered === sessionData.sessionQuestions.length : false;

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

  const saveCompletedSession = async (session) => {
    setSessionData((previous) =>
      previous?.sessionId === session.sessionId
        ? { ...previous, grading: true, saveError: null }
        : previous,
    );
    try {
      const grade = await api.quiz.saveResult({
        answers: session.answers.map((selectedOption, index) => ({
          questionId: session.sessionQuestions[index].id,
          selectedOption: session.sessionQuestions[index].optionOrder[selectedOption],
        })),
      });
      setSessionData((previous) =>
        previous?.sessionId === session.sessionId
          ? { ...previous, grading: false, grade, saved: true }
          : previous,
      );
    } catch (error) {
      console.error("Failed to grade and save quiz:", error);
      setSessionData((previous) =>
        previous?.sessionId === session.sessionId
          ? {
              ...previous,
              grading: false,
              saveError: "Impossible d’enregistrer le résultat. Vérifiez votre connexion puis réessayez.",
            }
          : previous,
      );
    }
  };

  const selectAnswer = (idx) => {
    if (answers[currentQ] !== null) return;
    const nextAnswers = answers.map((answer, index) =>
      index === currentQ ? idx : answer,
    );
    const nextSession = {
      ...sessionData,
      answers: nextAnswers,
    };
    setSessionData(nextSession);
    if (nextAnswers.every((answer) => answer !== null)) {
      saveCompletedSession(nextSession);
    }
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
    loadQuestions();
  };

  const progressPercent = (answered / QUIZ_SIZE) * 100;

  if (isFinished && !sessionData.grade) {
    return (
      <div className="quiz-loading" role="status" aria-live="polite">
        {sessionData.grading ? (
          "Vérification et enregistrement des résultats..."
        ) : (
          <>
            <p>{sessionData.saveError || "Le résultat n’a pas encore été vérifié."}</p>
            <button
              className="btn btn-primary"
              onClick={() => saveCompletedSession(sessionData)}
            >
              Réessayer
            </button>
          </>
        )}
      </div>
    );
  }

  if (isFinished) {
    const { grade: serverGrade } = sessionData;
    const score = serverGrade.score;
    const pct = Math.round((score / QUIZ_SIZE) * 100);

    let grade, gradeColor, msg, msgIcon;
    if (pct === 100) {
      grade = "Excellent";
      gradeColor = "#1A8754";
      msgIcon = <i className="bi bi-trophy"></i>;
      msg = "Excellent. Vous maîtrisez les connaissances abordées dans ce quiz pédagogique.";
    } else if (pct >= 80) {
      grade = "Très bien";
      gradeColor = "#27AE60";
      msgIcon = <i className="bi bi-thumbs-up"></i>;
      msg = "Très bien. Quelques réponses méritent une révision pour atteindre l'excellence.";
    } else if (pct >= 60) {
      grade = "Passable";
      gradeColor = "#E67E22";
      msgIcon = <i className="bi bi-book"></i>;
      msg = "Résultat satisfaisant. Consultez les ressources pédagogiques avant de renouveler l'évaluation.";
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
      const correctIndex = q.optionOrder.indexOf(serverGrade.correctAnswers[q.id]);
      if (answers[i] === correctIndex) catMap[q.category].correct++;
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
      const correctIndex = q.optionOrder.indexOf(serverGrade.correctAnswers[q.id]);
      const ok = answers[i] === correctIndex;
      return (
        <div key={i} className="result-item">
          <div className="result-icon">{ok ? <i className="bi bi-check-circle-fill"></i> : <i className="bi bi-x-circle-fill"></i>}</div>
          <div className="result-item-text">
            <strong>
              Q{i + 1}. {q.text}
            </strong>
            {ok ? (
              <em><i className="bi bi-check"></i> {q.options[correctIndex]}</em>
            ) : (
              <span className="wrong-ans">
                Votre réponse : {q.options[answers[i]]} &nbsp;|&nbsp; Correcte :{" "}
                {q.options[correctIndex]}
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
            Cette évaluation sélectionne aléatoirement 10 questions de la banque
            pédagogique. Elle ne constitue pas une évaluation réglementaire.
            Vérifiez les réponses portant sur des numéros, normes, seuils ou
            obligations auprès des sources officielles avant tout usage pratique.
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
      if (idx === userAnswer) cls += " selected";
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

  const dotsHtml = Array.from({ length: QUIZ_SIZE }, (_, i) => {
    let dotCls = "quiz-dot";
    if (i === currentQ) dotCls += " dot-current";
    else if (answers[i] !== null) dotCls += " dot-answered";
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
          Cette évaluation sélectionne aléatoirement 10 questions de la banque
          pédagogique. Elle ne constitue pas une évaluation réglementaire.
          Vérifiez les réponses portant sur des numéros, normes, seuils ou
          obligations auprès des sources officielles avant tout usage pratique.
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
