
import React from 'react';

const WaveAnimation: React.FC = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-wave inline-block"
    >
      <path d="M2 12c.833 0 1.5-.667 1.5-1.5S2.833 9 2 9s-1.5.667-1.5 1.5S1.167 12 2 12zm5 0c.833 0 1.5-.667 1.5-1.5S7.833 9 7 9s-1.5.667-1.5 1.5S6.167 12 7 12zm5 0c.833 0 1.5-.667 1.5-1.5S12.833 9 12 9s-1.5.667-1.5 1.5S11.167 12 12 12zm5 0c.833 0 1.5-.667 1.5-1.5S17.833 9 17 9s-1.5.667-1.5 1.5S16.167 12 17 12z" fill="currentColor"/>
      <style jsx>{`
        @keyframes wave {
          0% {   transform: scaleY(0.4); }
          20% {  transform: scaleY(1.0); }
          40% {  transform: scaleY(0.5); }
          60% {  transform: scaleY(0.8); }
          80% {  transform: scaleY(0.6); }
          100% { transform: scaleY(0.4); }
        }
        .animate-wave path {
          transform-origin: center bottom;
          animation: wave 1.2s linear infinite;
        }
        .animate-wave path:nth-child(2) {
          animation-delay: 0.1s;
        }
        .animate-wave path:nth-child(3) {
          animation-delay: 0.2s;
        }
        .animate-wave path:nth-child(4) {
          animation-delay: 0.3s;
        }
      `}</style>
    </svg>
  );
};

export default WaveAnimation;