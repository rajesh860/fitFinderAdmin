import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css"
import "../css/responsive.css"
const ThankYouScreen = ({ onBack }) => {
    const nav = useNavigate()
  return (
    <div className="thankyou-screen">
      <div className="thankyou-card">
        <div className="checkmark">
          <svg viewBox="0 0 52 52" className="checkmark-svg">
            <circle
              className="checkmark-circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="checkmark-check"
              fill="none"
              d="M14 27l7 7 16-16"
            />
          </svg>
        </div>
        <h2>Thank You!</h2>
        <p>Your feedback has been submitted successfully 🎉</p>
        <p>We appreciate your interest in our services. One of our representatives will get back to you shortly with the information you requested. If you have any urgent questions, please feel free to contact us directly. 🎉</p>
        <button className="back-btn" onClick={()=>nav("/feedback")}>
          Submit Another Response
        </button>
      </div>
    </div>
  );
};

export default ThankYouScreen;
