import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Sketchbook from './Sketchbook';
import AiChat from './components/chat/AiChat';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import StarBackground from './StarBackground';
import ProjectDetailPage from './ProjectDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. 랜딩 페이지: 누구나 접근 가능 */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. 로그인 화면: 별도 경로로 분리 (선택 사항) */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 3. 대시보드: 로그인한 사용자만 접근 */}
        <Route path="/dashboard" element={<MainPage />} />
        
        {/* 4. 프로젝트 상세: 로그인한 사용자만 접근 */}
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        {/* <Route path="/project/:id" element={<Sketchbook />} /> */}

        {/* <Route path="/login" element={<MainPage />} /> */}
      </Routes>
      
      <StarBackground />
      {/* 🚀 모든 화면 위로 뜨는 글로벌 AI 채팅창 */}
      {/* <AiChat /> */}
    </Router>
  );
}

function MainPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [projects, setProjects] = useState([]);
  const [view, setView] = useState(() => {
    return localStorage.getItem('viewMode') || 'list';
  });
  const [inputs, setInputs] = useState({ email: '', password: '' });
  const { email, password } = inputs;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectInputs, setNewProjectInputs] = useState({ title: '', description: '' });

  const goToProject = (projectId) => navigate(`/project/${projectId}`);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('accessToken');
      if (savedToken) await fetchMyInfo(savedToken);
    };
    initAuth();
  }, []);

  const fetchMyInfo = async (token) => {
    try {
      const response = await axios.get('http://localhost:8080/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      return response.data;
    } catch (e) {
      handleLogout();
    }
  };

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:8080/projects?userId=' + user.id, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data.data);
    } catch (e) { console.error(e); }
  };

  const onChange = (e) => setInputs({ ...inputs, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/users/login', { email, password });
      const { accessToken } = response.data;
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        const userInfo = await fetchMyInfo(accessToken);
        localStorage.setItem('user', JSON.stringify(userInfo));
      }
    } catch (e) { alert("로그인 정보를 확인해 주세요."); }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setProjects([]);
  };

  const handleCreate = async () => {
    const { title, description } = newProjectInputs;
    
    if (!title.trim()) {
      alert("프로젝트 명은 필수입니다.");
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      await axios.post('http://localhost:8080/projects', 
        { 
          projectName: title.trim(), 
          description: description || "설명이 없습니다.",
          userId: user.id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProjects();
      closeCreateModal(); // 성공 시 닫기
    } catch (e) {
      alert("프로젝트 생성에 실패했습니다.");
    }
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewProjectInputs({ title: '', description: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:8080/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjects();
    } catch (e) { alert("삭제 실패"); }
  };

  if (!user) {
    return (
      <div style={styles.loginWrapper}>
        <div style={styles.loginCard}>
          <div style={styles.loginHeader}>
            <div style={styles.logoCircle}>U</div>
            <h1 style={styles.brand}>ULMUS</h1>
            <p style={styles.loginSub}>Architect your database visually</p>
          </div>
          <form onSubmit={handleLogin}>
            <div style={styles.inputField}>
              <label style={styles.inputLabel}>Email Address</label>
              <input name="email" type="email" placeholder="name@company.com" value={email} onChange={onChange} style={styles.input} required />
            </div>
            <div style={styles.inputField}>
              <label style={styles.inputLabel}>Password</label>
              <input name="password" type="password" placeholder="••••••••" value={password} onChange={onChange} style={styles.input} required />
            </div>
            <button type="submit" style={styles.mainBtn}>Sign In to Workspace</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.appContainer}>
      <nav style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoCircleSmall}>U</div>
          <h2 style={styles.headerLogo}>ULMUS</h2>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.userInfo}>
            <span style={styles.userEmail}>{user.email}</span>
            <div style={styles.avatar}>{user.email[0].toUpperCase()}</div>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.toolBar}>
          <div>
            <h3 style={styles.sectionTitle}>Projects</h3>
            <p style={styles.sectionSub}>Manage your database schemas ({projects.length})</p>
          </div>
          <div style={styles.actions}>
            <div style={styles.viewToggle}>
              <button onClick={() => { setView('list'); localStorage.setItem('viewMode', 'list'); }} style={view === 'list' ? styles.tabActive : styles.tab}>List</button>
              <button onClick={() => { setView('gallery'); localStorage.setItem('viewMode', 'gallery'); }} style={view === 'gallery' ? styles.tabActive : styles.tab}>Gallery</button>
            </div>
            <button onClick={() => setIsCreateModalOpen(true)} style={styles.createBtn}>+ New Project</button>
          </div>
        </div>

        {view === 'list' ? (
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Project Name</th>
                  <th style={styles.th}>Description</th>
                  <th style={{...styles.th, textAlign: 'right'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id} style={styles.tr} onClick={() => goToProject(p.id)}>
                    <td style={styles.td}><span style={styles.projName}>{p.projectName}</span></td>
                    <td style={styles.td}><span style={styles.projDesc}>{p.description}</span></td>
                    <td style={{...styles.td, textAlign: 'right'}}>
                      <button onClick={(e) => {e.stopPropagation(); handleDelete(p.id);}} style={styles.delBtnSmall}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={styles.grid}>
            {projects.map(p => (
              <div key={p.id} style={styles.card} onClick={() => goToProject(p.id)}>
                <div style={styles.cardIcon}>📂</div>
                <h4 style={styles.cardTitle}>{p.projectName}</h4>
                <p style={styles.cardDescText}>{p.description}</p>
                <div style={styles.cardFooter}>
                  <span style={styles.cardDate}>Updated just now</span>
                  <button onClick={(e) => {e.stopPropagation(); handleDelete(p.id);}} style={styles.delIconBtn}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isCreateModalOpen && (
          <div style={styles.overlay}>
            <div style={{...styles.modal, width: '500px'}}>
              <div style={styles.modalHeader}>
                <h3 style={{margin:0, color:'#1e293b'}}>Create New Project</h3>
                <button onClick={closeCreateModal} style={styles.closeX}>✕</button>
              </div>
              <div style={styles.modalBody}>
                <div style={styles.inputField}>
                  <label style={styles.inputLabel}>Project Name</label>
                  <input 
                    style={styles.input} 
                    placeholder="Enter project name..." 
                    value={newProjectInputs.title}
                    onChange={e => setNewProjectInputs({...newProjectInputs, title: e.target.value})}
                    autoFocus
                  />
                </div>
                <div style={styles.inputField}>
                  <label style={styles.inputLabel}>Description</label>
                  <textarea 
                    style={{...styles.input, height: '100px', resize: 'none'}} 
                    placeholder="What is this project about?" 
                    value={newProjectInputs.description}
                    onChange={e => setNewProjectInputs({...newProjectInputs, description: e.target.value})}
                  />
                </div>
              </div>
              <div style={styles.footer}>
                <button onClick={closeCreateModal} style={styles.cancelBtn}>Cancel</button>
                <button onClick={handleCreate} style={styles.confirmBtn}>Create Project</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, backdropFilter: 'blur(4px)' },
  modal: { backgroundColor: '#fff', borderRadius: '20px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow:'hidden' },
  modalHeader: { padding: '20px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  modalBody: { padding: '32px' },
  footer: { padding: '20px 32px', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9' },
  confirmBtn: { padding: '12px 24px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  cancelBtn: { padding: '12px 24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', color:'#64748b' },

  // 로그인 스타일
  loginWrapper: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  loginCard: { width: '400px', padding: '48px', backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', textAlign: 'center' },
  loginHeader: { marginBottom: '32px' },
  logoCircle: { width: '60px', height: '60px', backgroundColor: '#3b82f6', borderRadius: '16px', color: '#fff', fontSize: '32px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  brand: { color: '#1e293b', margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.025em' },
  loginSub: { color: '#64748b', fontSize: '0.95rem', margin: 0 },
  inputField: { textAlign: 'left', marginBottom: '20px' },
  inputLabel: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '6px' },
  input: { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', boxSizing: 'border-box', fontSize: '15px', outline: 'none', transition: 'border 0.2s' },
  mainBtn: { width: '100%', padding: '14px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '16px', marginTop: '10px', boxShadow: '0 4px 6px -1px rgba(59,130,246,0.3)' },

  // 메인 대시보드 스타일
  appContainer: { minHeight: '100vh', backgroundColor: '#f1f5f9' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', height: '72px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', sticky: 'top', zIndex: 10 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoCircleSmall: { width: '32px', height: '32px', backgroundColor: '#3b82f6', borderRadius: '8px', color: '#fff', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  headerLogo: { color: '#1e293b', margin: 0, fontSize: '1.25rem', fontWeight: '800' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '20px' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  userEmail: { fontSize: '14px', color: '#64748b', fontWeight: '500' },
  avatar: { width: '36px', height: '36px', backgroundColor: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', color: '#475569' },
  logoutBtn: { padding: '8px 16px', backgroundColor: '#fff', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  
  main: { padding: '40px max(40px, (100vw - 1200px)/2)' },
  toolBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' },
  sectionTitle: { fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0' },
  sectionSub: { fontSize: '14px', color: '#64748b', margin: 0 },
  actions: { display: 'flex', gap: '12px' },
  viewToggle: { display: 'flex', backgroundColor: '#e2e8f0', padding: '4px', borderRadius: '10px' },
  tab: { padding: '6px 16px', border: 'none', cursor: 'pointer', backgroundColor: 'transparent', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#64748b' },
  tabActive: { padding: '6px 16px', border: 'none', cursor: 'pointer', backgroundColor: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#1e293b', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  createBtn: { padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' },
  
  // 갤러리 뷰 스타일
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' },
  card: { padding: '24px', backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s', ':hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 20px -5px rgba(0,0,0,0.1)' } },
  cardIcon: { fontSize: '32px', marginBottom: '16px' },
  cardTitle: { margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700', color: '#1e293b' },
  cardDescText: { color: '#64748b', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5', height: '42px', overflow: 'hidden' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f1f5f9' },
  cardDate: { fontSize: '12px', color: '#94a3b8' },
  delIconBtn: { background: 'none', border: 'none', cursor: 'pointer', opacity: 0.4, ':hover': { opacity: 1 } },

  // 리스트 뷰 스타일
  tableCard: { backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '16px 24px', textAlign: 'left', backgroundColor: '#f8fafc', color: '#64748b', fontSize: '13px', fontWeight: '700', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '20px 24px', borderBottom: '1px solid #f1f5f9' },
  projName: { fontWeight: '700', color: '#1e293b', fontSize: '15px' },
  projDesc: { color: '#64748b', fontSize: '14px' },
  delBtnSmall: { color: '#ef4444', background: '#fef2f2', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
  tr: { cursor: 'pointer', transition: 'background 0.2s' }
};

export default App;