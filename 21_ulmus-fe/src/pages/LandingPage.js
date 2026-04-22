import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  // 반응형 웹을 위한 화면 너비 상태 관리
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/users/me', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (response.ok) {
          navigate('/project/1');
        } else {
          localStorage.removeItem('accessToken');
        }
      } catch (error) {
        console.error("인증 체크 실패", error);
      }
    };

    checkAuth();

    window.scrollTo(0, 0);
    
    // 화면 크기 변경 감지 이벤트 리스너
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 모바일 기준 (768px 미만) 판단
  const isMobile = windowWidth < 768;

  return (
    <div style={lpStyles.container}>
      {/* GNB (반응형 패딩 조정) */}
      <header style={{...lpStyles.header, padding: isMobile ? '20px' : '30px 60px'}}>
        <div style={lpStyles.logoGroup}>
          <div style={lpStyles.logoContainer}>
            {/* 직접 그리신 로고 SVG (Glow 잘림 수정) */}
            <svg 
              style={lpStyles.logoSvg} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="-20 -20 120 120" // 3. viewBox를 넉넉하게 잡아 광채 확보
              fill="none"
            >
              <g clipPath="url(#clip0_1_3)">
                <g filter="url(#filter0_d_1_3)">
                  <path d="M30 50C41.0457 50 50 58.9543 50 70H30C18.9543 70 10 61.0457 10 50V10C21.0457 10 30 18.9543 30 30V50ZM60 10C65.5228 10 70 14.4772 70 20C70 31.0457 61.0457 40 50 40V20C50 14.4772 54.4772 10 60 10Z" fill="#BFFF00"/>
                </g>
              </g>
              <defs>
                {/* SVG 내부 DropShadow 필터 ( stdDeviation을 유지하되 viewBox로 해결) */}
                <filter id="filter0_d_1_3" x="-20" y="-20" width="120" height="120" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset/>
                  <feGaussianBlur stdDeviation="10"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0.74902 0 0 0 0 1 0 0 0 0 0 0 0 0 0.25 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_3"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_3" result="shape"/>
                </filter>
                <clipPath id="clip0_1_3">
                <rect width="80" height="80" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
          {/* 브랜드명 완전 제거 */}
        </div>
        
        {/* 네비게이션 (모바일에서는 간격 조정) */}
        <nav style={{...lpStyles.nav, gap: isMobile ? '20px' : '40px'}}>
          <span style={lpStyles.navItem}>About</span>
          <span style={lpStyles.navItem}>Guide</span>
          <span style={lpStyles.navItem}>GitHub</span>
        </nav>
        
        {/* <button onClick={() => navigate('/login')} style={lpStyles.loginBtn}>Login</button> */}
      </header>

      {/* Hero Section (반응형 폰트 크기 조정) */}
      <section style={{...lpStyles.hero, paddingTop: isMobile ? '60px' : '100px'}}>
        <div style={lpStyles.badge}>Free for Developers</div>
        <h1 style={{...lpStyles.heroTitle, fontSize: isMobile ? '40px' : '72px'}}>
          From Schema Design to <br />
          {/* 4. 라임 -> 흰색 그라데이션 텍스트 (SVG 필터 활용) */}
          <span style={lpStyles.limeGradientText}>Test Data in Seconds.</span>
        </h1>
        <p style={{...lpStyles.heroSub, fontSize: isMobile ? '14px' : '18px'}}>
          디자인부터 데이터 생성까지, 10초 만에 끝내세요. <br />
          복잡한 DB 관계를 분석하여 무결성이 보장된 SQL과 데이터를 즉시 제공합니다.
        </p>
        <button onClick={() => navigate('/login')} style={lpStyles.getStartedBtn}>GET STARTED</button>
      </section>

      {/* Grid Sections (반응형 그리드 및 간격 조정) */}
      <div style={{...lpStyles.gridWrapper, padding: isMobile ? '0 10px 60px' : '0 20px 100px'}}>
        
        {/* Section 1: AI Data Generation (이미지 포함) */}
        <div style={{...lpStyles.gridRow, flexDirection: isMobile ? 'column-reverse' : 'row', gap: isMobile ? '40px' : '80px'}}>
          <div style={{...lpStyles.textBox, textAlign: isMobile ? 'center' : 'left'}}>
            <h2 style={{...lpStyles.featureTitle, fontSize: isMobile ? '28px' : '40px'}}>AI Data Generation.</h2>
            <p style={{...lpStyles.featureDesc, margin: isMobile ? '0 auto' : '0 0 20px 0'}}>
              Ulmus uses advanced machine intelligence to create realistic test datasets for every schema in seconds. 
              Leverage powerful automation for faster development.
            </p>
          </div>
          {/* 코드 에디터 스타일 반영 */}
          <div style={{...lpStyles.codeEditorBox, flex: isMobile ? '1' : '1.2'}}>
            <div style={lpStyles.codeHeader}>
              <div style={{...lpStyles.dot, backgroundColor: '#ff5f56'}}></div>
              <div style={{...lpStyles.dot, backgroundColor: '#ffbd2e'}}></div>
              <div style={{...lpStyles.dot, backgroundColor: '#27c93f'}}></div>
              <span style={lpStyles.codeTitle}>test-data.sql</span>
            </div>
            <pre style={{...lpStyles.pre, fontSize: isMobile ? '12px' : '14px'}}>
              <code>{`-- USERS 테이블 테스트 데이터
INSERT INTO USERS (ID, NAME, AGE) 
VALUES (1, '김민준', 30);
INSERT INTO USERS (ID, NAME, AGE) 
VALUES (2, '박서연', 25);

-- PROJECTS 테이블 테스트 데이터
INSERT INTO PROJECTS (ID, TITLE) 
VALUES (1, 'Ulmus Project');`}</code>
            </pre>
          </div>
        </div>

        {/* Section 2: Dark Code Editor (지그재그 구조) */}
        <div style={{...lpStyles.gridRow, flexDirection: isMobile ? 'column-reverse' : 'row-reverse', gap: isMobile ? '40px' : '80px'}}>
          <div style={{...lpStyles.textBox, textAlign: isMobile ? 'center' : 'left'}}>
            <h2 style={{...lpStyles.featureTitle, fontSize: isMobile ? '28px' : '40px'}}>Dark Code Editor.</h2>
            <p style={{...lpStyles.featureDesc, margin: isMobile ? '0 auto' : '0 0 20px 0'}}>
              Preview data with syntax-highlighted SQL INSERT statements, 
              designed for clarity in a deep space interface.
            </p>
          </div>
          <div style={lpStyles.imagePlaceholder}>
             <div style={{...lpStyles.shape, width: '80px', height: '80px', border: '2px solid #fff', borderRadius: '50%', opacity: 0.1}}></div>
          </div>
        </div>

        {/* Section 3: Starlight Glow */}
        <div style={{...lpStyles.gridRow, flexDirection: isMobile ? 'column-reverse' : 'row', gap: isMobile ? '40px' : '80px'}}>
          <div style={{...lpStyles.textBox, textAlign: isMobile ? 'center' : 'left'}}>
            <h2 style={{...lpStyles.featureTitle, fontSize: isMobile ? '28px' : '40px'}}>Starlight Glow.</h2>
            <p style={{...lpStyles.featureDesc, margin: isMobile ? '0 auto' : '0 0 20px 0'}}>
              Core buttons and highlights radiate a neon lime accent for an immersive, futuristic UX.
            </p>
          </div>
          <div style={lpStyles.imagePlaceholder}>
             <div style={{...lpStyles.shape, width: 0, height: 0, borderLeft: '40px solid transparent', borderRight: '40px solid transparent', borderBottom: '70px solid #fff', opacity: 0.1}}></div>
          </div>
        </div>

      </div>

      <footer style={lpStyles.footer}>
        © 2026 ULMUS. Built for developers. 100% Free.
      </footer>
    </div>
  );
};

