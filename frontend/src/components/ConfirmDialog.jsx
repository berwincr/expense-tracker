const ConfirmDialog = ({ open, title, message, onConfirm, onCancel, confirmLabel = "Delete" }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl2 border border-ink-100 bg-white p-6 shadow-card">
        <h3 className="font-display text-lg text-ink-900">{title}</h3>
        <p className="mt-2 text-sm text-ink-500">{message}</p>
        <div className="mt-5 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-ink-200 py-2.5 text-sm font-medium text-ink-600 hover:bg-ink-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-rust-600 py-2.5 text-sm font-medium text-white hover:bg-rust-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
