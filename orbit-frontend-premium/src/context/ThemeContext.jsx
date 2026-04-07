import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("app-theme") || "Dark Mode (Default)";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "Light Mode") {
      root.classList.add("light-mode-active");
      localStorage.setItem("app-theme", "Light Mode");
    } else {
      root.classList.remove("light-mode-active");
      localStorage.setItem("app-theme", "Dark Mode (Default)");
    }
  }, [theme]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
