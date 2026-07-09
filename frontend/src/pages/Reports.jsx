import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../api/axios";
import { CATEGORY_COLORS, formatCurrency, formatDate } from "../utils/constants";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Reports = () => {
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recent, setRecent] = useState([]);
  const [reportType, setReportType] = useState("expense");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [m, c, r] = await Promise.all([
          api.get("/dashboard/monthly-summary?months=6"),
          api.get(`/dashboard/category-summary?type=${reportType}`),
          api.get("/dashboard/recent?limit=8"),
        ]);
        setSeries(m.data.series);
        setCategories(c.data.categories);
        setRecent(r.data.transactions);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [reportType]);

  const barData = {
    labels: series.map((s) => s.label),
    datasets: [
      {
        label: "Income",
        data: series.map((s) => s.income),
        backgroundColor: "#1B8A5A",
        borderRadius: 4,
        maxBarThickness: 22,
      },
      {
        label: "Expense",
        data: series.map((s) => s.expense),
        backgroundColor: "#C1432C",
        borderRadius: 4,
        maxBarThickness: 22,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", align: "end", labels: { usePointStyle: true, boxWidth: 6 } },
      tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}` } },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: "rgba(16,21,31,0.06)" },
        ticks: { callback: (v) => `₹${v >= 1000 ? `${v / 1000}k` : v}` },
      },
    },
  };

  const doughnutData = {
    labels: categories.map((c) => c.category),
    datasets: [
      {
        data: categories.map((c) => c.total),
        backgroundColor: categories.map((c) => CATEGORY_COLORS[c.category] || "#4A5850"),
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: {
      legend: { position: "bottom", labels: { boxWidth: 8, padding: 12, font: { size: 11 } } },
      tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.parsed)}` } },
    },
  };

  const categoryTotal = categories.reduce((sum, c) => sum + c.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink-900">Reports</h1>
        <p className="mt-1 text-sm text-ink-400">Understand where your money comes from and goes</p>
      </div>

      <div className="rounded-xl2 border border-ink-100 bg-white p-5 shadow-card">
        <h2 className="mb-4 font-display text-lg text-ink-900">Monthly summary</h2>
        <div className="h-72">{!loading && <Bar data={barData} options={barOptions} />}</div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl2 border border-ink-100 bg-white p-5 shadow-card lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg text-ink-900">By category</h2>
            <div className="flex rounded-lg border border-ink-200 p-0.5 text-xs">
              {["expense", "income"].map((t) => (
                <button
                  key={t}
                  onClick={() => setReportType(t)}
                  className={`rounded-md px-2.5 py-1 font-medium capitalize transition-colors ${
                    reportType === t ? "bg-ink-900 text-paper" : "text-ink-500"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-56">
            {!loading && categories.length > 0 && <Doughnut data={doughnutData} options={doughnutOptions} />}
            {!loading && categories.length === 0 && (
              <p className="grid h-full place-items-center text-sm text-ink-400">No data yet</p>
            )}
          </div>
        </div>

        <div className="rounded-xl2 border border-ink-100 bg-white p-5 shadow-card lg:col-span-2">
          <h2 className="mb-4 font-display text-lg text-ink-900">Category breakdown</h2>
          <div className="space-y-3">
            {categories.map((c) => {
              const pct = categoryTotal ? Math.round((c.total / categoryTotal) * 100) : 0;
              return (
                <div key={c.category}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-ink-700">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[c.category] }}
                      />
                      {c.category}
                    </span>
                    <span className="font-mono tabular text-ink-900">{formatCurrency(c.total)}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[c.category] }}
                    />
                  </div>
                </div>
              );
            })}
            {categories.length === 0 && !loading && (
              <p className="py-8 text-center text-sm text-ink-400">No {reportType} data yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl2 border border-ink-100 bg-white p-5 shadow-card">
        <h2 className="mb-4 font-display text-lg text-ink-900">Recent transactions</h2>
        <div className="divide-y divide-ink-50">
          {recent.map((t) => (
            <div key={t._id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[t.category] }}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-800">{t.description || t.category}</p>
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
          {recent.length === 0 && !loading && (
            <p className="py-8 text-center text-sm text-ink-400">No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
