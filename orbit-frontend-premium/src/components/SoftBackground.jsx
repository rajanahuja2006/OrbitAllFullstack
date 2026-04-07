import React from "react";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

export default function SoftBackground() {
  const { colors } = useTheme();

  return (
    <div 
      className="fixed inset-0 -z-10 overflow-hidden transition-colors duration-1000"
      style={{ backgroundColor: colors.stop1 }}
    >
      <div className="absolute inset-0 mix-blend-screen opacity-90">
        {/* Large central glowing orb */}
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 40, -40, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 h-[45rem] w-[45rem] rounded-full blur-[120px]"
          style={{ backgroundColor: colors.primary, opacity: 0.9 }}
        />
        
        {/* Secondary massive orb bottom right */}
        <motion.div 
          animate={{
            scale: [1, 1.25, 0.9, 1],
            x: [0, -60, 40, 0],
            y: [0, 50, -20, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 right-1/4 h-[40rem] w-[40rem] rounded-full blur-[130px]"
          style={{ backgroundColor: colors.secondary, opacity: 0.8 }}
        />

        {/* Accent orb top right */}
        <motion.div 
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 40, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute -top-20 right-10 h-[30rem] w-[30rem] rounded-full blur-[100px]"
          style={{ backgroundColor: colors.accent, opacity: 0.7 }}
        />

        {/* Dynamic center gradient */}
        <motion.div 
          className="absolute inset-0 transition-opacity duration-1000" 
          style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${colors.bgCenter}, transparent 65%)` }} 
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
