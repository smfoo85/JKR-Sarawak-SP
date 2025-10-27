import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  confirmButtonClass?: string;
}

export const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title,
  children,
  confirmText = 'Confirm',
  confirmButtonClass = 'bg-red-600 hover:bg-red-700'
}) => {
  if (!isOpen) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="flex items-center text-lg font-bold text-gray-900 dark:text-white">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
            {title}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="p-6 text-sm text-gray-600 dark:text-slate-300">
            {children}
        </div>

        <div className="flex justify-end p-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 mr-2">
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm ${confirmButtonClass}`}
          >
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};