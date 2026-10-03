import { useEffect, useState } from "react";
import sstLogo from "../../assets/sst-logo.png";
import { useAuth } from "../../lib/AuthContext";
import { localized, useLanguage } from "../../lib/language";
import { api } from "../../lib/api";
import "./AuthGate.css";

const AUTH_ERROR_MESSAGES = {
  "Provide a valid email, name, and password of at least 8 characters.":
    "Saisissez une adresse e-mail valide, votre nom et un mot de passe d’au moins 8 caractères.",
  "User already exists.": "Un compte existe déjà avec cette adresse e-mail.",
  "Choose a client or administrator login.": "Choisissez une connexion client ou administrateur.",
  "Invalid email or password.": "Adresse e-mail ou mot de passe incorrect.",
  "Administrator access required.": "L’accès administrateur est requis.",
  "Enter a valid email address.": "Saisissez une adresse e-mail valide.",
  "Password recovery email is not configured. Contact the administrator.":
    "La récupération du mot de passe n’est pas configurée. Contactez l’administrateur.",
  "Password recovery email is temporarily unavailable. Try again later.":
    "L’envoi des e-mails est temporairement indisponible. Réessayez plus tard.",
  "This reset link is invalid or has expired. Request a new one.":
    "Ce lien est invalide ou expiré. Demandez-en un nouveau.",
  "Use a valid reset link and a password between 8 and 72 bytes.":
    "Utilisez un lien valide et un mot de passe de 8 à 72 octets.",
  "Too many password reset requests. Please try again later.":
    "Trop de demandes de réinitialisation. Réessayez plus tard.",
};
const AUTH_ERROR_MESSAGES_EN = {
  "Provide a valid email, name, and password of at least 8 characters.":
    "Enter a valid email address, your name, and a password of at least 8 characters.",
  "User already exists.": "An account with this email address already exists.",
  "Choose a client or administrator login.": "Choose client or administrator sign-in.",
  "Invalid email or password.": "Email address or password is incorrect.",
  "Administrator access required.": "Administrator access is required.",
  "Enter a valid email address.": "Enter a valid email address.",
  "Password recovery email is not configured. Contact the administrator.":
    "Password recovery email is not configured. Contact the administrator.",
  "Password recovery email is temporarily unavailable. Try again later.":
    "Email delivery is temporarily unavailable. Try again later.",
  "This reset link is invalid or has expired. Request a new one.":
    "This reset link is invalid or has expired. Request a new one.",
  "Use a valid reset link and a password between 8 and 72 bytes.":
    "Use a valid reset link and a password between 8 and 72 bytes.",
  "Too many password reset requests. Please try again later.":
    "Too many password reset requests. Please try again later.",
};

