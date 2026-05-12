// src/components/canvas/CircularDownloadIconButton.js
import React from 'react';
import { Download } from 'lucide-react'; // Download 아이콘 사용
import './circularAddIconButton.css'; // 공통 스타일링을 위한 CSS 파일 (또는 별도 파일)

/**
 * 다운로드 버튼 컴포넌트
 * @param {object} props
 * @param {function} props.onDownloadClick - 다운로드 클릭 시 호출될 함수
 * @param {boolean} [props.disabled=false] - 버튼 비활성화 여부
 */
function CircularDownloadIconButton({ onDownloadClick, disabled = false }) {
  return (
    <button
      className="circular-icon-button success" // 'download' 클래스를 추가하여 스타일 구분
      type="button"
      onClick={onDownloadClick}
      disabled={disabled}
      aria-label="Download ERD" // ARIA 레이블 업데이트
      title="ERD 다운로드" // 툴팁 텍스트 업데이트
    >
      <Download size={22} strokeWidth={2.5} />
    </button>
  );
}

export default CircularDownloadIconButton;