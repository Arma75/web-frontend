import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ship } from 'lucide-react'; 

const LoginPage = () => {
  const navigate = useNavigate();

  // 소셜 로그인 핸들러: 백엔드 OAuth2 엔드포인트로 리다이렉트
  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  useEffect(() => {
    // 이미 토큰이 있는 유저라면 대시보드로 리다이렉트
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div style={styles.container}>
      {/* 우주 별자리 배경 효과 */}
      <div style={styles.starsOverlay} />

      <main style={styles.main}>
        {/* 프로젝트 로고 섹션 */}
        <div style={styles.logoSection} onClick={() => navigate('/')}>
          <div style={styles.logoContainer}>
            <div style={styles.logoCircle}>U</div>
          </div>
          <h1 style={styles.brandName}>ULMUS</h1>
          <p style={styles.brandSub}>Cosmic ERD Navigator</p>
        </div>

        {/* 인증 카드 */}
        <div style={styles.authCard}>
          <div style={styles.cardHeader}>
            <h2 style={styles.welcomeText}>Embark on a Journey</h2>
            <p style={styles.subText}>Select your <span style={styles.highlight}>identity provider</span> to enter</p>
          </div>

          <div style={styles.socialGroup}>
            {/* Google 로그인 버튼 */}
            <button style={styles.socialBtn} onClick={() => handleSocialLogin('google')}>
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="G" 
                style={{ width: '18px', height: '18px' }} 
              />
              <span>Continue with Google</span>
            </button>

            {/* GitHub 로그인 버튼 (아이콘 에러 방지를 위해 인라인 SVG 사용) */}
            <button 
              style={{ ...styles.socialBtn, backgroundColor: '#24292e', color: '#fff' }} 
              onClick={() => handleSocialLogin('github')}
            >
              <svg height="20" width="20" viewBox="0 0 16 16" fill="white">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div style={styles.footerInfo}>
            <p style={styles.footerText}>
              By joining, you agree to navigate the infinite architecture of Ulmus.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: { 
    minHeight: '100vh', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    position: 'relative', 
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  starsOverlay: { 
    position: 'absolute', 
    width: '100%', 
    height: '100%', 
    backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')", 
    opacity: 0.3, 
    zIndex: 1 
  },
  main: { 
    zIndex: 10, 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    gap: '40px' 
  },
  logoSection: { textAlign: 'center', cursor: 'pointer' },
  logoContainer: { display: 'flex', justifyContent: 'center', marginBottom: '15px' },
  logoCircle: { 
    width: '64px', 
    height: '64px', 
    background: '#BFFF00', 
    color: '#000', 
    borderRadius: '18px', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    fontWeight: '900', 
    fontSize: '32px', 
    boxShadow: '0 0 30px rgba(191, 255, 0, 0.3)' 
  },
  brandName: { fontSize: '28px', fontWeight: '900', letterSpacing: '4px', color: '#fff', margin: 0 },
  brandSub: { fontSize: '11px', color: '#555', marginTop: '6px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' },

  authCard: { 
    width: '380px', 
    padding: '48px', 
    backgroundColor: 'rgba(15, 15, 15, 0.85)', 
    borderRadius: '32px', 
    border: '1px solid rgba(255, 255, 255, 0.08)', 
    backdropFilter: 'blur(20px)', 
    textAlign: 'center' 
  },
  cardHeader: { marginBottom: '40px' },
  welcomeText: { fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 10px 0' },
  subText: { fontSize: '14px', color: '#888', fontWeight: '400' },
  highlight: { color: '#BFFF00', fontWeight: '600' },

  socialGroup: { display: 'flex', flexDirection: 'column', gap: '14px' },
  socialBtn: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '12px', 
    padding: '16px', 
    backgroundColor: '#fff', 
    color: '#000', 
    border: 'none', 
    borderRadius: '16px', 
    fontSize: '15px', 
    fontWeight: '700', 
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },

  footerInfo: { marginTop: '40px' },
  footerText: { fontSize: '12px', color: '#333', lineHeight: '1.6', maxWidth: '240px', margin: '0 auto' }
};

export default LoginPage;