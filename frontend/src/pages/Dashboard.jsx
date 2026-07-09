import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import api from "../api/axios";
import StatCard from "../components/StatCard";
import { CATEGORY_COLORS, formatCurrency, formatDate } from "../utils/constants";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

function WalletIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path d="M3 6a2 2 0 012-2h9a1 1 0 011 1v1H5a2 2 0 000 4h10v4a1 1 0 01-1 1H5a2 2 0 01-2-2V6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="14" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}
function ArrowUpIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path d="M10 16V4M5 9l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowDownIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path d="M10 4v12M5 11l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <rect x="3" y="4" width="14" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 8h14M7 2.5v3M13 2.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [series, setSeries] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [s, m, r] = await Promise.all([
          api.get("/dashboard/summary"),
          api.get("/dashboard/monthly-summary?months=6"),
          api.get("/dashboard/recent?limit=6"),
        ]);
        setSummary(s.data);
        setSeries(m.data.series);
        setRecent(r.data.transactions);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const chartData = {
    labels: series.map((s) => s.label),
    datasets: [
      {
        label: "Income",
        data: series.map((s) => s.income),
        borderColor: "#1B8A5A",
        backgroundColor: "rgba(27,138,90,0.08)",
        tension: 0.35,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: "#1B8A5A",
      },
      {
        label: "Expense",
        data: series.map((s) => s.expense),
        borderColor: "#C1432C",
        backgroundColor: "rgba(193,67,44,0.06)",
        tension: 0.35,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: "#C1432C",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: { usePointStyle: true, boxWidth: 6, font: { family: "Inter", size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: "IBM Plex Mono", size: 11 } } },
      y: {
        grid: { color: "rgba(16,21,31,0.06)" },
        ticks: {
          font: { family: "IBM Plex Mono", size: 11 },
          callback: (v) => `₹${v >= 1000 ? `${v / 1000}k` : v}`,
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink-900">Dashboard</h1>
          <p className="mt-1 text-sm text-ink-400">Your financial snapshot at a glance</p>
        </div>
        <Link
          to="/transactions"
          className="rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-medium text-paper hover:bg-ink-700"
        >
          + Add transaction
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total balance"
          value={summary?.totalBalance || 0}
          icon={WalletIcon}
          tone="neutral"
          hint="Across all time"
        />
        <StatCard
          label="Total income"
          value={summary?.totalIncome || 0}
          icon={ArrowUpIcon}
          tone="emerald"
          hint="All-time earnings"
        />
        <StatCard
          label="Total expenses"
          value={summary?.totalExpenses || 0}
          icon={ArrowDownIcon}
          tone="rust"
          hint="All-time spending"
        />
        <StatCard
          label="This month's spending"
          value={summary?.monthlySpending || 0}
          icon={CalendarIcon}
          tone="paper"
          hint={new Date().toLocaleString("default", { month: "long", year: "numeric" })}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl2 border border-ink-100 bg-white p-5 shadow-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg text-ink-900">Income vs. expenses</h2>
            <span className="text-xs text-ink-400">Last 6 months</span>
          </div>
          <div className="h-64">
            {!loading && <Line data={chartData} options={chartOptions} />}
          </div>
        </div>

        <div className="rounded-xl2 border border-ink-100 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg text-ink-900">Recent activity</h2>
            <Link to="/transactions" className="text-xs font-medium text-ink-500 hover:text-ink-900">
              View all
            </Link>
          </div>
          <div className="space-y-1">
            {recent.length === 0 && !loading && (
              <p className="py-8 text-center text-sm text-ink-400">No transactions yet</p>
            )}
            {recent.map((t) => (
              <div key={t._id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[t.category] }}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-800">
                      {t.description || t.category}
                    </p>
                    <p className="text-xs text-ink-400">{formatDate(t.date)}</p>
                  </div>
                </div>
                <span
                  className={`shrink-0 font-mono text-sm font-semibold tabular ${
                    t.type === "income" ? "text-emerald-600" : "text-rust-600"
                  }`}
                >
                  {t.type === "income" ? "+" : "−"}
                  {formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
