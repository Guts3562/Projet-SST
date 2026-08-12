import { useState } from "react";
import accueilIcon from "./assets/accueil-icon.png";
import risquesIcon from "./assets/risques-icon.png";
import quizIcon from "./assets/quiz-icon.png";
import chatbotIcon from "./assets/chatbot-icon.png";
import guideIcon from "./assets/guide-icon.png";
import ressourcesIcon from "./assets/ressources-icon.png";
import settingsIcon from "./assets/settings-icon.png";
import logoutIcon from "./assets/logout-icon.png";
import sstLogo from "./assets/sst-logo.png";
import "./style.css";
import "./layout.css";
import { useAuth } from "./lib/AuthContext";
import Accueil from "./components/Accueil";
import Risques from "./components/Risques";
import Quiz from "./components/Quiz";
import Chatbot from "./components/Chatbot";
import Guide from "./components/Guide";
import Ressources from "./components/Ressources";
import LoginModal from "./components/Login/LoginModal";
import AuthRequired from "./components/Login/AuthRequired";
import LogoutConfirmModal from "./components/Login/LogoutConfirmModal";
import SettingsModal from "./components/Login/SettingsModal";

// Hamburger icon as clean SVG lines
const HamburgerIcon = () => (
  <svg
    width="20"
    height="14"
    viewBox="0 0 20 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="20" height="2" rx="1" fill="currentColor" />
    <rect y="6" width="14" height="2" rx="1" fill="currentColor" />
    <rect y="12" width="17" height="2" rx="1" fill="currentColor" />
  </svg>
);

// Tunisian flag as a crisp inline SVG with perfect official proportions (2:3)
const TunisianFlag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 800"
    style={{
      width: "22px",
      height: "15px",
      borderRadius: "2px",
      flexShrink: 0,
      boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
    }}
  >
    {/* Red background */}
    <rect width="1200" height="800" fill="#E70013" />

    {/* White circle (radius 200, centered) */}
    <circle cx="600" cy="400" r="200" fill="#FFFFFF" />

    {/* Red crescent (made by overlapping a red and white circle) */}
    <circle cx="600" cy="400" r="150" fill="#E70013" />
    <circle cx="640" cy="400" r="120" fill="#FFFFFF" />

    {/* Red star (5-pointed, centered inside the crescent) */}
    <polygon
      fill="#E70013"
      points="
        640,310
        660.2,372.2
        725.6,372.2
        672.6,410.6
        692.9,472.8
        640,434.3
        587.1,472.8
        607.4,410.6
        554.4,372.2
        619.8,372.2
      "
    />
  </svg>
);

// Page title map for inner-page top bar
const PAGE_TITLES = {
  accueil: null, // handled by hero
  situations: { img: risquesIcon,   label: "Risques Professionnels" },
  quiz:       { img: quizIcon,      label: "Quiz SST" },
  chatbot:    { img: chatbotIcon,   label: "Assistant IA" },
  guide:      { img: guideIcon,     label: "Guide Pratique" },
  ressources: { img: ressourcesIcon, label: "Ressources & Liens" },
};

