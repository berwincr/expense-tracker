import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: DashboardIcon },
  { to: "/transactions", label: "Transactions", icon: TransactionsIcon },
  { to: "/reports", label: "Reports", icon: ReportsIcon },
];

function DashboardIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <rect x="2.5" y="2.5" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11.5" y="2.5" width="6" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2.5" y="11" width="6" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11.5" y="14" width="6" height="3.5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function TransactionsIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path d="M3 6.5h11M3 6.5l3-3M3 6.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 13.5H6M17 13.5l-3-3M17 13.5l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ReportsIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path d="M3 17V9M9.5 17V3M16 17v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initials = (user?.name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-paper">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-ink-100 bg-paper px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-ink-900 font-display text-sm text-paper">L</div>
          <span className="font-display text-lg text-ink-900">Ledger</span>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-md border border-ink-200 p-2 text-ink-700"
          aria-label="Toggle menu"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="mx-auto flex max-w-[1400px]">
        {/* Sidebar */}
        <aside
          className={`${
            mobileOpen ? "block" : "hidden"
          } w-full shrink-0 border-b border-ink-100 bg-paper px-4 py-4 md:block md:w-64 md:border-b-0 md:border-r md:px-5 md:py-8`}
        >
          <div className="mb-8 hidden items-center gap-2 md:flex">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-ink-900 font-display text-lg text-paper">L</div>
            <div>
              <p className="font-display text-xl leading-none text-ink-900">Ledger</p>
              <p className="mt-1 text-xs text-ink-400">Personal finance</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-ink-900 text-paper"
                      : "text-ink-600 hover:bg-ink-100"
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 flex items-center gap-3 rounded-lg border border-ink-100 p-3 md:mt-auto">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 font-mono text-sm font-semibold text-emerald-700">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink-900">{user?.name}</p>
              <p className="truncate text-xs text-ink-400">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="rounded-md p-1.5 text-ink-400 hover:bg-rust-50 hover:text-rust-600"
            >
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7.5 17H4.5A1.5 1.5 0 013 15.5v-11A1.5 1.5 0 014.5 3h3M13 14l4-4-4-4M17 10H7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
