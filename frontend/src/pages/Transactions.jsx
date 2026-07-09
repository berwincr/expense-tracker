import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";
import TransactionTable from "../components/TransactionTable";
import TransactionModal from "../components/TransactionModal";
import ConfirmDialog from "../components/ConfirmDialog";
import { CATEGORIES } from "../utils/constants";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (category !== "All") params.category = category;
      if (type !== "All") params.type = type;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const { data } = await api.get("/transactions", { params });
      setTransactions(data.transactions);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, type, startDate, endDate]);

  useEffect(() => {
    const timeout = setTimeout(fetchTransactions, 300);
    return () => clearTimeout(timeout);
  }, [fetchTransactions]);

  useEffect(() => {
    setPage(1);
  }, [search, category, type, startDate, endDate]);

  const handleSave = async (form) => {
    if (editing) {
      await api.put(`/transactions/${editing._id}`, form);
    } else {
      await api.post("/transactions", form);
    }
    fetchTransactions();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await api.delete(`/transactions/${deleteTarget._id}`);
    setDeleteTarget(null);
    fetchTransactions();
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setType("All");
    setStartDate("");
    setEndDate("");
  };

  const hasFilters = search || category !== "All" || type !== "All" || startDate || endDate;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink-900">Transactions</h1>
          <p className="mt-1 text-sm text-ink-400">{pagination.total} total records</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-medium text-paper hover:bg-ink-700"
        >
          + Add transaction
        </button>
      </div>

      <div className="rounded-xl2 border border-ink-100 bg-white p-4 shadow-card">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search description or category…"
              className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 outline-none focus:border-ink-900"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 outline-none focus:border-ink-900"
          >
            <option value="All">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 outline-none focus:border-ink-900"
          >
            <option value="All">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-ink-200 px-2 py-2 text-xs text-ink-900 outline-none focus:border-ink-900"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-ink-200 px-2 py-2 text-xs text-ink-900 outline-none focus:border-ink-900"
            />
          </div>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="mt-3 text-xs font-medium text-ink-500 underline underline-offset-2 hover:text-ink-900"
          >
            Clear filters
          </button>
        )}
      </div>

      <TransactionTable
        transactions={transactions}
        loading={loading}
        onEdit={(t) => {
          setEditing(t);
          setModalOpen(true);
        }}
        onDelete={(t) => setDeleteTarget(t)}
      />

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-ink-200 px-3 py-1.5 text-sm text-ink-600 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="font-mono text-sm text-ink-500">
            {pagination.page} / {pagination.pages}
          </span>
          <button
            disabled={page >= pagination.pages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-ink-200 px-3 py-1.5 text-sm text-ink-600 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        initialData={editing}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete transaction?"
        message="This action can't be undone. The transaction will be permanently removed from your ledger."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Transactions;
