import { useState, useEffect } from "react";

const COOKING_TIPS = [
  "Chopping vegetables...",
  "Preheating the oven...",
  "Seasoning to perfection...",
  "Simmering the sauce...",
  "Consulting the recipe book...",
  "Tasting for flavor...",
  "Plating the dish...",
  "Almost ready! 🍽️",
];

export default function Loader() {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % COOKING_TIPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-10 animate-fade-in">
      {/* Spinner */}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-amber-200 dark:border-gray-700" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-500 border-r-orange-400 animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-xl">
          🍳
        </span>
      </div>

      {/* Rotating tip */}
      <div className="text-center">
        <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 animate-pulse-soft transition-all duration-500">
          {COOKING_TIPS[tipIndex]}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Our AI chef is crafting your recipe…
        </p>
      </div>

      {/* Dot trail */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-amber-400 dark:bg-amber-600"
            style={{ animation: `bounceSm 1s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}
