import React, { useState } from 'react';
import './QnA.css';

const QnAItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`qna-item ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
            <div className="qna-question">
                <h3>{question}</h3>
                <span className="qna-toggle">{isOpen ? '−' : '+'}</span>
            </div>
            <div className="qna-answer" style={{ maxHeight: isOpen ? '500px' : '0' }}>
                <p>{answer}</p>
            </div>
        </div>
    );
};

const QnA = () => {
    const qnaData = [
        {
            q: "회전근개 파열, 수술 꼭 해야 하나요?",
            a: "모두가 수술이 필요하지 않습니다. 저는 수술을 권하기보다 '수술하지 않아도 되는 이유'를 먼저 찾습니다. 하지만 제가 권한다면, 그때는 정말 필요한 순간입니다. 당신의 미래 10년을 위한 가장 정확한 판정을 내려드립니다."
        },
        {
            q: "어깨 탈구, 뼈는 괜찮다는데 수술해야 하나요?",
            a: "뼈는 괜찮아도 연골(관절와순)은 다쳤을 수 있습니다. 젊고 활동적일수록 재발률이 높고 관절염이 빨리 옵니다. 오타니 선수도 첫 탈구 후 바로 수술했습니다. 당신의 전성기를 지키기 위해 적극적인 치료가 필요할 수 있습니다."
        },
        {
            q: "오십견 스트레칭, 너무 아픈데 괜찮나요?",
            a: "네, 괜찮습니다. 제가 수술실에서 수없이 확인했습니다. 사람의 힘줄은 환자분의 힘만으로 절대 끊어지지 않습니다. '이러다 죽겠다' 싶을 때까지 하셔도 안전합니다. 그 안전함은 제가 보장합니다."
        }
    ];

    return (
        <section className="section qna-section">
            <div className="container">
                <h2 className="section-title fade-in-up">Q&A</h2>
                <div className="qna-list fade-in-up delay-200">
                    {qnaData.map((item, index) => (
                        <QnAItem key={index} question={item.q} answer={item.a} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default QnA;
