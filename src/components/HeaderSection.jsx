import { Sun, Moon, ChefHat } from "lucide-react";
import chefLogo from "../assets/chef-claude-icon1.png";

export default function HeaderSection({ darkMode, toggleTheme }) {
  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Glassmorphism bar */}
      <nav className="backdrop-blur-sm bg-transparent dark:bg-gray-900/70 border-b border-amber-200/50 dark:border-amber-900/40 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Brand */}
          <a href="/" className="flex items-center gap-3 group select-none">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md ring-2 ring-amber-400/40 group-hover:ring-amber-500/60 transition-all duration-300 bg-white dark:bg-amber-50 flex items-center justify-center p-0.5">
              <img
                src={chefLogo}
                alt="Chef Claude Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-bold text-xl text-gray-900 dark:text-white tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-200">
                Chef Claude
              </span>
              <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                AI Recipe Generator
              </span>
            </div>
          </a>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark/light mode"
            className="relative w-14 h-7 rounded-full bg-amber-200 dark:bg-gray-700 border border-amber-300 dark:border-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            {/* Track thumb */}
            <span
              className={`absolute top-1 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 shadow-md
                ${darkMode
                  ? "translate-x-8 bg-gray-900"
                  : "translate-x-1 bg-white"
                }
              `}
            >
              {darkMode
                ? <Moon className="w-3 h-3 text-amber-400" />
                : <Sun className="w-3 h-3 text-amber-600" />
              }
            </span>
          </button>

        </div>
      </nav>

      {/* Hero subtitle strip */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 dark:from-amber-700 dark:via-orange-700 dark:to-amber-800 py-3 px-4">
        <p className="text-center text-white text-sm font-medium tracking-wide">
          🍳 Drop your ingredients below — let AI craft your perfect recipe!
        </p>
      </div>
    </header>
  );
}
