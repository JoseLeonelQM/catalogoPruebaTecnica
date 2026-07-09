import { useEffect, useState } from "react";

// Definimos un tipo estricto para evitar strings aleatorios
type Theme = "light" | "dark";

export default function useTheme() {
  const getInitialTheme = (): Theme => {
    // Si estamos del lado del servidor (SSR con Vite), evitamos errores de referencia
    if (typeof window === "undefined") return "light";

    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved === "light" || saved === "dark") {
      return saved;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    
    // Agrega o quita la clase .dark
    root.classList.toggle("dark", theme === "dark");
    
    // Guarda el tema actual
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
}