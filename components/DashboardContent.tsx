import React, { useState, useEffect, useMemo } from 'react';
import type { KPI, Initiative, StrategicThrust, KPIHistory } from '../types';
import { Edit, Save, X, PlusCircle, Trash2, Link, Link2Off, TrendingUp, AlertTriangle, CheckCircle, BarChartHorizontal, Activity, Search } from 'lucide-react';
import { RadialProgress } from './RadialProgress';
import { KpiTrendGraph } from './KpiTrendGraph';

interface KpiCardProps {
    kpi: any; // Using `any` because it's a derived KPI object with extra fields
    index: number;
    isAdminMode: boolean;
    onUpdate: (index: number, updatedKpi: KPI) => void;
    onDelete: (index: number) => void;
    initiatives: Initiative[];
}

const KpiCard: React.FC<KpiCardProps> = ({ kpi, index, isAdminMode, onUpdate, onDelete, initiatives }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<KPI>(kpi);
    const [editingHistoryIndex, setEditingHistoryIndex] = useState<number | null>(null);
    const [currentHistoryEdit, setCurrentHistoryEdit] = useState<KPIHistory | null>(null);

    const initiativesIdMap = useMemo(() => new Map(initiatives.map(init => [init.id, init])), [initiatives]);

    const linkedInitiative = useMemo(() => {
        const match = editData.name.match(/^(I-\d+\.\d+)/);
        const initiativeId = match ? match[1] : null;
        return initiativeId ? initiativesIdMap.get(initiativeId) : null;
    }, [editData.name, initiativesIdMap]);
    
    const isCurrentlyLinked = !!linkedInitiative;

    // Reset form state if the kpi prop changes (e.g., from parent re-render)
    useEffect(() => {
        setEditData(kpi);
        if (kpi.name === "New KPI") {
            setIsEditing(true);
        } else {
            setIsEditing(false);
        }
    }, [kpi]);

    const handleSave = () => {
        // Sort history by date before saving
        const sortedHistory = (editData.history || [])
            .map(h => ({ ...h, value: Number(h.value) })) // Ensure value is a number
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        onUpdate(index, {
            ...editData,
            targetValue: Number(editData.targetValue),
            currentValue: Number(editData.currentValue),
            history: sortedHistory,
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        if (kpi.name === "New KPI") onDelete(index);
        else {
            setEditData(kpi);
            setIsEditing(false);
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'name') {
            const match = value.match(/^(I-\d+\.\d+)/);
            const initiativeId = match ? match[1] : null;
            const newLinkedInitiative = initiativeId ? initiativesIdMap.get(initiativeId) : null;
            
            const wasLinked = !!linkedInitiative;
            const isNowLinked = !!newLinkedInitiative;

            if (isNowLinked) {
                // If linking or switching links, update to new initiative's data
                setEditData({
                    ...editData,
                    name: value,
                    current: `${newLinkedInitiative.progress}% Complete`,
                    target: "100% Complete",
                    currentValue: newLinkedInitiative.progress,
                    targetValue: 100,
                });
            } else if (wasLinked && !isNowLinked) {
                // If unlinking, revert to original prop values
                setEditData({
                    ...editData,
                    name: value,
                    current: kpi.current,
                    target: kpi.target,
                    currentValue: kpi.currentValue,
                    targetValue: kpi.targetValue,
                });
            } else {
                // A normal change for a manual KPI
                setEditData({ ...editData, [name]: value });
            }
        } else {
            // A change to a field other than 'name'
            setEditData({ ...editData, [name]: value });
        }
    };

    // History Editing Handlers
    const handleEditHistoryClick = (idx: number) => {
        setEditingHistoryIndex(idx);
        setCurrentHistoryEdit({ ...(editData.history?.[idx] as KPIHistory) });
    };

    const handleCancelHistoryEdit = () => {
        setEditingHistoryIndex(null);
        setCurrentHistoryEdit(null);
    };

    const handleSaveHistoryEdit = (idx: number) => {
        if (!currentHistoryEdit) return;
        const newHistory = [...(editData.history || [])];
        newHistory[idx] = { ...currentHistoryEdit, value: Number(currentHistoryEdit.value) };
        setEditData(prev => ({ ...prev, history: newHistory }));
        setEditingHistoryIndex(null);
        setCurrentHistoryEdit(null);
    };

    const handleDeleteHistory = (idx: number) => {
        const newHistory = (editData.history || []).filter((_, i) => i !== idx);
        setEditData(prev => ({ ...prev, history: newHistory }));
    };

    const handleAddHistory = () => {
        const lastValue = editData.history && editData.history.length > 0
            ? editData.history[editData.history.length - 1].value
            : editData.currentValue;

        const newEntry: KPIHistory = {
            date: new Date().toISOString().split('T')[0],
            value: lastValue
        };
        const newHistory = [...(editData.history || []), newEntry];
        setEditData(prev => ({ ...prev, history: newHistory }));
        setEditingHistoryIndex(newHistory.length - 1);
        setCurrentHistoryEdit(newEntry);
    };

    const percentage = kpi.percentage;
    
    const status = useMemo(() => {
        if (percentage === 100) {
            return {
                label: 'Completed',
                icon: CheckCircle,
                textColor: 'text-blue-500',
                borderColor: 'border-blue-500',
                bgColor: 'bg-blue-100 dark:bg-blue-900/30',
                badgeTextColor: 'text-blue-700 dark:text-blue-300'
            };
        }
        if (percentage >= 50) {
            return {
                label: 'On Track',
                icon: TrendingUp,
                textColor: 'text-green-500',
                borderColor: 'border-green-500',
                bgColor: 'bg-green-100 dark:bg-green-900/30',
                badgeTextColor: 'text-green-700 dark:text-green-300'
            };
        }
        return {
            label: 'At Risk',
            icon: AlertTriangle,
            textColor: 'text-yellow-500',
            borderColor: 'border-yellow-500',
            bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
            badgeTextColor: 'text-yellow-700 dark:text-yellow-300'
        };
    }, [percentage]);

    if (isEditing) {
        return (
            <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-t-4 border-red-500 ring-2 ring-red-500 dark:ring-red-400">
                <div className="absolute top-2 right-2 flex space-x-1">
                    <button onClick={handleSave} className="p-1.5 rounded-full hover:bg-green-100 dark:hover:bg-green-900 text-green-500" title="Save"><Save className="w-4 h-4" /></button>
                    <button onClick={handleCancel} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500" title="Cancel"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-slate-400">KPI Name (from Initiative or Custom)</label>
                        <input name="name" value={editData.name} onChange={handleInputChange} className="w-full bg-white dark:bg-slate-700 p-1 rounded border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-red-500" list="initiatives-list" placeholder="Select or type a custom KPI" />
                        <datalist id="initiatives-list">{initiatives.map(init => <option key={init.id} value={`${init.id}: ${init.name}`} />)}</datalist>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-slate-400">Current Status (Text)</label>
                        <input name="current" value={editData.current} onChange={handleInputChange} disabled={isCurrentlyLinked} className="w-full bg-white dark:bg-slate-700 p-1 rounded border border-gray-300 dark:border-slate-600 disabled:bg-gray-100 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed" />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-slate-400">Target (Text)</label>
                        <input name="target" value={editData.target} onChange={handleInputChange} disabled={isCurrentlyLinked} className="w-full bg-white dark:bg-slate-700 p-1 rounded border border-gray-300 dark:border-slate-600 disabled:bg-gray-100 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-slate-400">Current Value</label>
                            <input type="number" name="currentValue" value={editData.currentValue} onChange={handleInputChange} disabled={isCurrentlyLinked} className="w-full bg-white dark:bg-slate-700 p-1 rounded border border-gray-300 dark:border-slate-600 disabled:bg-gray-100 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 dark:text-slate-400">Target Value</label>
                            <input type="number" name="targetValue" value={editData.targetValue} onChange={handleInputChange} disabled={isCurrentlyLinked} className="w-full bg-white dark:bg-slate-700 p-1 rounded border border-gray-300 dark:border-slate-600 disabled:bg-gray-100 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed" />
                        </div>
                    </div>
                     {isCurrentlyLinked && (
                        <div className="flex items-center text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 p-2 rounded-md mt-2">
                           <Link className="w-4 h-4 mr-2 flex-shrink-0" />
                           <span>Linked to an initiative. Progress is updated automatically.</span>
                        </div>
                    )}

                    {/* History Editor */}
                    <fieldset disabled={isCurrentlyLinked} className="pt-4 mt-4 border-t border-gray-200 dark:border-slate-700 group">
                        <legend className="text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 px-1">Performance History</legend>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 group-disabled:opacity-50">
                            {(editData.history || []).map((entry, idx) => (
                                editingHistoryIndex === idx && currentHistoryEdit ? (
                                    // Edit Mode for History Item
                                    <div key={idx} className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                                        <input 
                                            type="date" 
                                            value={currentHistoryEdit.date}
                                            onChange={(e) => setCurrentHistoryEdit({ ...currentHistoryEdit, date: e.target.value })}
                                            className="w-full text-sm bg-white dark:bg-slate-600 p-1 rounded border border-gray-300 dark:border-slate-500" 
                                        />
                                        <input 
                                            type="number" 
                                            value={currentHistoryEdit.value}
                                            onChange={(e) => setCurrentHistoryEdit({ ...currentHistoryEdit, value: Number(e.target.value) })}
                                            className="w-20 text-sm bg-white dark:bg-slate-600 p-1 rounded border border-gray-300 dark:border-slate-500"
                                        />
                                        <button onClick={() => handleSaveHistoryEdit(idx)} className="p-1.5 rounded-full hover:bg-green-100 dark:hover:bg-green-900 text-green-500" title="Save History"><Save className="w-4 h-4" /></button>
                                        <button onClick={handleCancelHistoryEdit} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500" title="Cancel Edit"><X className="w-4 h-4" /></button>
                                    </div>
                                ) : (
                                    // Display Mode for History Item
                                    <div key={idx} className="flex items-center justify-between group-hover:bg-gray-50 dark:group-hover:bg-slate-700/50 p-2 rounded-lg">
                                        <p className="text-sm text-gray-700 dark:text-slate-300">
                                            <span className="font-mono">{entry.date}</span> — Value: <span className="font-bold">{entry.value}</span>
                                        </p>
                                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditHistoryClick(idx)} className="p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-500" title="Edit Entry"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => handleDeleteHistory(idx)} className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500" title="Delete Entry"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                )
                            ))}
                            {(editData.history || []).length === 0 && <p className="text-xs text-center text-gray-400 dark:text-slate-500 py-2">No history data. Add an entry to start.</p>}
                        </div>
                        <button
                            type="button"
                            onClick={handleAddHistory}
                            disabled={editingHistoryIndex !== null || isCurrentlyLinked}
                            className="w-full mt-2 flex items-center justify-center space-x-2 px-3 py-1.5 text-xs font-semibold rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border border-gray-300 dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Add History Entry</span>
                        </button>
                         {isCurrentlyLinked && (
                            <p className="text-xs text-center text-gray-500 dark:text-slate-400 mt-2">
                                History cannot be edited for synced KPIs.
                            </p>
                        )}
                    </fieldset>
                </div>
            </div>
        );
    }

    return (
        <div className={`group relative bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-t-4 ${status.borderColor} flex flex-col justify-between min-h-[420px]`}>
            {isAdminMode && (
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {kpi.isLinked ? (
                        <button onClick={() => setIsEditing(true)} className="p-1.5 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900 text-yellow-500" title="Edit to Unlink KPI">
                            <Link2Off className="w-4 h-4" />
                        </button>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-500" title="Edit KPI">
                            <Edit className="w-4 h-4" />
                        </button>
                    )}
                    <button onClick={() => onDelete(index)} className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500" title="Delete KPI"><Trash2 className="w-4 h-4" /></button>
                </div>
            )}
            <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white flex-1">{kpi.name}</h3>
                    <div className={`flex-shrink-0 flex items-center text-xs font-semibold px-2 py-1 rounded-full ${status.bgColor} ${status.badgeTextColor}`}>
                        <status.icon className="w-3.5 h-3.5 mr-1.5" />
                        <span>{status.label}</span>
                    </div>
                </div>
                 <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-sm text-gray-500 dark:text-slate-400">
                    <span>Current: <strong className="text-gray-700 dark:text-slate-200">{kpi.current}</strong></span>
                    <span>Target: <strong className="text-gray-700 dark:text-slate-200">{kpi.target}</strong></span>
                    {kpi.isLinked ? (
                        <div title="Synced with an initiative" className="flex items-center text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 py-1 px-2 rounded-full font-semibold">
                            <Link className="w-3 h-3 mr-1.5" />Synced
                        </div>
                    ) : (
                        <div title="Manually-managed KPI" className="flex items-center text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 py-1 px-2 rounded-full font-semibold">
                            <Link2Off className="w-3 h-3 mr-1.5" />Manual
                        </div>
                    )}
                </div>
            </div>

            <div className="my-4">
                {kpi.history && kpi.history.length > 1 ? (
                    <KpiTrendGraph history={kpi.history} targetValue={kpi.targetValue} color={status.textColor} />
                ) : (
                    <div className="h-24 flex items-center justify-center text-xs text-gray-400 dark:text-slate-500">
                        No trend data available.
                    </div>
                )}
            </div>

            <div className="flex justify-center">
                <RadialProgress percentage={percentage} color={status.textColor} />
            </div>
        </div>
    );
};

interface DashboardContentProps {
    kpis: KPI[];
    isAdminMode: boolean;
    onUpdateKpi: (index: number, updatedKpi: KPI) => void;
    onAddKpi: () => void;
    onDeleteKpi: (index: number) => void;
    initiatives: Initiative[];
    strategicThrusts: StrategicThrust[];
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ kpis, isAdminMode, onUpdateKpi, onAddKpi, onDeleteKpi, initiatives, strategicThrusts }) => {
    
    const [filterThrust, setFilterThrust] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const initiativesMap = useMemo(() => new Map(initiatives.map(init => [init.id, init])), [initiatives]);
    
    const derivedKpis = useMemo(() => {
        return kpis.map(kpi => {
            const match = kpi.name.match(/^(I-\d+\.\d+)/);
            const initiativeId = match ? match[1] : null;
            const linkedInitiative = initiativeId ? initiativesMap.get(initiativeId) : null;

            let derivedData: any;

            if (linkedInitiative) {
                derivedData = {
                    ...kpi,
                    currentValue: linkedInitiative.progress,
                    targetValue: 100,
                    current: `${linkedInitiative.progress}% Complete`,
                    target: '100% Complete',
                    isLinked: true,
                    linkedInitiative: linkedInitiative,
                    thrustId: linkedInitiative.thrustId,
                };
            } else {
                 derivedData = { ...kpi, isLinked: false, linkedInitiative: null, thrustId: null };
            }
            
            let percentage = 0;
            if (derivedData.targetValue > 0) {
                percentage = (derivedData.currentValue / derivedData.targetValue) * 100;
            }
            derivedData.percentage = Math.min(100, Math.max(0, percentage));
            
            return derivedData;
        });
    }, [kpis, initiativesMap]);

    const filteredKpis = useMemo(() => {
        return derivedKpis.filter(kpi => {
            const thrustMatch = filterThrust === 'all' || (kpi.thrustId && kpi.thrustId.toString() === filterThrust);
            
            const statusMatch = (() => {
                if (filterStatus === 'all') return true;
                const p = kpi.percentage;
                if (filterStatus === 'on-track') return p >= 50 && p < 100;
                if (filterStatus === 'at-risk') return p < 50;
                if (filterStatus === 'completed') return p === 100;
                return true;
            })();

            const searchMatch = searchQuery.trim() === '' || kpi.name.toLowerCase().includes(searchQuery.trim().toLowerCase());

            return thrustMatch && statusMatch && searchMatch;
        });
    }, [derivedKpis, filterThrust, filterStatus, searchQuery]);
    
    // Summary Stats Calculation
    const summaryStats = useMemo(() => {
        const total = derivedKpis.length;
        if (total === 0) return { total: 0, avgProgress: 0, onTrack: 0, atRisk: 0, completed: 0 };
        
        const totalProgress = derivedKpis.reduce((sum, kpi) => sum + kpi.percentage, 0);
        const avgProgress = totalProgress / total;
        const onTrack = derivedKpis.filter(kpi => kpi.percentage >= 50 && kpi.percentage < 100).length;
        const atRisk = derivedKpis.filter(kpi => kpi.percentage < 50).length;
        const completed = derivedKpis.filter(kpi => kpi.percentage === 100).length;

        return { total, avgProgress, onTrack, atRisk, completed };
    }, [derivedKpis]);

    const statusFilters = [
        { id: 'all', label: 'All Statuses' },
        { id: 'on-track', label: 'On Track' },
        { id: 'at-risk', label: 'At Risk' },
        { id: 'completed', label: 'Completed' },
    ];

    return (
        <div className="space-y-10">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Live Progress Dashboard</h2>
                <p className="text-gray-600 dark:text-slate-300 max-w-4xl mx-auto">
                    Interactive analysis of our Key Performance Indicators. KPIs linked to initiatives are automatically updated from the timeline.
                </p>
            </div>

            {/* Summary & Filters */}
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 space-y-6">
                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                     <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                        <BarChartHorizontal className="w-6 h-6 mx-auto mb-1 text-gray-500"/>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{summaryStats.total}</p>
                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total KPIs</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                        <Activity className="w-6 h-6 mx-auto mb-1 text-purple-500"/>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{Math.round(summaryStats.avgProgress)}%</p>
                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Avg. Progress</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                        <TrendingUp className="w-6 h-6 mx-auto mb-1 text-green-500"/>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{summaryStats.onTrack}</p>
                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400">On Track</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                        <AlertTriangle className="w-6 h-6 mx-auto mb-1 text-yellow-500"/>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{summaryStats.atRisk}</p>
                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400">At Risk</p>
                    </div>
                     <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                        <CheckCircle className="w-6 h-6 mx-auto mb-1 text-blue-500"/>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{summaryStats.completed}</p>
                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Completed</p>
                    </div>
                 </div>
                 <div className="pt-6 border-t border-gray-200 dark:border-slate-700 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label htmlFor="thrust-filter" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Filter by Strategic Thrust</label>
                            <select id="thrust-filter" value={filterThrust} onChange={e => setFilterThrust(e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500">
                                <option value="all">All Thrusts</option>
                                {strategicThrusts.map(thrust => <option key={thrust.id} value={thrust.id}>Thrust {thrust.id}: {thrust.title}</option>)}
                            </select>
                        </div>
                         <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Filter by Status</label>
                            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-slate-700/50 p-1 rounded-lg">
                                {statusFilters.map(filter => (
                                    <button key={filter.id} onClick={() => setFilterStatus(filter.id)} className={`flex-1 text-center px-3 py-1 text-sm font-semibold rounded-md transition-colors ${filterStatus === filter.id ? 'bg-white dark:bg-slate-600 text-red-600 dark:text-red-400 shadow' : 'text-gray-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-600/50'}`}>
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="kpi-search" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Search by Name</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            <input
                                id="kpi-search"
                                type="text"
                                placeholder="e.g., 'PEP Compliance', 'Road Quality'..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm pl-10 pr-4 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                    </div>
                 </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredKpis.map((derivedKpi, index) => (
                    <KpiCard 
                        key={index}
                        kpi={derivedKpi} 
                        index={kpis.indexOf(derivedKpi)} 
                        isAdminMode={isAdminMode} 
                        onUpdate={onUpdateKpi}
                        onDelete={onDeleteKpi}
                        initiatives={initiatives}
                    />
                ))}
                {isAdminMode && (
                    <button onClick={onAddKpi} className="flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-t-4 border-dashed border-gray-400 dark:border-slate-600 hover:border-red-500 hover:text-red-500 transition-all text-gray-500 dark:text-slate-400 min-h-[420px]">
                        <PlusCircle className="w-10 h-10 mb-2" />
                        <span className="font-bold text-lg">Add New KPI</span>
                    </button>
                )}
            </div>
             {filteredKpis.length === 0 && (
                <div className="text-center py-10 text-gray-500 dark:text-slate-400 md:col-span-2 lg:col-span-3">
                    <p className="font-semibold">No KPIs match the current filters.</p>
                    <p className="text-sm">Try adjusting your filter selection or search query.</p>
                </div>
            )}
        </div>
    );
};