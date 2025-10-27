import React, { useState, useMemo, useRef, useEffect, Fragment, useCallback } from 'react';
import { strategicThrusts } from '../../data/strategicData';
import type { Initiative, StrategicThrust } from '../../types';
import { Info, Filter, RotateCcw, ChevronDown, CheckSquare, Square, Move, ZoomIn, ZoomOut, GripVertical, TrendingUp, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

interface TimelineContentProps {
    initiatives: Initiative[];
    isAdminMode?: boolean;
    onEditInitiative?: (initiative: Initiative) => void;
}

// Helper to parse DD/MM/YYYY string to Date object
const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  const [day, month, year] = dateString.split('/').map(Number);
  // Check if parts are numbers, otherwise return null
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  return new Date(year, month - 1, day);
};

// Helper to parse YYYY-MM-DD string to Date object
const parseISODate = (isoDateString: string): Date | null => {
    if (!isoDateString) return null;
    const [year, month, day] = isoDateString.split('-').map(Number);
    // Note: JS month is 0-indexed
    return new Date(year, month - 1, day);
};

const durationInDays = (startStr: string, endStr: string): number => {
    const startDate = parseDate(startStr);
    const endDate = parseDate(endStr);
    if (!startDate || !endDate || startDate >= endDate) return 0;
    return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
};

const getInitiativeStatus = (initiative: Initiative) => {
    const today = new Date('2026-07-01'); // Fixed date for deterministic simulation
    today.setHours(0, 0, 0, 0);

    const planEnd = parseDate(initiative.plan_end);
    const planStart = parseDate(initiative.plan_start);

    if (initiative.progress >= 100) {
        return { 
            status: 'Completed', 
            icon: CheckCircle, 
            textColor: 'text-blue-600 dark:text-blue-400',
        };
    }

    if (planEnd && planEnd < today) {
        return { 
            status: 'Overdue', 
            icon: AlertTriangle, 
            textColor: 'text-red-600 dark:text-red-400',
        };
    }
    
    if (planStart && today < planStart) {
       return { 
           status: 'Not Started', 
           icon: Calendar, 
           textColor: 'text-gray-500 dark:text-gray-400',
        };
    }

    if (planStart && planEnd) {
        const totalDuration = planEnd.getTime() - planStart.getTime();
        const elapsedDuration = today.getTime() - planStart.getTime();
        
        if (totalDuration > 0) {
            const expectedProgress = (elapsedDuration / totalDuration) * 100;
            if (initiative.progress < expectedProgress - 25 || initiative.progress < expectedProgress * 0.5) {
                return { 
                    status: 'At Risk', 
                    icon: AlertTriangle, 
                    textColor: 'text-amber-600 dark:text-amber-400',
                };
            }
        }
    }
    
    return { 
        status: 'On Track', 
        icon: TrendingUp, 
        textColor: 'text-green-600 dark:text-green-400',
    };
};


const colorClassMap: Record<string, { light: string, gradient: string, shadow: string }> = {
    'bg-green-600':    { light: 'bg-green-500/30',    gradient: 'bg-gradient-to-r from-green-400 to-green-500',    shadow: 'shadow-md shadow-green-500/30' },
    'bg-yellow-600':   { light: 'bg-yellow-500/30',   gradient: 'bg-gradient-to-r from-yellow-400 to-yellow-500',   shadow: 'shadow-md shadow-yellow-500/30' },
    'bg-orange-600':   { light: 'bg-orange-500/30',   gradient: 'bg-gradient-to-r from-orange-400 to-orange-500',   shadow: 'shadow-md shadow-orange-500/30' },
    'bg-purple-600':   { light: 'bg-purple-500/30',   gradient: 'bg-gradient-to-r from-purple-400 to-purple-500',   shadow: 'shadow-md shadow-purple-500/30' },
    'bg-blue-600':     { light: 'bg-blue-500/30',     gradient: 'bg-gradient-to-r from-blue-400 to-blue-500',     shadow: 'shadow-md shadow-blue-500/30' },
    'bg-red-600':      { light: 'bg-red-500/30',      gradient: 'bg-gradient-to-r from-red-400 to-red-500',      shadow: 'shadow-md shadow-red-500/30' },
    'bg-amber-600':    { light: 'bg-amber-500/30',    gradient: 'bg-gradient-to-r from-amber-400 to-amber-500',    shadow: 'shadow-md shadow-amber-500/30' },
};
const defaultColorClasses = {
    light: 'bg-gray-500/30',
    gradient: 'bg-gradient-to-r from-gray-400 to-gray-500',
    shadow: 'shadow-md shadow-gray-500/30'
};


