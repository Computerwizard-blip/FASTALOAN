/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Smartphone, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MpesaNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  message: string;
}

export default function MpesaSimNotification({
  isVisible,
  onClose,
  message,
}: MpesaNotificationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="mpesa-push"
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-4 right-4 z-50 w-full max-w-sm bg-slate-905 bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl p-4.5 font-sans overflow-hidden"
        >
          {/* Header row resembling mobile notification banner */}
          <div className="flex justify-between items-center text-slate-500 text-[10px] uppercase font-mono pb-2 border-b border-slate-800">
            <span className="flex items-center gap-1.5 font-bold text-emerald-400">
              <MessageSquare className="h-4 w-4" />
              <span>M-PESA / SAFARICOM</span>
            </span>
            <div className="flex items-center gap-2">
              <span>9:46 AM</span>
              <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* SMS Body */}
          <div className="pt-3 space-y-2">
            <p className="text-xs font-mono leading-relaxed text-slate-200">
              {message}
            </p>
            <div className="flex justify-end pt-1">
              <span className="text-[9px] font-mono text-slate-500 italic">Simulated Carrier Push</span>
            </div>
          </div>

          {/* Green accent line on card side */}
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-emerald-500"></div>
          
        </motion.div>
      )}
    </AnimatePresence>
  );
}
