import React from "react";
import { Plus, Sparkles } from "lucide-react";
import IngredientsList from "./Ingredients.jsx";
import ClaudeRecipe from "./ClaudeRecipe.jsx";
import { getRecipeFromMistral } from "./ai.js";
import Loader from "./Loader.jsx";
import Toast, { useToast } from "./Toast.jsx";
import ThreeBackground from "./ThreeBackground.jsx";

export default function MainSection({ darkMode }) {
  const [ingredients, setIngredients] = React.useState([]);
  const [recipe, setRecipe] = React.useState("");
  const [loader, setLoader] = React.useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const recipeSection = React.useRef(null);
  const loaderRef = React.useRef(null);

  React.useEffect(() => {
    if (recipe !== "" && recipeSection.current !== null) {
      recipeSection.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [recipe]);

  React.useEffect(() => {
    if (loader && loaderRef.current !== null) {
      loaderRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [loader]);

  async function getRecipe() {
    setRecipe("");
    try {
      const recipeMarkdown = await getRecipeFromMistral(ingredients);
      setRecipe(recipeMarkdown);
      addToast(
        recipeMarkdown && "🍽️ Recipe generated",
        "success"
      );
    } catch (err) {
      addToast("⚠️ Failed to fetch recipe. Please try again.", "error");
    } finally {
      setLoader(false);
    }
  }

  function addIngredients(formData) {
    const raw = formData.get("ingredient")?.trim();
    if (!raw) {
      addToast("⚠️ Please enter an ingredient before adding.", "error");
      return;
    }
    const duplicate = ingredients.some(
      (item) => item.toLowerCase() === raw.toLowerCase()
    );
    if (duplicate) {
      addToast(`❌ "${raw}" is already in your list!`, "error");
      return;
    }
    setIngredients((prev) => [...prev, raw]);
    addToast(`✅ "${raw}" added!`, "success", 2000);
  }

  function removeIngredient(itemToRemove) {
    setIngredients((prev) => prev.filter((item) => item !== itemToRemove));
    addToast(`Removed "${itemToRemove}"`, "info", 1800);
  }

  return (
    <>
      {/* Three.js animated background — dark mode only */}
      {darkMode && <ThreeBackground />}

      {/* Toast overlay */}
      <Toast toasts={toasts} removeToast={removeToast} />

      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-10 flex flex-col items-center gap-8">

        {/* Page hero */}
        <div className={`w-full text-center animate-fade-in rounded-3xl px-6 py-8 ${
          darkMode
            ? "backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl shadow-black/40"
            : "bg-white/70 border border-amber-100 shadow-xl"
        }`}>
          <div className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full mb-3 border ${
            darkMode
              ? "bg-amber-400/20 text-amber-200 border-amber-400/30"
              : "bg-amber-100 text-amber-700 border-amber-200"
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Mistral AI
          </div>
          <h1 className={`font-display text-3xl sm:text-4xl font-bold leading-tight ${
            darkMode ? "text-white drop-shadow-lg" : "text-gray-900"
          }`}>
            What's in your kitchen?
          </h1>
          <p className={`mt-2 text-sm sm:text-base max-w-sm mx-auto ${
            darkMode ? "text-amber-100/80" : "text-gray-500"
          }`}>
            Add the ingredients you have and our AI chef will craft a delicious recipe just for you.
          </p>
        </div>

        {/* Add ingredient form */}
        <form
          action={addIngredients}
          className="w-full flex gap-2 animate-slide-up"
        >
          <div className="relative flex-1">
            <input
              type="text"
              aria-label="Add ingredient"
              placeholder="e.g. garlic, tomatoes, basil…"
              name="ingredient"
              className={`w-full border-2 rounded-xl px-4 py-3 text-sm outline-none shadow-sm transition-all duration-200 ${
                darkMode
                  ? "bg-white/15 backdrop-blur-md border-white/25 focus:border-amber-400 text-white placeholder-white/50 focus:shadow-amber-400/40"
                  : "bg-white border-amber-200 focus:border-amber-500 text-gray-800 placeholder-gray-400 focus:shadow-amber-200/50"
              }`}
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-amber-400/30 transition-all duration-200 text-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </form>

        {/* Empty state */}
        {ingredients.length === 0 && (
          <div className={`text-center animate-fade-in rounded-3xl px-6 py-8 ${
            darkMode
              ? "backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl"
              : "bg-white/70 border border-amber-100 shadow-md"
          }`}>
            <div className="text-5xl mb-3">🥗</div>
            <p className={`text-sm ${
              darkMode ? "text-white/70" : "text-gray-400"
            }`}>
              Your ingredient list is empty.<br />Start adding ingredients above!
            </p>
          </div>
        )}

        {/* Ingredients list */}
        <IngredientsList
          listItem={ingredients}
          setLoader={setLoader}
          getRecipe={getRecipe}
          recipeRef={recipeSection}
          removeIngredient={removeIngredient}
          darkMode={darkMode}
        />

        {/* Loader */}
        {loader && (
          <div ref={loaderRef} className="w-full">
            <Loader />
          </div>
        )}

        {/* Recipe output */}
        {recipe && (
          <div ref={recipeSection} className="w-full">
            <ClaudeRecipe recipe={recipe} />
          </div>
        )}

        {/* Footer spacing */}
        <div className="h-10" />
      </main>
    </>
  );
}
