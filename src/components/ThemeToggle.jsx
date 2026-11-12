import Icon from "./Icon";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`btn-outline h-10 w-10 px-0 transition hover:border-brand hover:text-brand ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Icon
        name={isDark ? "sun" : "moon"}
        className={`h-5 w-5 transition-transform duration-300 ${isDark ? "rotate-0 text-amber-400" : "-rotate-12 text-mute hover:text-ink"}`}
      />
    </button>
  );
}
