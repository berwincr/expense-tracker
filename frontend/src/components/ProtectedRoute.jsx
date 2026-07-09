import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-paper">
        <div className="flex items-center gap-3 text-ink-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-300 border-t-emerald-600" />
          <span className="font-mono text-sm">Loading your ledger…</span>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
