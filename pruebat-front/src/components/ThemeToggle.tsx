import useTheme from "../hooks/useTheme";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="btn rounded-xl p-2.5 bg-(--color-surface-hover) text-(--color-text) hover:bg-(--color-bg) border border-(--color-border) transition-all duration-300 flex items-center justify-center cursor-pointer group"
      aria-label="Cambiar tema"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-500 transition-transform duration-300 group-hover:rotate-45" strokeWidth={2.5} />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300 group-hover:-rotate-12" strokeWidth={2.5} />
      )}
    </button>
  );
}