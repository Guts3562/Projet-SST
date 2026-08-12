import React, { useState, useEffect } from "react";
import "./LoginModal.css";
import { useAuth } from "../../lib/AuthContext";

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const { login, register } = useAuth();
  const [view, setView] = useState("login"); // 'login' | 'register' | 'forgot' | 'reset'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("worker");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setErrorMsg("");
      setSuccessMsg("");
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setView("login");
    setSuccessMsg("");
    setErrorMsg("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (view === "login") {
        const data = await login(email, password);
        setSuccessMsg("Connexion réussie !");
        setTimeout(() => {
          onLoginSuccess(data.user);
          handleClose();
        }, 1000);
      } else if (view === "register") {
        const data = await register({
          email,
          password,
          full_name: name,
          role,
        });
        setSuccessMsg(
          "Inscription réussie ! Vous pouvez maintenant vous connecter.",
        );
        setTimeout(() => {
          onLoginSuccess(data.user);
          handleClose();
        }, 1500);
      } else if (view === "forgot") {
        // Simplified forgot password logic for this migration
        setErrorMsg(
          "La réinitialisation par email n'est pas encore configurée sur ce nouveau backend PostgreSQL. Veuillez contacter l'administrateur.",
        );
      } else if (view === "reset") {
        setErrorMsg(
          "La réinitialisation du mot de passe n'est pas encore disponible sur ce backend.",
        );
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <>
      <div className="login-header">
        <div className="login-logo">🔐</div>
        <h2>Connexion</h2>
        <p>Accédez à votre espace sécurisé SST</p>
      </div>

      {successMsg && <div className="auth-alert success">{successMsg}</div>}
      {errorMsg && <div className="auth-alert error">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label htmlFor="email">Adresse Email</label>
          <div className="input-wrapper">
            <span className="input-icon">✉️</span>
            <input
              type="email"
              id="email"
              placeholder="nom@exemple.tn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <div className="label-row">
            <label htmlFor="password">Mot de passe</label>
            <button
              type="button"
              className="forgot-link"
              onClick={() => setView("forgot")}
            >
              Oublié ?
            </button>
          </div>
          <div className="input-wrapper">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-login-submit"
          disabled={loading}
        >
          {loading ? "Chargement..." : "Se connecter"}
        </button>
      </form>

      <div className="login-footer">
        <p>
          Pas encore de compte ?{" "}
          <button
            type="button"
            className="footer-link"
            onClick={() => setView("register")}
          >
            S'inscrire
          </button>
        </p>
      </div>
    </>
  );

  const renderRegisterForm = () => (
    <>
      <div className="login-header">
        <div className="login-logo">📝</div>
        <h2>S'inscrire</h2>
        <p>Rejoignez la plateforme de prévention SST</p>
      </div>

      {successMsg && <div className="auth-alert success">{successMsg}</div>}
      {errorMsg && <div className="auth-alert error">{errorMsg}</div>}

      {!successMsg && (
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="name">Nom complet</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="name"
                placeholder="Votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Adresse Email</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                id="email"
                placeholder="nom@exemple.tn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="role">Votre rôle</label>
            <div className="input-wrapper">
              <span className="input-icon">💼</span>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="role-select"
              >
                <option value="worker">Travailleur</option>
                <option value="employer">Employeur / RH</option>
                <option value="specialist">Spécialiste SST / Médecin</option>
                <option value="student">Étudiant</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="password"
                placeholder="Créer un mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-login-submit"
            disabled={loading}
          >
            {loading ? "Chargement..." : "Créer mon compte"}
          </button>
        </form>
      )}

      <div className="login-footer">
        <p>
          Déjà inscrit ?{" "}
          <button
            type="button"
            className="footer-link"
            onClick={() => setView("login")}
          >
            Se connecter
          </button>
        </p>
      </div>
    </>
  );

  const renderForgotForm = () => (
    <>
      <div className="login-header">
        <div className="login-logo">🔑</div>
        <h2>Récupération</h2>
        <p>Entrez votre email pour réinitialiser votre mot de passe</p>
      </div>

      {successMsg && <div className="auth-alert success">{successMsg}</div>}
      {errorMsg && <div className="auth-alert error">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label htmlFor="email">Adresse Email</label>
          <div className="input-wrapper">
            <span className="input-icon">✉️</span>
            <input
              type="email"
              id="email"
              placeholder="nom@exemple.tn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-login-submit"
          disabled={loading}
        >
          {loading ? "Chargement..." : "Envoyer le lien"}
        </button>
      </form>

      <div className="login-footer">
        <button
          type="button"
          className="footer-link"
          onClick={() => setView("login")}
        >
          ← Retour à la connexion
        </button>
      </div>
    </>
  );

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>
          &times;
        </button>

        <div className="view-container">
          {view === "login" && renderLoginForm()}
          {view === "register" && renderRegisterForm()}
          {view === "forgot" && renderForgotForm()}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
