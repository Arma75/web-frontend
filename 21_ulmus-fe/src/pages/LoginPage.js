import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { email, password } = inputs;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/users/login', { email, password });
      const { accessToken } = response.data;
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        navigate('/dashboard');
      }
    } catch (e) {
      alert("항해 정보를 찾을 수 없습니다. 다시 시도해 주세요.");
    }
  };

  const onChange = (e) => setInputs({ ...inputs, [e.target.name]: e.target.value });

  useEffect(() => {
    // 인풋 포커스 시 부드러운 글로우 효과를 위한 글로벌 스타일 주입
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes inputGlow {
        from { box-shadow: 0 0 0px rgba(191, 255, 0, 0); }
        to { box-shadow: 0 0 15px rgba(191, 255, 0, 0.3); }
      }
      .cosmic-input:focus {
        border-color: #BFFF00 !important;
        animation: inputGlow 0.4s forwards;
        outline: none;
      }
      input:-webkit-autofill {
        -webkit-text-fill-color: #fff !important;
        -webkit-box-shadow: 0 0 0px 1000px #0a0a0a inset !important;
        transition: background-color 5000s ease-in-out 0s;
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  return (
    <div style={styles.container}>
      {/* 별자리 배경 (레퍼런스 image_a3123b.jpg 무드 반영) */}
      <div style={styles.starsOverlay} />

      <main style={styles.main}>
        {/* 울머스 로고 섹션 (LandingPage.js 로고 로직 이식) */}
        <div style={styles.logoSection} onClick={() => navigate('/')}>
          <div style={styles.logoContainer}>
            <svg style={styles.logoSvg} xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 120 120" fill="none">
              <g clipPath="url(#clip0_1_3)">
                <g filter="url(#filter0_d_1_3)">
                  <path d="M30 50C41.0457 50 50 58.9543 50 70H30C18.9543 70 10 61.0457 10 50V10C21.0457 10 30 18.9543 30 30V50ZM60 10C65.5228 10 70 14.4772 70 20C70 31.0457 61.0457 40 50 40V20C50 14.4772 54.4772 10 60 10Z" fill="#BFFF00"/>
                </g>
              </g>
              <defs>
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
                <clipPath id="clip0_1_3"><rect width="80" height="80" fill="white"/></clipPath>
              </defs>
            </svg>
          </div>
          <h1 style={styles.brandName}>ULMUS</h1>
          <p style={styles.brandSub}>Cosmic ERD Navigator</p>
        </div>

        {/* 로그인 카드 */}
        <div style={styles.authCard}>
          <div style={styles.cardHeader}>
            <h2 style={styles.welcomeText}>Welcome back</h2>
            <p style={styles.subText}>Enter your <span style={styles.highlight}>universe</span></p>
          </div>

          <form style={styles.form} onSubmit={handleLogin}>
            <div style={styles.inputWrapper}>
              <label style={styles.label}>Email address</label>
              <input 
                className="cosmic-input"
                type="email" name="email" value={email} onChange={onChange}
                placeholder="name@company.com" style={styles.input} required 
              />
            </div>

            <div style={styles.inputWrapper}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordContainer}>
                <input 
                  className="cosmic-input"
                  type={showPassword ? "text" : "password"} 
                  name="password" value={password} onChange={onChange}
                  placeholder="••••••••" style={styles.input} required 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  {showPassword ? <EyeOff size={18} color="#444"/> : <Eye size={18} color="#444"/>}
                </button>
              </div>
              <div style={styles.forgotPass} onClick={() => alert('비밀번호 초기화 링크가 이메일로 전송됩니다.')}>
                Forgot password?
              </div>
            </div>

            <button type="submit" style={styles.submitBtn}>
              Enter Orbit <ArrowRight size={18} style={{marginLeft: '8px'}} />
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.line} />
            <span style={styles.dividerText}>or continue with</span>
            <div style={styles.line} />
          </div>

          <div style={styles.socialGroup}>
            <button style={styles.socialBtn} onClick={() => window.location.href = 'http://localhost:8080/auth/google'}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" style={{width: '18px'}} />
              Google
            </button>
            <button style={styles.socialBtn} onClick={() => window.location.href = 'http://localhost:8080/auth/github'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </button>
          </div>

          <p style={styles.footerText}>
            New here? <span style={styles.signUpLink} onClick={() => navigate('/signup')}>Create your universe</span>
          </p>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden' },
  starsOverlay: { position: 'absolute', width: '100%', height: '100%', backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')", opacity: 0.3, zIndex: 1 },
  main: { zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' },
  
  logoSection: { textAlign: 'center', cursor: 'pointer' },
  logoContainer: { width: '60px', height: '60px', margin: '0 auto 10px' },
  logoSvg: { width: '100%', height: '100%', filter: 'drop-shadow(0 0 10px rgba(191, 255, 0, 0.4))' },
  brandName: { fontSize: '24px', fontWeight: '900', letterSpacing: '3px', margin: 0 },
  brandSub: { fontSize: '11px', color: '#666', marginTop: '4px', fontWeight: '600' },

  authCard: { width: '400px', padding: '45px', backgroundColor: 'rgba(10, 10, 10, 0.8)', borderRadius: '28px', border: '1px solid rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(12px)' },
  cardHeader: { textAlign: 'center', marginBottom: '35px' },
  welcomeText: { fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' },
  subText: { fontSize: '15px', color: '#888' },
  highlight: { color: '#BFFF00' },

  form: { display: 'flex', flexDirection: 'column', gap: '22px' },
  inputWrapper: { display: 'flex', flexDirection: 'column', gap: '10px' },
  label: { fontSize: '12px', color: '#444', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '16px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#fff', fontSize: '15px', transition: '0.3s' },
  passwordContainer: { position: 'relative' },
  eyeBtn: { position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' },
  forgotPass: { fontSize: '12px', color: '#444', textAlign: 'right', marginTop: '8px', cursor: 'pointer', fontWeight: '600' },

  submitBtn: { marginTop: '10px', padding: '18px', backgroundColor: '#BFFF00', color: '#000', border: 'none', borderRadius: '14px', fontWeight: '900', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 0 25px rgba(191, 255, 0, 0.4)' },

  divider: { display: 'flex', alignItems: 'center', gap: '15px', margin: '30px 0' },
  line: { flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' },
  dividerText: { fontSize: '11px', color: '#333', fontWeight: '600' },

  socialGroup: { display: 'flex', gap: '15px' },
  socialBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },

  footerText: { textAlign: 'center', fontSize: '14px', color: '#555', marginTop: '35px' },
  signUpLink: { color: '#BFFF00', fontWeight: '800', cursor: 'pointer', borderBottom: '1px solid #BFFF00' }
};

export default LoginPage;