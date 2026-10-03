import { useState } from "react";
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
import AuthGate from "./components/Login/AuthGate";
import LogoutConfirmModal from "./components/Login/LogoutConfirmModal";
import SettingsModal from "./components/Login/SettingsModal";
import Admin from "./components/Admin";
import { localized, useLanguage } from "./lib/language";

const NAV_ICONS = {
  accueil: "bi bi-house",
  situations: "bi bi-exclamation-triangle",
  quiz: "bi bi-patch-question",
  chatbot: "bi bi-chat-dots",
  guide: "bi bi-journal-text",
  ressources: "bi bi-folder2-open",
};

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
  accueil: null,
  situations: { icon: "bi bi-exclamation-triangle", label: "Risques Professionnels" },
  quiz:       { icon: "bi bi-patch-question",     label: "Quiz SST" },
  chatbot:    { icon: "bi bi-chat-dots",          label: "Assistant pédagogique" },
  guide:      { icon: "bi bi-journal-text",       label: "Guide Pratique" },
  ressources: { icon: "bi bi-folder2-open",       label: "Ressources & Liens" },
};

function App() {
  const { user, profile, isLoading, logout, refreshProfile } = useAuth();
  const language = useLanguage();
  const text = (french, english) => localized(language, french, english);

  const [activeTab, setActiveTab] = useState("accueil");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsLogoutModalOpen(false);
    setIsSidebarOpen(false);
  };

  const isAdmin = user?.system_role === "admin";

  const navItems = [
    { id: "accueil", label: text("Accueil", "Home"), icon: NAV_ICONS.accueil },
    { id: "situations", label: text("Risques", "Risks"), icon: NAV_ICONS.situations },
    { id: "quiz", label: text("Quiz SST", "OSH quiz"), icon: NAV_ICONS.quiz },
    { id: "chatbot", label: text("Assistant", "Assistant"), icon: NAV_ICONS.chatbot },
    { id: "guide", label: text("Guide", "Guide"), icon: NAV_ICONS.guide },
    { id: "ressources", label: text("Ressources", "Resources"), icon: NAV_ICONS.ressources },
  ];

  const renderPage = () => {
    switch (activeTab) {
      case "accueil":
        return <Accueil onTabChange={setActiveTab} />;
      case "situations":
        return <Risques />;
      case "quiz":
        return <Quiz user={user} profile={profile} />;
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
        {text("Chargement…", "Loading…")}
      </div>
    );
  }

  if (!user) {
    return <AuthGate />;
  }

  if (isAdmin) {
    return (
      <Admin
        user={user}
        onLogout={handleLogout}
      />
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
                <i className={item.icon}></i>
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
                  {text("En ligne", "Online")}
                </div>
              </div>
            </div>
            <div className="profile-actions">
              <button
                className="profile-btn"
                onClick={() => setIsSettingsModalOpen(true)}
                title="Paramètres"
              >
                <i className="bi bi-gear"></i>
              </button>
              <button
                className="profile-btn logout"
                onClick={() => setIsLogoutModalOpen(true)}
                title="Déconnexion"
              >
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </div>
          </div>
        ) : (
          <div className="sidebar-profile">
            <button
              className="btn btn-primary"
              style={{ width: "100%", padding: "14px" }}
              onClick={() => setIsSidebarOpen(false)}
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
                <i className="bi bi-hand"></i>
                <span className="hero-user-name">
                  {text("Bonjour", "Hello")}, {fullName}
                </span>
              </div>
            )}

            <div className="hero-badge">
              <TunisianFlag /> Projet pédagogique de sensibilisation SST
            </div>
            <h1>
              Santé &amp; Sécurité
              <br />
              au <span>Travail</span> Tunisie
            </h1>
            <p>
              Ressources pédagogiques et outils d’évaluation autour de la santé et de la sécurité au travail en Tunisie. Les informations réglementaires sont à vérifier auprès des sources officielles.
            </p>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-num">Prévenir</div>
                <div className="hero-stat-label">
                  Identifier les situations à risque
                </div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">Apprendre</div>
                <div className="hero-stat-label">Consulter les ressources pédagogiques</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">Évaluer</div>
                <div className="hero-stat-label">Tester ses connaissances avec le quiz</div>
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
                {pageInfo.icon ? (
                  <i className={pageInfo.icon}></i>
                ) : (
                  <span>{pageInfo.icon}</span>
                )}
                <span>{({
                  situations: text("Risques professionnels", "Occupational risks"),
                  quiz: text("Quiz SST", "OSH quiz"),
                  chatbot: text("Assistant pédagogique", "Learning assistant"),
                  guide: text("Guide pratique", "Practical guide"),
                  ressources: text("Ressources et liens", "Resources and links"),
                })[activeTab] || pageInfo.label}</span>
              </div>
            )}
            {user && (
              <div className="inner-user-pill">
                <i className="bi bi-person"></i>
                <span className="inner-user-name">
                  {fullName}
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
