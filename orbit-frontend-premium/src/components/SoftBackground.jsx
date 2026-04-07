import React from "react";
import { motion } from "framer-motion";

export default function SoftBackground() {
  const displayColors = { 
    primary: 'rgba(124, 58, 237, 0.7)', 
    secondary: 'rgba(56, 189, 248, 0.7)', 
    accent: 'rgba(236, 72, 153, 0.4)', 
    bgCenter: 'rgba(99, 102, 241, 0.15)', 
    stop1: '#050714' 
  };

  return (
    <div 
      className="fixed inset-0 -z-10 overflow-hidden transition-colors duration-1000"
      style={{ backgroundColor: displayColors.stop1 }}
    >
      <div className="absolute inset-0 mix-blend-screen opacity-90">
        {/* Large central glowing orb */}
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -20, 20, 0],
            y: [0, 20, -20, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 h-[45rem] w-[45rem] rounded-full blur-[120px]"
          style={{ backgroundColor: displayColors.primary, opacity: 0.8 }}
        />
        
        {/* Secondary massive orb bottom right */}
        <motion.div 
          animate={{
            scale: [1, 1.25, 0.9, 1],
            x: [0, 40, -40, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 right-0 h-[40rem] w-[40rem] rounded-full blur-[130px]"
          style={{ backgroundColor: displayColors.secondary, opacity: 0.7 }}
        />

        {/* Accent orb top right */}
        <motion.div 
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 40, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute top-0 right-10 h-[30rem] w-[30rem] rounded-full blur-[100px]"
          style={{ backgroundColor: displayColors.accent, opacity: 0.6 }}
        />

        {/* Dynamic center gradient */}
        <motion.div 
          className="absolute inset-0 transition-opacity duration-1000" 
          style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${displayColors.bgCenter}, transparent 65%)` }} 
        />

        {/* Floating particles (stars) */}
        {[...Array(12)].map((_, idx) => (
          <motion.div
            key={idx}
            className="absolute rounded-full bg-white/70"
            initial={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.1 + Math.random() * 0.3
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.9, 0.1]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3
            }}
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              filter: 'blur(1px)',
              boxShadow: '0 0 10px rgba(255,255,255,0.8)'
            }}
          />
        ))}
      </div>
    </div>
  );
}
