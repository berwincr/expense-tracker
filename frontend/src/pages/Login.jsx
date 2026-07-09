import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to log in, please try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-4 ledger-lines">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-lg bg-ink-900 font-display text-xl text-paper">
            L
          </div>
          <h1 className="font-display text-2xl text-ink-900">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-400">Log in to your ledger</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl2 border border-ink-100 bg-white p-6 shadow-card"
        >
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-400">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-400">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-900"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-rust-50 px-3 py-2 text-sm text-rust-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-ink-900 py-2.5 text-sm font-medium text-paper hover:bg-ink-700 disabled:opacity-60"
          >
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-ink-900 underline underline-offset-2">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
