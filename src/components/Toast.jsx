import { useState, useEffect } from "react";
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react";

/* shared fade-up style builder */
const fadeUp = (delay) => ({
  animation: `toastTextIn 0.35s ease forwards`,
  animationDelay: delay,
  opacity: 0,
});

/* ── Icons ── */
const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />,
  error:   <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />,
  info:    <Info className="w-5 h-5 text-amber-500 shrink-0" />,
};

const accent = {
  success: "bg-green-500",
  error:   "bg-red-500",
  info:    "bg-amber-500",
};

/* ── Single Toast item with enter/exit animation + progress bar ── */
function ToastItem({ toast, onRemove }) {
  const [exiting, setExiting] = useState(false);

  function dismiss() {
    setExiting(true);
    setTimeout(() => onRemove(toast.id), 280);   // wait for exit anim
  }

  // auto-dismiss
  useEffect(() => {
    const t = setTimeout(dismiss, toast.duration ?? 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`relative flex items-start gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 px-4 pt-3 pb-4 rounded-xl shadow-2xl min-w-[270px] max-w-sm overflow-hidden pointer-events-auto ${
        exiting ? "toast-exit" : "toast-enter"
      }`}
    >
      {/* Icon */}
      <span style={fadeUp("0.05s")}>
        {icons[toast.type] || icons.info}
      </span>

      {/* Message */}
      <span
        className="text-base flex-1 leading-snug pt-0.5"
        style={fadeUp("0.15s")}
      >
        {toast.message}
      </span>

      {/* Close button */}
      <button
        onClick={dismiss}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors shrink-0 mt-0.5"
        aria-label="Dismiss"
        style={fadeUp("0.25s")}
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress bar — shrinks over the toast duration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700 rounded-b-xl overflow-hidden">
        <div
          className={`h-full rounded-b-xl ${accent[toast.type] ?? accent.info}`}
          style={{
            animation: `shrink ${toast.duration ?? 3500}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
}

/* ── Toast container ── */
export default function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  );
}

/* ── Hook ── */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  function addToast(message, type = "info", duration = 3500) {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }

  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return { toasts, addToast, removeToast };
}
