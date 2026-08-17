import React from "react";
import "./Navbar.css";
import sstLogo from "../assets/sst-logo.png";

const Navbar = ({
  user,
  profile,
  onLoginClick,
  onLogoutClick,
  onSettingsClick,
  onMenuClick,
}) => {
  const displayName =
    profile?.full_name || user?.user_metadata?.full_name || user?.email;
  const firstName = displayName?.split(" ")[0] || "Utilisateur";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-left-group">
          <button
            className="hamburger-btn"
            onClick={onMenuClick}
            title="Menu principal"
          >
            <i className="bi bi-list"></i>
          </button>

          <div className="navbar-logo">
            <img src={sstLogo} alt="SST Logo" className="logo-icon" style={{ height: "32px", width: "auto", objectFit: "contain" }} />
            <div className="logo-text">
              <span className="logo-main">SST</span>
              <span className="logo-sub">Tunisie</span>
            </div>
          </div>
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="user-nav">
              <span className="user-name">
                <i className="bi bi-person"></i> <span className="name-text">{firstName}</span>
              </span>

              <button
                className="btn btn-login-nav settings-btn"
                onClick={onSettingsClick}
                title="Paramètres"
              >
                <span className="btn-icon"><i className="bi bi-gear"></i></span>
                <span className="btn-text">Paramètres</span>
              </button>

              <button
                className="btn btn-login-nav logout"
                onClick={onLogoutClick}
                title="Déconnexion"
              >
                <span className="btn-icon"><i className="bi bi-box-arrow-right"></i></span>
                <span className="btn-text">Déconnexion</span>
              </button>
            </div>
          ) : (
            <button className="btn btn-login-nav" onClick={onLoginClick}>
              <span className="btn-icon"><i className="bi bi-person"></i></span>
              <span className="btn-text">Connexion</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
