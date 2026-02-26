import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Printer, CheckCheck, ChefHat } from "lucide-react";

export default function ClaudeRecipe({ recipe }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(recipe).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handlePrint() {
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Chef Claude Recipe</title>
      <style>
        body { font-family: Georgia, serif; max-width: 720px; margin: 40px auto; line-height: 1.7; color: #1e1e2f; }
        h1 { color: #d17557; } h2 { color: #b45a3c; } h3 { color: #92400e; }
        li { margin-bottom: 4px; }
      </style></head>
      <body>${recipe.replace(/\n/g, "<br/>")}</body></html>
    `);
    win.document.close();
    win.print();
  }

  return (
    <section
      className="w-full max-w-2xl bg-white dark:bg-gray-900/90 dark:backdrop-blur-xl border border-amber-100 dark:border-white/20 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/50 overflow-hidden animate-fade-in"
      aria-live="polite"
    >
      {/* Recipe Card Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChefHat className="w-6 h-6 text-white" />
          <h2 className="font-display font-bold text-white text-lg tracking-tight">
            Chef Claude Recommends
          </h2>
        </div>
        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            title="Copy recipe"
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 active:bg-white/40 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150"
          >
            {copied
              ? <><CheckCheck className="w-3.5 h-3.5" /> Copied!</>
              : <><Copy className="w-3.5 h-3.5" /> Copy</>
            }
          </button>
          <button
            onClick={handlePrint}
            title="Print recipe"
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 active:bg-white/40 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-amber-200 via-orange-200 to-amber-200 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600" />

      {/* Recipe Content */}
      <div className="px-6 py-5 recipe-prose text-gray-800 dark:text-gray-200 text-base leading-relaxed">
        <ReactMarkdown>{recipe}</ReactMarkdown>
      </div>
    </section>
  );
}
