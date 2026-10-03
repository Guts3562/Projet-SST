import React, { useEffect } from "react";
import { localized } from "../../lib/language";
import "./LogoutConfirmModal.css";

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm, language = "fr" }) => {
  const text = (french, english) => localized(language, french, english);

  // Prevent background scrolling when modal is open
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content logout-confirm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label={text("Fermer", "Close")}>
          &times;
        </button>

        <div className="logout-header">
          <div className="logout-icon-big"><i className="bi bi-box-arrow-right"></i></div>
          <h2>{text("Déconnexion", "Sign out")}</h2>
          <p>{text("Êtes-vous sûr de vouloir vous déconnecter de votre espace SST ?", "Are you sure you want to sign out of your SST account?")}</p>
        </div>

        <div className="logout-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {text("Annuler", "Cancel")}
          </button>
          <button
            type="button"
            className="btn btn-primary logout-btn-final"
            onClick={onConfirm}
          >
            {text("Oui, me déconnecter", "Yes, sign out")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
