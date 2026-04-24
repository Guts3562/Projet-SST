import React from 'react'

function Ressources({ onTabChange }) {
  return (
    <div id="ressources" className="page active">
      <div className="section-header">
      <span className="section-label blue">Ressources</span>
      <h2>Documents & contacts utiles</h2>
      <p>Tous les numéros d'urgence, équipements et institutions de référence en Tunisie.</p>
      </div>

      <div className="grid-2" style={{ marginBottom: '40px' }}>
        <div className="card danger">
          <h3>🚨 Numéros d'urgence</h3>
          <div className="emergency-grid">
            <div className="emergency-card">
              <div className="emergency-icon">🚑</div>
              <div className="emergency-num">190</div>
              <div className="emergency-label">SAMU</div>
              <div className="emergency-desc">Urgences médicales</div>
            </div>
            <div className="emergency-card">
              <div className="emergency-icon">🚒</div>
              <div className="emergency-num">198</div>
              <div className="emergency-label">Protection Civile</div>
              <div className="emergency-desc">Pompiers + secours</div>
            </div>
            <div className="emergency-card">
              <div className="emergency-icon">👮</div>
              <div className="emergency-num">197</div>
              <div className="emergency-label">Police Secours</div>
              <div className="emergency-desc">Intervention police</div>
            </div>
            <div className="emergency-card">
              <div className="emergency-icon">🪖</div>
              <div className="emergency-num">193</div>
              <div className="emergency-label">Garde Nationale</div>
              <div className="emergency-desc">Sécurité nationale</div>
            </div>
            <div className="emergency-card">
              <div className="emergency-icon">🌊</div>
              <div className="emergency-num">194</div>
              <div className="emergency-label">Garde Maritime</div>
              <div className="emergency-desc">Secours en mer</div>
            </div>
            <div className="emergency-card">
              <div className="emergency-icon">☠️</div>
              <div className="emergency-num">71 335 500</div>
              <div className="emergency-label">Centre Anti-Poison</div>
              <div className="emergency-desc">Intoxications</div>
            </div>
            <div className="emergency-card">
              <div className="emergency-icon">💼</div>
              <div className="emergency-num">55 590 228</div>
              <div className="emergency-label">CNSS</div>
              <div className="emergency-desc">Ligne verte (gratuite)</div>
            </div>
          </div>
        </div>

        <div className="card info">
          <h3>🏛️ Institutions de référence</h3>
          <div className="institution-card">
            <div className="institution-logo">🏛️</div>
            <div>
              <h4>CNSS — Caisse Nationale de Sécurité Sociale</h4>
              <p>Gestion des risques professionnels, accidents du travail et maladies professionnelles. Ligne verte : <strong>55 590 228</strong></p>
            </div>
          </div>
          <div className="institution-card">
            <div className="institution-logo">🔬</div>
            <div>
              <h4>INRSST — Institut National de Recherche et de Sécurité en Santé au Travail</h4>
              <p>Recherche, expertise technique, formation et documentation en SST pour la Tunisie.</p>
            </div>
          </div>
          <div className="institution-card">
            <div className="institution-logo">⚖️</div>
            <div>
              <h4>Ministère des Affaires Sociales — Inspection du Travail</h4>
              <p>Contrôle des conditions de travail, application du Code du Travail tunisien, médiation.</p>
            </div>
          </div>
          <div className="institution-card">
            <div className="institution-logo">🏭</div>
            <div>
              <h4>UTICA — Union Tunisienne de l'Industrie, du Commerce et de l'Artisanat</h4>
              <p>Organisation patronale, promotion des bonnes pratiques en matière de sécurité au travail.</p>
            </div>
          </div>
          <div className="institution-card">
            <div className="institution-logo">👷</div>
            <div>
              <h4>UGTT — Union Générale Tunisienne du Travail</h4>
              <p>Représentation des travailleurs, défense des droits et promotion de la sécurité en milieu professionnel.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>📄 Documents obligatoires en entreprise</h3>
        <ul>
          <li>Registre Santé et Sécurité au Travail</li>
          <li>Document Unique d'Évaluation des Risques (DUER)</li>
          <li>Plan d'évacuation incendie affiché</li>
          <li>Fiches de Données de Sécurité (FDS) pour chaque produit chimique</li>
          <li>Registre de vérification des équipements de travail</li>
        </ul>
        <div style={{overflowX: 'auto'}}>
          <table className="epi-table">
            <thead>
              <tr>
                <th>EPI</th>
                <th>Norme tunisienne</th>
                <th>Secteurs</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td>⛑️ Casque de sécurité</td>
              <td>NT 09.02</td>
              <td>BTP, mines, industrie</td>
              <td><span className="epi-level obligatoire">Obligatoire</span></td>
            </tr>
            <tr>
              <td>👞 Chaussures de sécurité</td>
              <td>NT 09.01</td>
              <td>BTP, industrie, entrepôts</td>
              <td><span className="epi-level obligatoire">Obligatoire</span></td>
            </tr>
            <tr>
              <td>🪢 Harnais de sécurité</td>
              <td>NT 09.12</td>
              <td>Travaux en hauteur &gt;2m</td>
              <td><span className="epi-level obligatoire">Obligatoire</span></td>
            </tr>
            <tr>
              <td>😷 Masques FFP2/FFP3</td>
              <td>NT 09.08</td>
              <td>Cimenteries, mines, chimie</td>
              <td><span className="epi-level obligatoire">Obligatoire</span></td>
            </tr>
            <tr>
              <td>🧤 Gants de protection</td>
              <td>Selon risque</td>
              <td>Chimie, BTP, agroalimentaire</td>
              <td><span className="epi-level obligatoire">Obligatoire</span></td>
            </tr>
            <tr>
              <td>🥽 Lunettes de protection</td>
              <td>NT 09.06</td>
              <td>Soudure, chimie, découpe</td>
              <td><span className="epi-level obligatoire">Obligatoire</span></td>
            </tr>
            <tr>
              <td>👂 Protection auditive</td>
              <td>NT 09.09</td>
              <td>Industrie bruyante (&gt;85 dB)</td>
              <td><span className="epi-level obligatoire">Obligatoire</span></td>
            </tr>
            <tr>
              <td>👕 Combinaison chimique</td>
              <td>NT 09.15</td>
              <td>Agriculture, chimie</td>
              <td><span className="epi-level recommande">Recommandé</span></td>
            </tr>
            <tr>
              <td>🦺 Gilet haute visibilité</td>
              <td>NT 09.20</td>
              <td>BTP, transport, routes</td>
              <td><span className="epi-level recommande">Recommandé</span></td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>

      <div className="cta-banner">
        <h3>🎯 Explorez les risques professionnels</h3>
        <p>Découvrez les situations à risque spécifiques à votre secteur et les mesures de prévention adaptées.</p>
        <button className="btn btn-blue" onClick={() => onTabChange('situations')}>Voir les risques →</button>
      </div>
    </div>
  )
}

export default Ressources