function App() {
  const { user, profile, isLoading, login, register, logout, refreshProfile } = useAuth();

  const [activeTab, setActiveTab] = useState("accueil");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsLogoutModalOpen(false);
    setIsSidebarOpen(false);
  };

  const onLoginSuccess = () => {
    setIsLoginModalOpen(false);
  };

  const navItems = [
    { id: "accueil",    label: "Accueil",    img: accueilIcon },
    { id: "situations", label: "Risques",     img: risquesIcon },
    { id: "quiz",       label: "Quiz SST",    img: quizIcon },
    { id: "chatbot",    label: "Assistant",   img: chatbotIcon },
    { id: "guide",      label: "Guide",       img: guideIcon },
    { id: "ressources", label: "Ressources",  img: ressourcesIcon },
  ];

  const renderPage = () => {
    switch (activeTab) {
      case "accueil":
        return <Accueil onTabChange={setActiveTab} />;
      case "situations":
        return <Risques />;
      case "quiz":
        return user ? (
          <Quiz user={user} profile={profile} />
        ) : (
          <AuthRequired onLoginClick={() => setIsLoginModalOpen(true)} />
        );
      case "chatbot":
        return <Chatbot />;
      case "guide":
        return <Guide />;
      case "ressources":
        return <Ressources onTabChange={setActiveTab} />;
      default:
        return <Accueil onTabChange={setActiveTab} />;
    }
  };

  const fullName =
    profile?.full_name || user?.user_metadata?.full_name || user?.email;
  const isAccueil = activeTab === "accueil";
  const pageInfo = PAGE_TITLES[activeTab];

  // Show a minimal loading state while session is being restored
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "var(--bg-primary, #0f1117)",
          color: "var(--text-secondary, #8b9cb3)",
          fontSize: "1rem",
          gap: "12px",
        }}
      >
        <img src={sstLogo} alt="SST Logo" style={{ height: "24px", width: "auto", objectFit: "contain" }} />
        Chargement…
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ─── SIDEBAR ─────────────────────────────────────── */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="navbar-logo">
            <img src={sstLogo} alt="SST Logo" className="logo-icon" style={{ height: "32px", width: "auto", objectFit: "contain" }} />
            <div className="logo-text">
              <span className="logo-main">SST</span>
              <span className="logo-sub">Tunisie</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
            >
              <span className="nav-icon">
                {item.img ? (
                  <img src={item.img} alt={item.label} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                ) : (
                  item.icon
                )}
              </span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Profile / Login section */}
        {user ? (
          <div className="sidebar-profile">
            <div className="profile-info">
              <div className="profile-avatar">
                {fullName?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="profile-details">
                <span className="profile-name">{fullName}</span>
                <div className="profile-status">
                  <span className="status-dot"></span>
                  En ligne
                </div>
              </div>
            </div>
            <div className="profile-actions">
              <button
                className="profile-btn"
                onClick={() => setIsSettingsModalOpen(true)}
                title="Paramètres"
              >
                <img src={settingsIcon} alt="Paramètres" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
              </button>
              <button
                className="profile-btn logout"
                onClick={() => setIsLogoutModalOpen(true)}
                title="Déconnexion"
              >
                <img src={logoutIcon} alt="Déconnexion" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
              </button>
            </div>
          </div>
        ) : (
          <div className="sidebar-profile">
            <button
              className="btn btn-primary"
              style={{ width: "100%", padding: "14px" }}
              onClick={() => {
                setIsLoginModalOpen(true);
                setIsSidebarOpen(false);
              }}
            >
              Accéder au compte
            </button>
          </div>
        )}

        <div className="sidebar-footer">© 2026 SST Tunisie</div>
      </aside>

      {/* ─── MAIN LAYOUT ─────────────────────────────────── */}
      <main className="main-layout">
        {/* ── ACCUEIL: Hero with integrated hamburger ── */}
        {isAccueil && (
          <div className="hero">
            {/* Hamburger floats over the hero (top-left) */}
            <button
              className="hero-menu-btn"
              onClick={() => setIsSidebarOpen((v) => !v)}
              aria-label={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <HamburgerIcon />
            </button>

            {/* User pill floats over the hero (top-right) */}
            {user && (
              <div className="hero-user-pill">
                <span>👋</span>
                <span className="hero-user-name">
                  Bonjour, {fullName?.split(" ")[0]}
                </span>
              </div>
            )}

            <div className="hero-badge">
              <TunisianFlag /> Portail National de Référence en Prévention &amp; Sécurité
            </div>
            <h1>
              Santé &amp; Sécurité
              <br />
              au <span>Travail</span> Tunisie
            </h1>
            <p>
              Cadre d'accompagnement réglementaire, ressources académiques et outils d'évaluation conformes au Code du Travail tunisien et aux directives nationales de la CNSS.
            </p>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-num">45 000+</div>
                <div className="hero-stat-label">
                  Sinistres Professionnels / Déclarés annuellement (CNSS)
                </div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">35%</div>
                <div className="hero-stat-label">Incidence BTP / Secteur à haute vigilance</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">70%</div>
                <div className="hero-stat-label">Taux d'Évitabilité / Par actions de prévention active</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">CNSS</div>
                <div className="hero-stat-label">
                  Organisme Assureur / Gestion des risques professionnels
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── INNER PAGES: clean compact top bar ── */}
        {!isAccueil && (
          <header className="inner-top-bar">
            <button
              className="inner-menu-btn"
              onClick={() => setIsSidebarOpen((v) => !v)}
              aria-label={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <HamburgerIcon />
            </button>
            {pageInfo && (
              <div className="inner-page-title">
                {pageInfo.img ? (
                  <img src={pageInfo.img} alt={pageInfo.label} style={{ width: "22px", height: "22px", objectFit: "contain" }} />
                ) : (
                  <span>{pageInfo.icon}</span>
                )}
                <span>{pageInfo.label}</span>
              </div>
            )}
            {user && (
              <div className="inner-user-pill">
                <span>👤</span>
                <span className="inner-user-name">
                  {fullName?.split(" ")[0]}
                </span>
              </div>
            )}
          </header>
        )}

        {/* ── PAGE CONTENT ── */}
        <div className="content-wrapper">
          <div className="page-container">{renderPage()}</div>
        </div>
      </main>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={onLoginSuccess}
      />
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
      {user && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          user={user}
          profile={profile}
          onProfileUpdate={refreshProfile}
        />
      )}
    </div>
  );
}

export default App;
