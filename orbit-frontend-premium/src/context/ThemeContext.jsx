import React, { createContext, useState, useEffect, useContext } from 'react';

export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const THEMES = {
  purple: { primary: 'rgba(124, 58, 237, 0.7)', secondary: 'rgba(56, 189, 248, 0.7)', accent: 'rgba(236, 72, 153, 0.4)', bgCenter: 'rgba(99, 102, 241, 0.15)', stop1: '#050714' },
  green: { primary: 'rgba(16, 185, 129, 0.8)', secondary: 'rgba(234, 179, 8, 0.7)', accent: 'rgba(20, 184, 166, 0.4)', bgCenter: 'rgba(16, 185, 129, 0.15)', stop1: '#021006' },
  blue: { primary: 'rgba(59, 130, 246, 0.7)', secondary: 'rgba(168, 85, 247, 0.7)', accent: 'rgba(14, 165, 233, 0.4)', bgCenter: 'rgba(59, 130, 246, 0.15)', stop1: '#040b17' },
  rose: { primary: 'rgba(244, 63, 94, 0.7)', secondary: 'rgba(249, 115, 22, 0.7)', accent: 'rgba(236, 72, 153, 0.4)', bgCenter: 'rgba(244, 63, 94, 0.15)', stop1: '#170509' },
  sunset: { primary: 'rgba(236, 72, 153, 0.7)', secondary: 'rgba(234, 179, 8, 0.7)', accent: 'rgba(244, 63, 94, 0.4)', bgCenter: 'rgba(249, 115, 22, 0.15)', stop1: '#120502' },
  ocean: { primary: 'rgba(14, 165, 233, 0.7)', secondary: 'rgba(20, 184, 166, 0.7)', accent: 'rgba(37, 99, 235, 0.4)', bgCenter: 'rgba(6, 182, 212, 0.15)', stop1: '#020b12' },
  neon: { primary: 'rgba(217, 70, 239, 0.7)', secondary: 'rgba(132, 204, 22, 0.7)', accent: 'rgba(6, 182, 212, 0.4)', bgCenter: 'rgba(236, 72, 153, 0.15)', stop1: '#0b0212' },
  lava: { primary: 'rgba(239, 68, 68, 0.7)', secondary: 'rgba(249, 115, 22, 0.7)', accent: 'rgba(185, 28, 28, 0.4)', bgCenter: 'rgba(220, 38, 38, 0.15)', stop1: '#120202' },
};

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('orbitTheme') || 'purple';
  });

  useEffect(() => {
    localStorage.setItem('orbitTheme', theme);
  }, [theme]);



  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: THEMES[theme] || THEMES.purple }}>
      {children}
    </ThemeContext.Provider>
  );
}
