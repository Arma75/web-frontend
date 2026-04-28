import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    email: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    verificationCode: ''
  });
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  
  const { email, nickname, password, confirmPassword, verificationCode } = inputs;

  const onChange = (e) => setInputs({ ...inputs, [e.target.name]: e.target.value });

  // 1. 인증번호 발송 (Brevo 연동 예정)
  const handleSendCode = async () => {
    if (!email) return alert("이메일을 입력해주세요.");
    try {
      // await axios.post('http://localhost:8080/auth/email-send', { email });
      alert("인증번호가 발송되었습니다.");
      setIsEmailSent(true);
    } catch (e) {
      alert("발송 실패");
    }
  };

  // 2. 인증번호 확인 (Redis 연동 예정)
  const handleVerifyCode = async () => {
    try {
      // await axios.post('http://localhost:8080/auth/email-verify', { email, code: verificationCode });
      alert("인증되었습니다.");
      setIsEmailVerified(true);
    } catch (e) {
      alert("인증번호를 확인해주세요.");
    }
  };

  // 3. 회원가입 제출
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isEmailVerified) return alert("이메일 인증이 필요합니다.");
    if (password !== confirmPassword) return alert("비밀번호가 일치하지 않습니다.");

    try {
      await axios.post('http://localhost:8080/users/create', { email, nickname, password, provider: 'LOCAL' });
      alert("성단이 생성되었습니다!");
      navigate('/login');
    } catch (e) {
      alert("회원가입에 실패했습니다.");
    }
  };

  useEffect(() => {
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
      .cosmic-input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.starsOverlay} />

      <main style={styles.main}>
        {/* 로고 섹션 (로그인 페이지와 동일) */}
        <div style={styles.logoSection} onClick={() => navigate('/')}>
          <div style={styles.logoContainer}>
            <svg style={styles.logoSvg} xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 120 120" fill="none">
              <g clipPath="url(#clip0_1_3)">
                <g filter="url(#filter0_d_1_3)">
                  <path d="M30 50C41.0457 50 50 58.9543 50 70H30C18.9543 70 10 61.0457 10 50V10C21.0457 10 30 18.9543 30 30V50ZM60 10C65.5228 10 70 14.4772 70 20C70 31.0457 61.0457 40 50 40V20C50 14.4772 54.4772 10 60 10Z" fill="#BFFF00"/>
                </g>
              </g>
            </svg>
          </div>
          <h1 style={styles.brandName}>ULMUS</h1>
          <p style={styles.brandSub}>Genesis Registration</p>
        </div>

        {/* 회원가입 카드 */}
        <div style={styles.authCard}>
          <div style={styles.cardHeader}>
            <h2 style={styles.welcomeText}>Create Universe</h2>
            <p style={styles.subText}>Start your <span style={styles.highlight}>journey</span></p>
          </div>

          <form style={styles.form} onSubmit={handleSignUp}>
            {/* Email + Verify Button */}
            <div style={styles.inputWrapper}>
              <label style={styles.label}>Cosmic Identifier (Email)</label>
              <div style={styles.row}>
                <input 
                  className="cosmic-input"
                  type="email" name="email" value={email} onChange={onChange}
                  placeholder="name@company.com" style={{...styles.input, flex: 1}} required 
                  disabled={isEmailVerified}
                />
                <button type="button" onClick={handleSendCode} style={styles.inlineBtn} disabled={isEmailVerified}>
                  {isEmailSent ? 'Resend' : 'Send'}
                </button>
              </div>
            </div>

            {/* Verification Code (Visible after sending) */}
            {isEmailSent && !isEmailVerified && (
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Verification Code</label>
                <div style={styles.row}>
                  <input 
                    className="cosmic-input"
                    type="text" name="verificationCode" value={verificationCode} onChange={onChange}
                    placeholder="6-digit code" style={{...styles.input, flex: 1}}
                  />
                  <button type="button" onClick={handleVerifyCode} style={styles.inlineBtn}>
                    Verify
                  </button>
                </div>
              </div>
            )}

            {isEmailVerified && (
              <div style={styles.verifiedBadge}>
                <CheckCircle size={14} style={{marginRight: '6px'}} /> Email Verified
              </div>
            )}

            <div style={styles.inputWrapper}>
              <label style={styles.label}>Explorer Alias</label>
              <input 
                className="cosmic-input"
                type="text" name="nickname" value={nickname} onChange={onChange}
                placeholder="Captain Solo" style={styles.input} required 
              />
            </div>

            <div style={styles.inputWrapper}>
              <label style={styles.label}>Cluster Key (Password)</label>
              <input 
                className="cosmic-input"
                type="password" name="password" value={password} onChange={onChange}
                placeholder="••••••••" style={styles.input} required 
              />
            </div>

            <div style={styles.inputWrapper}>
              <label style={styles.label}>Confirm Key</label>
              <input 
                className="cosmic-input"
                type="password" name="confirmPassword" value={confirmPassword} onChange={onChange}
                placeholder="••••••••" style={styles.input} required 
              />
            </div>

            <button type="submit" style={{...styles.submitBtn, opacity: isEmailVerified ? 1 : 0.5}} disabled={!isEmailVerified}>
              Initialize Cluster <ArrowRight size={18} style={{marginLeft: '8px'}} />
            </button>
          </form>

          <p style={styles.footerText}>
            Already a navigator? <span style={styles.signUpLink} onClick={() => navigate('/login')}>Return to base</span>
          </p>
        </div>
      </main>
    </div>
  );
};

