import React, { createContext, useState, useContext } from "react";

// 1. Definim Paleta de Culori
const themes = {
  light: {
    background: "#f3f4f6",
    card: "#ffffff",
    text: "#1f2937",
    subtext: "#6b7280",
    iconColor: "#374151",
    budgetCard: "#1e293b", // Rămâne dark și pe light mode pt contrast
  },
  dark: {
    background: "#0f172a", // Albastru foarte închis
    card: "#1e293b",       // Gri-albăstrui închis
    text: "#f1f5f9",       // Alb murdar
    subtext: "#94a3b8",    // Gri deschis
    iconColor: "#f1f5f9",
    budgetCard: "#0f172a", // Mai închis pe dark mode
  }
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = isDarkMode ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};