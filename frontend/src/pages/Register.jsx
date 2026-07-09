import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create account, please try again");
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
          <h1 className="font-display text-2xl text-ink-900">Create your account</h1>
          <p className="mt-1 text-sm text-ink-400">Start tracking your money, simply</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl2 border border-ink-100 bg-white p-6 shadow-card"
        >
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-400">
              Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ada Lovelace"
              className="w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-ink-900"
            />
          </div>
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
              placeholder="At least 6 characters"
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
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-ink-900 underline underline-offset-2">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
