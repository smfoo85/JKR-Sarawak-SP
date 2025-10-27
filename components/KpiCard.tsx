import React, { useMemo } from 'react';
import type { KPIHistory } from '../types';
import { Edit, Trash2, Link, TrendingUp, AlertTriangle, CheckCircle, Link2Off, Calendar } from 'lucide-react';
import { RadialProgress } from './RadialProgress';
import { KpiTrendGraph } from './KpiTrendGraph';

type DerivedKpi = {
    type: 'initiative' | 'manual';
    name: string;
    target: string;
    current: string;
    targetValue: number;
    currentValue: number;
    percentage: number;
    history: KPIHistory[];
    thrustId?: number;
    plan_start?: string;
    plan_end?: string;
    actual_start?: string;
    actual_end?: string; // DD/MM/YYYY
    original: any;
};

interface KpiCardProps {
    kpi: DerivedKpi;
    isAdminMode: boolean;
    onEdit: () => void;
    onDelete: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({ kpi, isAdminMode, onEdit, onDelete }) => {
    
    const { percentage } = kpi;

    const isOverdue = useMemo(() => {
        if (!kpi.actual_end || kpi.percentage >= 100) return false;
        const today = new Date();
        today.setHours(0,0,0,0);
        const [day, month, year] = kpi.actual_end.split('/').map(Number);
        const dueDate = new Date(year, month - 1, day);
        return dueDate < today;
    }, [kpi.actual_end, kpi.percentage]);
    
    const status = useMemo(() => {
        if (isOverdue) {
            return {
                label: 'Overdue',
                icon: AlertTriangle,
                textColor: 'text-red-500',
                borderColor: 'border-red-500',
                bgColor: 'bg-red-100 dark:bg-red-900/30',
                badgeTextColor: 'text-red-700 dark:text-red-300'
            };
        }
        if (percentage >= 100) {
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
    }, [percentage, isOverdue]);

    return (
        <div className={`group relative bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-t-4 ${status.borderColor} flex flex-col justify-between min-h-[420px]`}>
            {isAdminMode && (
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={onEdit} className="p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-500" title="Edit KPI">
                        <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={onDelete} className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500" title="Delete KPI"><Trash2 className="w-4 h-4" /></button>
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
                 <div className="flex flex-col space-y-2 text-sm text-gray-500 dark:text-slate-400">
                    <div className="flex flex-wrap items-center justify-between gap-x-4">
                        <span>Current: <strong className="text-gray-700 dark:text-slate-200">{kpi.current}</strong></span>
                        <span>Target: <strong className="text-gray-700 dark:text-slate-200">{kpi.target}</strong></span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-x-4">
                        {kpi.actual_end && (
                            <div className="flex items-center">
                                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                <span>Due: <strong className={isOverdue ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-slate-200'}>{kpi.actual_end}</strong></span>
                            </div>
                        )}
                        {kpi.type === 'initiative' ? (
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
            </div>

            <div className="my-4">
                {kpi.history && kpi.history.length > 1 ? (
                    <KpiTrendGraph history={kpi.history} targetValue={kpi.targetValue} color={status.textColor} />
                ) : (
                    <div className="h-24 flex items-center justify-center text-xs text-gray-400 dark:text-slate-500">
                        {kpi.type === 'manual' 
                            ? "Add at least 2 history points to see a trend."
                            : "No trend data available for initiatives."}
                    </div>
                )}
            </div>

            <div className="flex justify-center">
                <RadialProgress percentage={percentage} color={status.textColor} />
            </div>
        </div>
    );
};