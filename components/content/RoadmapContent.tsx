import React, { useState } from 'react';
import { CheckCircle, Edit, Trash2, PlusCircle, Check, X } from 'lucide-react';
import type { TierMilestone } from '../../types';

interface RoadmapContentProps {
  isAdminMode?: boolean;
  milestones: TierMilestone[];
  onUpdateMilestone?: (tierIndex: number, milestoneIndex: number, newText: string) => void;
  onDeleteMilestone?: (tierIndex: number, milestoneIndex: number) => void;
  onAddMilestone?: (tierIndex: number, newText: string) => void;
}

const MilestoneItem: React.FC<{
  tierIndex: number;
  milestoneIndex: number;
  text: string;
  isAdminMode?: boolean;
  onUpdate: (tierIndex: number, milestoneIndex: number, newText: string) => void;
  onDelete: (tierIndex: number, milestoneIndex: number) => void;
}> = ({ tierIndex, milestoneIndex, text, isAdminMode, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(tierIndex, milestoneIndex, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(text);
    setIsEditing(false);
  };

  if (isAdminMode && isEditing) {
    return (
      <li className="flex items-center text-base space-x-2">
        <CheckCircle className="w-5 h-5 mr-1 flex-shrink-0" />
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="flex-grow bg-white dark:bg-slate-700 border border-red-500 rounded px-2 py-1 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />
        <button onClick={handleSave} className="p-1.5 rounded-full hover:bg-green-100 dark:hover:bg-green-900 text-green-500" title="Save">
          <Check className="w-4 h-4" />
        </button>
        <button onClick={handleCancel} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500" title="Cancel">
          <X className="w-4 h-4" />
        </button>
      </li>
    );
  }

  return (
    <li className="flex items-start text-base group">
      <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
      <span className="flex-grow">{text}</span>
      {isAdminMode && (
        <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setIsEditing(true)} className="p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-500" title="Edit Milestone">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(tierIndex, milestoneIndex)} className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500" title="Delete Milestone">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </li>
  );
};


const AddMilestone: React.FC<{
  tierIndex: number;
  onAdd: (tierIndex: number, newText: string) => void;
}> = ({ tierIndex, onAdd }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newText, setNewText] = useState('');

    const handleSave = () => {
        if (newText.trim()) {
            onAdd(tierIndex, newText.trim());
            setNewText('');
            setIsAdding(false);
        }
    };

    if (!isAdding) {
        return (
            <div className="mt-4 pt-4 border-t border-current border-opacity-30">
                <button onClick={() => setIsAdding(true)} className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Milestone</span>
                </button>
            </div>
        );
    }

    return (
        <div className="mt-4 pt-4 border-t border-current border-opacity-30 space-y-2">
            <input
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="w-full bg-white dark:bg-slate-700 border border-red-500 rounded px-2 py-1 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter new milestone text..."
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
             <div className="flex justify-end space-x-2">
                <button onClick={() => setIsAdding(false)} className="px-3 py-1 text-xs font-semibold rounded hover:bg-gray-200 dark:hover:bg-slate-600">Cancel</button>
                <button onClick={handleSave} className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded hover:bg-red-700">Save</button>
            </div>
        </div>
    );
};


export const RoadmapContent: React.FC<RoadmapContentProps> = ({ isAdminMode, milestones, onUpdateMilestone, onDeleteMilestone, onAddMilestone }) => (
  <div className="space-y-10">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Implementation Roadmap: Tier Milestones (2026-2029)</h2>
      <p className="text-gray-600 dark:text-slate-300 max-w-4xl mx-auto">
        Our phased approach ensures systematic implementation, focusing on laying a strong foundation, accelerating innovation, and institutionalizing excellence.
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {milestones.map((tier, tierIndex) => (
        <div key={tierIndex} className={`${tier.color} border-l-4 rounded-xl p-6 shadow-xl`}>
          <h3 className="text-2xl font-bold mb-6 pb-3 border-b-2 border-current">
            {tier.tier}
          </h3>
          <ul className="space-y-4">
            {tier.milestones.map((milestone, milestoneIndex) => (
              <MilestoneItem
                key={`${tierIndex}-${milestoneIndex}`}
                tierIndex={tierIndex}
                milestoneIndex={milestoneIndex}
                text={milestone}
                isAdminMode={isAdminMode}
                onUpdate={onUpdateMilestone!}
                onDelete={onDeleteMilestone!}
              />
            ))}
          </ul>
          {isAdminMode && onAddMilestone && (
              <AddMilestone tierIndex={tierIndex} onAdd={onAddMilestone} />
          )}
        </div>
      ))}
    </div>
  </div>
);