const AuthGate = () => {
  const { login, register } = useAuth();
  const language = useLanguage();
  const text = (french, english) => localized(language, french, english);
  const [loginType, setLoginType] = useState("client");
  const [isRegistering, setIsRegistering] = useState(false);
  const [authView, setAuthView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState(
    () => new URLSearchParams(window.location.search).get("resetToken") || "",
  );
  const [fullName, setFullName] = useState("");
  const [occupation, setOccupation] = useState("worker");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!resetToken) return;
    setAuthView("reset");
    const url = new URL(window.location.href);
    url.searchParams.delete("resetToken");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, [resetToken]);

  const chooseLoginType = (type) => {
    setLoginType(type);
    setIsRegistering(false);
    setAuthView("login");
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      if (isRegistering) {
        await register({
          email,
          password,
          full_name: fullName,
          role: occupation,
        });
      } else {
        await login(email, password, loginType);
      }
    } catch (authError) {
      console.error("Authentication failed:", authError);
      setError(
        text(
          AUTH_ERROR_MESSAGES[authError.message] ||
            "La connexion a échoué. Vérifiez vos informations et réessayez.",
          AUTH_ERROR_MESSAGES_EN[authError.message] ||
            "Sign in failed. Check your details and try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestReset = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      await api.auth.requestPasswordReset(email.trim());
      setSuccess(text(
        "Si un compte correspond à cette adresse, vous recevrez un lien de réinitialisation valide pendant 30 minutes. Vérifiez aussi vos courriers indésirables.",
        "If an account matches this address, you’ll receive a reset link valid for 30 minutes. Check your spam folder too.",
      ));
    } catch (resetError) {
      console.error("Password reset request failed:", resetError);
      setError(text(
        AUTH_ERROR_MESSAGES[resetError.message] || "Impossible d’envoyer la demande. Réessayez plus tard.",
        AUTH_ERROR_MESSAGES_EN[resetError.message] || "Unable to send the request. Please try again later.",
      ));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteReset = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!resetToken) {
      setError(text(
        "Le lien de réinitialisation est manquant ou invalide. Demandez un nouveau lien.",
        "The reset link is missing or invalid. Request a new link.",
      ));
      return;
    }
    if (password !== confirmPassword) {
      setError(text("Les mots de passe ne correspondent pas.", "The passwords do not match."));
      return;
    }
    setIsSubmitting(true);
    try {
      await api.auth.completePasswordReset(resetToken, password);
      setResetToken("");
      setPassword("");
      setConfirmPassword("");
      setIsRegistering(false);
      setAuthView("login");
      setSuccess(text(
        "Votre mot de passe a été modifié. Vous pouvez vous connecter.",
        "Your password has been changed. You can now sign in.",
      ));
    } catch (resetError) {
      console.error("Password reset completion failed:", resetError);
      setError(text(
        AUTH_ERROR_MESSAGES[resetError.message] || "Impossible de réinitialiser le mot de passe.",
        AUTH_ERROR_MESSAGES_EN[resetError.message] || "Unable to reset the password.",
      ));
    } finally {
      setIsSubmitting(false);
    }
  };

  const returnToLogin = () => {
    setAuthView("login");
    setError("");
    setSuccess("");
    setResetToken("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <main className="auth-gate">
      <section className="auth-gate-card" aria-labelledby="auth-gate-title">
        <div className="auth-gate-brand">
          <img src={sstLogo} alt="" />
          <span>SST <strong>Tunisie</strong></span>
        </div>
        <div className="auth-gate-heading">
          <span className="auth-gate-eyebrow">{text("ESPACE SÉCURISÉ", "SECURE ACCESS")}</span>
          <h1 id="auth-gate-title">
            {authView === "forgot"
              ? text("Mot de passe oublié", "Forgot password")
              : authView === "reset"
                ? text("Nouveau mot de passe", "New password")
                : isRegistering
                  ? text("Créer un compte client", "Create a client account")
                  : loginType === "admin"
                    ? text("Connexion administrateur", "Administrator sign in")
                    : text("Connexion client", "Client sign in")}
          </h1>
          <p>
            {authView === "forgot"
              ? text("Saisissez l’adresse e-mail associée à votre compte.", "Enter the email address associated with your account.")
              : authView === "reset"
                ? text("Choisissez un nouveau mot de passe sécurisé.", "Choose a new secure password.")
                : isRegistering
                  ? text("Créez votre compte pour accéder aux ressources SST.", "Create your account to access SST resources.")
                  : text("Connectez-vous pour accéder à votre espace SST.", "Sign in to access your SST workspace.")}
          </p>
        </div>

        {authView === "login" && <div className="auth-gate-roles" aria-label={text("Type de connexion", "Sign-in type")}>
          <button
            type="button"
            className={loginType === "client" ? "selected" : ""}
            aria-pressed={loginType === "client"}
            onClick={() => chooseLoginType("client")}
          >
            <i className="bi bi-person-fill" aria-hidden="true"></i>
            <span>Client</span>
          </button>
          <button
            type="button"
            className={loginType === "admin" ? "selected" : ""}
            aria-pressed={loginType === "admin"}
            onClick={() => chooseLoginType("admin")}
          >
            <i className="bi bi-shield-lock-fill" aria-hidden="true"></i>
            <span>{text("Administrateur", "Administrator")}</span>
          </button>
        </div>}

        {error && <p className="auth-gate-error" role="alert">{error}</p>}
        {success && <p className="auth-gate-success" role="status">{success}</p>}

        {authView === "login" && <form className="auth-gate-form" onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <label>
                {text("Nom complet", "Full name")}
                <input
                  autoComplete="name"
                  maxLength={150}
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                />
              </label>
              <label>
                {text("Votre profil", "Your occupation")}
                <select
                  value={occupation}
                  onChange={(event) => setOccupation(event.target.value)}
                >
                  <option value="worker">{text("Travailleur", "Worker")}</option>
                  <option value="employer">{text("Employeur / RH", "Employer / HR")}</option>
                  <option value="specialist">{text("Spécialiste SST / Médecin", "OSH specialist / Physician")}</option>
                  <option value="student">{text("Étudiant", "Student")}</option>
                </select>
              </label>
            </>
          )}
          <label>
            {text("Adresse e-mail", "Email address")}
            <input
              autoComplete="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            {text("Mot de passe", "Password")}
            <input
              autoComplete={isRegistering ? "new-password" : "current-password"}
              type="password"
              minLength={isRegistering ? 8 : undefined}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {!isRegistering && (
            <button
              className="auth-gate-forgot"
              type="button"
              onClick={() => {
                setAuthView("forgot");
                setError("");
                setSuccess("");
              }}
            >
              {text("Mot de passe oublié ?", "Forgot password?")}
            </button>
          )}
          <button className="auth-gate-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? text("Connexion…", "Signing in…")
              : isRegistering
                ? text("Créer mon compte client", "Create client account")
                : loginType === "admin"
                  ? text("Se connecter à l’administration", "Sign in as administrator")
                  : text("Se connecter", "Sign in")}
          </button>
        </form>}

        {authView === "forgot" && (
          <form className="auth-gate-form" onSubmit={handleRequestReset}>
            <label>
              {text("Adresse e-mail", "Email address")}
              <input
                autoComplete="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <button className="auth-gate-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? text("Envoi…", "Sending…")
                : text("Envoyer le lien de réinitialisation", "Send reset link")}
            </button>
            <button className="auth-gate-back" type="button" onClick={returnToLogin}>
              {text("Retour à la connexion", "Back to sign in")}
            </button>
          </form>
        )}

        {authView === "reset" && (
          <form className="auth-gate-form" onSubmit={handleCompleteReset}>
            <label>
              {text("Nouveau mot de passe", "New password")}
              <input
                autoComplete="new-password"
                type="password"
                minLength={8}
                maxLength={72}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <label>
              {text("Confirmer le nouveau mot de passe", "Confirm new password")}
              <input
                autoComplete="new-password"
                type="password"
                minLength={8}
                maxLength={72}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </label>
            <button className="auth-gate-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? text("Mise à jour…", "Updating…")
                : text("Modifier le mot de passe", "Update password")}
            </button>
            <button className="auth-gate-back" type="button" onClick={returnToLogin}>
              {text("Retour à la connexion", "Back to sign in")}
            </button>
          </form>
        )}

        {authView === "login" && loginType === "client" && (
          <p className="auth-gate-register">
            {isRegistering ? text("Déjà inscrit ?", "Already registered?") : text("Vous n’avez pas encore de compte ?", "Don’t have an account yet?")}
            {" "}
            <button
              type="button"
              onClick={() => {
                setIsRegistering((value) => !value);
                setError("");
              }}
            >
              {isRegistering ? text("Se connecter", "Sign in") : text("Créer un compte", "Create an account")}
            </button>
          </p>
        )}
        {authView === "login" && <p className="auth-gate-note">
          L’accès administrateur est réservé aux comptes autorisés par
          l’administrateur du système.
        </p>}
      </section>
    </main>
  );
};

export default AuthGate;