// Timeline constants
const PLAN_START_DATE = new Date('2025-01-01');
const PLAN_END_DATE = new Date('2030-12-31');
const TOTAL_DAYS = (PLAN_END_DATE.getTime() - PLAN_START_DATE.getTime()) / (1000 * 60 * 60 * 24);

const Tooltip: React.FC<{ tooltipData: { x: number; y: number; initiative: Initiative } }> = ({ tooltipData }) => {
    const { x, y, initiative } = tooltipData;
    const { status, textColor } = getInitiativeStatus(initiative);
    return (
        <div 
          className="fixed z-[110] bg-gray-900 text-white p-3 rounded-lg shadow-xl text-sm max-w-sm pointer-events-none transition-opacity"
          style={{ top: y + 15, left: x + 15 }}
        >
          <p className="font-bold text-base mb-1">{initiative.id}: {initiative.name}</p>
          <p><strong>Status:</strong> <span className={`font-bold ${textColor}`}>{status}</span></p>
          <p><strong>Progress:</strong> {initiative.progress}%</p>
          <p><strong>Plan:</strong> {initiative.plan_start} to {initiative.plan_end}</p>
          <p><strong>Actual:</strong> {initiative.actual_start || 'N/A'} to {initiative.actual_end || 'N/A'}</p>
          {initiative.tier && <p><strong>Tier:</strong> {initiative.tier}</p>}
          {initiative.responsibleBranch && <p><strong>Branch:</strong> {initiative.responsibleBranch}</p>}
          {(initiative.remarks || initiative.expectedOutcome) && <div className="mt-1 pt-1 border-t border-gray-700 space-y-1">
            {initiative.remarks && <p><strong>Remarks:</strong> {initiative.remarks}</p>}
            {initiative.expectedOutcome && <p><strong>Outcome:</strong> {initiative.expectedOutcome}</p>}
          </div>}
        </div>
    );
};


