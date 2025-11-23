import React from 'react';
import './Expertise.css';

const Expertise = () => {
    return (
        <section className="section expertise-section">
            <div className="container">
                <h2 className="section-title fade-in-up">Expertise</h2>
                <div className="expertise-grid">
                    {/* Card A */}
                    <div className="expertise-card fade-in-up delay-100">
                        <div className="card-icon">🏃‍♂️</div>
                        <h3 className="card-title">Dynamic Recovery<br />(스포츠 손상/탈구)</h3>
                        <p className="card-desc">
                            젊은 선수의 재활을 돕는 정교함.<br />
                            오타니 쇼헤이와 같은 빠른 복귀를 위한 맞춤 전략.
                        </p>
                    </div>

                    {/* Card B */}
                    <div className="expertise-card fade-in-up delay-200">
                        <div className="card-icon">🛡️</div>
                        <h3 className="card-title">Stable Restoration<br />(회전근개/오십견)</h3>
                        <p className="card-desc">
                            부모님의 어깨를 지키는 안전함.<br />
                            불필요한 수술을 막고 가장 확실한 치료를 제시.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Expertise;
