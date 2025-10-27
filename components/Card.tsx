import React from 'react';
import type { IconType } from '../types';

interface CardProps {
  title: string;
  description: string;
  icon: IconType;
  bgColor: string;
  iconColor: string;
  progress?: number;
  color?: string;
}

export const Card: React.FC<CardProps> = ({ title, description, icon: Icon, bgColor, iconColor, progress, color }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border-t-8 border-gray-100 dark:border-slate-700 hover:border-green-500 transition-colors flex flex-col">
    <div className="flex-grow">
      <div className={`w-14 h-14 ${bgColor} rounded-full flex items-center justify-center mb-4`}>
        <Icon className={`w-7 h-7 ${iconColor}`} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-slate-400 text-sm">{description}</p>
    </div>
    {typeof progress === 'number' && (
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700/50">
        <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">
          <span>Overall Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
          <div 
            className={`${color || 'bg-blue-600'} h-2.5 rounded-full transition-all duration-500`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    )}
  </div>
);