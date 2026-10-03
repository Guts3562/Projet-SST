import React from "react";
import "./Ressources.css";
import SourcesSST from "./SourcesSST";

function Ressources({ onTabChange }) {
  return (
    <div id="ressources" className="page active">
      <div className="section-header">
        <span className="section-label blue">Ressources</span>
        <h2>Documents & contacts à vérifier</h2>
        <p>
          Pistes documentaires et institutionnelles. Vérifiez les informations
          sensibles auprès des sources officielles avant de les utiliser.
        </p>
      </div>

      <SourcesSST />

      <div className="grid-2" style={{ marginBottom: "40px" }}>
        <div className="card danger">
          <h3>
            <i className="bi bi-exclamation-triangle-fill"></i> Services
            d'urgence
          </h3>
          <p>
            Les coordonnées ci-dessous sont en attente de confirmation par une
            source officielle. Ne vous y fiez pas en situation d’urgence avant
            vérification auprès des autorités tunisiennes.
          </p>
          <div className="emergency-grid">
            <div className="emergency-card">
              <div className="emergency-icon">
                <i className="bi bi-heart-pulse"></i>
              </div>
              <div className="emergency-status">190</div>
              <div className="emergency-label">SAMU</div>
              <div className="emergency-desc">Urgences médicales</div>
            </div>
            <div className="emergency-card">
              <div className="emergency-icon">
                <i className="bi bi-fire"></i>
              </div>
              <div className="emergency-status">198</div>
              <div className="emergency-label">Protection Civile</div>
              <div className="emergency-desc">Pompiers + secours</div>
            </div>
            <div className="emergency-card">
              <div className="emergency-icon">
                <i className="bi bi-shield"></i>
              </div>
              <div className="emergency-status">197</div>
              <div className="emergency-label">Police Secours</div>
              <div className="emergency-desc">Intervention police</div>
            </div>
            <div className="emergency-card">
              <div className="emergency-icon">
                <i className="bi bi-flag"></i>
              </div>
              <div className="emergency-status">193</div>
              <div className="emergency-label">Garde Nationale</div>
              <div className="emergency-desc">Sécurité nationale</div>
            </div>
            <div className="emergency-card">
              <div className="emergency-icon">
                <i className="bi bi-water"></i>
              </div>
              <div className="emergency-status">194</div>
              <div className="emergency-label">Garde Maritime</div>
              <div className="emergency-desc">Secours en mer</div>
            </div>
            <div className="emergency-card">
              <div className="emergency-icon">
                <i className="bi bi-exclamation-diamond"></i>
              </div>
              <div className="emergency-status">71 335 500</div>
              <div className="emergency-label">Centre Anti-Poison</div>
              <div className="emergency-desc">Intoxications</div>
            </div>
            <div className="emergency-card">
              <div className="emergency-icon">
                <i className="bi bi-briefcase"></i>
              </div>
              <div className="emergency-status">71 796 744</div>
              <div className="emergency-label">CNSS</div>
              <div className="emergency-desc">Ligne verte (gratuite)</div>
            </div>
          </div>
        </div>

        <div className="card info">
          <h3>
            <i className="bi bi-bank"></i> Institutions de référence
          </h3>
          <div className="institution-card">
            <div className="institution-logo">
              <i className="bi bi-building"></i>
            </div>
            <div>
              <h4>CNSS — Caisse Nationale de Sécurité Sociale</h4>
              <p>
                Gestion des risques professionnels, accidents du travail et
                maladies professionnelles. Vérifier les services et coordonnées
                sur le site officiel de la CNSS.
              </p>
            </div>
          </div>
          <div className="institution-card">
            <div className="institution-logo">
              <i className="bi bi-clipboard2-pulse"></i>
            </div>
            <div>
              <h4>ISST — Institut de santé et de sécurité au travail</h4>
              <p>
                Consulter le site institutionnel pour les missions et services
                actuels.
              </p>
            </div>
          </div>
          <div className="institution-card">
            <div className="institution-logo">
              <i className="bi bi-briefcase"></i>
            </div>
            <div>
              <h4>Ministère des Affaires Sociales — Inspection du Travail</h4>
              <p>
                Contrôle des conditions de travail, application du Code du
                Travail tunisien, médiation.
              </p>
            </div>
          </div>
          <div className="institution-card">
            <div className="institution-logo">
              <i className="bi bi-building"></i>
            </div>
            <div>
              <h4>
                UTICA — Union Tunisienne de l'Industrie, du Commerce et de
                l'Artisanat
              </h4>
              <p>
                Organisation patronale, promotion des bonnes pratiques en
                matière de sécurité au travail.
              </p>
            </div>
          </div>
          <div className="institution-card">
            <div className="institution-logo">
              <i className="bi bi-people"></i>
            </div>
            <div>
              <h4>UGTT — Union Générale Tunisienne du Travail</h4>
              <p>
                Représentation des travailleurs, défense des droits et promotion
                de la sécurité en milieu professionnel.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>
          <i className="bi bi-folder2-open"></i> Documents à vérifier selon
          l’activité
        </h3>
        <p>
          Cette liste est indicative : les noms, le caractère obligatoire et les
          conditions applicables doivent être confirmés dans les textes
          tunisiens en vigueur.
        </p>
        <ul>
          <li>
            Registres de santé et de sécurité applicables à l’établissement
          </li>
          <li>
            Document d’évaluation des risques — intitulé et obligation à
            confirmer
          </li>
          <li>Consignes et plans d’urgence applicables au site</li>
          <li>
            Fiches de Données de Sécurité (FDS), selon les exigences applicables
          </li>
          <li>Registre de vérification des équipements de travail</li>
        </ul>
        <div style={{ overflowX: "auto" }}>
          <table className="epi-table">
            <thead>
              <tr>
                <th>EPI</th>
                <th>Référence normative (à confirmer)</th>
                <th>Secteurs</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <i className="bi bi-shield-fill-check"></i> Casque de sécurité
                </td>
                <td>À vérifier</td>
                <td>BTP, mines, industrie</td>
                <td>
                  <span className="epi-level recommande">À valider</span>
                </td>
              </tr>
              <tr>
                <td>
                  <i className="bi bi-shield"></i> Chaussures de sécurité
                </td>
                <td>À vérifier</td>
                <td>BTP, industrie, entrepôts</td>
                <td>
                  <span className="epi-level recommande">À valider</span>
                </td>
              </tr>
              <tr>
                <td>
                  <i className="bi bi-link"></i> Harnais de sécurité
                </td>
                <td>À vérifier</td>
                <td>Travaux en hauteur</td>
                <td>
                  <span className="epi-level recommande">À valider</span>
                </td>
              </tr>
              <tr>
                <td>
                  <i className="bi bi-mask"></i> Masques FFP2/FFP3
                </td>
                <td>À vérifier</td>
                <td>Cimenteries, mines, chimie</td>
                <td>
                  <span className="epi-level recommande">À valider</span>
                </td>
              </tr>
              <tr>
                <td>
                  <i className="bi bi-hand-index"></i> Gants de protection
                </td>
                <td>Selon risque</td>
                <td>Chimie, BTP, agroalimentaire</td>
                <td>
                  <span className="epi-level recommande">À valider</span>
                </td>
              </tr>
              <tr>
                <td>
                  <i className="bi bi-eyeglasses"></i> Lunettes de protection
                </td>
                <td>À vérifier</td>
                <td>Soudure, chimie, découpe</td>
                <td>
                  <span className="epi-level recommande">À valider</span>
                </td>
              </tr>
              <tr>
                <td>
                  <i className="bi bi-shield-check"></i> Protection auditive
                </td>
                <td>À vérifier</td>
                <td>Industrie bruyante</td>
                <td>
                  <span className="epi-level recommande">À valider</span>
                </td>
              </tr>
              <tr>
                <td>
                  <i className="bi bi-droplet"></i> Combinaison chimique
                </td>
                <td>À vérifier</td>
                <td>Agriculture, chimie</td>
                <td>
                  <span className="epi-level recommande">Recommandé</span>
                </td>
              </tr>
              <tr>
                <td>
                  <i className="bi bi-person-workspace"></i> Gilet haute
                  visibilité
                </td>
                <td>À vérifier</td>
                <td>BTP, transport, routes</td>
                <td>
                  <span className="epi-level recommande">Recommandé</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="cta-banner">
        <div className="cta-banner-icon">
          <i className="bi bi-bullseye"></i>
        </div>
        <h3 className="cta-banner-title">
          Anticipez les risques professionnels
        </h3>
        <p className="cta-banner-text">
          Explorez les situations à risque par secteur et adoptez les mesures de
          prévention adaptées.
        </p>
        <button
          className="btn btn-blue cta-banner-btn"
          onClick={() => onTabChange("situations")}
        >
          Voir les risques <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}

export default Ressources;
