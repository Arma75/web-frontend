import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Database,     // 'FolderDatabase' 대신 'Database' 사용
  Library,      // Templates용
  History,      // Recent용
  Star, 
  Trash2, 
  Search, 
  Settings, 
  ChevronsUpDown, 
  Plus, 
  UserCircle,
  MoreVertical
} from 'lucide-react';

// --- [컨셉 4번 반영] 상세 목업 데이터 ---
const mockProjects = [
  { 
    id: 1, title: "E-Commerce System", tables: 23, relations: 48, columns: 156, 
    updated: "2024-04-22 14:30", color: "#BFFF00", glow: "rgba(191, 255, 0, 0.4)" 
  },
  { 
    id: 2, title: "Social Graph DB", tables: 12, relations: 24, columns: 82, 
    updated: "2024-04-21 09:15", color: "#00EAFF", glow: "rgba(0, 234, 255, 0.3)" 
  },
  { 
    id: 3, title: "Inventory Master", tables: 18, relations: 37, columns: 124, 
    updated: "2024-04-20 18:45", color: "#FF00E5", glow: "rgba(255, 0, 229, 0.3)" 
  },
  { 
    id: 4, title: "Auth Universe", tables: 5, relations: 12, columns: 34, 
    updated: "2024-04-19 11:20", color: "#FFB800", glow: "rgba(255, 184, 0, 0.3)" 
  },
];

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div style={styles.container}>
      {/* 🌠 우주 배경 효과 (Nebula Layer) */}
      <div style={styles.nebulaBg} />

      {/* 🌌 LNB 네비게이션 (컨셉 3번 좌측 패널) */}
      <nav style={styles.lnb}>
        <div style={styles.lnbHeader}>
          <div style={styles.logoIcon}>U</div>
          <div>
            <div style={styles.logoText}>ULMUS</div>
            <div style={styles.logoSub}>Cosmic ERD Navigator</div>
          </div>
        </div>

        <button style={styles.newSketchBtn}>
          <Plus size={18} />
          <span>New Sketchbook</span>
        </button>

        <div style={styles.menuList}>
          <div style={activeTab === 'dashboard' ? styles.menuItemActive : styles.menuItem} onClick={() => setActiveTab('dashboard')}>
            <LayoutGrid size={18} /> Dashboard
          </div>
          <div style={styles.menuItem}><Database size={18} /> My Sketchbooks</div>
          <div style={styles.menuItem}><Library size={18} /> Templates</div>
          <div style={styles.menuItem}><History size={18} /> Recent</div>
          <div style={styles.menuItem}><Star size={18} /> Starred</div>
          <div style={styles.menuItem}><Trash2 size={18} /> Trash</div>
        </div>

        <div style={styles.lnbFooter}>
          <div style={styles.menuItem}><Settings size={18} /> Settings</div>
          <div style={styles.profileCard}>
            <div style={styles.avatar}>D</div>
            <div style={styles.profileInfo}>
              <div style={styles.userName}>Pilot_D</div>
              <div style={styles.userRole}>Premium Voyager</div>
            </div>
          </div>
        </div>
      </nav>

      {/* 🌠 메인 콘텐츠 영역 (컨셉 3번 중앙) */}
      <main style={styles.main}>
        <header style={styles.contentHeader}>
          <h1 style={styles.mainTitle}>My Sketchbooks</h1>
          <div style={styles.headerActions}>
            <div style={styles.searchWrapper}>
              <Search size={16} color="#666" />
              <input style={styles.searchInput} placeholder="Search universes..." />
            </div>
            <button style={styles.sortBtn}>
              Sort by <span style={{color: '#fff', marginLeft: '6px'}}>Last Modified</span>
              <ChevronsUpDown size={14} style={{marginLeft: '8px'}} />
            </button>
          </div>
        </header>

        {/* 🌠 프로젝트 그리드 (컨셉 4번 카드 스타일 적용) */}
        <div style={styles.grid}>
          {mockProjects.map((p) => (
            <div key={p.id} style={styles.card}>
              {/* 성단 미리보기 (Thumbnail) */}
              <div style={styles.preview}>
                {/* 배경 성단 안개 효과 */}
                {/* <div style={{...styles.cardNebula, background: `radial-gradient(circle, ${p.glow} 0%, transparent 70%)`}} /> */}
                {/* [컨셉 4번] 밀도 있는 별자리 포인트 */}
                {[...Array(25)].map((_, i) => (
                  <div key={i} style={{
                    ...styles.star,
                    top: `${Math.random() * 85 + 5}%`,
                    left: `${Math.random() * 85 + 5}%`,
                    backgroundColor: p.color,
                    boxShadow: `0 0 4px 3px ${p.color}`,
                    opacity: Math.random() * 0.7 + 0.3,
                  }} />
                ))}
                {/* 별자리를 잇는 아주 연한 선 (CSS 가상 요소 대신 생성) */}
                <div style={{...styles.constellationLine, borderColor: p.color}} />
              </div>

              {/* 카드 정보부 */}
              <div style={styles.cardContent}>
                <div style={styles.cardTop}>
                  <h3 style={styles.cardTitle}>{p.title}</h3>
                  <MoreVertical size={16} color="#444" />
                </div>
                
                <div style={styles.statsRow}>
                  <span style={{...styles.statLabel, color: p.color}}>{p.tables} Tables</span>
                  <span style={styles.statDivider}>|</span>
                  <span style={styles.statLabel}>{p.relations} Relations</span>
                </div>

                <div style={styles.cardFooter}>
                  <div style={styles.timeInfo}>
                    <span style={styles.updatedText}>{p.updated}</span>
                  </div>
                  <div style={{...styles.miniAvatar, backgroundColor: p.color}}>D</div>
                </div>
              </div>
            </div>
          ))}

          {/* New Sketchbook 카드 */}
          <div style={styles.addCard}>
            <Plus size={32} color="#1a1a1a" />
            <span style={styles.addText}>New Sketchbook</span>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- CSS-in-JS 스타일 (컨셉 이미지 100% 동기화) ---
