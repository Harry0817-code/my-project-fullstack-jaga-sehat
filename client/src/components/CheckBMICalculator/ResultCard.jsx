import React from 'react';

const ResultCard = ({ bmiResult, onClose }) => {
  if (!bmiResult) return null;
  return (
    <div className="result-card-balanced">
      <div className="result-header-simple">
        <h3>Hasil BMI Anda</h3>
        <button className="close-btn-simple" onClick={onClose}>×</button>
      </div>
      <div className="result-main">
        <div className="bmi-section">
          <div className="bmi-value-display">
            <span className="bmi-number-balanced">{bmiResult.bmi}</span>
            <span className="bmi-label">BMI</span>
          </div>
          <div className={`bmi-status-badge ${bmiResult.statusClass}`}>
            {bmiResult.status}
          </div>
        </div>
        <div className="feedback-section">
          <p className="feedback-text">{bmiResult.feedback}</p>
        </div>
        <div className="user-summary">
          <div className="summary-item">
            <span className="summary-label">Tinggi:</span>
            <span className="summary-value">{bmiResult.height} cm</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Berat:</span>
            <span className="summary-value">{bmiResult.weight} kg</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Usia:</span>
            <span className="summary-value">{bmiResult.age} tahun</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
