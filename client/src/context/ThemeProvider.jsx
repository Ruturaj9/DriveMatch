import { useState, useEffect } from "react";
import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = ({ children }) => {
  // 🌙 Default to dark theme if nothing saved
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark"; // SSR safety
    const saved = localStorage.getItem("theme");
    if (saved) return saved; // Use saved preference
    return "dark"; // Default to dark if no saved or system preference
  });

  // 🚀 Apply theme instantly (no flicker on load)
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      document.body.style.backgroundColor = "#0d1117"; // rich black
      document.body.style.color = "#c9d1d9";
    } else {
      root.classList.remove("dark");
      document.body.style.backgroundColor = "#f8fafc"; // rich light
      document.body.style.color = "#1e293b";
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 🧠 React to system theme changes dynamically
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem("theme")) {
        // only update if user hasn’t manually toggled
        setTheme(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // 🌗 Toggle Handler
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="transition-colors duration-300">{children}</div>
    </ThemeContext.Provider>
  );
};
