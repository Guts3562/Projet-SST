import React from "react";
import sstLogo from "../../assets/sst-logo.png";
import "./AuthRequired.css";

const AuthRequired = ({ onLoginClick }) => {
  return (
    <div className="auth-required-container">
      <div className="auth-required-card">
        <div className="auth-icon-large"><i className="bi bi-lock-fill"></i></div>
        <h2>Espace Membre Requis</h2>
        <p>
          Pour participer au Quiz SST et sauvegarder vos scores dans votre
          dossier professionnel, vous devez être connecté à votre compte.
        </p>

        <div className="auth-required-actions">
          <button className="btn btn-primary" onClick={onLoginClick}>
            Se connecter / S'inscrire
          </button>
        </div>

        <div className="auth-features-grid">
          <div className="auth-feature">
            <span><i className="bi bi-bar-chart"></i></span>
            <p>Suivi des scores</p>
          </div>
          <div className="auth-feature">
            <span><img src={sstLogo} alt="SST Logo" style={{ height: "28px", width: "auto", objectFit: "contain" }} /></span>
            <p>Attestations SST</p>
          </div>
          <div className="auth-feature">
            <span><i className="bi bi-graph-up"></i></span>
            <p>Statistiques</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthRequired;
