const CosmicLogo = () => (
  <svg viewBox="-20 -20 120 120" fill="none" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 10px rgba(191, 255, 0, 0.4))' }}>
    <g clipPath="url(#clip0_1_3)">
      <g filter="url(#filter0_d_1_3)">
        <path d="M30 50C41.0457 50 50 58.9543 50 70H30C18.9543 70 10 61.0457 10 50V10C21.0457 10 30 18.9543 30 30V50ZM60 10C65.5228 10 70 14.4772 70 20C70 31.0457 61.0457 40 50 40V20C50 14.4772 54.4772 10 60 10Z" fill="#BFFF00"/>
      </g>
    </g>
    <defs>
      <filter id="filter0_d_1_3" x="-20" y="-20" width="120" height="120" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="10"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.74902 0 0 0 0 1 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in="SourceGraphic" result="shape"/>
      </filter>
    </defs>
  </svg>
);

export default CosmicLogo;