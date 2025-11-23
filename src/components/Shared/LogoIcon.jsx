import React from 'react';

const LogoIcon = () => (
    <div className="w-full h-full animate-float">
        <style>{`
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes spin-coin {
                0% { transform: rotateY(0deg); }
                100% { transform: rotateY(360deg); }
            }
            
            @keyframes pulse-hands {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.8; transform: scale(1.05); }
            }
            
            .animate-float {
                animation: float 3s ease-in-out infinite;
            }
            
            .coin-group {
                transform-origin: 50px 35px;
                animation: spin-coin 4s linear infinite;
            }
            
            .hands-group {
                transform-origin: 50px 60px;
                animation: pulse-hands 2s ease-in-out infinite;
            }
        `}</style>

        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Background: Modern Gradient Circle */}
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" stroke="#cbd5e1" strokeWidth="1" />

            {/* Partnership Hands with Pulse Animation */}
            <g className="hands-group">
                {/* Left Hand (Blue - Trust/Tech) */}
                <path d="M30 55 C30 55 40 45 50 55 L40 70 C30 65 30 55 30 55 Z" fill="#1e3a8a" />
                <path d="M25 60 L40 70 L45 65" fill="none" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

                {/* Right Hand (Gold - Cuan/Profit) */}
                <path d="M70 55 C70 55 60 45 50 55 L60 70 C70 65 70 55 70 55 Z" fill="#eab308" />
                <path d="M75 60 L60 70 L55 65" fill="none" stroke="#eab308" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Rotating Coin */}
            <g className="coin-group">
                <circle cx="50" cy="35" r="12" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                <text x="50" y="40" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">$</text>
            </g>

            {/* Upward Graph Line (Growth) */}
            <path d="M25 50 L40 40 L60 40 L75 25" fill="none" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 2" opacity="0.3" />

            {/* Connection Arc */}
            <path d="M30 75 Q50 85 70 75" fill="none" stroke="#0f2942" strokeWidth="2" strokeLinecap="round" />
        </svg>
    </div>
);

export default LogoIcon;
