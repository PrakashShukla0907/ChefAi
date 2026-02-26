import { useState } from "react";
import HeaderSection from "./components/HeaderSection";
import MainSection from "./components/MainSection";
import "./styles/MainStyle.css";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div
        className="min-h-screen transition-colors duration-300 dark:bg-gray-950"
        style={
          darkMode
            ? {}
            : {
                background:
                  "radial-gradient(ellipse 90% 40% at 50% 0%, rgba(251,191,36,0.22) 0%, transparent 65%), " +
                  "radial-gradient(ellipse 60% 30% at 80% 80%, rgba(253,186,116,0.15) 0%, transparent 60%), " +
                  "linear-gradient(160deg, #fffbf0 0%, #fef3c7 35%, #fde8b0 65%, #fdf5e0 100%)",
              }
        }
      >
        <HeaderSection darkMode={darkMode} toggleTheme={toggleTheme} />
        <MainSection darkMode={darkMode} />
      </div>
    </div>
  );
}