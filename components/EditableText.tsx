import React, { useState, useEffect } from 'react';
import { Edit, Save, X } from 'lucide-react';

interface EditableTextProps {
  isAdminMode: boolean;
  initialValue: string;
  onSave: (newValue: string) => void;
  as?: React.ElementType;
  isTextarea?: boolean;
  label: string; // For accessibility
  textClassName?: string;
  inputClassName?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({ isAdminMode, initialValue, onSave, as, isTextarea, label, textClassName, inputClassName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
    // Exit editing mode if admin mode is turned off
    if (!isAdminMode) {
      setIsEditing(false);
    }
  }, [initialValue, isAdminMode]);

  const handleSave = () => {
    onSave(value);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };
  
  const Component = as || 'p';

  if (isAdminMode && isEditing) {
    const InputComponent = isTextarea ? 'textarea' : 'input';
    return (
      <div className="relative">
        <label htmlFor={label} className="sr-only">{label}</label>
        <InputComponent
          id={label}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`w-full bg-white dark:bg-slate-700 border border-red-500 rounded px-2 py-1 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 ${inputClassName}`}
          autoFocus
          rows={isTextarea ? 4 : undefined}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isTextarea) handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
        />
        <div className="absolute -top-2 -right-2 flex space-x-1 z-10">
          <button onClick={handleSave} className="p-1.5 rounded-full bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-600 dark:text-green-300 shadow-lg" title="Save"><Save className="w-4 h-4" /></button>
          <button onClick={handleCancel} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 shadow-lg" title="Cancel"><X className="w-4 h-4" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group ${isAdminMode ? 'p-1 -m-1 border border-dashed border-transparent hover:border-blue-400 dark:hover:border-blue-600 rounded-md transition-colors' : ''}`}>
      <Component className={textClassName}>{initialValue}</Component>
      {isAdminMode && (
        <button onClick={() => setIsEditing(true)} className="absolute top-0 right-0 p-1 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-500 dark:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity" title={`Edit ${label}`}>
          <Edit className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
