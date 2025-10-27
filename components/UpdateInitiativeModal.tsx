import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import type { Initiative } from '../types';

interface UpdateInitiativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (initiativeId: string, updates: Partial<Initiative>) => void;
  initiative: Initiative | null;
  initiatives: Initiative[];
}

// Helper: DD/MM/YYYY -> YYYY-MM-DD (for input value)
const parseDisplayDate = (dateString: string): string => {
  if (!dateString) return '';
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};

// Helper: YYYY-MM-DD -> DD/MM/YYYY (for display)
const formatDateForDisplay = (isoDate: string): string => {
  if (!isoDate) return '--/--/----';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};


export const UpdateInitiativeModal: React.FC<UpdateInitiativeModalProps> = ({ isOpen, onClose, onSave, initiative, initiatives }) => {
  const [progress, setProgress] = useState(0);
  const [newNote, setNewNote] = useState('');
  const [plan_start, setPlanStart] = useState('');
  const [plan_end, setPlanEnd] = useState('');
  const [actual_start, setActualStart] = useState('');
  const [actual_end, setActualEnd] = useState('');
  const [responsibleBranch, setResponsibleBranch] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [error, setError] = useState('');
  const [dateError, setDateError] = useState('');

  const uniqueBranches = useMemo(() => {
    const branches = new Set(initiatives.map(i => i.responsibleBranch).filter(Boolean) as string[]);
    return Array.from(branches).sort();
  }, [initiatives]);

  useEffect(() => {
    if (initiative) {
      setProgress(initiative.progress);
      setNewNote('');
      setPlanStart(parseDisplayDate(initiative.plan_start));
      setPlanEnd(parseDisplayDate(initiative.plan_end));
      setActualStart(parseDisplayDate(initiative.actual_start));
      setActualEnd(parseDisplayDate(initiative.actual_end));
      setResponsibleBranch(initiative.responsibleBranch || '');
      setExpectedOutcome(initiative.expectedOutcome || '');
      setError('');
      setDateError('');
    }
  }, [initiative]);

  if (!isOpen || !initiative) {
    return null;
  }

  const handleSave = () => {
    if (!newNote.trim()) {
      setError('A new update note is required to save changes.');
      return;
    }
    if (new Date(plan_start) >= new Date(plan_end) || (actual_start && actual_end && new Date(actual_start) >= new Date(actual_end))) {
        setDateError('End dates must be after their corresponding start dates.');
        return;
    }

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const formattedNewNote = `[${timestamp}] ${newNote.trim()}`;
    const updatedNotes = initiative.notes 
        ? `${formattedNewNote}\n-------------------\n${initiative.notes}`
        : formattedNewNote;

    onSave(initiative.id, {
        progress, 
        notes: updatedNotes,
        plan_start: formatDateForDisplay(plan_start),
        plan_end: formatDateForDisplay(plan_end),
        actual_start: formatDateForDisplay(actual_start),
        actual_end: formatDateForDisplay(actual_end),
        responsibleBranch,
        expectedOutcome,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg m-4 transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Update Initiative</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Initiative</p>
            <p className="font-semibold text-gray-800 dark:text-slate-200">{initiative.id}: {initiative.name}</p>
          </div>
          
          <div>
            <label htmlFor="progress-slider" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Progress: <span className="font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
            </label>
            <input
              id="progress-slider"
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div>
            <label htmlFor="update-responsible-branch" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Responsible Branch</label>
            <select
                id="update-responsible-branch"
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
            <label htmlFor="update-expected-outcome" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Expected Outcome</label>
            <textarea
                id="update-expected-outcome"
                rows={3}
                value={expectedOutcome}
                onChange={(e) => setExpectedOutcome(e.target.value)}
                className="mt-1 block w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="e.g., Sustainable materials adopted in new designs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label htmlFor="update-plan-start-date" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Plan Start Date</label>
                <input type="date" id="update-plan-start-date" value={plan_start} onChange={e => { setPlanStart(e.target.value); if (dateError) setDateError(''); }} className="mt-1 w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"/>
             </div>
             <div>
                <label htmlFor="update-plan-end-date" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Plan End Date</label>
                <input type="date" id="update-plan-end-date" value={plan_end} onChange={e => { setPlanEnd(e.target.value); if (dateError) setDateError(''); }} className="mt-1 w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"/>
             </div>
             <div>
                <label htmlFor="update-actual-start-date" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Actual Start Date</label>
                <input type="date" id="update-actual-start-date" value={actual_start} onChange={e => { setActualStart(e.target.value); if (dateError) setDateError(''); }} className="mt-1 w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"/>
             </div>
             <div>
                <label htmlFor="update-actual-end-date" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Actual End Date</label>
                <input type="date" id="update-actual-end-date" value={actual_end} onChange={e => { setActualEnd(e.target.value); if (dateError) setDateError(''); }} className="mt-1 w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"/>
             </div>
          </div>
           {dateError && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center -mt-4">
                <AlertCircle className="w-4 h-4 mr-1" />
                {dateError}
              </p>
            )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Update History
            </label>
            <div className="w-full bg-gray-100 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-md p-3 max-h-32 overflow-y-auto text-xs text-gray-700 dark:text-slate-300">
                {initiative.notes ? (
                    <pre className="whitespace-pre-wrap font-sans">{initiative.notes}</pre>
                ) : (
                    <p className="text-gray-500 italic">No previous updates recorded.</p>
                )}
            </div>
          </div>

          <div>
            <label htmlFor="new-update-note" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Add New Update Note (Required)
            </label>
            <textarea
              id="new-update-note"
              rows={4}
              value={newNote}
              onChange={(e) => {
                setNewNote(e.target.value);
                if (error) setError('');
              }}
              className={`mt-1 block w-full bg-white dark:bg-slate-700 border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 ${
                error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-slate-600'
              }`}
              placeholder="e.g., Phase 1 completed, awaiting stakeholder feedback."
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
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
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};