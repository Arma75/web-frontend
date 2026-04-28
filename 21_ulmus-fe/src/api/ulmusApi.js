import axios from 'axios';

const ulmusApi = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' }
});

// 요청 인터셉터
// 모든 요청에 토큰 자동 부착
ulmusApi.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 응답 인터셉터
// 첫번째 인자 : 성공 시 콜백 함수
// 두번쨰 인자 : 실패 시 콜백 함수
ulmusApi.interceptors.response.use((response) => response.data,
  async (error) => {
    // 401 에러이고, 이미 재시도한 요청이 아닐 때만 실행
    if (error.response?.status === 401 && !error.config._retry) {
      // 재시도 표시
      error.config._retry = true;

      try {
        // 리프레시 토큰 추출
        const refreshToken = localStorage.getItem('refreshToken');
        
        // 리프레시 요청
        // axios 기본 인스턴스 사용 (인터셉터 중복 방지)
        const res = await axios.post('http://localhost:8080/users/refresh', {
          refreshToken: refreshToken
        });

        // 리프레시 요청 성공한 경우
        if (res.status === 200) {
          // 신규 accessToken, refreshToken 추출
          const { newAccessToken, newRefreshToken } = res.data;
          
          // 신규 토큰 저장
          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // 실패했던 기존 요청의 헤더를 새 토큰으로 교체
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          
          // 재요청
          return ulmusApi(error.config);
        }
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우 토큰 클리어 후 로그인 페이지로 리다이렉트
        localStorage.clear();
        // window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default ulmusApi;