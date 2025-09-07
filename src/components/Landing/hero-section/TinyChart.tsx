"use client";

export default function TinyChart({ className = "" }: { className?: string }) {
  // Línea simple para simular el gráfico del hero
  return (
    <svg viewBox="0 0 400 120" className={`w-full h-24 ${className}`} aria-hidden>
      <defs>
        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity=".25" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 90 C60 70 80 95 120 78 C160 60 200 95 240 70 C280 50 320 100 360 80 380 73 390 70 400 68"
            fill="none" stroke="white" strokeOpacity=".85" strokeWidth="2" />
      <path d="M0 100 C60 90 80 110 120 96 C160 85 200 110 240 93 C280 80 320 115 360 95 380 88 390 86 400 84"
            fill="url(#g1)" stroke="white" strokeOpacity=".25" strokeWidth="2" />
    </svg>
  );
}
