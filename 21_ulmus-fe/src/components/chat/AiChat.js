import React, { useState, useEffect, useRef } from 'react';

const AiChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: '안녕하세요! 서비스 어디서든 도움을 드릴 준비가 되어 있습니다.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 이 줄 추가
  const scrollRef = useRef(null);

  // 메시지가 추가될 때마다 자동으로 스크롤 하단 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]); // messages 배열이 바뀔 때마다 실행

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    // 1. 브라우저에 저장된 토큰 가져오기 (저장 명칭을 확인하세요: 예: token, accessToken 등)
    const accessToken = localStorage.getItem('accessToken');

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/ai/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // 2. 인증 헤더 추가
          'Authorization': `Bearer ${accessToken}` 
        },
        body: JSON.stringify({ message: userMsg.content }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: '연결 오류가 발생했습니다.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} style={styles.floatingBtn}>
          💬 AI Assistant
        </button>
      )}

      {/* 사이드바 대화창 */}
      <div style={{...styles.sidebar, transform: isOpen ? 'translateX(0)' : 'translateX(100%)'}}>
        <div style={styles.header}>
          <span style={{fontWeight: 'bold'}}>Ulmus AI</span>
          <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>✕</button>
        </div>
        <div style={styles.body}>
          {messages.map((m, i) => (
            <div key={i} style={{...styles.bubble, alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', 
                 backgroundColor: m.role === 'user' ? '#3b82f6' : '#f1f5f9', color: m.role === 'user' ? '#fff' : '#1e293b',
                 whiteSpace: 'pre-wrap', 
                 wordBreak: 'break-word',
                 overflowWrap: 'anywhere'}}>
              {m.content}
            </div>
          ))}
        </div>
        <div style={styles.footer}>
          <input style={styles.input} value={input} onChange={e => setInput(e.target.value)} disabled={isLoading} onKeyDown={e => {
              // 한글 조합 중일 때는 이벤트를 무시합니다.
              if (e.nativeEvent.isComposing) return; 
              
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            placeholder={isLoading ? "생각 중..." : "무엇이든 물어보세요..."}
          />
          <button onClick={sendMessage} style={styles.sendBtn}>Send</button>
        </div>
      </div>
    </>
  );
};

// 스타일은 이전과 비슷하지만 zIndex를 매우 높게(2000 이상) 설정해야 모든 화면 위로 올라옵니다.
const styles = {
  floatingBtn: { position: 'fixed', bottom: '32px', right: '32px', padding: '12px 24px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '50px', cursor: 'pointer', zIndex: 1900, boxShadow: '0 10px 15px rgba(0,0,0,0.1)' },
  sidebar: { position: 'fixed', top: 0, right: 0, width: '350px', height: '100vh', backgroundColor: '#fff', zIndex: 2000, display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease-in-out', boxShadow: '-5px 0 15px rgba(0,0,0,0.1)' },
  header: { padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  body: { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' },
  bubble: { padding: '10px 14px', borderRadius: '15px', maxWidth: '85%', fontSize: '13px' },
  footer: { padding: '15px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '8px' },
  input: { flex: 1, padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' },
  sendBtn: { padding: '8px 15px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  closeBtn: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#94a3b8' }
};

export default AiChat;