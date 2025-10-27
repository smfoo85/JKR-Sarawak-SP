import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, PlusCircle, Trash2, Edit, AlertCircle, Link } from 'lucide-react';
import type { KPI, KPIHistory, Initiative } from '../types';

interface KpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (kpi: KPI) => void;
  kpiInfo: { index: number | null, kpi: KPI | null, isNew: boolean } | null;
  initiatives: Initiative[];
}

// Helper: DD/MM/YYYY -> YYYY-MM-DD (for input[type="date"])
const parseDisplayDate = (dateString: string): string => {
  if (!dateString) return '';
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};

// Helper: YYYY-MM-DD -> DD/MM/YYYY (for saving)
const formatDateForSave = (isoDate: string): string => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

const emptyKpi: KPI = {
  name: '',
  target: '',
  current: '',
  targetValue: 100,
  currentValue: 0,
  history: [],
  plan_start: '',
  plan_end: '',
  actual_start: '',
  actual_end: '',
};

export const KpiModal: React.FC<KpiModalProps> = ({ isOpen, onClose, onSave, kpiInfo, initiatives }) => {
  const [kpiData, setKpiData] = useState<KPI>(emptyKpi);
  const [editingHistoryIndex, setEditingHistoryIndex] = useState<number | null>(null);
  const [currentHistoryEdit, setCurrentHistoryEdit] = useState<KPIHistory | null>(null);
  const [error, setError] = useState('');
  
  const initiativesMap = useMemo(() => new Map(initiatives.map(init => [init.id, init])), [initiatives]);

  const linkedInitiative = useMemo(() => {
    const match = kpiData.name.match(/^(I-\d+\.\d+)/);
    const initiativeId = match ? match[1] : null;
    return initiativeId ? initiativesMap.get(initiativeId) : null;
  }, [kpiData.name, initiativesMap]);


  useEffect(() => {
    if (isOpen) {
      if (kpiInfo?.isNew) {
        setKpiData({ ...emptyKpi });
      } else if (kpiInfo?.kpi) {
        setKpiData(kpiInfo.kpi);
      }
      setError('');
    }
  }, [isOpen, kpiInfo]);

  useEffect(() => {
    if (linkedInitiative) {
        setKpiData(prev => ({
            ...prev,
            target: '100% Complete',
            current: `${linkedInitiative.progress}% Complete`,
            targetValue: 100,
            currentValue: linkedInitiative.progress,
            history: [],
        }));
    }
  }, [linkedInitiative]);


  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('Date')) {
        setKpiData(prev => ({...prev, [name]: formatDateForSave(value)}));
    } else {
        setKpiData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleHistoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentHistoryEdit) {
      const { name, value } = e.target;
      setCurrentHistoryEdit(prev => prev ? { ...prev, [name]: name === 'value' ? Number(value) : value } : null);
    }
  };

  const handleSaveHistory = (idx: number) => {
    if (!currentHistoryEdit) return;
    const newHistory = [...(kpiData.history || [])];
    newHistory[idx] = { ...currentHistoryEdit, value: Number(currentHistoryEdit.value) };
    setKpiData(prev => ({ ...prev, history: newHistory }));
    setEditingHistoryIndex(null);
    setCurrentHistoryEdit(null);
  };
  
  const handleAddHistory = () => {
    const newEntry: KPIHistory = { date: new Date().toISOString().split('T')[0], value: 0 };
    const newHistory = [...(kpiData.history || []), newEntry];
    setKpiData(prev => ({ ...prev, history: newHistory }));
    setEditingHistoryIndex(newHistory.length - 1);
    setCurrentHistoryEdit(newEntry);
  };

  const handleDeleteHistory = (idx: number) => {
    const newHistory = (kpiData.history || []).filter((_, i) => i !== idx);
    setKpiData(prev => ({ ...prev, history: newHistory }));
  };

  const handleSave = () => {
    if (!kpiData.name.trim()) {
        setError('KPI Name is a required field.');
        return;
    }
    const sortedHistory = (kpiData.history || [])
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    onSave({ 
        ...kpiData,
        targetValue: Number(kpiData.targetValue),
        currentValue: Number(kpiData.currentValue),
        history: sortedHistory 
    });
    onClose();
  };


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl m-4 transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{kpiInfo?.isNew ? 'Add New KPI' : 'Edit KPI'}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">KPI Name (Type or select an Initiative to sync)</label>
            <input name="name" value={kpiData.name} onChange={handleInputChange} className="mt-1 w-full bg-white dark:bg-slate-700 p-2 rounded border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-red-500" placeholder="e.g., Public Satisfaction Score" list="initiatives-list" />
            <datalist id="initiatives-list">
              {initiatives.map(init => <option key={init.id} value={`${init.id}: ${init.name}`} />)}
            </datalist>
          </div>
          
          {linkedInitiative && (
            <div className="flex items-center text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 p-2 rounded-md">
               <Link className="w-4 h-4 mr-2 flex-shrink-0" />
               <span>Synced to an initiative. Progress is updated automatically.</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">Current Status (Text)</label>
              <input name="current" value={kpiData.current} onChange={handleInputChange} disabled={!!linkedInitiative} className="mt-1 w-full bg-white dark:bg-slate-700 p-2 rounded border border-gray-300 dark:border-slate-600 disabled:bg-gray-100 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed" placeholder="e.g., 82% Positive"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">Target (Text)</label>
              <input name="target" value={kpiData.target} onChange={handleInputChange} disabled={!!linkedInitiative} className="mt-1 w-full bg-white dark:bg-slate-700 p-2 rounded border border-gray-300 dark:border-slate-600 disabled:bg-gray-100 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed" placeholder="e.g., 85% Positive"/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">Current Value</label>
              <input type="number" name="currentValue" value={kpiData.currentValue} onChange={handleInputChange} disabled={!!linkedInitiative} className="mt-1 w-full bg-white dark:bg-slate-700 p-2 rounded border border-gray-300 dark:border-slate-600 disabled:bg-gray-100 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">Target Value</label>
              <input type="number" name="targetValue" value={kpiData.targetValue} onChange={handleInputChange} disabled={!!linkedInitiative} className="mt-1 w-full bg-white dark:bg-slate-700 p-2 rounded border border-gray-300 dark:border-slate-600 disabled:bg-gray-100 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed" />
            </div>
          </div>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">Plan Start</label>
                <input type="date" name="plan_start" value={parseDisplayDate(kpiData.plan_start || '')} onChange={handleInputChange} className="mt-1 w-full bg-white dark:bg-slate-700 p-2 rounded border border-gray-300 dark:border-slate-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">Plan End</label>
                <input type="date" name="plan_end" value={parseDisplayDate(kpiData.plan_end || '')} onChange={handleInputChange} className="mt-1 w-full bg-white dark:bg-slate-700 p-2 rounded border border-gray-300 dark:border-slate-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">Actual Start</label>
                <input type="date" name="actual_start" value={parseDisplayDate(kpiData.actual_start || '')} onChange={handleInputChange} className="mt-1 w-full bg-white dark:bg-slate-700 p-2 rounded border border-gray-300 dark:border-slate-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-slate-400">Actual End</label>
                <input type="date" name="actual_end" value={parseDisplayDate(kpiData.actual_end || '')} onChange={handleInputChange} className="mt-1 w-full bg-white dark:bg-slate-700 p-2 rounded border border-gray-300 dark:border-slate-600" />
              </div>
            </div>

          <fieldset disabled={!!linkedInitiative} className="pt-4 mt-4 border-t border-gray-200 dark:border-slate-700 group">
            <legend className="text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 px-1 group-disabled:opacity-50">Performance History</legend>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {(kpiData.history || []).map((entry, idx) => (
                    editingHistoryIndex === idx && currentHistoryEdit ? (
                        <div key={idx} className="flex items-center space-x-2 bg-gray-50 dark:bg-slate-700/50 p-2 rounded-lg">
                            <input name="date" type="date" value={currentHistoryEdit.date} onChange={handleHistoryChange} className="w-full text-sm bg-white dark:bg-slate-600 p-1 rounded border border-gray-300 dark:border-slate-500" />
                            <input name="value" type="number" value={currentHistoryEdit.value} onChange={handleHistoryChange} className="w-24 text-sm bg-white dark:bg-slate-600 p-1 rounded border border-gray-300 dark:border-slate-500" />
                            <button onClick={() => handleSaveHistory(idx)} className="p-1.5 rounded-full hover:bg-green-100 dark:hover:bg-green-900 text-green-500" title="Save Entry"><Save className="w-4 h-4" /></button>
                            <button onClick={() => setEditingHistoryIndex(null)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500" title="Cancel"><X className="w-4 h-4" /></button>
                        </div>
                    ) : (
                        <div key={idx} className="flex items-center justify-between group-hover:bg-gray-50 dark:group-hover:bg-slate-700/50 p-2 rounded-lg">
                            <p className="text-sm text-gray-700 dark:text-slate-300"><span className="font-mono">{entry.date}</span> — Value: <span className="font-bold">{entry.value}</span></p>
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100">
                                <button onClick={() => { setEditingHistoryIndex(idx); setCurrentHistoryEdit(entry); }} className="p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-500" title="Edit"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => handleDeleteHistory(idx)} className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    )
                ))}
                {(kpiData.history || []).length === 0 && <p className="text-xs text-center text-gray-400 dark:text-slate-500 py-2">No history data.</p>}
            </div>
            <button type="button" onClick={handleAddHistory} disabled={editingHistoryIndex !== null || !!linkedInitiative} className="w-full mt-2 flex items-center justify-center space-x-2 px-3 py-1.5 text-xs font-semibold rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border border-gray-300 dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed">
                <PlusCircle className="w-4 h-4" />
                <span>Add History Entry</span>
            </button>
            {!!linkedInitiative && (
                <p className="text-xs text-center text-gray-500 dark:text-slate-400 mt-2">
                    History cannot be edited for synced KPIs.
                </p>
            )}
          </fieldset>
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
        </div>

        <div className="flex justify-end p-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 mr-2">
            Cancel
          </button>
          <button onClick={handleSave} className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">
            <Save className="w-4 h-4" />
            <span>Save KPI</span>
          </button>
        </div>
      </div>
    </div>
  );
};