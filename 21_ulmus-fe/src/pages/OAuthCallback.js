import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // URL에서 accessToken 추출
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('accessToken');

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      // 토큰 저장 후 대시보드로 이동
      navigate('/project/1');
    } else {
      alert("인증에 실패했습니다.");
      navigate('/login');
    }
  }, [navigate, location]);

  return <div style={{color: '#fff', textAlign: 'center', marginTop: '20%'}}>🚀 우주로 진입 중입니다...</div>;
};

export default OAuthCallback;