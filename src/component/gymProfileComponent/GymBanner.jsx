import React from "react";
import "./styles.scss";

const GymBanner = ({coverImage,gymName}) => {
  return (
    <div className="gym-banner" style={{backgroundImage:`url(${coverImage})`}}>
      <div className="overlay">
        <div className="content">
          <h1 className="title">{gymName}</h1>
          <p className="subtitle">Transform your body, transform your life</p>
        </div>
      </div>
    </div>
  );
};

export default GymBanner;
