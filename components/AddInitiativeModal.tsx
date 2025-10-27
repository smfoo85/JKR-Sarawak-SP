import React, { useState, useEffect, useMemo } from 'react';
import { X, PlusCircle, Calendar } from 'lucide-react';
import type { Initiative } from '../types';

interface AddInitiativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newInitiativeData: Omit<Initiative, 'id'>) => void;
  thrustId: number | null;
  initiatives: Initiative[];
}

// Helper function to format date to DD/MM/YYYY for saving
const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to format date to YYYY-MM-DD for input[type=date]
const formatDateForInput = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

export const AddInitiativeModal: React.FC<AddInitiativeModalProps> = ({ isOpen, onClose, onSave, thrustId, initiatives }) => {
  const [name, setName] = useState('');
  const [plan_start, setPlanStart] = useState('');
  const [plan_end, setPlanEnd] = useState('');
  const [actual_start, setActualStart] = useState('');
  const [actual_end, setActualEnd] = useState('');
  const [progress, setProgress] = useState(0);
  const [code, setCode] = useState('');
  const [responsibleBranch, setResponsibleBranch] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [notes, setNotes] = useState('');

  const uniqueBranches = useMemo(() => {
    const branches = new Set(initiatives.map(i => i.responsibleBranch).filter(Boolean) as string[]);
    return Array.from(branches).sort();
  }, [initiatives]);

  useEffect(() => {
    if (isOpen && thrustId !== null) {
      setName('');
      const today = new Date();
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      setPlanStart(formatDateForInput(today));
      setPlanEnd(formatDateForInput(oneYearFromNow));
      setActualStart('');
      setActualEnd('');
      setProgress(0);
      setResponsibleBranch('');
      setExpectedOutcome('');
      setNotes('');
      
      const thrustInitiatives = initiatives.filter(i => i.thrustId === thrustId);
      const maxSeq = thrustInitiatives.reduce((max, i) => {
        const seq = parseInt(i.id.split('.')[1], 10);
        return !isNaN(seq) && seq > max ? seq : max;
      }, 0);
      const newCode = `I-${thrustId}.${maxSeq + 1}`;
      setCode(newCode);
    }
  }, [isOpen, thrustId, initiatives]);

  if (!isOpen || thrustId === null) {
    return null;
  }

  const handleSave = () => {
    if (!name.trim() || !plan_start || !plan_end) {
        alert("Please fill in Name and Planned dates.");
        return;
    }

    if (new Date(plan_start) >= new Date(plan_end) || (actual_start && actual_end && new Date(actual_start) >= new Date(actual_end))) {
        alert("End dates must be after their corresponding start dates.");
        return;
    }

    let finalNotes: string | undefined = undefined;
    if (notes.trim()) {
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        finalNotes = `[${timestamp}] ${notes.trim()}`;
    }

    onSave({
      thrustId,
      name,
      plan_start: formatDate(new Date(plan_start)),
      plan_end: formatDate(new Date(plan_end)),
      actual_start: actual_start ? formatDate(new Date(actual_start)) : '',
      actual_end: actual_end ? formatDate(new Date(actual_end)) : '',
      progress,
      responsibleBranch,
      expectedOutcome,
      notes: finalNotes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg m-4 transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add New Initiative for Thrust {thrustId}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label htmlFor="initiative-code" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Code</label>
              <input
                id="initiative-code"
                type="text"
                value={code}
                readOnly
                className="mt-1 block w-full bg-gray-100 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="initiative-name" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Initiative Name</label>
              <input
                id="initiative-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="add-responsible-branch" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Responsible Branch</label>
            <select
                id="add-responsible-branch"
                value={responsibleBranch}
                onChange={(e) => setResponsibleBranch(e.target.value)}
                className="mt-1 block w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
            >
                <option value="">-- Select Branch --</option>
                {uniqueBranches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="add-expected-outcome" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Expected Outcome</label>
            <textarea
                id="add-expected-outcome"
                rows={2}
                value={expectedOutcome}
                onChange={(e) => setExpectedOutcome(e.target.value)}
                className="mt-1 block w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="e.g., Sustainable materials adopted in new designs"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label htmlFor="plan-start-date" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Plan Start Date</label>
                <input type="date" id="plan-start-date" value={plan_start} onChange={e => setPlanStart(e.target.value)} className="mt-1 w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"/>
             </div>
             <div>
                <label htmlFor="plan-end-date" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Plan End Date</label>
                <input type="date" id="plan-end-date" value={plan_end} onChange={e => setPlanEnd(e.target.value)} className="mt-1 w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"/>
             </div>
             <div>
                <label htmlFor="actual-start-date" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Actual Start Date</label>
                <input type="date" id="actual-start-date" value={actual_start} onChange={e => setActualStart(e.target.value)} className="mt-1 w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"/>
             </div>
             <div>
                <label htmlFor="actual-end-date" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Actual End Date</label>
                <input type="date" id="actual-end-date" value={actual_end} onChange={e => setActualEnd(e.target.value)} className="mt-1 w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"/>
             </div>
          </div>
          <div>
              <label htmlFor="add-notes" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Initial Notes (Optional)</label>
              <textarea
                  id="add-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 block w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., Initial planning complete, team assigned."
              />
          </div>
          <div>
            <label htmlFor="add-progress-slider" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Initial Progress: <span className="font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
            </label>
            <input
              id="add-progress-slider"
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end p-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 mr-2">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Initiative</span>
          </button>
        </div>
      </div>
    </div>
  );
};