const lpStyles = {
  container: { color: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden', position: 'relative' },

  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 },
  logoGroup: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
  logoContainer: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSvg: {
    width: '100%',
    height: '100%',
    // SVG 광채 효과 (filter stdDeviation="10"을 감안하여 Drop Shadow로 강화)
    filter: 'drop-shadow(0 0 10px rgba(191, 255, 0, 0.4))',
  },
  nav: { display: 'flex' },
  navItem: { color: '#888', fontSize: '14px', cursor: 'pointer' },
  loginBtn: { padding: '8px 20px', backgroundColor: '#fff', color: '#000', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' },

  hero: { textAlign: 'center', paddingBottom: '100px', position: 'relative', zIndex: 10 },
  badge: { display: 'inline-block', padding: '5px 15px', border: '1px solid rgba(191, 255, 0, 0.3)', color: '#BFFF00', borderRadius: '20px', fontSize: '10px', marginBottom: '20px' },
  heroTitle: { fontWeight: '800', lineHeight: 1.1, margin: 0 },
  // 4. 라임 -> 흰색 그라데이션 텍스트 스타일
  limeGradientText: {
    color: '#BFFF00', // 기본 색상
    textShadow: '0 0 20px rgba(191, 255, 0, 0.3)', // 은은한 광채
    // 그라데이션 적용 (webkit 속성 필요)
    background: 'linear-gradient(to right, #fff, #BFFF00)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSub: { color: '#888', marginTop: '30px', lineHeight: 1.6 },
  getStartedBtn: { marginTop: '40px', padding: '15px 40px', backgroundColor: '#BFFF00', color: '#000', borderRadius: '8px', fontWeight: '900', border: 'none', cursor: 'pointer', boxShadow: '0 0 25px rgba(191, 255, 0, 0.5)', fontSize: '16px' },

  gridWrapper: { maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 10 },
  gridRow: { display: 'flex', alignItems: 'center', marginBottom: '120px' },
  textBox: { flex: 1 },
  featureTitle: { fontWeight: '800', marginBottom: '20px', color: '#fff' },
  featureDesc: { fontSize: '16px', color: '#666', lineHeight: 1.6, maxWidth: '400px' },

  // 코드 에디터 스타일
  codeEditorBox: { backgroundColor: '#0D1117', border: '1px solid #30363D', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' },
  codeHeader: { backgroundColor: '#161B22', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #30363D' },
  dot: { width: '12px', height: '12px', borderRadius: '50%' },
  codeTitle: { color: '#8B949E', fontSize: '12px', marginLeft: '8px', fontFamily: 'monospace' },
  pre: { padding: '24px', margin: 0, color: '#E6EDF3', fontFamily: '"Fira Code", monospace', lineHeight: '1.6', overflowX: 'auto' },

  imagePlaceholder: { flex: 1.2, height: '350px', backgroundColor: '#111', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #222' },
  shape: { transition: '0.3s' },

  footer: { padding: '80px 0', textAlign: 'center', color: '#333' },
};

export default LandingPage;