// 로그인 페이지의 styles 객체를 기반으로 확장/수정
const styles = {
  container: { minHeight: '100vh', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden' },
  starsOverlay: { position: 'absolute', width: '100%', height: '100%', backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')", opacity: 0.3, zIndex: 1 },
  main: { zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', padding: '40px 0' },
  
  logoSection: { textAlign: 'center', cursor: 'pointer' },
  logoContainer: { width: '60px', height: '60px', margin: '0 auto 10px' },
  logoSvg: { width: '100%', height: '100%', filter: 'drop-shadow(0 0 10px rgba(191, 255, 0, 0.4))' },
  brandName: { fontSize: '24px', fontWeight: '900', letterSpacing: '3px', margin: 0 },
  brandSub: { fontSize: '11px', color: '#666', marginTop: '4px', fontWeight: '600' },

  authCard: { width: '420px', padding: '45px', backgroundColor: 'rgba(10, 10, 10, 0.8)', borderRadius: '28px', border: '1px solid rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(12px)' },
  cardHeader: { textAlign: 'center', marginBottom: '35px' },
  welcomeText: { fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' },
  subText: { fontSize: '15px', color: '#888' },
  highlight: { color: '#BFFF00' },

  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputWrapper: { display: 'flex', flexDirection: 'column', gap: '10px' },
  row: { display: 'flex', gap: '10px' },
  label: { fontSize: '12px', color: '#444', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '16px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#fff', fontSize: '15px', transition: '0.3s', boxSizing: 'border-box' },
  
  inlineBtn: { padding: '0 20px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#BFFF00', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: '0.3s' },
  
  verifiedBadge: { display: 'flex', alignItems: 'center', color: '#BFFF00', fontSize: '13px', fontWeight: '600', padding: '5px 0' },

  submitBtn: { marginTop: '10px', padding: '18px', backgroundColor: '#BFFF00', color: '#000', border: 'none', borderRadius: '14px', fontWeight: '900', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 0 25px rgba(191, 255, 0, 0.4)' },

  footerText: { textAlign: 'center', fontSize: '14px', color: '#555', marginTop: '35px' },
  signUpLink: { color: '#BFFF00', fontWeight: '800', cursor: 'pointer', borderBottom: '1px solid #BFFF00' }
};

export default SignUpPage;