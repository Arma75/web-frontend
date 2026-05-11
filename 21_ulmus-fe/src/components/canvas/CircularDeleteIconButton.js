import React from 'react';
import { Trash2 } from 'lucide-react';
import './circularAddIconButton.css';

function CircularDeleteIconButton({ onDeleteClick, disabled = false }) {
  return (
    <button
      className="circular-icon-button danger"
      type="button"
      onClick={onDeleteClick}
      disabled={disabled}
      aria-label="선택한 테이블 삭제"
      title="삭제"
    >
      <Trash2 size={18} strokeWidth={2.25} aria-hidden />
    </button>
  );
}

export default CircularDeleteIconButton;
