import React from 'react';
import { Target, Globe, Users, BarChart3, ChevronRight, Edit } from 'lucide-react';
import { strategicThrusts } from '../../data/strategicData';
import type { StrategicDirection, StrategicObjective } from '../../types';
import { EditableText } from '../EditableText';

interface OverviewContentProps {
  isAdminMode?: boolean;
  direction?: StrategicDirection;
  objectives?: StrategicObjective[];
  onUpdateDirection?: (field: keyof StrategicDirection, value: string) => void;
  onUpdateObjective?: (id: number, field: 'title' | 'description' | 'imgSrc', value: string) => void;
  onOpenMediaLibrary: (callback: (url: string) => void) => void;
}

export const OverviewContent: React.FC<OverviewContentProps> = ({ 
  isAdminMode = false, 
  direction, 
  objectives, 
  onUpdateDirection, 
  onUpdateObjective,
  onOpenMediaLibrary,
}) => {

  const colorMap: Record<string, any> = {
    blue: { border: 'border-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-600 dark:text-blue-300', chevron: 'text-blue-500' },
    purple: { border: 'border-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-600 dark:text-purple-300', chevron: 'text-purple-500' },
    green: { border: 'border-green-500', bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-600 dark:text-green-300', chevron: 'text-green-500' },
    red: { border: 'border-red-500', bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-600 dark:text-red-300', chevron: 'text-red-500' },
  };

  if (!direction || !objectives) {
    return (
        <div className="text-center p-10 text-gray-500 dark:text-slate-400">
            Loading overview data...
        </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center border-b pb-4 border-gray-100 dark:border-slate-700">
          Our Strategic Direction
        </h2>
        <div className="space-y-8">
          <div className="space-y-4 p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/50 rounded-lg">
            <h3 className="text-2xl font-semibold text-red-700 dark:text-red-300 flex items-center"><Target className="w-6 h-6 mr-3" /> Vision</h3>
            <EditableText isAdminMode={isAdminMode} initialValue={direction.vision} onSave={(newValue) => onUpdateDirection && onUpdateDirection('vision', newValue)} label="Vision Statement" textClassName="text-gray-700 dark:text-slate-300 text-lg font-medium" inputClassName="text-lg font-medium" />
          </div>
          <div className="space-y-4 p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
            <h3 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 flex items-center"><Globe className="w-6 h-6 mr-3" /> Mission</h3>
            <EditableText isAdminMode={isAdminMode} initialValue={direction.mission} onSave={(newValue) => onUpdateDirection && onUpdateDirection('mission', newValue)} label="Mission Statement" isTextarea textClassName="text-gray-700 dark:text-slate-300" />
          </div>
          <div className="space-y-4 p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/50 rounded-lg">
            <h3 className="text-2xl font-semibold text-green-700 dark:text-green-300 flex items-center"><BarChart3 className="w-6 h-6 mr-3" /> Goal</h3>
            <EditableText isAdminMode={isAdminMode} initialValue={direction.goal} onSave={(newValue) => onUpdateDirection && onUpdateDirection('goal', newValue)} label="Goal Statement" isTextarea textClassName="text-gray-700 dark:text-slate-300" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">Our 4 Strategic Objectives</h2>
        <p className="text-center text-gray-600 dark:text-slate-300 mb-10 max-w-3xl mx-auto">Our 12 Strategic Thrusts are grouped into four core objectives that guide every aspect of our mission to build a better Sarawak.</p>
        <div className="grid md:grid-cols-2 gap-8">
          {objectives.map((obj) => {
            const colors = colorMap[obj.color];
            const Icon = obj.icon as React.ElementType; // Cast for JSX
            const handleIconEdit = () => {
              onOpenMediaLibrary((url) => {
                  onUpdateObjective?.(obj.id, 'imgSrc', url);
              });
            };
            return (
              <div key={obj.id} className={`bg-white dark:bg-slate-800/50 p-6 rounded-xl border-l-4 shadow-lg ${colors.border}`}>
                <div className="flex items-center mb-3">
                    <div className="relative group/icon">
                      <div className={`p-3 rounded-lg mr-4 ${colors.bg}`}>
                        {obj.imgSrc ? (
                          <img src={obj.imgSrc} alt={obj.title} className="w-7 h-7 object-contain" />
                        ) : (
                          <Icon className={`w-7 h-7 ${colors.text}`} />
                        )}
                      </div>
                      {isAdminMode && (
                        <>
                          <button onClick={handleIconEdit} className="absolute inset-0 w-full h-full bg-black/50 flex items-center justify-center opacity-0 group-hover/icon:opacity-100 transition-opacity rounded-lg" title="Change Icon">
                            <Edit className="w-4 h-4 text-white" />
                          </button>
                          <span className="absolute top-0 right-2 block h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-800 animate-pulse group-hover/icon:animate-none" title="This icon is editable" aria-hidden="true"></span>
                        </>
                      )}
                    </div>
                  <div className="flex-grow">
                     <EditableText isAdminMode={isAdminMode} initialValue={obj.title} onSave={(newValue) => onUpdateObjective && onUpdateObjective(obj.id, 'title', newValue)} label={`Objective ${obj.id} Title`} textClassName="text-xl font-bold text-gray-900 dark:text-slate-100" inputClassName="text-xl font-bold" />
                  </div>
                </div>
                <EditableText isAdminMode={isAdminMode} initialValue={obj.description} onSave={(newValue) => onUpdateObjective && onUpdateObjective(obj.id, 'description', newValue)} label={`Objective ${obj.id} Description`} isTextarea textClassName="text-gray-600 dark:text-slate-400 text-sm mb-4 pl-1 min-h-[3rem]" inputClassName="text-sm" />
                <ul className="space-y-2 text-sm mt-4 pt-4 border-t border-gray-200 dark:border-slate-700/50">
                  {obj.thrusts.map(thrustId => {
                    const thrust = strategicThrusts.find(t => t.id === thrustId);
                    if (!thrust) return null;
                    return (
                      <li key={thrust.id} className="flex items-start text-gray-700 dark:text-slate-300">
                        <ChevronRight className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${colors.chevron}`} />
                        <span><strong>T{thrust.id}:</strong> {thrust.title}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center border-b pb-4 border-gray-100 dark:border-slate-700">Our 12 Strategic Thrusts at a Glance</h2>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
          {strategicThrusts.map(thrust => (
            <div key={thrust.id} className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className={`${thrust.color} w-12 h-12 rounded-lg flex items-center justify-center mr-4 text-white flex-shrink-0`}>
                <thrust.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-slate-200">Thrust {thrust.id}: {thrust.title}</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400">{thrust.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};