import React from "react";
import { UtensilsCrossed, Trash2, ChefHat } from "lucide-react";

export default function IngredientsList({ listItem, setLoader, getRecipe, recipeRef, removeIngredient, darkMode }) {
  if (listItem.length === 0) return null;

  const readyToGenerate = listItem.length > 3;

  return (
    <section className={`w-full max-w-2xl animate-fade-in rounded-3xl p-6 ${
      darkMode
        ? "backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl shadow-black/40"
        : "bg-white/70 border border-amber-100 shadow-xl"
    }`}>

      {/* Section heading */}
      <div className="flex items-center gap-2 mb-4">
        <UtensilsCrossed className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        <h2 className={`text-lg font-bold ${
          darkMode ? "text-white drop-shadow" : "text-gray-800"
        }`}>
          Ingredients on hand
        </h2>
        <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
          {listItem.length}
        </span>
      </div>

      {/* Ingredient chips */}
      <ul className="flex flex-wrap gap-2 mb-6">
        {listItem.map((item) => (
          <li
            key={item}
            className={`group flex items-center gap-2.5 text-base font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 ${
              darkMode
                ? "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
                : "bg-amber-100 border border-amber-200 text-gray-800 hover:bg-amber-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 shrink-0" />
            <span className="capitalize">{item}</span>
            <button
              onClick={() => removeIngredient(item)}
              title={`Remove ${item}`}
              className="text-amber-700 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-150"
              aria-label={`Remove ${item}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>

      {/* Minimum-ingredient hint */}
      {!readyToGenerate && (
        <p className={`text-sm rounded-lg px-4 py-2 mb-4 border ${
          darkMode
            ? "text-amber-200 bg-amber-900/40 backdrop-blur-sm border-amber-500/40"
            : "text-amber-700 bg-amber-50 border-amber-200"
        }`}>
          🥄 Add at least <strong>4 ingredients</strong> to unlock recipe generation ({4 - listItem.length} more to go)
        </p>
      )}

      {/* Get Recipe CTA */}
      {readyToGenerate && (
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in ${
          darkMode
            ? "bg-white/15 backdrop-blur-md border border-white/25 hover:bg-white/20"
            : "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
        }`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shrink-0">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={`font-bold text-base leading-tight ${
                darkMode ? "text-white drop-shadow" : "text-gray-900"
              }`}>
                Ready for a recipe?
              </h3>
              <p className={`text-sm mt-0.5 ${
                darkMode ? "text-amber-200" : "text-gray-500"
              }`}>
                Generate a dish using your {listItem.length} ingredients.
              </p>
            </div>
          </div>
          <button
            ref={recipeRef}
            onClick={() => { setLoader(true); getRecipe(); }}
            className="shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/30 transition-all duration-200 text-sm"
          >
            ✨ Get a Recipe
          </button>
        </div>
      )}
    </section>
  );
}