const styles = {
  container: {
    display: 'flex', width: '100vw', height: '100vh', 
    backgroundColor: '#000', color: '#fff', position: 'relative', overflow: 'hidden',
    fontFamily: '"Inter", -apple-system, sans-serif'
  },
  nebulaBg: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    background: 'radial-gradient(circle at 50% 50%, #0a0a0a 0%, #000 100%)',
    zIndex: 0
  },
  lnb: {
    width: '260px', height: '100%', zIndex: 10,
    background: 'rgba(5, 5, 5, 0.8)', backdropFilter: 'blur(30px)',
    borderRight: '1px solid rgba(255,255,255,0.03)',
    display: 'flex', flexDirection: 'column', padding: '30px 20px'
  },
  logoIcon: {
    width: '32px', height: '32px', background: '#BFFF00', color: '#000',
    borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center',
    fontWeight: '900', fontSize: '18px'
  },
  lnbHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' },
  logoText: { fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' },
  logoSub: { fontSize: '10px', color: '#444', textTransform: 'uppercase' },
  
  newSketchBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
    background: '#BFFF00', color: '#000', border: 'none', padding: '14px',
    borderRadius: '12px', fontWeight: '800', fontSize: '14px', cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(191, 255, 0, 0.2)', marginBottom: '30px'
  },
  menuList: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
  menuItem: {
    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px',
    borderRadius: '10px', color: '#666', fontSize: '14px', cursor: 'pointer', transition: '0.2s'
  },
  menuItemActive: {
    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px',
    borderRadius: '10px', color: '#BFFF00', background: 'rgba(191, 255, 0, 0.05)', fontSize: '14px'
  },
  
  lnbFooter: { borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' },
  profileCard: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', background: '#BFFF00', color: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  profileInfo: { display: 'flex', flexDirection: 'column' },
  userName: { fontSize: '14px', fontWeight: 'bold' },
  userRole: { fontSize: '10px', color: '#444' },

  main: { flex: 1, zIndex: 1, padding: '50px 60px', overflowY: 'auto' },
  contentHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  mainTitle: { fontSize: '28px', fontWeight: '800' },
  headerActions: { display: 'flex', gap: '20px' },
  searchWrapper: {
    display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)', padding: '10px 18px', borderRadius: '10px', width: '300px'
  },
  searchInput: { background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '14px' },
  sortBtn: { background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' },
  card: {
    background: 'rgba(15, 15, 15, 0.6)', border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s'
  },
  preview: { height: '180px', background: '#050505', position: 'relative', overflow: 'hidden' },
  cardNebula: { position: 'absolute', width: '150px', height: '150px', top: '15px', left: '65px', filter: 'blur(30px)', opacity: 0.6 },
  star: { position: 'absolute', width: '3px', height: '3px', borderRadius: '50%' },
  constellationLine: { position: 'absolute', top: '20%', left: '20%', width: '60%', height: '60%', border: '1px solid transparent', opacity: 0.05, borderRadius: '40%' },
  
  cardContent: { padding: '20px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  cardTitle: { fontSize: '16px', fontWeight: '700', margin: 0 },
  statsRow: { display: 'flex', gap: '10px', marginBottom: '20px' },
  statLabel: { fontSize: '11px', fontWeight: '600', opacity: 0.8 },
  statDivider: { color: '#222', fontSize: '10px' },
  
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '15px' },
  updatedText: { fontSize: '10px', color: '#333' },
  miniAvatar: { width: '22px', height: '22px', borderRadius: '50%', color: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px', fontWeight: 'bold' },

  addCard: {
    border: '2px dashed rgba(255,255,255,0.03)', borderRadius: '20px', minHeight: '300px',
    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '15px', cursor: 'pointer'
  },
  addText: { color: '#222', fontSize: '14px', fontWeight: '600' }
};

export default DashboardPage;