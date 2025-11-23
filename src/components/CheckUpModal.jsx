import React, { useState, useMemo } from 'react';
import './CheckUpModal.css';
import { findPatient } from '../utils/mockDatabase';
import { calculateVasStats, getMonthsSinceSurgery, predictFutureVAS } from '../utils/vasModel';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    ReferenceDot, ReferenceLine, Label
} from 'recharts';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Standard Normal PDF
const normalPDF = (x) => {
    return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
};

// Generate graph data
const generateGraphData = () => {
    const data = [];
    for (let i = -3.5; i <= 3.5; i += 0.1) {
        data.push({ z: i, y: normalPDF(i) });
    }
    return data;
};

const CheckUpModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1); // 1: Login, 2: Input, 3: Result
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        dob: '',
        vas: 5
    });
    const [patient, setPatient] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const graphData = useMemo(() => generateGraphData(), []);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const found = await findPatient(formData.id, formData.name, formData.dob);
            if (found) {
                setPatient(found);
                setStep(2);
                setError('');
            } else {
                setError('일치하는 환자 정보를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('Error during patient lookup:', error);
            setError('환자 정보를 조회하는 중 오류가 발생했습니다.');
        }
    };

    const handleAnalysis = async () => {
        const months = getMonthsSinceSurgery(patient.surgeryDate);
        const stats = calculateVasStats(months, parseFloat(formData.vas));

        // Calculate 3-month future prediction
        const futureVAS = predictFutureVAS(months, parseFloat(formData.vas));
        const futureMonths = months + 3;

        setResult({
            ...stats,
            futureVAS,
            futureMonths
        });
        setStep(3);

        // Save to Firebase
        try {
            await addDoc(collection(db, "checkups"), {
                patientId: patient.id,
                patientName: patient.name,
                surgeryDate: patient.surgeryDate,
                monthsPostOp: months,
                vasScore: parseFloat(formData.vas),
                zScore: stats.z_score,
                percentile: stats.percentile,
                predictedFutureVAS: futureVAS,
                predictedFutureMonths: futureMonths,
                timestamp: serverTimestamp()
            });
            console.log("Check-up result saved to Firestore!");
        } catch (e) {
            console.error("Error adding document: ", e);
            // We don't block the UI if saving fails, just log it
        }
    };

    const resetModal = () => {
        setStep(1);
        setFormData({ id: '', name: '', dob: '', vas: 5 });
        setPatient(null);
        setResult(null);
        setError('');
        onClose();
    };

    // Helper to determine status message
    const getStatusMessage = (z) => {
        if (z < -1) return "평균보다 통증이 훨씬 적습니다. 아주 훌륭한 회복 속도입니다!";
        if (z < 0) return "평균보다 통증이 약간 적습니다. 잘 회복하고 계십니다.";
        if (z === 0) return "정확히 평균적인 회복 속도입니다.";
        if (z < 1) return "평균보다 통증이 약간 있습니다. 무리하지 마시고 안정을 취하세요.";
        return "평균보다 통증이 심한 편입니다. 병원에 문의하시거나 휴식을 취해주세요.";
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={resetModal}>&times;</button>

                {step === 1 && (
                    <div className="modal-step fade-in-up">
                        <h2>환자 확인</h2>
                        <p className="modal-desc">진료 시 등록된 정보를 입력해주세요.</p>
                        <form onSubmit={handleLogin}>
                            <div className="input-group">
                                <label>환자 번호</label>
                                <input
                                    type="text"
                                    name="id"
                                    placeholder="예: 12345"
                                    value={formData.id}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>이름</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="예: 김철수"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>생년월일</label>
                                <input
                                    type="text"
                                    name="dob"
                                    placeholder="예: 1980-01-01"
                                    value={formData.dob}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            {error && <p className="error-msg">{error}</p>}
                            <button type="submit" className="modal-btn">확인</button>
                        </form>
                        <div className="mock-hint">
                            <small>테스트용: 12345 / 김철수 / 1980-01-01</small>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="modal-step fade-in-up">
                        <h2>통증 점수 (VAS) 입력</h2>
                        <p className="modal-desc">
                            현재 느끼는 통증의 정도를 선택해주세요.<br />
                            (0: 통증 없음 ~ 10: 상상할 수 있는 최악의 고통)
                        </p>

                        <div className="vas-slider-container">
                            <div className="vas-value">{formData.vas}</div>
                            <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.1"
                                name="vas"
                                value={formData.vas}
                                onChange={handleInputChange}
                                className="vas-slider"
                            />
                            <div className="vas-labels">
                                <span>0 (편안함)</span>
                                <span>10 (극심함)</span>
                            </div>
                        </div>

                        <button onClick={handleAnalysis} className="modal-btn">결과 분석하기</button>
                    </div>
                )}

                {step === 3 && result && (
                    <div className="modal-step fade-in-up">
                        <h2>회복 상태 분석</h2>
                        <div className="result-summary">
                            <p>수술 후 <strong>{result.t_months.toFixed(1)}개월</strong> 경과</p>
                            <p className="status-msg">{getStatusMessage(result.z_score)}</p>
                        </div>

                        <div className="graph-container">
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1B3A57" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#1B3A57" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="z"
                                        type="number"
                                        domain={[-3.5, 3.5]}
                                        hide={true}
                                    />
                                    <YAxis hide={true} />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="custom-tooltip">
                                                        <p className="label">{`Z-score: ${payload[0].payload.z.toFixed(1)}`}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="y"
                                        stroke="#1B3A57"
                                        fillOpacity={1}
                                        fill="url(#colorNormal)"
                                    />

                                    {/* Patient Marker */}
                                    <ReferenceDot
                                        x={result.z_score}
                                        y={normalPDF(result.z_score)}
                                        r={6}
                                        fill="#e74c3c"
                                        stroke="white"
                                        strokeWidth={2}
                                        isFront={true}
                                    >
                                        <Label
                                            value="나"
                                            position="top"
                                            offset={10}
                                            fill="#e74c3c"
                                            fontSize={14}
                                            fontWeight="bold"
                                        />
                                    </ReferenceDot>

                                    {/* Mean Line */}
                                    <ReferenceLine x={0} stroke="#999" strokeDasharray="3 3" />
                                </AreaChart>
                            </ResponsiveContainer>

                            <div className="graph-labels">
                                <span>빠른 회복 (통증 적음)</span>
                                <span>평균</span>
                                <span>느린 회복 (통증 많음)</span>
                            </div>
                        </div>

                        <div className="stats-detail">
                            <div className="stat-item">
                                <span>나의 통증</span>
                                <strong>{result.vas}</strong>
                            </div>
                            <div className="stat-item">
                                <span>평균 통증</span>
                                <strong>{result.mean.toFixed(1)}</strong>
                            </div>
                            <div className="stat-item">
                                <span>상위</span>
                                <strong>{result.percentile.toFixed(1)}%</strong>
                            </div>
                        </div>

                        <div className="prediction-section">
                            <h3>3개월 후 예상 통증</h3>
                            <div className="prediction-card">
                                <div className="prediction-timeline">
                                    <div className="timeline-point current">
                                        <span className="timeline-label">현재</span>
                                        <span className="timeline-value">{result.vas}</span>
                                    </div>
                                    <div className="timeline-arrow">→</div>
                                    <div className="timeline-point future">
                                        <span className="timeline-label">3개월 후</span>
                                        <span className="timeline-value">{result.futureVAS.toFixed(1)}</span>
                                    </div>
                                </div>
                                <p className="prediction-note">
                                    {result.futureVAS < result.vas
                                        ? `현재 회복 추세가 유지된다면, 3개월 후 통증이 ${(result.vas - result.futureVAS).toFixed(1)}점 감소할 것으로 예상됩니다.`
                                        : result.futureVAS > result.vas
                                            ? `현재 상태를 고려할 때, 추가 관리가 필요할 수 있습니다.`
                                            : `현재 통증 수준이 유지될 것으로 예상됩니다.`
                                    }
                                </p>
                            </div>
                        </div>

                        <button onClick={resetModal} className="modal-btn secondary">닫기</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckUpModal;
