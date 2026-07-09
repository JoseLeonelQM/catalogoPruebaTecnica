import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function useTheme() {
  const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") return "light";

    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    return "light";
  };
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  useEffect(() => {
    const root = document.documentElement;
    
    root.classList.toggle("dark", theme === "dark");
    
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };
  return { theme, toggleTheme };
}