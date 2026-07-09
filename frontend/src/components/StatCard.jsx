import { formatCurrency } from "../utils/constants";

const toneStyles = {
  neutral: { bg: "bg-ink-900", text: "text-paper", sub: "text-ink-300" },
  emerald: { bg: "bg-emerald-500", text: "text-white", sub: "text-emerald-50" },
  rust: { bg: "bg-rust-500", text: "text-white", sub: "text-rust-50" },
  paper: { bg: "bg-white", text: "text-ink-900", sub: "text-ink-400" },
};

const StatCard = ({ label, value, icon: Icon, tone = "paper", hint }) => {
  const t = toneStyles[tone];
  return (
    <div
      className={`relative overflow-hidden rounded-xl2 border border-ink-100 p-5 shadow-card ${t.bg} ${
        tone === "paper" ? "" : "ledger-lines"
      }`}
    >
      <div className="flex items-start justify-between">
        <p className={`text-xs font-medium uppercase tracking-wide ${t.sub}`}>{label}</p>
        {Icon && (
          <div className={`grid h-8 w-8 place-items-center rounded-md ${
            tone === "paper" ? "bg-ink-100 text-ink-700" : "bg-white/15 text-white"
          }`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <p className={`mt-3 font-mono text-2xl font-semibold tabular ${t.text}`}>
        {formatCurrency(value)}
      </p>
      {hint && <p className={`mt-1 text-xs ${t.sub}`}>{hint}</p>}
    </div>
  );
};

export default StatCard;
