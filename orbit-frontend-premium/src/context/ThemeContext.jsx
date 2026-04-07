import React, { createContext, useState, useEffect, useContext } from 'react';

export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('orbitTheme') || 'purple';
  });

  useEffect(() => {
    localStorage.setItem('orbitTheme', theme);
  }, [theme]);

  // Expose colors to be used everywhere
  const themeColors = {
    purple: {
      primary: 'rgba(124, 58, 237, 0.45)', // Purple
      secondary: 'rgba(56, 189, 248, 0.45)', // Sky blue
      accent: 'rgba(236, 72, 153, 0.25)', // Pink
      bgCenter: 'rgba(99, 102, 241, 0.15)',
      stop1: '#050714'
    },
    green: {
      primary: 'rgba(16, 185, 129, 0.5)', // Emerald green
      secondary: 'rgba(234, 179, 8, 0.45)', // Yellow amber
      accent: 'rgba(20, 184, 166, 0.25)', // Teal
      bgCenter: 'rgba(16, 185, 129, 0.15)',
      stop1: '#021006'
    },
    blue: {
      primary: 'rgba(59, 130, 246, 0.45)', // Deep blue
      secondary: 'rgba(168, 85, 247, 0.45)', // Violet
      accent: 'rgba(14, 165, 233, 0.25)', // Cyan
      bgCenter: 'rgba(59, 130, 246, 0.15)',
      stop1: '#040b17'
    },
    rose: {
      primary: 'rgba(244, 63, 94, 0.45)', // Rose
      secondary: 'rgba(249, 115, 22, 0.45)', // Orange
      accent: 'rgba(236, 72, 153, 0.25)', // Pink
      bgCenter: 'rgba(244, 63, 94, 0.15)',
      stop1: '#170509'
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: themeColors[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}
