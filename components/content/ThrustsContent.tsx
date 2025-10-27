import React, { useState, useMemo } from 'react';
import type { Initiative, StrategicThrust } from '../../types';
import { ChevronRight, Edit, Trash2, PlusCircle, NotebookText, Building, Target, ClipboardList, Filter, Search, RotateCcw, TrendingUp, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import { strategicThrusts } from '../../data/strategicData';

interface ThrustsContentProps {
  isAdminMode?: boolean;
  onEditInitiative?: (initiative: Initiative) => void;
  onDeleteInitiative?: (initiativeId: string) => void;
  onAddInitiative?: (thrustId: number) => void;
  initiatives: Initiative[];
}

// Helper to parse DD/MM/YYYY string to Date object
const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  const [day, month, year] = dateString.split('/').map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  // JS month is 0-indexed
  return new Date(year, month - 1, day);
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
            gradient: 'bg-gradient-to-r from-blue-400 to-blue-500',
            shadow: 'shadow-md shadow-blue-500/30'
        };
    }

    if (planEnd && planEnd < today) {
        return { 
            status: 'Overdue', 
            icon: AlertTriangle, 
            textColor: 'text-red-600 dark:text-red-400',
            gradient: 'bg-gradient-to-r from-red-400 to-red-500',
            shadow: 'shadow-md shadow-red-500/30'
        };
    }
    
    if (planStart && today < planStart) {
       return { 
           status: 'Not Started', 
           icon: Calendar, 
           textColor: 'text-gray-500 dark:text-gray-400',
           gradient: 'bg-gray-400 dark:bg-gray-500', 
           shadow: 'shadow-md shadow-gray-500/30'
        };
    }

    if (planStart && planEnd) {
        const totalDuration = planEnd.getTime() - planStart.getTime();
        const elapsedDuration = today.getTime() - planStart.getTime();
        
        if (totalDuration > 0) {
            const expectedProgress = (elapsedDuration / totalDuration) * 100;
            // At risk if progress is more than 25 percentage points behind expected,
            // or less than half of what's expected.
            if (initiative.progress < expectedProgress - 25 || initiative.progress < expectedProgress * 0.5) {
                return { 
                    status: 'At Risk', 
                    icon: AlertTriangle, 
                    textColor: 'text-amber-600 dark:text-amber-400',
                    gradient: 'bg-gradient-to-r from-amber-400 to-amber-500',
                    shadow: 'shadow-md shadow-amber-500/30'
                };
            }
        }
    }
    
    return { 
        status: 'On Track', 
        icon: TrendingUp, 
        textColor: 'text-green-600 dark:text-green-400',
        gradient: 'bg-gradient-to-r from-green-400 to-green-500',
        shadow: 'shadow-md shadow-green-500/30'
    };
};


