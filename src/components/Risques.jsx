import React, { useState } from "react";
import "./Risques.css";
import { risks } from "../risks";

function Risques() {
  const [openRisks, setOpenRisks] = useState(new Set());

  const toggleRisk = (index) => {
    const newOpen = new Set(openRisks);
    if (newOpen.has(index)) {
      newOpen.delete(index);
    } else {
      newOpen.add(index);
    }
    setOpenRisks(newOpen);
  };

  return (
    <div id="situations" className="page active">
      <div className="section-header">
        <span className="section-label">Risques professionnels</span>
        <h2>
          Situations à risque spécifiques à la Tunisie
        </h2>
        <p>
          Cliquez sur chaque catégorie pour voir les dangers détaillés et les
          mesures de prévention adaptées.
        </p>
      </div>

      <div id="riskList">
        {risks.map((risk, index) => (
          <div
            key={index}
            className={`risk-item ${openRisks.has(index) ? "open" : ""}`}
          >
            <div className="risk-header" onClick={() => toggleRisk(index)}>
              <div className={`risk-icon-wrap ${risk.color}`}><i className={risk.icon}></i></div>
              <div className="risk-title">
                <h4>{risk.title}</h4>
                <p>{risk.subtitle}</p>
              </div>
              <div className="risk-chevron">⌄</div>
            </div>
            <div className="risk-body">
              <div className="risk-cols">
                <div className="risk-col dangers">
                  <h5>Dangers identifiés</h5>
                  <ul>
                    {risk.dangers.map((danger, i) => (
                      <li key={i}><i className="bi bi-exclamation-triangle-fill list-icon"></i> {danger}</li>
                    ))}
                  </ul>
                </div>
                <div className="risk-col prevention">
                  <h5>Mesures de prévention</h5>
                  <ul>
                    {risk.prevention.map((measure, i) => (
                      <li key={i}><i className="bi bi-check-circle-fill list-icon"></i> {measure}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Risques;
