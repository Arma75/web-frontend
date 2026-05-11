import React from 'react';
import { Redo2 } from 'lucide-react';
import './circularAddIconButton.css';

function CircularRedoIconButton({ onRedoClick, disabled = false }) {
  return (
    <button
      className="circular-icon-button"
      type="button"
      onClick={onRedoClick}
      disabled={disabled}
      aria-label="다시 실행"
      title="앞으로가기 (다시 실행)"
    >
      <Redo2 size={18} strokeWidth={2.25} aria-hidden />
    </button>
  );
}

export default CircularRedoIconButton;
