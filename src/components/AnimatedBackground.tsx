"use client";
import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const [stars, setStars] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const starElements = Array.from({ length: 40 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-[2px] h-[2px] bg-white rounded-full animate-pulse"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 4}s`,
          opacity: Math.random() * 0.6 + 0.2,
        }}
      />
    ));
    setStars(starElements);
  }, []);

  return <>{stars}</>;
}

export function MoonIcon() {
  return (
    <div className="flex justify-center mb-4 animate-bounce">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-indigo-300 drop-shadow-glow"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M21.75 15.5a9.75 9.75 0 01-12.25-12A10 10 0 1018 21.75a9.63 9.63 0 003.75-6.25z" />
      </svg>
    </div>
  );
}
