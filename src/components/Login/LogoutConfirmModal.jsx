import React, { useEffect } from "react";
import "./LogoutConfirmModal.css";
import logoutIcon from "../../assets/logout-icon.png";

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
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
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <div className="logout-header">
          <div className="logout-icon-big"><img src={logoutIcon} alt="Déconnexion" style={{ width: "40px", height: "40px", objectFit: "contain", verticalAlign: "middle" }} /></div>
          <h2>Déconnexion</h2>
          <p>Êtes-vous sûr de vouloir vous déconnecter de votre espace SST ?</p>
        </div>

        <div className="logout-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button
            className="btn btn-primary logout-btn-final"
            onClick={onConfirm}
          >
            Oui, me déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
