import React from 'react';

const hudStyle = {
  position: 'absolute',
  right: 20,
  bottom: 28,
  zIndex: 120,
  padding: '8px 14px',
  borderRadius: 10,
  background: 'rgba(15,15,15,0.85)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: 'rgba(255,255,255,0.92)',
  fontSize: 13,
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: '0.02em',
  pointerEvents: 'none',
  boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
  opacity: 0,
  transform: 'translateY(6px)',
  transition: 'opacity 0.2s ease, transform 0.2s ease',
};

const hudVisibleStyle = {
  opacity: 1,
  transform: 'translateY(0)',
};

/**
 * 줌 배율을 잠깐 표시 (React Flow onMove에서 zoom 변경 시에만 갱신).
 */
function CanvasZoomHud({ visible, percent }) {
  return (
    <div
      style={{
        ...hudStyle,
        ...(visible ? hudVisibleStyle : {}),
      }}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {percent}%
    </div>
  );
}

export default CanvasZoomHud;
