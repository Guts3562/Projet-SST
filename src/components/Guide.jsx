import React from "react";
import "./Guide.css";

function Guide() {
  return (
    <div id="guide" className="page active">
      <div className="section-header">
        <span className="section-label green">Documentation</span>
        <h2>Guide d'utilisation</h2>
        <p>
          Comment tirer le meilleur parti de cette plateforme de sensibilisation
          SST.
        </p>
      </div>

      <div className="steps-list" style={{ marginBottom: "36px" }}>
        <div className="step-item">
          <div className="step-num">1</div>
          <div className="step-body">
            <h4>Explorer les risques par secteur</h4>
            <p>
              Consultez l'onglet "Risques" pour identifier les dangers
              spécifiques à votre secteur (BTP, agriculture, industrie textile,
              chimique…) et les mesures de prévention adaptées.
            </p>
          </div>
        </div>

        <div className="step-item">
          <div className="step-num">2</div>
          <div className="step-body">
            <h4>Répondre au quiz SST</h4>
            <p>
              Testez vos connaissances avec 10 questions sur la législation
              tunisienne, les numéros d'urgence et les équipements de
              protection. Chaque réponse est expliquée.
            </p>
          </div>
        </div>

        <div className="step-item">
          <div className="step-num">3</div>
          <div className="step-body">
            <h4>Consulter les portails institutionnels</h4>
            <p>
              Utilisez les liens institutionnels et les portails réglementaires
              de la rubrique Ressources pour retrouver les textes et coordonnées
              à jour. La présence d’un lien ne signifie pas que chaque affirmation
              de ce projet a été validée.
            </p>
          </div>
        </div>

        <div className="step-item">
          <div className="step-num">4</div>
          <div className="step-body">
            <h4>Organiser des sessions collectives</h4>
            <p>
              Partagez la plateforme avec vos collègues. Organisez des sessions
              hebdomadaires de quiz pour ancrer les connaissances et développer
              une culture de prévention collective.
            </p>
          </div>
        </div>
        <div className="step-item">
          <div className="step-num">5</div>
          <div className="step-body">
            <h4>Se former aux premiers secours au travail</h4>
            <p>
              Renseignez-vous auprès d’un organisme de formation et vérifiez
              auprès des autorités compétentes les conditions de reconnaissance
              applicables en Tunisie. Les coordonnées de contact du projet ne
              sont pas encore vérifiées.
            </p>
          </div>
        </div>
      </div>

      <div className="card success">
        <h3><i className="bi bi-lightbulb"></i> Conseils pédagogiques</h3>
        <ul>
          <li>
            <i className="bi bi-calendar"></i> Refaites le quiz une fois par semaine pour ancrer les
            connaissances
          </li>
          <li>
            <i className="bi bi-people"></i> Organisez des séances collectives d'échanges sur les bonnes
            pratiques
          </li>
          <li>
            <i className="bi bi-journal-text"></i> Notez les points à améliorer dans votre environnement de travail
            immédiat
          </li>
          <li>
            <i className="bi bi-arrow-clockwise"></i> Mettez vos connaissances à jour selon les nouvelles
            réglementations tunisiennes
          </li>
          <li>
            <i className="bi bi-hospital"></i> Vérifiez que votre entreprise dispose d'un médecin du travail
            agréé
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Guide;