export const ThrustsContent: React.FC<ThrustsContentProps> = ({ isAdminMode, onEditInitiative, onDeleteInitiative, onAddInitiative, initiatives }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThrustId, setSelectedThrustId] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const uniqueBranches = useMemo(() => {
    const branches = new Set(initiatives.map(i => i.responsibleBranch).filter(Boolean) as string[]);
    return Array.from(branches).sort();
  }, [initiatives]);
  
  // This mapping is necessary because TailwindCSS JIT compiler needs to see full class names.
  const borderColorMap: Record<string, string> = {
    'bg-green-600': 'border-green-600',
    'bg-red-600': 'border-red-600',
    'bg-blue-600': 'border-blue-600',
    'bg-purple-600': 'border-purple-600',
    'bg-yellow-600': 'border-yellow-600',
    'bg-orange-600': 'border-orange-600',
    'bg-amber-600': 'border-amber-600',
  };

  const filteredInitiatives = useMemo(() => {
    return initiatives.filter(initiative => {
      const searchMatch = searchQuery.trim() === '' ||
        initiative.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        initiative.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const thrustMatch = selectedThrustId === 'all' || initiative.thrustId.toString() === selectedThrustId;
      const branchMatch = selectedBranch === 'all' || initiative.responsibleBranch === selectedBranch;
      const tierMatch = selectedTier === 'all' || initiative.tier === selectedTier;
      
      const statusMatch = (() => {
        if (selectedStatus === 'all') return true;
        const { status } = getInitiativeStatus(initiative);
        return status.toLowerCase().replace(' ', '-') === selectedStatus;
      })();

      return searchMatch && thrustMatch && branchMatch && tierMatch && statusMatch;
    });
  }, [searchQuery, selectedThrustId, selectedBranch, selectedTier, selectedStatus, initiatives]);
  
  const initiativesByThrust = useMemo(() => {
    return filteredInitiatives.reduce((acc, initiative) => {
      if (!acc[initiative.thrustId]) {
        acc[initiative.thrustId] = [];
      }
      acc[initiative.thrustId].push(initiative);
      return acc;
    }, {} as Record<number, Initiative[]>);
  }, [filteredInitiatives]);

  const activeThrusts = strategicThrusts.filter(thrust => initiativesByThrust[thrust.id]?.length > 0);
  
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedThrustId('all');
    setSelectedBranch('all');
    setSelectedTier('all');
    setSelectedStatus('all');
  };

  return (
    <div className="space-y-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">The 12 Strategic Thrusts: Our Pillars of Action</h2>
        <p className="text-gray-600 dark:text-slate-300 max-w-4xl mx-auto">
          Each thrust is a commitment to excellence, driving targeted initiatives to achieve our vision for Sarawak's future.
        </p>
      </div>

      {/* Filter Panel */}
      <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center text-lg font-semibold text-gray-800 dark:text-slate-200">
            <Filter className="w-5 h-5 mr-2"/>
            Filter Initiatives
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="lg:col-span-2">
                <label htmlFor="initiative-search" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Search by Name/ID</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input id="initiative-search" type="text" placeholder="e.g., 'Pan Borneo', 'I-3.1'..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm pl-10 pr-4 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                </div>
            </div>
            <div>
                <label htmlFor="thrust-filter" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Strategic Thrust</label>
                <select id="thrust-filter" value={selectedThrustId} onChange={e => setSelectedThrustId(e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500">
                  <option value="all">All Thrusts</option>
                  {strategicThrusts.map(thrust => <option key={thrust.id} value={thrust.id}>T{thrust.id}: {thrust.title}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="branch-filter" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Responsible Branch</label>
                <select id="branch-filter" value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500">
                  <option value="all">All Branches</option>
                  {uniqueBranches.map(branch => <option key={branch} value={branch}>{branch}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="tier-filter" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Tier</label>
                <select id="tier-filter" value={selectedTier} onChange={e => setSelectedTier(e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500">
                    <option value="all">All Tiers</option>
                    <option value="Tier 1">Tier 1</option>
                    <option value="Tier 2">Tier 2</option>
                    <option value="Tier 3">Tier 3</option>
                </select>
            </div>
            <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Status</label>
                <select id="status-filter" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500">
                    <option value="all">All Statuses</option>
                    <option value="not-started">Not Started</option>
                    <option value="on-track">On Track</option>
                    <option value="at-risk">At Risk</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                </select>
            </div>
            <div className="lg:col-start-4">
                <button onClick={handleResetFilters} className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-slate-600 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors">
                    <RotateCcw className="w-4 h-4"/>
                    <span>Reset Filters</span>
                </button>
            </div>
        </div>
        <div className="text-sm text-gray-600 dark:text-slate-400 pt-3 border-t border-gray-200 dark:border-slate-700 mt-3">
            Showing <span className="font-bold text-red-600 dark:text-red-400">{filteredInitiatives.length}</span> of {initiatives.length} total initiatives.
        </div>
      </div>

      <div className="space-y-10">
        {activeThrusts.map(thrust => (
          <div key={thrust.id} className={`bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border-l-8 ${borderColorMap[thrust.shortColor] || 'border-gray-500'}`}>
            <div className={`p-6 ${thrust.color} bg-opacity-10 dark:bg-opacity-20`}>
              <div className="flex items-center">
                <div className={`${thrust.color} w-16 h-16 rounded-xl flex items-center justify-center mr-5 text-white flex-shrink-0`}>
                  <thrust.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">Thrust {thrust.id}: {thrust.title}</h3>
                  <p className="text-gray-600 dark:text-slate-300 mt-1">{thrust.description}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-bold text-gray-800 dark:text-slate-200">Key Initiatives ({initiativesByThrust[thrust.id]?.length || 0})</h4>
                {isAdminMode && (
                  <button onClick={() => onAddInitiative && onAddInitiative(thrust.id)} className="flex items-center space-x-2 px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Initiative</span>
                  </button>
                )}
              </div>
              <ul className="space-y-3">
                {(initiativesByThrust[thrust.id] || []).map(initiative => {
                  const { status, icon: StatusIcon, textColor, gradient, shadow } = getInitiativeStatus(initiative);
                  return (
                    <li key={initiative.id} className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group">
                      <ChevronRight className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div className="flex-grow">
                        <p className="font-medium text-gray-800 dark:text-slate-200">
                          <span className="font-bold text-gray-500 dark:text-slate-400">{initiative.id}:</span> {initiative.name}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center text-xs text-gray-500 dark:text-slate-400 mt-1 gap-x-4 gap-y-1">
                            {initiative.responsibleBranch && (
                              <div className="flex items-center">
                                <Building className="w-3 h-3 mr-1.5 flex-shrink-0" />
                                <span>{initiative.responsibleBranch}</span>
                              </div>
                            )}
                            {initiative.tier && (
                              <span className="font-bold py-0.5 px-2 rounded-full bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-200">{initiative.tier}</span>
                            )}
                            <div className="flex items-center space-x-2">
                              <strong>Progress:</strong>
                              <div className="w-32 bg-gray-300 dark:bg-slate-700 rounded-md h-4">
                                <div className={`${gradient} h-4 rounded-md ${shadow}`} style={{width: `${initiative.progress}%`}}></div>
                              </div>
                              <span className="font-semibold">{initiative.progress}%</span>
                              <div className={`flex items-center font-bold ${textColor}`}>
                                <StatusIcon className="w-3.5 h-3.5 mr-1" />
                                <span>{status}</span>
                              </div>
                            </div>
                        </div>
                        <div className="text-xs grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-gray-600 dark:text-slate-300">
                          <p><strong>Plan:</strong> {initiative.plan_start} - {initiative.plan_end}</p>
                          <p><strong>Actual:</strong> {initiative.actual_start || 'N/A'} - {initiative.actual_end || 'N/A'}</p>
                        </div>
                        {initiative.expectedOutcome && (
                          <div className="flex items-start text-xs text-gray-600 dark:text-slate-300 mt-2 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border-l-4 border-gray-300 dark:border-slate-600">
                              <Target className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                              <p><strong className="font-semibold text-gray-700 dark:text-slate-200">Expected Outcome:</strong> {initiative.expectedOutcome}</p>
                          </div>
                        )}
                        {initiative.remarks && (
                          <div className="flex items-start text-xs text-gray-600 dark:text-slate-300 mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border-l-4 border-yellow-400 dark:border-yellow-600">
                              <ClipboardList className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-yellow-500 dark:text-yellow-400" />
                              <p><strong className="font-semibold text-gray-700 dark:text-slate-200">Remarks:</strong> {initiative.remarks}</p>
                          </div>
                        )}
                        {initiative.notes && (
                          <div className="flex items-start text-xs text-gray-600 dark:text-slate-300 mt-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-l-4 border-blue-400 dark:border-blue-600">
                              <NotebookText className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-500 dark:text-blue-400" />
                              <p className="whitespace-pre-wrap"><strong className="font-semibold text-gray-700 dark:text-slate-200">Last Update Note:</strong> {initiative.notes}</p>
                          </div>
                        )}
                      </div>
                      {isAdminMode && onEditInitiative && onDeleteInitiative && (
                        <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => onEditInitiative(initiative)} className="p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-500" title="Edit Initiative">
                              <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => onDeleteInitiative(initiative.id)} className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500" title="Delete Initiative">
                              <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ))}

        {activeThrusts.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
                <Search className="w-12 h-12 mx-auto text-gray-400 dark:text-slate-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-slate-200">No Initiatives Found</h3>
                <p className="text-gray-500 dark:text-slate-400 mt-2">Try adjusting your filters to find what you're looking for.</p>
            </div>
        )}
      </div>
    </div>
  );
};