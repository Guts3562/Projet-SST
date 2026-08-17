import React, { useState, useEffect } from "react";
import "./SettingsModal.css";
import { api } from "../../lib/api";
import { countryCodes } from "../../utils/countryCodes";

const SettingsModal = ({ isOpen, onClose, user, profile, onProfileUpdate }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("worker");
  const [company, setCompany] = useState("");
  const [phoneCode, setPhoneCode] = useState("+216");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light" || stored === "system") {
        return stored;
      }
      return "system";
    }
    return "system";
  });

  const applyTheme = (selected) => {
    const root = document.documentElement;
    root.classList.remove("dark-mode", "light-mode");
    if (selected === "dark") {
      root.classList.add("dark-mode");
    } else if (selected === "light") {
      root.classList.add("light-mode");
    }
    localStorage.setItem("theme", selected);
    setTheme(selected);
  };

  const handleThemeChange = (e) => {
    applyTheme(e.target.value);
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

  // Update local state when profile prop changes
  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setRole(profile.role || "worker");
      setCompany(profile.company || "");

      const savedPhone = profile.phone || "";
      if (savedPhone.includes(" ")) {
        const parts = savedPhone.split(" ");
        setPhoneCode(parts[0]);
        setPhoneNumber(parts.slice(1).join(" "));
      } else {
        setPhoneNumber(savedPhone);
      }
    }
  }, [profile]);

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
        full_name: name,
        role: role,
        company: company,
        phone: fullPhone,
      });

      setSuccess(true);
      await onProfileUpdate();

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message);
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
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <div className="settings-header">
          <div className="settings-icon-wrapper">
            <i className="bi bi-gear"></i>
          </div>
          <h2>Paramètres du compte</h2>
          <p>Gérez vos informations personnelles et votre rôle</p>
        </div>

        {success && (
          <div className="settings-alert success">
            <i className="bi bi-check-circle-fill"></i> Profil mis à jour avec succès !
          </div>
        )}
        {error && <div className="settings-alert error"><i className="bi bi-x-circle-fill"></i> {error}</div>}

        <div className="settings-theme-section">
          <h3>Apparence</h3>
          <div className="theme-toggle-row">
            <span className="theme-label">
              <i className="bi bi-moon"></i> Thème
            </span>
            <div className="theme-options">
              <label className={`theme-radio ${theme === "light" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={theme === "light"}
                  onChange={handleThemeChange}
                />
                <i className="bi bi-sun"></i> Clair
              </label>
              <label className={`theme-radio ${theme === "system" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="theme"
                  value="system"
                  checked={theme === "system"}
                  onChange={handleThemeChange}
                />
                <i className="bi bi-laptop"></i> Système
              </label>
              <label className={`theme-radio ${theme === "dark" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={theme === "dark"}
                  onChange={handleThemeChange}
                />
                <i className="bi bi-moon-stars"></i> Sombre
              </label>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="settings-form">
          <div className="settings-form-section">
            <h3>Informations de base</h3>
            <div className="settings-input-group disabled-group">
              <label>Adresse Email (Non modifiable)</label>
              <div className="settings-input-wrapper">
                <span className="settings-input-icon"><i className="bi bi-envelope"></i></span>
                <input type="text" value={user?.email || ""} disabled />
              </div>
            </div>

            <div className="settings-input-group">
              <label htmlFor="settings-name">Nom complet</label>
              <div className="settings-input-wrapper">
                <span className="settings-input-icon"><i className="bi bi-person"></i></span>
                <input
                  type="text"
                  id="settings-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Entrez votre nom complet"
                  required
                />
              </div>
            </div>
          </div>

          <div className="settings-form-section">
            <h3>Détails Professionnels</h3>

            <div className="settings-input-group">
              <label htmlFor="settings-company">
                Entreprise / Organisation
              </label>
              <div className="settings-input-wrapper">
                <span className="settings-input-icon"><i className="bi bi-building"></i></span>
                <input
                  type="text"
                  id="settings-company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Nom de votre entreprise"
                />
              </div>
            </div>

            <div className="settings-input-group">
              <label htmlFor="settings-phone">Numéro de téléphone</label>
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

            <div className="settings-input-group" style={{ marginTop: "16px" }}>
              <label htmlFor="settings-role">Votre rôle professionnel</label>
              <div className="settings-input-wrapper">
                <span className="settings-input-icon"><i className="bi bi-briefcase"></i></span>
                <select
                  id="settings-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="settings-select"
                >
                  <option value="worker">Travailleur</option>
                  <option value="employer">Employeur / RH</option>
                  <option value="specialist">Spécialiste SST / Médecin</option>
                  <option value="student">Étudiant / Autre</option>
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
              Annuler
            </button>
            <button
              type="submit"
              className={`btn-settings-save ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Sauvegarde...
                </>
              ) : (
                  <><i className="bi bi-floppy"></i> Sauvegarder les modifications</>
              )}
            </button>
          </div>
        </form>

        <div className="settings-member-since">
          Membre depuis le{" "}
          {new Date(user?.created_at || new Date()).toLocaleDateString("fr-FR")}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