export const TimelineContent: React.FC<TimelineContentProps> = ({ initiatives, isAdminMode, onEditInitiative }) => {
    // Filter State
    const [selectedThrusts, setSelectedThrusts] = useState<Set<number>>(new Set());
    const [selectedBranches, setSelectedBranches] = useState<Set<string>>(new Set());
    const [selectedTier, setSelectedTier] = useState('all');
    const [selectedYear, setSelectedYear] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [isThrustDropdownOpen, setIsThrustDropdownOpen] = useState(false);
    const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
    
    // UI Interaction State
    const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; initiative: Initiative | null }>({ visible: false, x: 0, y: 0, initiative: null });
    const [isPanning, setIsPanning] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1); // 1 to 5
    const [labelWidth, setLabelWidth] = useState(30); // percentage
    
    // Refs
    const thrustFilterRef = useRef<HTMLDivElement>(null);
    const branchFilterRef = useRef<HTMLDivElement>(null);
    const timelineContainerRef = useRef<HTMLDivElement>(null);
    const timelineGridRef = useRef<HTMLDivElement>(null);
    const panState = useRef({ startX: 0, scrollLeft: 0 });
    const isResizing = useRef(false);

    const uniqueBranches = useMemo(() => {
        const branches = new Set(initiatives.map(i => i.responsibleBranch).filter(Boolean) as string[]);
        return Array.from(branches).sort();
    }, [initiatives]);

    // Resizable Column Handlers
    const handleResizeMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        isResizing.current = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', handleResizeMouseMove);
        document.addEventListener('mouseup', handleResizeMouseUp);
    };
    
    const handleResizeMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizing.current || !timelineGridRef.current) return;
        const gridRect = timelineGridRef.current.getBoundingClientRect();
        const newWidth = e.clientX - gridRect.left;
        const newWidthPercent = (newWidth / gridRect.width) * 100;
        setLabelWidth(Math.max(15, Math.min(60, newWidthPercent)));
    }, []);

    const handleResizeMouseUp = useCallback(() => {
        isResizing.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', handleResizeMouseMove);
        document.removeEventListener('mouseup', handleResizeMouseUp);
    }, []);

    // Panning Handlers
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!timelineContainerRef.current || isResizing.current) return;
        setIsPanning(true);
        panState.current = {
            startX: e.pageX - timelineContainerRef.current.offsetLeft,
            scrollLeft: timelineContainerRef.current.scrollLeft,
        };
    };

    const handleMouseUp = () => setIsPanning(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isPanning || !timelineContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - timelineContainerRef.current.offsetLeft;
        const walk = (x - panState.current.startX) * 1.5;
        timelineContainerRef.current.scrollLeft = panState.current.scrollLeft - walk;
    };
    
    // Tooltip Handlers
    const handleBarMouseMove = (e: React.MouseEvent, initiative: Initiative) => setTooltip({ visible: true, x: e.clientX, y: e.clientY, initiative });
    const handleBarMouseLeave = () => setTooltip(prev => ({ ...prev, visible: false }));

    // Zoom Handlers & Memoization
    const handleZoomIn = () => setZoomLevel(prev => Math.min(5, prev + 1));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(1, prev - 1));
    const timelineMinWidth = useMemo(() => 2400 * zoomLevel, [zoomLevel]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (thrustFilterRef.current && !thrustFilterRef.current.contains(event.target as Node)) setIsThrustDropdownOpen(false);
            if (branchFilterRef.current && !branchFilterRef.current.contains(event.target as Node)) setIsBranchDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('mousemove', handleResizeMouseMove);
            document.removeEventListener('mouseup', handleResizeMouseUp);
        };
    }, [handleResizeMouseMove, handleResizeMouseUp]);
    
    const handleThrustToggle = (thrustId: number) => setSelectedThrusts(prev => { const newSet = new Set(prev); if (newSet.has(thrustId)) newSet.delete(thrustId); else newSet.add(thrustId); return newSet; });
    const handleBranchToggle = (branchName: string) => setSelectedBranches(prev => { const newSet = new Set(prev); if (newSet.has(branchName)) newSet.delete(branchName); else newSet.add(branchName); return newSet; });
    const handleSelectAllThrusts = () => setSelectedThrusts(new Set(strategicThrusts.map(t => t.id)));
    const handleDeselectAllThrusts = () => setSelectedThrusts(new Set());
    const handleSelectAllBranches = () => setSelectedBranches(new Set(uniqueBranches));
    const handleDeselectAllBranches = () => setSelectedBranches(new Set());
    const handleResetFilters = () => { setSelectedThrusts(new Set()); setSelectedBranches(new Set()); setSelectedTier('all'); setSelectedStatus('all'); setSelectedYear('all'); setDateRange({ start: '', end: '' }); };

    const filteredInitiatives = useMemo(() => {
        return initiatives.filter(initiative => {
            const thrustMatch = selectedThrusts.size === 0 || selectedThrusts.has(initiative.thrustId);
            const branchMatch = selectedBranches.size === 0 || (initiative.responsibleBranch && selectedBranches.has(initiative.responsibleBranch));
            const tierMatch = selectedTier === 'all' || initiative.tier === selectedTier;
            const yearMatch = (() => { if (selectedYear === 'all') return true; const yearToFilter = Number(selectedYear); const start = parseDate(initiative.plan_start); const end = parseDate(initiative.plan_end); if (!start || !end) return false; return yearToFilter >= start.getFullYear() && yearToFilter <= end.getFullYear(); })();
            const statusMatch = (() => { if (selectedStatus === 'all') return true; const { status } = getInitiativeStatus(initiative); return status.toLowerCase().replace(' ', '-') === selectedStatus; })();
            const dateMatch = (() => { const rangeStart = parseISODate(dateRange.start); const rangeEnd = parseISODate(dateRange.end); if (!rangeStart && !rangeEnd) return true; const initiativeStart = parseDate(initiative.plan_start); const initiativeEnd = parseDate(initiative.plan_end); if (!initiativeStart || !initiativeEnd) return false; if (rangeStart && rangeEnd) return initiativeStart <= rangeEnd && initiativeEnd >= rangeStart; if (rangeStart) return initiativeEnd >= rangeStart; if (rangeEnd) return initiativeStart <= rangeEnd; return true; })();
            return thrustMatch && branchMatch && tierMatch && statusMatch && dateMatch && yearMatch;
        });
    }, [selectedThrusts, selectedBranches, selectedTier, selectedStatus, dateRange, selectedYear, initiatives]);
    
    const activeThrusts = strategicThrusts.filter(thrust => filteredInitiatives.some(i => i.thrustId === thrust.id));

    const todayPosition = useMemo(() => {
      const today = new Date('2026-07-01'); // Fixed date for deterministic simulation
      const daysFromStart = (today.getTime() - PLAN_START_DATE.getTime()) / (1000 * 60 * 60 * 24);
      const positionPercent = (daysFromStart / TOTAL_DAYS) * 100;
      return Math.max(0, Math.min(100, positionPercent));
    }, []);

    const getTierBadgeClass = (tier?: string) => {
        switch (tier) {
            case 'Tier 1': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            case 'Tier 2': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 'Tier 3': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const renderTimeAxis = () => {
        const years = ['2025', '2026', '2027', '2028', '2029', '2030'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return (
            <div className="w-full grid grid-cols-6">
                {years.map(year => (
                    <div key={year} className="text-center font-bold text-lg text-gray-700 dark:text-slate-300 py-3 border-r border-gray-200 dark:border-slate-700 relative">
                        {year}
                        <div className="grid grid-cols-4 text-xs font-normal text-gray-500 dark:text-slate-400 mt-1">
                          <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
                        </div>
                        {zoomLevel >= 3 && (
                            <div className="absolute top-full w-full left-0 grid grid-cols-12 text-[10px] font-normal text-gray-400 dark:text-slate-500 mt-1 pt-1 border-t border-gray-200 dark:border-slate-700">
                                {months.map(month => <span key={month} className="border-r border-gray-100 dark:border-slate-700/50 last:border-r-0 truncate px-0.5">{month}</span>)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )
    };

    return (
        <div className="space-y-10">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Master Timeline: All Initiatives (2025-2030)</h2>
                <p className="text-gray-600 dark:text-slate-300 max-w-4xl mx-auto">An interactive Gantt chart to visualize and filter every initiative across all 12 Strategic Thrusts.</p>
            </div>
            
            {/* Filter Controls */}
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center text-lg font-semibold text-gray-800 dark:text-slate-200"><Filter className="w-5 h-5 mr-2"/>Filter Initiatives</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div ref={thrustFilterRef} className="relative lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Strategic Thrust</label>
                        <button onClick={() => setIsThrustDropdownOpen(prev => !prev)} className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-4 py-2 text-left flex justify-between items-center"><span className="truncate">{selectedThrusts.size > 0 ? `${selectedThrusts.size} Thrust(s) Selected` : 'All Thrusts'}</span><ChevronDown className="w-5 h-5 text-gray-400"/></button>
                        {isThrustDropdownOpen && (<div className="absolute z-30 mt-1 w-full bg-white dark:bg-slate-800 shadow-lg border dark:border-slate-700 rounded-md"><div className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-slate-700"><button onClick={handleSelectAllThrusts} className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">Select All</button><button onClick={handleDeselectAllThrusts} className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">Deselect All</button></div><div className="max-h-52 overflow-y-auto">{strategicThrusts.map(thrust => (<label key={thrust.id} className="flex items-center space-x-3 p-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"><input type="checkbox" className="hidden" checked={selectedThrusts.has(thrust.id)} onChange={() => handleThrustToggle(thrust.id)}/>{selectedThrusts.has(thrust.id) ? <CheckSquare className="w-5 h-5 text-red-600" /> : <Square className="w-5 h-5 text-gray-400 dark:text-gray-500" />}<span className="text-gray-800 dark:text-slate-200 truncate">T{thrust.id}: {thrust.title}</span></label>))}</div></div>)}
                    </div>
                    <div ref={branchFilterRef} className="relative lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Responsible Branch</label>
                        <button onClick={() => setIsBranchDropdownOpen(prev => !prev)} className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-4 py-2 text-left flex justify-between items-center"><span className="truncate">{selectedBranches.size > 0 ? `${selectedBranches.size} Branch(es) Selected` : 'All Branches'}</span><ChevronDown className="w-5 h-5 text-gray-400"/></button>
                        {isBranchDropdownOpen && (<div className="absolute z-30 mt-1 w-full bg-white dark:bg-slate-800 shadow-lg border dark:border-slate-700 rounded-md"><div className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-slate-700"><button onClick={handleSelectAllBranches} className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">Select All</button><button onClick={handleDeselectAllBranches} className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">Deselect All</button></div><div className="max-h-52 overflow-y-auto">{uniqueBranches.map(branch => (<label key={branch} className="flex items-center space-x-3 p-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"><input type="checkbox" className="hidden" checked={selectedBranches.has(branch)} onChange={() => handleBranchToggle(branch)}/>{selectedBranches.has(branch) ? <CheckSquare className="w-5 h-5 text-red-600" /> : <Square className="w-5 h-5 text-gray-400 dark:text-gray-500" />}<span className="text-gray-800 dark:text-slate-200 truncate">{branch}</span></label>))}</div></div>)}
                    </div>
                    <div><label htmlFor="tier-filter" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Tier</label><select id="tier-filter" value={selectedTier} onChange={e => setSelectedTier(e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"><option value="all">All Tiers</option><option value="Tier 1">Tier 1</option><option value="Tier 2">Tier 2</option><option value="Tier 3">Tier 3</option></select></div>
                    <div><label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Status</label><select id="status-filter" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"><option value="all">All Statuses</option><option value="not-started">Not Started</option><option value="on-track">On Track</option><option value="at-risk">At Risk</option><option value="completed">Completed</option><option value="overdue">Overdue</option></select></div>
                    <div><label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Year</label><select id="year-filter" value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"><option value="all">All Years</option>{['2025', '2026', '2027', '2028', '2029', '2030'].map(year => (<option key={year} value={year}>{year}</option>))}</select></div>
                    <div><label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Overlaps From</label><input type="date" id="start-date" value={dateRange.start} onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))} className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"/></div>
                    <div><label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Overlaps To</label><input type="date" id="end-date" value={dateRange.end} onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))} className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"/></div>
                    <div><button onClick={handleResetFilters} className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-slate-600 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"><RotateCcw className="w-4 h-4"/><span>Reset</span></button></div>
                </div>
                <div className="text-sm text-gray-600 dark:text-slate-400 pt-2 border-t border-gray-200 dark:border-slate-700 mt-4">Showing <span className="font-bold text-red-600 dark:text-red-400">{filteredInitiatives.length}</span> of {initiatives.length} initiatives.</div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-0 sm:p-2 rounded-xl shadow-2xl relative">
                <div 
                    ref={timelineContainerRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className={`overflow-x-auto select-none ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
                >
                    <div ref={timelineGridRef} style={{ minWidth: `${timelineMinWidth}px`}}>
                        {/* Time Axis Header */}
                        <div className={`flex sticky top-0 bg-white dark:bg-slate-800 z-20 border-b-2 border-gray-300 dark:border-slate-600 ${zoomLevel >= 3 ? 'pb-5' : ''}`}>
                            <div style={{ width: `${labelWidth}%` }} className="flex-shrink-0 border-r-2 border-gray-300 dark:border-slate-600 font-bold text-gray-800 dark:text-slate-200 p-3">Initiative</div>
                            <div className="flex-grow">{renderTimeAxis()}</div>
                        </div>
                        
                        {/* Main Grid Content */}
                        <div className="flex relative">
                            {/* Resizer Handle */}
                            <div onMouseDown={handleResizeMouseDown} className="absolute top-0 bottom-0 z-20 w-2 -ml-1 group cursor-col-resize" style={{ left: `${labelWidth}%` }}>
                                <div className="w-0.5 h-full bg-gray-300 dark:bg-slate-600 group-hover:bg-red-500 transition-colors mx-auto"></div>
                                <GripVertical className="absolute top-1/2 -translate-y-1/2 -ml-1.5 w-4 h-4 text-gray-400 dark:text-slate-500 bg-white dark:bg-slate-800 rounded-sm group-hover:text-red-500 transition-colors" />
                            </div>

                            {/* Today Marker */}
                            <div className="absolute top-0 bottom-0 z-10 w-0.5 bg-red-500" style={{ left: `calc(${labelWidth}% + (100% - ${labelWidth}%) * ${todayPosition / 100})`}}>
                                <span className="absolute top-0 -translate-x-1/2 -translate-y-full mb-1 text-xs font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full shadow-md animate-pulse">TODAY</span>
                            </div>

                            {/* Initiative Rows */}
                            <div className="w-full">
                               {activeThrusts.map(thrust => (
                                  <Fragment key={thrust.id}>
                                    <div className="flex bg-gray-100 dark:bg-slate-700/50 sticky top-12 z-10 font-semibold text-gray-800 dark:text-slate-200">
                                        <div style={{ width: `${labelWidth}%` }} className="flex-shrink-0 p-2 border-r-2 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${thrust.shortColor}`}></div>Thrust {thrust.id}: {thrust.title}</div>
                                        <div style={{ width: `${100 - labelWidth}%` }} className="flex-shrink-0 p-2 border-b border-gray-200 dark:border-slate-700"></div>
                                    </div>
                                    {filteredInitiatives.filter(i => i.thrustId === thrust.id).map(initiative => {
                                        const { status, icon: StatusIcon, textColor } = getInitiativeStatus(initiative);
                                        const initiativeThrust = strategicThrusts.find(t => t.id === initiative.thrustId);
                                        const thrustColorKey = initiativeThrust ? initiativeThrust.shortColor : '';
                                        const { gradient: thrustGradient, shadow: thrustShadow } = colorClassMap[thrustColorKey] || defaultColorClasses;
                                        
                                        const calcBarPosition = (startStr: string, endStr: string) => {
                                            const startDate = parseDate(startStr); const endDate = parseDate(endStr);
                                            if (!startDate || !endDate || startDate >= endDate) return { left: '0%', width: '0%' };
                                            const startOffset = (startDate.getTime() - PLAN_START_DATE.getTime()) / (1000 * 60 * 60 * 24); const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
                                            const leftPercent = (startOffset / TOTAL_DAYS) * 100; const widthPercent = (duration / TOTAL_DAYS) * 100;
                                            return { left: `${leftPercent}%`, width: `${widthPercent}%` };
                                        };
                                        const planPos = calcBarPosition(initiative.plan_start, initiative.plan_end);
                                        const durationDays = durationInDays(initiative.plan_start, initiative.plan_end);
                                        const showBarText = (parseFloat(planPos.width) / 100) * (timelineMinWidth / zoomLevel) > 50;


                                        return (
                                            <div key={initiative.id} className="flex border-t border-gray-200 dark:border-slate-700 group min-h-[60px] hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                                <div style={{ width: `${labelWidth}%` }} className="flex-shrink-0 p-2 border-r-2 border-gray-200 dark:border-slate-700 text-sm flex flex-col justify-center">
                                                    <div>
                                                        <div className="flex items-center gap-x-2 flex-wrap mb-0.5">
                                                            <p className="font-semibold text-gray-800 dark:text-slate-200 leading-tight">{initiative.id}: {initiative.name}</p>
                                                            {initiative.tier && (
                                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getTierBadgeClass(initiative.tier)}`}>
                                                                    {initiative.tier}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-slate-400">{initiative.responsibleBranch}</p>
                                                        <div className={`flex items-center text-xs font-bold mt-1 ${textColor}`}>
                                                            <StatusIcon className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                                                            <span>{status}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ width: `${100 - labelWidth}%` }} className="relative flex items-center px-1">
                                                     <div
                                                        className="absolute h-8 bg-gray-300 dark:bg-slate-600 rounded-md"
                                                        style={planPos}
                                                        title={`Planned: ${initiative.plan_start} to ${initiative.plan_end}`}
                                                    ></div>
                                                    <div
                                                        className={`absolute h-6 top-1/2 -translate-y-1/2 rounded-md group/bar ${thrustGradient} ${thrustShadow} ${isAdminMode ? 'cursor-pointer' : 'cursor-default'}`}
                                                        style={{
                                                            left: planPos.left,
                                                            width: `calc(${planPos.width} * ${initiative.progress / 100})`,
                                                        }}
                                                        onMouseMove={(e) => handleBarMouseMove(e, initiative)}
                                                        onMouseLeave={handleBarMouseLeave}
                                                        onClick={() => isAdminMode && onEditInitiative && onEditInitiative(initiative)}
                                                        title={`${isAdminMode ? 'Click to edit: ' : ''}${initiative.name} (${initiative.progress}% complete)`}
                                                    >
                                                        {showBarText && (
                                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white truncate pr-2 z-10 pointer-events-none">
                                                                {initiative.id} ({initiative.progress}%)
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                })}
                              </Fragment> 
                               ))}
                                {activeThrusts.length === 0 && (<div className="flex items-center justify-center h-48 text-gray-500 dark:text-slate-400 w-full"><Info className="w-8 h-8 mr-4 opacity-50"/>No initiatives match the current filters.</div>)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Zoom Controls */}
                <div className="absolute bottom-4 right-4 z-30 flex items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg">
                    <button onClick={handleZoomOut} disabled={zoomLevel === 1} className="p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-md"><ZoomOut className="w-5 h-5" /></button>
                    <span className="px-3 text-sm font-semibold text-gray-700 dark:text-slate-200 border-x border-gray-200 dark:border-slate-700">{zoomLevel * 100}%</span>
                    <button onClick={handleZoomIn} disabled={zoomLevel === 5} className="p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-md"><ZoomIn className="w-5 h-5" /></button>
                </div>
            </div>
            
            {tooltip.visible && tooltip.initiative && <Tooltip tooltipData={{...tooltip, initiative: tooltip.initiative}} />}

             <div className="flex items-start bg-blue-50 dark:bg-blue-900/50 p-4 rounded-xl border-l-4 border-blue-500 text-sm text-blue-800 dark:text-blue-200">
                <Move className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"/>
                <div>
                    <strong className="font-semibold">How to use the timeline:</strong> Click and drag to pan, use the +/- buttons to zoom, and drag the vertical bar to resize the labels column. Hover over any initiative bar to see details.
                </div>
            </div>
        </div>
    );
};