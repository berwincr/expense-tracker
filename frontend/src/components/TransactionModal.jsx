import { useEffect, useState } from "react";
import { CATEGORIES } from "../utils/constants";

const emptyForm = {
  type: "expense",
  amount: "",
  category: "Food",
  description: "",
  date: new Date().toISOString().slice(0, 10),
};

const TransactionModal = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        type: initialData.type,
        amount: initialData.amount,
        category: initialData.category,
        description: initialData.description || "",
        date: new Date(initialData.date).toISOString().slice(0, 10),
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.amount || Number(form.amount) <= 0) {
      setError("Enter an amount greater than 0");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ ...form, amount: Number(form.amount) });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong, please try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 p-0 backdrop-blur-sm md:items-center md:p-4">
      <div className="w-full max-w-md rounded-t-2xl border border-ink-100 bg-white p-6 shadow-card md:rounded-xl2">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl text-ink-900">
            {initialData ? "Edit transaction" : "Add transaction"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {["expense", "income"].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setForm((f) => ({ ...f, type: t }))}
                className={`rounded-lg border py-2.5 text-sm font-medium capitalize transition-colors ${
                  form.type === t
                    ? t === "income"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-rust-500 bg-rust-50 text-rust-700"
                    : "border-ink-200 text-ink-500 hover:bg-ink-50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-400">
              Amount
            </label>
            <div className="flex items-center rounded-lg border border-ink-200 focus-within:border-ink-900">
              <span className="pl-3 font-mono text-ink-400">₹</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.amount}
                onChange={handleChange("amount")}
                placeholder="0.00"
                className="w-full rounded-lg bg-transparent px-2 py-2.5 font-mono text-ink-900 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-400">
                Category
              </label>
              <select
                value={form.category}
                onChange={handleChange("category")}
                className="w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-900"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-400">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={handleChange("date")}
                className="w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-400">
              Description (optional)
            </label>
            <input
              type="text"
              value={form.description}
              onChange={handleChange("description")}
              placeholder="e.g. Grocery run at the market"
              maxLength={200}
              className="w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-900"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-rust-50 px-3 py-2 text-sm text-rust-700">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-ink-200 py-2.5 text-sm font-medium text-ink-600 hover:bg-ink-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-ink-900 py-2.5 text-sm font-medium text-paper hover:bg-ink-700 disabled:opacity-60"
            >
              {submitting ? "Saving…" : initialData ? "Save changes" : "Add transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
