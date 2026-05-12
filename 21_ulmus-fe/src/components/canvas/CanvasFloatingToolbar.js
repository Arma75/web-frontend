import React from 'react';
import CircularAddIconButton from './CircularAddIconButton';
import CircularDeleteIconButton from './CircularDeleteIconButton';
import CircularUndoIconButton from './CircularUndoIconButton';
import CircularRedoIconButton from './CircularRedoIconButton';
import CircularDownloadIconButton from './CircularDownloadIconButton';

const barStyle = {
  position: 'absolute',
  left: '50%',
  bottom: 32,
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: 10,
  borderRadius: 999,
  background: 'rgba(20,20,20,0.88)',
  backdropFilter: 'blur(2px)',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
  zIndex: 100,
};

/**
 * 캔버스 하단 플로팅 툴바
 */
function CanvasFloatingToolbar({
  onAddClick,
  onDeleteClick,
  onUndoClick,
  onRedoClick
}) {
  return (
    <div style={barStyle} role="toolbar" aria-label="Canvas tools">
      <CircularAddIconButton onAddClick={onAddClick} disabled={onAddClick == null} />
      <CircularDownloadIconButton onDeleteClick={onDeleteClick} disabled={onDeleteClick == null} />
      <CircularDeleteIconButton onDeleteClick={onDeleteClick} disabled={onDeleteClick == null} />
      <CircularUndoIconButton onUndoClick={onUndoClick} disabled={onUndoClick == null} />
      <CircularRedoIconButton onRedoClick={onRedoClick} disabled={onRedoClick == null} />
    </div>
  );
}

export default CanvasFloatingToolbar;
