import React from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import type { Initiative } from '../types';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  initiative: Initiative | null;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, initiative }) => {
  if (!isOpen || !initiative) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="flex items-center text-lg font-bold text-red-600 dark:text-red-400">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Confirm Deletion
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-slate-300">
            Are you sure you want to delete this initiative? This action cannot be undone.
          </p>
          <div className="mt-4 p-3 bg-gray-100 dark:bg-slate-700/50 rounded-lg border-l-4 border-red-500">
             <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Initiative to be deleted:</p>
             <p className="font-semibold text-gray-800 dark:text-slate-200">{initiative.id}: {initiative.name}</p>
          </div>
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
            className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>Yes, Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
