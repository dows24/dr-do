import React from 'react';
import './Profile.css';

const Profile = () => {
    return (
        <section className="section profile-section">
            <div className="container">
                <div className="profile-grid">
                    <div className="profile-image-wrapper fade-in-up">
                        <img src="/assets/profile.png" alt="Dr. Do Woo-sung" className="profile-image" />
                    </div>
                    <div className="profile-content fade-in-up delay-200">
                        <h2 className="section-title">Who am I</h2>
                        <p className="profile-message">"대학병원의 안전함에<br />실전의 노하우를 더하다."</p>

                        <ul className="profile-details">
                            <li className="profile-item">
                                <strong>University Standard</strong>
                                <p>세브란스병원 임상조교수, 연세대학교 의과대학 박사.<br />안전한 마취와 표준화된 수술 시스템.</p>
                            </li>
                            <li className="profile-item">
                                <strong>Extreme Experience</strong>
                                <p>군병원에서 축적한 수천 건의 고에너지 외상 및 급성 손상 데이터 보유.</p>
                            </li>
                            <li className="profile-item">
                                <strong>Educator</strong>
                                <p>의사를 가르치는 의사, 끊임없이 연구하는 학자.</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;
