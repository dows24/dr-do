import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const ADMIN_PASSWORD = 'drdo2024'; // Simple password - change this to your preferred password

const AdminPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        patientId: '',
        name: '',
        birthDate: '',
        surgeryDate: '',
        surgeryType: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            loadPatients();
        }
    }, [isAuthenticated]);

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setAuthError('');
        } else {
            setAuthError('비밀번호가 올바르지 않습니다.');
        }
    };

    const loadPatients = async () => {
        setLoading(true);
        try {
            const patientsRef = collection(db, 'patients');
            const q = query(patientsRef, orderBy('name'));
            const querySnapshot = await getDocs(q);
            const patientsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPatients(patientsList);
        } catch (error) {
            console.error('Error loading patients:', error);
            setMessage({ type: 'error', text: '환자 목록을 불러오는 중 오류가 발생했습니다.' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddPatient = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await addDoc(collection(db, 'patients'), {
                patientId: formData.patientId,
                name: formData.name,
                birthDate: formData.birthDate,
                surgeryDate: formData.surgeryDate,
                surgeryType: formData.surgeryType,
                createdAt: new Date().toISOString()
            });

            setMessage({ type: 'success', text: '환자가 성공적으로 추가되었습니다!' });
            setFormData({
                patientId: '',
                name: '',
                birthDate: '',
                surgeryDate: '',
                surgeryType: ''
            });
            loadPatients();
        } catch (error) {
            console.error('Error adding patient:', error);
            setMessage({ type: 'error', text: '환자 추가 중 오류가 발생했습니다.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePatient = async (patientDocId, patientName) => {
        if (!window.confirm(`정말로 "${patientName}" 환자를 삭제하시겠습니까?`)) {
            return;
        }

        setLoading(true);
        try {
            await deleteDoc(doc(db, 'patients', patientDocId));
            setMessage({ type: 'success', text: '환자가 삭제되었습니다.' });
            loadPatients();
        } catch (error) {
            console.error('Error deleting patient:', error);
            setMessage({ type: 'error', text: '환자 삭제 중 오류가 발생했습니다.' });
        } finally {
            setLoading(false);
        }
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-container">
                <div className="admin-login">
                    <h1>관리자 로그인</h1>
                    <form onSubmit={handlePasswordSubmit}>
                        <div className="input-group">
                            <label>비밀번호</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="관리자 비밀번호를 입력하세요"
                                required
                            />
                        </div>
                        {authError && <p className="error-msg">{authError}</p>}
                        <button type="submit" className="admin-btn">로그인</button>
                    </form>
                    <button onClick={handleBackToHome} className="admin-btn secondary">
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>환자 관리</h1>
                <button onClick={handleBackToHome} className="admin-btn secondary">
                    홈으로 돌아가기
                </button>
            </div>

            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="admin-content">
                <div className="admin-section">
                    <h2>새 환자 추가</h2>
                    <form onSubmit={handleAddPatient} className="patient-form">
                        <div className="form-row">
                            <div className="input-group">
                                <label>환자 번호 *</label>
                                <input
                                    type="text"
                                    name="patientId"
                                    value={formData.patientId}
                                    onChange={handleInputChange}
                                    placeholder="예: P001"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>이름 *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="예: 김철수"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="input-group">
                                <label>생년월일 *</label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>수술 날짜 *</label>
                                <input
                                    type="date"
                                    name="surgeryDate"
                                    value={formData.surgeryDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>수술 종류 *</label>
                            <input
                                type="text"
                                name="surgeryType"
                                value={formData.surgeryType}
                                onChange={handleInputChange}
                                placeholder="예: Rotator Cuff Repair"
                                required
                            />
                        </div>
                        <button type="submit" className="admin-btn" disabled={loading}>
                            {loading ? '추가 중...' : '환자 추가'}
                        </button>
                    </form>
                </div>

                <div className="admin-section">
                    <h2>등록된 환자 목록</h2>
                    {loading && <p>로딩 중...</p>}
                    {!loading && patients.length === 0 && (
                        <p className="no-data">등록된 환자가 없습니다.</p>
                    )}
                    {!loading && patients.length > 0 && (
                        <div className="patients-table-container">
                            <table className="patients-table">
                                <thead>
                                    <tr>
                                        <th>환자 번호</th>
                                        <th>이름</th>
                                        <th>생년월일</th>
                                        <th>수술 날짜</th>
                                        <th>수술 종류</th>
                                        <th>작업</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patients.map((patient) => (
                                        <tr key={patient.id}>
                                            <td>{patient.patientId}</td>
                                            <td>{patient.name}</td>
                                            <td>{patient.birthDate}</td>
                                            <td>{patient.surgeryDate}</td>
                                            <td>{patient.surgeryType}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleDeletePatient(patient.id, patient.name)}
                                                    className="delete-btn"
                                                    disabled={loading}
                                                >
                                                    삭제
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
