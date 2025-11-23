import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <>
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-info">
                            <h4>세브란스병원 정형외과 도우성</h4>
                            <p>서울 서대문구 연세로 50-1</p>
                            <p>진료시간: 월~금 09:00 - 17:00</p>
                        </div>
                        <div className="footer-copy">
                            <p>&copy; {new Date().getFullYear()} Dr. Do Woo-sung. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>

            <a href="#" className="fab-button">
                진료 예약하기
            </a>
        </>
    );
};

export default Footer;
