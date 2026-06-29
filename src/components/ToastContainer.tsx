'use client';

import { useApp } from '@/lib/AppContext';

const typeStyles: Record<string, { bg: string; icon: string }> = {
  success: { bg: 'border-green-500', icon: 'fa-check-circle text-green-500' },
  error: { bg: 'border-red-500', icon: 'fa-exclamation-circle text-red-500' },
  info: { bg: 'border-teal-500', icon: 'fa-info-circle text-teal-500' },
  warning: { bg: 'border-amber-500', icon: 'fa-exclamation-triangle text-amber-500' },
};

export default function ToastContainer() {
  const { state, removeToast } = useApp();

  if (state.toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {state.toasts.map(toast => {
        const style = typeStyles[toast.type] || typeStyles.success;
        return (
          <div
            key={toast.id}
            className={`toast glass border-l-4 ${style.bg} rounded-xl p-4 shadow-2xl pointer-events-auto`}
          >
            <div className="flex items-start gap-3">
              <i className={`fas ${style.icon} text-lg mt-0.5`}></i>
              <p className="flex-1 text-sm text-gray-800 font-medium">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="toast-progress h-full accent-gradient rounded-full"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
