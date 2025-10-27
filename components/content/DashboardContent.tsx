import React, { useState, useMemo } from 'react';
import type { Initiative, StrategicThrust, KPI } from '../../types';
import { PlusCircle, Search, TrendingUp, AlertTriangle, CheckCircle, BarChartHorizontal, Activity, RotateCcw } from 'lucide-react';
import { KpiCard } from '../KpiCard';
import { ConfirmActionModal } from '../ConfirmActionModal';

// Helper to parse DD/MM/YYYY string to Date object
const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  const [day, month, year] = dateString.split('/').map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  // JS month is 0-indexed
  return new Date(year, month - 1, day);
};

interface DashboardContentProps {
    isAdminMode: boolean;
    initiatives: Initiative[];
    kpis: KPI[];
    strategicThrusts: StrategicThrust[];
    onEditInitiative: (initiative: Initiative) => void;
    onDeleteInitiative: (initiativeId: string) => void;
    onAddKpi: () => void;
    onEditKpi: (index: number) => void;
    onDeleteKpi: (index: number) => void;
    onResetAllProgress: () => void;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ 
    isAdminMode, 
    initiatives, 
    kpis, 
    strategicThrusts, 
    onAddKpi,
    onEditKpi,
    onDeleteKpi,
    onResetAllProgress,
}) => {
    
    const [filterThrust, setFilterThrust] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterDate, setFilterDate] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    const initiativesMap = useMemo(() => new Map(initiatives.map(init => [init.id, init])), [initiatives]);

    const derivedKpis = useMemo(() => {
        return kpis.map((kpi, index) => {
            const match = kpi.name.match(/^(I-\d+\.\d+)/);
            const initiativeId = match ? match[1] : null;
            const linkedInitiative = initiativeId ? initiativesMap.get(initiativeId) : null;
    
            if (linkedInitiative) {
                const percentage = linkedInitiative.progress;
                return {
                    type: 'initiative' as const,
                    name: kpi.name,
                    target: '100% Complete',
                    current: `${percentage}% Complete`,
                    targetValue: 100,
                    currentValue: percentage,
                    percentage: percentage,
                    history: [], // Synced KPIs don't have their own history
                    thrustId: linkedInitiative.thrustId,
                    actual_end: kpi.actual_end || linkedInitiative.actual_end,
                    original: { ...kpi, originalIndex: index },
                };
            }
            
            // Manual KPI
            let percentage = 0;
            if (kpi.targetValue > 0) {
                percentage = (kpi.currentValue / kpi.targetValue) * 100;
            }
            
            return {
                type: 'manual' as const,
                name: kpi.name,
                target: kpi.target,
                current: kpi.current,
                targetValue: kpi.targetValue,
                currentValue: kpi.currentValue,
                percentage: Math.min(100, Math.max(0, percentage)),
                history: kpi.history || [],
                thrustId: undefined, // Manual KPIs don't belong to a thrust
                actual_end: kpi.actual_end,
                original: { ...kpi, originalIndex: index },
            };
        });
    }, [kpis, initiativesMap]);


    const filteredKpis = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return derivedKpis.filter(kpi => {
            const thrustMatch = filterThrust === 'all' || (kpi.thrustId && kpi.thrustId.toString() === filterThrust);
            
            const statusMatch = (() => {
                if (filterStatus === 'all') return true;
                const p = kpi.percentage;
                const dueDate = parseDate(kpi.actual_end || '');
                const isOverdue = dueDate ? dueDate < today && p < 100 : false;

                if (filterStatus === 'overdue') return isOverdue;
                if (filterStatus === 'on-track') return p >= 50 && p < 100 && !isOverdue;
                if (filterStatus === 'at-risk') return p < 50 && !isOverdue;
                if (filterStatus === 'completed') return p >= 100;
                return true;
            })();

            const dateMatch = (() => {
                if (filterDate === 'all' || !kpi.actual_end) return true;
                const dueDate = parseDate(kpi.actual_end);
                if (!dueDate) return false;
                
                if (filterDate === 'past') return dueDate < today;
                if (filterDate === 'today') return dueDate.getTime() === today.getTime();

                const endOfWeek = new Date(today);
                endOfWeek.setDate(today.getDate() + 7);
                if (filterDate === 'week') return dueDate >= today && dueDate <= endOfWeek;

                const endOfMonth = new Date(today);
                endOfMonth.setDate(today.getDate() + 30);
                if (filterDate === 'month') return dueDate >= today && dueDate <= endOfMonth;
                return true;
            })();

            const searchMatch = searchQuery.trim() === '' || kpi.name.toLowerCase().includes(searchQuery.trim().toLowerCase());

            return thrustMatch && statusMatch && searchMatch && dateMatch;
        });
    }, [derivedKpis, filterThrust, filterStatus, filterDate, searchQuery]);
    
    // Summary Stats Calculation
    const summaryStats = useMemo(() => {
        const total = derivedKpis.length;
        if (total === 0) return { total: 0, avgProgress: 0, onTrack: 0, atRisk: 0, completed: 0, overdue: 0 };
        
        const today = new Date();
        today.setHours(0,0,0,0);

        const totalProgress = derivedKpis.reduce((sum, kpi) => sum + kpi.percentage, 0);
        const avgProgress = total > 0 ? totalProgress / total : 0;
        
        const isOverdue = (kpi: typeof derivedKpis[0]) => {
            const dueDate = parseDate(kpi.actual_end || '');
            return dueDate ? dueDate < today && kpi.percentage < 100 : false;
        };
        
        const completed = derivedKpis.filter(kpi => kpi.percentage >= 100).length;
        const overdue = derivedKpis.filter(isOverdue).length;
        const onTrack = derivedKpis.filter(kpi => kpi.percentage >= 50 && kpi.percentage < 100 && !isOverdue(kpi)).length;
        const atRisk = derivedKpis.filter(kpi => kpi.percentage < 50 && !isOverdue(kpi)).length;

        return { total, avgProgress, onTrack, atRisk, completed, overdue };
    }, [derivedKpis]);

    const statusFilters = [
        { id: 'all', label: 'All' },
        { id: 'on-track', label: 'On Track' },
        { id: 'at-risk', label: 'At Risk' },
        { id: 'completed', label: 'Completed' },
        { id: 'overdue', label: 'Overdue' },
    ];
    
    const dateFilters = [
        { id: 'all', label: 'All Dates' },
        { id: 'past', label: 'Past Due' },
        { id: 'today', label: 'Due Today' },
        { id: 'week', label: 'Due This Week' },
        { id: 'month', label: 'Due This Month' },
    ];

    const handleConfirmReset = () => {
        onResetAllProgress();
        setIsResetModalOpen(false);
    }

    return (
        <div className="space-y-10">
            {isAdminMode && (
                <div className="mb-6 text-right">
                    <button onClick={() => setIsResetModalOpen(true)} className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors shadow-sm ml-auto">
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset All Initiative Progress</span>
                    </button>
                </div>
            )}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Live Progress Dashboard</h2>
                <p className="text-gray-600 dark:text-slate-300 max-w-4xl mx-auto">
                    Interactive analysis of our Key Performance Indicators. KPIs can be manually managed or synced directly with initiatives for real-time progress tracking.
                </p>
            </div>

            {/* Summary & Filters */}
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 space-y-6">
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
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
                    <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                        <AlertTriangle className="w-6 h-6 mx-auto mb-1 text-red-500"/>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{summaryStats.overdue}</p>
                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Overdue</p>
                    </div>
                 </div>
                 <div className="pt-6 border-t border-gray-200 dark:border-slate-700 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="thrust-filter" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Filter by Strategic Thrust (Synced KPIs)</label>
                            <select id="thrust-filter" value={filterThrust} onChange={e => setFilterThrust(e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500">
                                <option value="all">All Thrusts & Manual KPIs</option>
                                {strategicThrusts.map(thrust => <option key={thrust.id} value={thrust.id}>Thrust {thrust.id}: {thrust.title}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Filter by Due Date</label>
                            <select id="date-filter" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500">
                                {dateFilters.map(filter => <option key={filter.id} value={filter.id}>{filter.label}</option>)}
                            </select>
                        </div>
                         <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Filter by Status</label>
                            <div className="flex flex-wrap items-center gap-2 bg-gray-100 dark:bg-slate-700/50 p-1 rounded-lg">
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
                                placeholder="e.g., 'PEP Compliance', 'Public Satisfaction', 'I-1.1'..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm pl-10 pr-4 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                    </div>
                 </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredKpis.map((kpi) => (
                    <KpiCard 
                        key={`kpi-${kpi.original.originalIndex}`}
                        kpi={kpi}
                        isAdminMode={isAdminMode} 
                        onEdit={() => onEditKpi(kpi.original.originalIndex)}
                        onDelete={() => onDeleteKpi(kpi.original.originalIndex)}
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
            <ConfirmActionModal 
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                onConfirm={handleConfirmReset}
                title="Confirm Reset Progress"
                confirmText="Yes, Reset All"
                confirmButtonClass="bg-yellow-600 hover:bg-yellow-700"
            >
                <p>Are you sure you want to reset the progress of <strong className="font-bold">ALL</strong> initiatives to 0%?</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">This action cannot be undone and will add a reset note to each initiative's history.</p>
            </ConfirmActionModal>
        </div>
    );
};