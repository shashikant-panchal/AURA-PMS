import React from 'react';
import { usePmsStore } from '../../store/usePmsStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const Notifications: React.FC = () => {
  const { toasts, removeToast } = usePmsStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Info className="w-4 h-4 text-[#B48C36]" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-emerald-200 bg-white text-stone-900 shadow-soft-luxury-lg';
      case 'warning':
        return 'border-amber-200 bg-white text-stone-900 shadow-soft-luxury-lg';
      case 'error':
        return 'border-rose-200 bg-white text-stone-900 shadow-soft-luxury-lg';
      default:
        return 'border-[#B48C36]/30 bg-white text-stone-900 shadow-soft-luxury-lg';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-md flex items-start gap-3.5 relative ${getBorderColor(
              toast.type
            )}`}
          >
            <div className="mt-0.5">{getIcon(toast.type)}</div>
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p className="text-xs font-serif font-bold text-stone-900">{toast.title}</p>
                <span className="text-[10px] font-mono text-stone-400">{toast.timestamp}</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
