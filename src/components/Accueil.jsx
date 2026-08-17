import React from "react";
import "./Accueil.css";
import knowledgeIcon from "../assets/knowledge-icon.png";

function Accueil({ onTabChange }) {
  return (
    <div id="accueil" className="page active">
      <div className="section-header" style={{ textAlign: "center" }}>
        <span className="section-label green">Cadre National de Prévention</span>
        <h2>Orientations Stratégiques &amp; Protection des Effectifs</h2>
        <p>
          En conformité stricte avec les dispositions législatives tunisiennes (notamment le Code du Travail et les décrets d'application n°2000-389 et n°2001-641), notre mission consiste à structurer la prévention des risques professionnels et à accompagner les organisations dans la mise en conformité de leurs environnements de travail.
        </p>
      </div>

      <div className="grid-3" style={{ marginBottom: "40px" }}>
        <div className="sector-card red-card">
          <div className="sector-icon red"><i className="bi bi-buildings"></i></div>
          <h4>Bâtiment &amp; Travaux Publics (BTP)</h4>
          <p>
            Premier secteur accidentogène en Tunisie, concentrant près de 35% des sinistres déclarés. Vigilance accrue requise sur les chantiers.
          </p>
          <span className="pill pill-red">Risque Critique</span>
        </div>
        <div className="sector-card amber-card">
          <div className="sector-icon amber"><i className="bi bi-tree"></i></div>
          <h4>Secteur Agricole</h4>
          <p>
            Risques spécifiques liés à la manipulation des machines agricoles et expositions toxicologiques sévères aux produits phytosanitaires.
          </p>
          <span className="pill pill-amber">Sensibilisation Impérative</span>
        </div>
        <div className="sector-card blue-card">
          <div className="sector-icon blue"><i className="bi bi-gear"></i></div>
          <h4>Activités Industrielles</h4>
          <p>
            Nuisances acoustiques majeures, risques de coupures ou d'amputation sur machines rotatives et risques chimiques diffus.
          </p>
          <span className="pill pill-red">Conformité Obligatoire</span>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: "40px" }}>
        <div className="card success">
          <h3><i className="bi bi-journal-text"></i> Références Législatives</h3>
          <ul>
            <li>Loi Organique &amp; Code du Travail (Loi n°66-27 du 30 avril 1966 et ses amendements)</li>
            <li>Décret n°2000-389 (Réglementation des comités de santé et sécurité au travail)</li>
            <li>Décret n°2001-641 (Organisation des services de médecine du travail)</li>
            <li>Directives techniques du Ministère des Affaires Sociales</li>
          </ul>
        </div>
        <div className="card info">
          <h3><i className="bi bi-bullseye"></i> Objectifs de Sensibilisation</h3>
          <ul>
            <li>Cartographier et analyser les situations de travail à risques majeurs.</li>
            <li>Appliquer les mesures techniques de protection collective (EPC) et individuelle (EPI).</li>
            <li>Maîtriser les procédures de signalement et numéros d'urgence nationaux.</li>
            <li>Comprendre les interactions institutionnelles avec la CNSS et l'inspection du travail.</li>
            <li>Instaurer une culture de sécurité partagée et de vigilance comportementale.</li>
          </ul>
        </div>
      </div>

      <div className="cta-banner">
        <div className="cta-banner-icon">
          <img src={knowledgeIcon} alt="Évaluation" />
        </div>
        <h3 className="cta-banner-title">Quiz SST : Évaluez vos connaissances</h3>
        <p className="cta-banner-text">
          10 questions pour tester votre maîtrise de la réglementation tunisienne en santé et sécurité au travail.
        </p>
        <button className="btn btn-amber cta-banner-btn" onClick={() => onTabChange("quiz")}>
          Commencer le quiz <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}

export default Accueil;
