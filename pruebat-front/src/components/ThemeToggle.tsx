import useTheme from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      // Usamos tus variables y transiciones para que el botón también cambie de color suavemente
      className="btn rounded-full p-2.5 text-xl bg-surface hover:bg-surface-hover border border-border"
      aria-label="Cambiar tema"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}