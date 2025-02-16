// CircularWaveAnimation.tsx
import React from 'react';

const CircularWaveAnimation: React.FC = () => {
    return (
        <svg
            width="48" // Increased size for better visibility in modal
            height="48"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            className="animate-circular-wave"
        >
            <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.3">
                <animate attributeName="r" values="4;12;4" dur="1.5s" repeatCount="indefinite" begin="0s" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="1.5s" repeatCount="indefinite" begin="0s" />
            </circle>
            <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.3">
                <animate attributeName="r" values="4;12;4" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
            </circle>
            <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.3">
                <animate attributeName="r" values="4;12;4" dur="1.5s" repeatCount="indefinite" begin="1s" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="1.5s" repeatCount="indefinite" begin="1s" />
            </circle>
        </svg>
    );
};

export default CircularWaveAnimation;