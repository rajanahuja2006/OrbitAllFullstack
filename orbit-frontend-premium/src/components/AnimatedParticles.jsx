import React, { useEffect, useState } from "react";

const AnimatedParticles = ({ count = 50 }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
      size: 2 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes floatUp {
          0% { 
            opacity: 1;
            transform: translateY(0) translateX(0);
          }
          100% { 
            opacity: 0;
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
          }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        .particle {
          position: absolute;
          background: radial-gradient(circle, #00ff88, #00ffff);
          border-radius: 50%;
          animation: floatUp var(--duration)s linear var(--delay)s infinite,
                    twinkle var(--twinkle)s ease-in-out var(--delay)s infinite;
        }
      `}</style>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            "--duration": particle.duration,
            "--delay": particle.delay,
            "--twinkle": particle.duration * 0.3,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedParticles;
