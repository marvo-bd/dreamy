import React from 'react';

export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    viewBox="0 0 100 100" 
    xmlns="http://www.w3.org/2000/svg" 
    {...props}
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#c084fc', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
      </linearGradient>
      <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#logoGlow)">
      <path 
        fill="url(#logoGradient)" 
        d="M 50 10 A 40 40 0 1 0 50 90 A 30 30 0 1 1 50 10 Z"
      />
      <path 
        fill="white" 
        d="M 65 35 L 67.5 42.5 L 75 45 L 67.5 47.5 L 65 55 L 62.5 47.5 L 55 45 L 62.5 42.5 Z"
      />
    </g>
  </svg>
);
