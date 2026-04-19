import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [inputs, setInputs] = useState({ email: '', password: '' });
  const { email, password } = inputs;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/users/login', { email, password });
      const { accessToken } = response.data;
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        // const userInfo = await fetchMyInfo(accessToken);
        // localStorage.setItem('user', JSON.stringify(userInfo));
        navigate('/project/1');
      }
    } catch (e) { alert("로그인 정보를 확인해 주세요."); }
  };

  const onChange = (e) => setInputs({ ...inputs, [e.target.name]: e.target.value });

  useEffect(() => {
    window.scrollTo(0, 0);

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      /* 자동 완성 스타일 초기화 */
      input {
        border: 0;
        background-image: none;
        border-image-width: 0;
        outline: none;
      }
      input:-webkit-autofill {
        -webkit-text-fill-color: #fff !important;
        // -webkit-box-shadow: 0 0 0px 1000px #000 inset !important;
        -webkit-box-shadow: none !important;
        // border: 1px solid rgb(20, 20, 20) !important;
        appearance: none !important;
      }
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
          -webkit-text-fill-color: #fff !important;
          -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.05) inset !important;
          box-shadow: 0 0 0px 1000px rgb(13, 13, 13) inset !important;
          transition: background-color 5000s ease-in-out 0s;
          background-color: green !important;
      }

      input:autofill,
      input:autofill:hover,
      input:autofill:focus,
      input:autofill:active {
          -webkit-text-fill-color: #fff !important;
          -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.05) inset !important;
          box-shadow: 0 0 0px 1000px rgb(13, 13, 13) inset !important;
          transition: background-color 5000s ease-in-out 0s;
          background-color: green !important;
      }
      
      /* 포커스 시 라임색 테두리 유지 */
      .ulmus-input:focus {
        border-color: #BFFF00 !important;
        outline: none;
      }
    `;
    document.head.appendChild(styleSheet);
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.head.removeChild(styleSheet);
    };
  }, []);

  const isMobile = windowWidth < 768;

  return (
    <div style={loginStyles.container}>
      {/* GNB (반응형 패딩 조정) */}
      <header style={{...loginStyles.header, padding: isMobile ? '20px' : '30px 60px'}}>
        <div style={loginStyles.logoGroup} onClick={() => navigate('/')}>
          <div style={loginStyles.logoContainer}>
            {/* 직접 그리신 로고 SVG (Glow 잘림 수정) */}
            <svg 
              style={loginStyles.logoSvg} 
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
      </header>

      {/* 중앙 로그인 섹션 */}
      <main style={loginStyles.main}>
        <div style={{...loginStyles.authStack, width: isMobile ? '85%' : '340px'}}>

          <form style={loginStyles.loginForm} onSubmit={handleLogin}>
            <div style={loginStyles.inputGroup}>
              <input type="email" name="email" placeholder="Email" value={email} onChange={onChange} style={loginStyles.input} />
              <input type="password" name="password" placeholder="Password" value={password} onChange={onChange} style={loginStyles.input} />
            </div>
            
            <button type="submit" style={loginStyles.loginBtn}>Sign In</button>
          </form>
          
          <button style={loginStyles.googleBtn}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="google" style={{width: '18px'}} />
            Continue with Google
          </button>

          <button style={loginStyles.signUpBtn} onClick={() => navigate('/signup')}>
            New to Ulmus? Sign Up
          </button>
        </div>
      </main>

      <bottom style={{...loginStyles.bottom, padding: isMobile ? '20px' : '30px 60px'}}>
      </bottom>
    </div>
  );
};

const loginStyles = {
  container: { backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  
  // 헤더 레이아웃 수정: 랜딩 페이지와 위치 동기화
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

  main: { display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 10, flex: 1 },
  authStack: { display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' },
  
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  input: {
    padding: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    // backgroundColor: '#f00 !important',
    // border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s'
  },

  loginForm: {
    display: 'flex', flexDirection: 'column', gap: '12px'
  },
  loginBtn: {
    padding: '16px',
    backgroundColor: '#BFFF00',
    color: '#000',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '800',
    fontSize: '15px',
    cursor: 'pointer',
    width: '100%',
    boxShadow: 'rgba(191, 255, 0, 0.5) 0px 0px 25px'
  },

  googleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '16px',
    backgroundColor: '#fff',
    color: '#000',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer'
  },

  signUpBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#BFFF00',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    opacity: 0.8
  },

  bottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10, height: '109px' },
};

export default LoginPage;