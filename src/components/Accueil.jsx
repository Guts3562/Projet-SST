import React from "react";
import "./Accueil.css";
import knowledgeIcon from "../assets/knowledge-icon.png";
import constructionIcon from "../../Ressources/construction_4423686.png";
import tractorIcon from "../../Ressources/tractor_15871104.png";
import industryIcon from "../../Ressources/money_10215454.png";
import referencesIcon from "../../Ressources/Références Législatives.png";
import objectivesIcon from "../../Ressources/Objectifs de Sensibilisation.png";

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
        <div className="sector-card">
          <div className="sector-icon red"><img src={constructionIcon} alt="BTP" style={{ width: "36px", height: "36px", objectFit: "contain" }} /></div>
          <h4>Bâtiment &amp; Travaux Publics (BTP)</h4>
          <p>
            Premier secteur accidentogène en Tunisie, concentrant près de 35% des sinistres déclarés. Vigilance accrue requise sur les chantiers.
          </p>
          <span className="pill pill-red">Risque Critique</span>
        </div>
        <div className="sector-card">
          <div className="sector-icon amber"><img src={tractorIcon} alt="Agriculture" style={{ width: "36px", height: "36px", objectFit: "contain" }} /></div>
          <h4>Secteur Agricole</h4>
          <p>
            Risques spécifiques liés à la manipulation des machines agricoles et expositions toxicologiques sévères aux produits phytosanitaires.
          </p>
          <span className="pill pill-amber">Sensibilisation Impérative</span>
        </div>
        <div className="sector-card">
          <div className="sector-icon blue"><img src={industryIcon} alt="Industrie" style={{ width: "36px", height: "36px", objectFit: "contain" }} /></div>
          <h4>Activités Industrielles</h4>
          <p>
            Nuisances acoustiques majeures, risques de coupures ou d'amputation sur machines rotatives et risques chimiques diffus.
          </p>
          <span className="pill pill-red">Conformité Obligatoire</span>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: "40px" }}>
        <div className="card success">
          <h3><img src={referencesIcon} alt="Références" style={{ width: "24px", height: "24px", objectFit: "contain", marginRight: "8px" }} /> Références Législatives</h3>
          <ul>
            <li>Loi Organique &amp; Code du Travail (Loi n°66-27 du 30 avril 1966 et ses amendements)</li>
            <li>Décret n°2000-389 (Réglementation des comités de santé et sécurité au travail)</li>
            <li>Décret n°2001-641 (Organisation des services de médecine du travail)</li>
            <li>Directives techniques du Ministère des Affaires Sociales</li>
          </ul>
        </div>
        <div className="card info">
          <h3><img src={objectivesIcon} alt="Objectifs" style={{ width: "24px", height: "24px", objectFit: "contain", marginRight: "8px" }} /> Objectifs de Sensibilisation</h3>
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
        <h3 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
          <img src={knowledgeIcon} alt="Évaluation" style={{ height: "32px", width: "auto", objectFit: "contain" }} />
          Évaluation des Connaissances
        </h3>
        <p>
          Mesurez votre niveau de conformité et testez vos connaissances pratiques sur la réglementation SST en Tunisie à travers un diagnostic rapide de 10 questions.
        </p>
        <button className="btn btn-amber" onClick={() => onTabChange("quiz")}>
          Démarrer le diagnostic SST →
        </button>
      </div>
    </div>
  );
}

export default Accueil;
