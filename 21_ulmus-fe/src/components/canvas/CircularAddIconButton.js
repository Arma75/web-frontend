import React from 'react';
import { Plus } from 'lucide-react';
import './circularAddIconButton.css';

function CircularAddIconButton({ onAddClick, disabled = false }) {
  return (
    <button
      className="circular-icon-button primary"
      type="button"
      onClick={onAddClick}
      disabled={disabled}
      aria-label="Add ERD table"
      title="테이블 추가"
    >
      <Plus size={22} strokeWidth={2.5} />
    </button>
  );
}

export default CircularAddIconButton;
