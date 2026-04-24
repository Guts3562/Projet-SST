import React from 'react'

function Accueil({ onTabChange }) {
  return (
    <div id="accueil" className="page active">
      <div className="section-header">
        <span className="section-label green">Notre mission</span>
        <h2>Prévenir les risques,<br/>protéger les travailleurs</h2>
        <p>Conformément à la législation tunisienne (Code du Travail, décrets n°2000-389 et n°2001-641), nous vous aidons à identifier et prévenir les risques professionnels dans votre secteur.</p>
      </div>

      <div className="grid-3" style={{marginBottom: '40px'}}>
        <div className="sector-card">
          <div className="sector-icon red">🏗️</div>
          <h4>Bâtiment & BTP</h4>
          <p>Secteur le plus accidentogène en Tunisie avec 35% des accidents déclarés</p>
          <span className="pill pill-red">Risque très élevé</span>
        </div>
        <div className="sector-card">
          <div className="sector-icon amber">🌾</div>
          <h4>Agriculture</h4>
          <p>Accidents liés aux machines agricoles et aux produits phytosanitaires</p>
          <span className="pill pill-amber">Prévention essentielle</span>
        </div>
        <div className="sector-card">
          <div className="sector-icon blue">🏭</div>
          <h4>Industrie</h4>
          <p>Risques liés aux machines industrielles, bruit, produits chimiques</p>
          <span className="pill pill-red">Formation obligatoire</span>
        </div>
      </div>

      <div className="grid-2" style={{marginBottom: '40px'}}>
        <div className="card success">
          <h3>📋 Cadre légal tunisien</h3>
          <ul>
            <li>Code du Travail (Loi n°66-27 du 30 avril 1966)</li>
            <li>Décret n°2000-389 du 28 novembre 2000</li>
            <li>Décret n°2001-641 du 13 mars 2001 (médecine du travail)</li>
            <li>Arrêtés du ministère des Affaires Sociales</li>
          </ul>
        </div>
        <div className="card info">
          <h3>� Objectifs pédagogiques</h3>
          <ul>
            <li>Identifier les principales situations à risque</li>
            <li>Connaître les gestes de prévention adaptés</li>
            <li>Maîtriser les numéros d'urgence en Tunisie</li>
            <li>Comprendre le rôle de la CNSS</li>
            <li>Développer une culture de prévention collective</li>
          </ul>
        </div>
      </div>

      <div className="card warning">
        <h3>📊 Chiffres clés — Tunisie</h3>
        <div className="grid-3" style={{marginTop: '16px', gap: '12px'}}>
          <div className="stat-box stat-box-amber">
            <div className="stat-val" style={{fontFamily: "'Fraunces', serif", fontSize: '28px', fontWeight: '800'}}>45 000+</div>
            <div className="stat-sub" style={{fontSize: '13px'}}>accidents/an déclarés à la CNSS</div>
          </div>
          <div className="stat-box stat-box-red">
            <div className="stat-val" style={{fontFamily: "'Fraunces', serif", fontSize: '28px', fontWeight: '800'}}>35%</div>
            <div className="stat-sub" style={{fontSize: '13px'}}>des accidents dans le BTP</div>
          </div>
          <div className="stat-box stat-box-green">
            <div className="stat-val" style={{fontFamily: "'Fraunces', serif", fontSize: '28px', fontWeight: '800'}}>70%</div>
            <div className="stat-sub" style={{fontSize: '13px'}}>évitables avec la prévention</div>
          </div>
        </div>
      </div>

      <div className="cta-banner">
        <h3>🎯 Testez vos connaissances SST</h3>
        <p>10 questions sur le contexte tunisien pour évaluer et renforcer votre culture de prévention.</p>
        <button className="btn btn-amber" onClick={() => onTabChange('quiz')}>Commencer le quiz →</button>
      </div>
    </div>
  )
}

export default Accueil