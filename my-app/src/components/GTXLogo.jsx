import React from "react";

function GTXLogo({ className = "h-12 w-auto" }) {
  return (
    <svg viewBox="0 0 220 70" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="GTX Agency" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="gtx-chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#f0f5ff"/>
          <stop offset="20%"  stopColor="#c8d8f2"/>
          <stop offset="46%"  stopColor="#6878b0"/>
          <stop offset="65%"  stopColor="#ccd8f4"/>
          <stop offset="100%" stopColor="#3848a0"/>
        </linearGradient>
        <linearGradient id="gtx-beam" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%"   stopColor="#9933ff" stopOpacity="0.1"/>
          <stop offset="25%"  stopColor="#4466ff"/>
          <stop offset="50%"  stopColor="#00ccff"/>
          <stop offset="75%"  stopColor="#9933ff"/>
          <stop offset="100%" stopColor="#cc44ff" stopOpacity="0.1"/>
        </linearGradient>
        <linearGradient id="gtx-ring" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#4466ff" stopOpacity="0"/>
          <stop offset="15%"  stopColor="#4466ff" stopOpacity="0.9"/>
          <stop offset="42%"  stopColor="#00ccff"/>
          <stop offset="70%"  stopColor="#9933ff" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#cc44ff" stopOpacity="0"/>
        </linearGradient>
        <filter id="gtx-3d" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#00001a" floodOpacity="0.95"/>
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#3355ff" floodOpacity="0.28"/>
        </filter>
        <filter id="gtx-bf" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="gtx-df" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <style>{`
        @keyframes gtxbp{0%,100%{opacity:.5}50%{opacity:1}}
        @keyframes gtxgp{0%,100%{opacity:.88}50%{opacity:1}}
        .gtx-bl{animation:gtxbp 2.5s ease-in-out infinite}
        .gtx-tl{animation:gtxgp 3s ease-in-out infinite}
      `}</style>
      <ellipse cx="110" cy="35" rx="105" ry="21" fill="none" stroke="url(#gtx-ring)" strokeWidth="1.5" opacity="0.78"/>
      <circle r="3" fill="#4d9fff" filter="url(#gtx-df)">
        <animateMotion dur="7s" repeatCount="indefinite"><mpath href="#gtx-op"/></animateMotion>
      </circle>
      <circle r="2" fill="#cc44ff" filter="url(#gtx-df)">
        <animateMotion dur="7s" begin="-3.5s" repeatCount="indefinite"><mpath href="#gtx-op"/></animateMotion>
      </circle>
      <path id="gtx-op" d="M215,35 a105,21 0 1,0 -0.001,0" fill="none"/>
      <text x="12" y="55" fontFamily="'Arial Black',Impact,sans-serif" fontSize="50" fontWeight="900" fill="#000018" letterSpacing="-2" opacity="0.6">GTX</text>
      <text x="9" y="52" fontFamily="'Arial Black',Impact,sans-serif" fontSize="50" fontWeight="900" fill="url(#gtx-chrome)" filter="url(#gtx-3d)" letterSpacing="-2" className="gtx-tl">GTX</text>
      <line x1="78" y1="3" x2="205" y2="67" stroke="url(#gtx-beam)" strokeWidth="3.5" strokeLinecap="round" filter="url(#gtx-bf)" className="gtx-bl"/>
    </svg>
  );
}

export default GTXLogo;
