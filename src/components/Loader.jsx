import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-wrapper">
        <div className="rotating-border"></div>
        <div className="fixed-text">SAWTAR</div>
      </div>
      <div className="loader-text">Loading...</div>
    </div>
  );
};

export default Loader;