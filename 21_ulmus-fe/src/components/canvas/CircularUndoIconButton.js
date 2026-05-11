import React from 'react';
import { Undo2 } from 'lucide-react';
import './circularAddIconButton.css';

function CircularUndoIconButton({ onUndoClick, disabled = false }) {
  return (
    <button
      className="circular-icon-button"
      type="button"
      onClick={onUndoClick}
      disabled={disabled}
      aria-label="실행 취소"
      title="뒤로가기 (실행 취소)"
    >
      <Undo2 size={18} strokeWidth={2.25} aria-hidden />
    </button>
  );
}

export default CircularUndoIconButton;
