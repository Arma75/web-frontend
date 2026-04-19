import React, { useEffect } from 'react';

// [핵심] 서비스 전체에서 사용될 최대 예상 높이를 기준으로 px 좌표를 딱 한 번 생성합니다.
// 이렇게 하면 %와 달리 부모의 높이가 변해도 별의 절대적인 위치(px)는 변하지 않습니다.
const MAX_SPACE_HEIGHT = 5000; 
const colors = ['#fff', '#BFFF00', '#A855F7', '#60A5FA'];

const GLOBAL_STARS = Array.from({ length: 300 }).map((_, i) => ({
  id: i,
  top: Math.random() * MAX_SPACE_HEIGHT,
  left: Math.random() * 100,
  size: Math.random() * 2 + 1,
  color: colors[Math.floor(Math.random() * colors.length)],
  delay: Math.random() * 5,
  duration: 3 + Math.random() * 4,
}));

const StarBackground = () => {
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes twinkle {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  return (
    <div style={starStyles.container}>
      {GLOBAL_STARS.map(star => (
        <div
          key={star.id}
          style={{
            ...starStyles.star,
            top: `${star.top}px`, // 고정된 px 위치
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            boxShadow: `0 0 6px ${star.color}`,
            animation: `twinkle ${star.duration}s infinite ease-in-out ${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

const starStyles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%', 
    minHeight: '100vh',
    zIndex: 100,
    pointerEvents: 'none',
    overflow: 'hidden', 
  },
  star: {
    position: 'absolute',
    borderRadius: '50%',
  },
};

export default StarBackground;