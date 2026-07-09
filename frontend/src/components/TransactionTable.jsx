import { CATEGORY_COLORS, formatCurrency, formatDate } from "../utils/constants";

const CategoryBadge = ({ category }) => (
  <span
    className="inline-flex items-center gap-1.5 rounded-full border border-ink-100 px-2.5 py-1 text-xs font-medium text-ink-600"
  >
    <span
      className="h-1.5 w-1.5 rounded-full"
      style={{ backgroundColor: CATEGORY_COLORS[category] || "#4A5850" }}
    />
    {category}
  </span>
);

const TransactionTable = ({ transactions, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="grid place-items-center rounded-xl2 border border-ink-100 bg-white py-16 text-ink-400">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink-200 border-t-emerald-600" />
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="rounded-xl2 border border-dashed border-ink-200 bg-white py-16 text-center">
        <p className="font-display text-lg text-ink-700">No transactions yet</p>
        <p className="mt-1 text-sm text-ink-400">
          Add your first income or expense to start building your ledger.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl2 border border-ink-100 bg-white shadow-card">
      {/* Desktop table */}
      <table className="hidden w-full text-left md:table">
        <thead>
          <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
            <th className="px-5 py-3 font-medium">Date</th>
            <th className="px-5 py-3 font-medium">Description</th>
            <th className="px-5 py-3 font-medium">Category</th>
            <th className="px-5 py-3 font-medium text-right">Amount</th>
            <th className="px-5 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t._id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60">
              <td className="whitespace-nowrap px-5 py-3.5 text-sm text-ink-500">{formatDate(t.date)}</td>
              <td className="px-5 py-3.5 text-sm text-ink-800">{t.description || "—"}</td>
              <td className="px-5 py-3.5">
                <CategoryBadge category={t.category} />
              </td>
              <td
                className={`whitespace-nowrap px-5 py-3.5 text-right font-mono text-sm font-semibold tabular ${
                  t.type === "income" ? "text-emerald-600" : "text-rust-600"
                }`}
              >
                {t.type === "income" ? "+" : "−"}
                {formatCurrency(t.amount)}
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEdit(t)}
                    className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                    aria-label="Edit"
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M14.2 3.3a1.7 1.7 0 012.5 2.5L6.5 16 3 17l1-3.5 10.2-10.2z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(t)}
                    className="rounded-md p-1.5 text-ink-400 hover:bg-rust-50 hover:text-rust-600"
                    aria-label="Delete"
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M4 6h12M8 6V4.5A1.5 1.5 0 019.5 3h1A1.5 1.5 0 0112 4.5V6m-6.5 0l.6 9a1.5 1.5 0 001.5 1.4h4.8a1.5 1.5 0 001.5-1.4l.6-9"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="divide-y divide-ink-50 md:hidden">
        {transactions.map((t) => (
          <div key={t._id} className="flex items-center justify-between gap-3 px-4 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink-900">{t.description || t.category}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-ink-400">
                <span>{formatDate(t.date)}</span>
                <span>•</span>
                <CategoryBadge category={t.category} />
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span
                className={`font-mono text-sm font-semibold tabular ${
                  t.type === "income" ? "text-emerald-600" : "text-rust-600"
                }`}
              >
                {t.type === "income" ? "+" : "−"}
                {formatCurrency(t.amount)}
              </span>
              <button onClick={() => onEdit(t)} className="rounded-md p-1.5 text-ink-400" aria-label="Edit">
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                  <path d="M14.2 3.3a1.7 1.7 0 012.5 2.5L6.5 16 3 17l1-3.5 10.2-10.2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={() => onDelete(t)} className="rounded-md p-1.5 text-ink-400" aria-label="Delete">
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                  <path d="M4 6h12M8 6V4.5A1.5 1.5 0 019.5 3h1A1.5 1.5 0 0112 4.5V6m-6.5 0l.6 9a1.5 1.5 0 001.5 1.4h4.8a1.5 1.5 0 001.5-1.4l.6-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionTable;
