// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import ulmusApi from '../api/ulmusApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // 이 요청이 나갈 때 토큰이 만료되었다면 인터셉터가 자동으로 리프레시를 수행함
      const userData = await ulmusApi.get('/users/me');
      setUser(userData); 
    } catch (error) {
      // 리프레시 토큰까지 만료된 경우 인터셉터에서 이미 로그아웃 처리를 했겠지만,
      // 여기서 한 번 더 상태를 정리해줍니다.
      setUser(null);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, initAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);