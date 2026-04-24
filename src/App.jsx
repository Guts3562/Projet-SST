import { useState } from 'react'
import './style.css'
import Accueil from './components/Accueil'
import Risques from './components/Risques'
import Quiz from './components/Quiz'
import Guide from './components/Guide'
import Ressources from './components/Ressources'

function App() {
  const [activeTab, setActiveTab] = useState('accueil')

  const tabs = [
    { id: 'accueil', label: 'Accueil', icon: '🏠' },
    { id: 'situations', label: 'Risques', icon: '⚠️' },
    { id: 'quiz', label: 'Quiz SST', icon: '📝' },
    { id: 'guide', label: 'Guide', icon: '📘' },
    { id: 'ressources', label: 'Ressources', icon: '📚' },
  ]

  const renderPage = () => {
    switch (activeTab) {
      case 'accueil':
        return <Accueil onTabChange={setActiveTab} />
      case 'situations':
        return <Risques />
      case 'quiz':
        return <Quiz />
      case 'guide':
        return <Guide />
      case 'ressources':
        return <Ressources onTabChange={setActiveTab} />
      default:
        return <Accueil onTabChange={setActiveTab} />
    }
  }

  return (
    <>
      {/* HERO */}
      <div className="hero">
        <div className="hero-badge">🇹🇳 Plateforme officielle de sensibilisation</div>
        <h1>Santé &amp; Sécurité<br/>au <span>Travail</span> Tunisie</h1>
        <p>Sensibilisation, formation et ressources pour protéger les travailleurs tunisiens — conformément au Code du Travail et aux normes CNSS.</p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num">45 000+</div>
            <div className="hero-stat-label">accidents du travail par an</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">35%</div>
            <div className="hero-stat-label">dans le secteur BTP</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">70%</div>
            <div className="hero-stat-label">évitables avec prévention</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">CNSS</div>
            <div className="hero-stat-label">gestionnaire des risques pro.</div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs-wrapper">
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="main-wrapper">
        {renderPage()}
      </div>
    </>
  )
}

export default App
