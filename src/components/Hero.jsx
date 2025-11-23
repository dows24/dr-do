import React from 'react';
import './Hero.css';
import './HeroButton.css';

const Hero = ({ onOpenCheckUp }) => {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content container">
        <p className="hero-intro fade-in-up">세브란스병원 정형외과</p>
        <h2 className="hero-name fade-in-up delay-100">도우성 교수</h2>
        <h1 className="hero-title fade-in-up delay-200">Dynamic Care,<br />Stable Life</h1>
        <p className="hero-subtitle fade-in-up delay-400">움직임은 역동적으로, 어깨는 견고하게.</p>

        <button className="hero-btn fade-in-up delay-500" onClick={onOpenCheckUp}>
          나의 회복 상태 확인하기
        </button>
      </div>
    </section>
  );
};

export default Hero;
