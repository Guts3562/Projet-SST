import React, { useState, useEffect } from "react";
import "./LoginModal.css";
import "./SettingsModal.css";
import { api } from "../../lib/api";
import { countryCodes } from "../../utils/countryCodes";
import { getLanguage, localized, setLanguage } from "../../lib/language";

const SettingsModal = ({ isOpen, onClose, user, profile, onProfileUpdate }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("worker");
  const [company, setCompany] = useState("");
  const [phoneCode, setPhoneCode] = useState("+216");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [theme, setTheme] = useState("system");
  const [language, setLanguageDraft] = useState("fr");
  const text = (french, english) => localized(language, french, english);

  const applyTheme = (selected) => {
    localStorage.setItem("theme", selected);
    const root = document.documentElement;
    root.classList.remove("dark-mode", "light-mode");
    if (selected === "dark") {
      root.classList.add("dark-mode");
    } else if (selected === "light") {
      root.classList.add("light-mode");
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load saved values into the draft each time the settings dialog opens.
  useEffect(() => {
    if (!isOpen) return;

    setName(profile?.full_name || "");
    setRole(profile?.role || "worker");
    setCompany(profile?.company || "");

    const savedPhone = profile?.phone || "";
    if (savedPhone.includes(" ")) {
      const [savedCode, ...phoneParts] = savedPhone.split(" ");
      setPhoneCode(savedCode || "+216");
      setPhoneNumber(phoneParts.join(" "));
    } else {
      setPhoneCode("+216");
      setPhoneNumber(savedPhone);
    }

    const storedTheme = localStorage.getItem("theme");
    setTheme(
      storedTheme === "dark" || storedTheme === "light" || storedTheme === "system"
        ? storedTheme
        : "system",
    );
    setLanguageDraft(getLanguage());
    setError("");
    setSuccess(false);
  }, [isOpen, profile]);

  if (!isOpen) return null;

  // Custom Flag component that translates emojis to flagcdn images for Windows compatibility
  const Flag = ({ emoji }) => {
    if (!emoji || emoji === "🌐")
      return <span style={{ fontSize: "18px" }}><i className="bi bi-globe"></i></span>;
    try {
      const char1 = emoji.codePointAt(0) - 127397;
      const char2 = emoji.codePointAt(2) - 127397;
      const iso = String.fromCharCode(char1, char2).toLowerCase();
      if (iso.match(/^[a-z]{2}$/)) {
        return (
          <img
            src={`https://flagcdn.com/w20/${iso}.png`}
            srcSet={`https://flagcdn.com/w40/${iso}.png 2x`}
            width="20"
            alt={iso}
            style={{
              verticalAlign: "middle",
              borderRadius: "2px",
              flexShrink: 0,
            }}
          />
        );
      }
    } catch { /* ignore */ }
    return <span style={{ fontSize: "18px" }}><i className="bi bi-flag"></i></span>;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const fullPhone = phoneNumber ? `${phoneCode} ${phoneNumber.trim()}` : "";

    try {
      await api.profile.update({
        full_name: name.trim(),
        role: role,
        company: company.trim(),
        phone: fullPhone,
      });

      applyTheme(theme);
      setLanguage(language);
      setSuccess(true);
      await onProfileUpdate();

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(text("Impossible de mettre à jour le profil. Vérifiez les informations puis réessayez.", "Unable to update the profile. Check the information and try again."));
      console.error("Settings Update Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content settings-modal-premium"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose}>
          &times;
        </button>

        <div className="settings-header">
          <div className="settings-icon-wrapper">
            <i className="bi bi-gear"></i>
          </div>
          <h2>{text("Paramètres du compte", "Account settings")}</h2>
          <p>{text("Gérez vos informations personnelles et votre rôle", "Manage your personal information and occupation")}</p>
        </div>

        {success && (
          <div className="settings-alert success">
            <i className="bi bi-check-circle-fill"></i> {text("Profil mis à jour avec succès !", "Profile updated successfully!")}
          </div>
        )}
        {error && <div className="settings-alert error"><i className="bi bi-x-circle-fill"></i> {error}</div>}

        <form onSubmit={handleUpdate} className="settings-form">
          <div className="settings-theme-section">
            <h3>{text("Apparence", "Appearance")}</h3>
            <div className="theme-toggle-row">
              <span className="theme-label">
                <i className="bi bi-moon"></i> {text("Thème", "Theme")}
              </span>
              <div className="theme-options">
                <label className={`theme-radio ${theme === "light" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={theme === "light"}
                    onChange={(event) => setTheme(event.target.value)}
                  />
                  <i className="bi bi-sun"></i> {text("Clair", "Light")}
                </label>
                <label className={`theme-radio ${theme === "system" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="theme"
                    value="system"
                    checked={theme === "system"}
                    onChange={(event) => setTheme(event.target.value)}
                  />
                  <i className="bi bi-laptop"></i> {text("Système", "System")}
                </label>
                <label className={`theme-radio ${theme === "dark" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={theme === "dark"}
                    onChange={(event) => setTheme(event.target.value)}
                  />
                  <i className="bi bi-moon-stars"></i> {text("Sombre", "Dark")}
                </label>
              </div>
            </div>
          </div>

          <div className="settings-form-section">
            <h3>{text("Langue", "Language")}</h3>
            <div className="settings-input-group">
              <label htmlFor="settings-language">{text("Langue de l’interface", "Interface language")}</label>
              <div className="settings-input-wrapper">
                <span className="settings-input-icon"><i className="bi bi-translate"></i></span>
                <select
                  id="settings-language"
                  className="settings-select"
                  value={language}
                  onChange={(event) => setLanguageDraft(event.target.value)}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          <div className="settings-form-section">
            <h3>{text("Informations de base", "Basic information")}</h3>
            <div className="settings-input-group disabled-group">
              <label>{text("Adresse e-mail (non modifiable)", "Email address (cannot be changed)")}</label>
              <div className="settings-input-wrapper">
                <span className="settings-input-icon"><i className="bi bi-envelope"></i></span>
                <input type="text" value={user?.email || ""} disabled />
              </div>
            </div>

            <div className="settings-input-group">
              <label htmlFor="settings-name">{text("Nom complet", "Full name")}</label>
              <div className="settings-input-wrapper">
                <span className="settings-input-icon"><i className="bi bi-person"></i></span>
                <input
                  type="text"
                  id="settings-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={text("Entrez votre nom complet", "Enter your full name")}
                  required
                />
              </div>
            </div>
          </div>

          <div className="settings-form-section">
            <h3>{text("Détails professionnels", "Professional details")}</h3>

            <div className="settings-input-group">
              <label htmlFor="settings-company">
                {text("Entreprise / organisation", "Company / organization")}
              </label>
              <div className="settings-input-wrapper">
                <span className="settings-input-icon"><i className="bi bi-building"></i></span>
                <input
                  type="text"
                  id="settings-company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={text("Nom de votre entreprise", "Company name")}
                />
              </div>
            </div>

            <div className="settings-input-group">
              <label htmlFor="settings-phone">{text("Numéro de téléphone", "Phone number")}</label>
              <div className="settings-input-wrapper phone-wrapper">
                {/* Fully Custom Select Dropdown for PC Flag Support */}
                <div className="custom-country-select" ref={dropdownRef}>
                  <div
                    className="ccs-trigger"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <Flag
                      emoji={
                        countryCodes.find((c) => c.code === phoneCode)?.flag
                      }
                    />
                    <span className="ccs-code">{phoneCode || "Autre"}</span>
                    <span className="ccs-arrow"><i className="bi bi-chevron-down"></i></span>
                  </div>

                  {isDropdownOpen && (
                    <div className="ccs-menu">
                      {countryCodes.map((c, index) => (
                        <div
                          key={`${c.code}-${index}`}
                          className={`ccs-option ${phoneCode === c.code ? "selected" : ""}`}
                          onClick={() => {
                            setPhoneCode(c.code);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <Flag emoji={c.flag} />
                          <span className="ccs-name">{c.name}</span>
                          <span className="ccs-opt-code">({c.code})</span>
                        </div>
                      ))}
                      <div
                        className="ccs-option"
                        onClick={() => {
                          setPhoneCode("");
                          setIsDropdownOpen(false);
                        }}
                      >
                        <Flag emoji="🌐" />
                        <span className="ccs-name">Autre</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="phone-divider"></div>
                <input
                  type="tel"
                  id="settings-phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Numéro de téléphone (ex: 55 123 456)"
                />
              </div>
            </div>

            <div className="settings-input-group profession-group">
              <label htmlFor="settings-role">{text("Votre profession", "Your occupation")}</label>
              <div className="settings-input-wrapper">
                <span className="settings-input-icon"><i className="bi bi-briefcase"></i></span>
                <select
                  id="settings-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="settings-select"
                >
                  <option value="worker">{text("Travailleur", "Worker")}</option>
                  <option value="employer">{text("Employeur / RH", "Employer / HR")}</option>
                  <option value="specialist">{text("Spécialiste SST / Médecin", "OSH specialist / Physician")}</option>
                  <option value="student">{text("Étudiant / autre", "Student / Other")}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="settings-footer-actions">
            <button
              type="button"
              className="btn-settings-cancel"
              onClick={onClose}
              disabled={loading}
            >
              {text("Annuler", "Cancel")}
            </button>
            <button
              type="submit"
              className={`btn-settings-save ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> {text("Enregistrement…", "Saving…")}
                </>
              ) : (
                <>
                  <i className="bi bi-floppy"></i> {text("Appliquer les changements", "Apply changes")}
                </>
              )}
            </button>
          </div>
        </form>

        <div className="settings-member-since">
          {text("Membre depuis le", "Member since")}{" "}
          {new Date(user?.created_at || new Date()).toLocaleDateString(language === "fr" ? "fr-FR" : "en-GB")}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
