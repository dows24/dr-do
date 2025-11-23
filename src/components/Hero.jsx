import React from 'react';
import './Hero.css'; // We'll create this for specific hero styles if needed, or just use inline/global

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content container">
        <p className="hero-intro fade-in-up">세브란스병원 정형외과 교수 도우성입니다.</p>
        <h1 className="hero-title fade-in-up delay-200">Dynamic Care,<br />Stable Life</h1>
        <p className="hero-subtitle fade-in-up delay-400">움직임은 역동적으로, 어깨는 견고하게.</p>
      </div>
    </section>
  );
};

export default Hero;
