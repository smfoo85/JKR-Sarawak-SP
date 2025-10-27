import React, { useState } from 'react';
import type { FooterData } from '../types';
import { EditableText } from './EditableText';
import { Edit, Save, X } from 'lucide-react';

interface FooterProps {
  isAdminMode: boolean;
  data: FooterData;
  onUpdate: (field: 'tagline' | 'copyright' | 'linkText' | 'linkHref', value: string, linkIndex?: number) => void;
}

export const Footer: React.FC<FooterProps> = ({ isAdminMode, data, onUpdate }) => {
  const [editingUrlIndex, setEditingUrlIndex] = useState<number | null>(null);
  const [urlValue, setUrlValue] = useState('');

  const handleEditUrlClick = (index: number, currentHref: string) => {
    setEditingUrlIndex(index);
    setUrlValue(currentHref);
  };

  const handleCancelUrlEdit = () => {
    setEditingUrlIndex(null);
    setUrlValue('');
  };

  const handleSaveUrl = (index: number) => {
    onUpdate('linkHref', urlValue, index);
    setEditingUrlIndex(null);
    setUrlValue('');
  };

  return (
    <footer className="bg-gray-900 dark:bg-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <EditableText
            isAdminMode={isAdminMode}
            initialValue={data.tagline}
            onSave={(newValue) => onUpdate('tagline', newValue)}
            label="Footer Tagline"
            textClassName="text-xl font-extrabold mb-4 text-red-400"
            inputClassName="text-xl font-extrabold"
          />
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 mt-4 text-sm">
            {data.links.map((link, index) => (
              <div key={index} className="group/container">
                {isAdminMode && editingUrlIndex === index ? (
                   <div className="flex items-center space-x-1 relative w-64">
                    <input
                      type="url"
                      value={urlValue}
                      onChange={(e) => setUrlValue(e.target.value)}
                      className="w-full text-xs bg-white dark:bg-slate-700 border border-red-500 rounded px-2 py-1 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveUrl(index)}
                    />
                    <div className="flex">
                      <button onClick={() => handleSaveUrl(index)} className="p-1.5 rounded-full hover:bg-green-100 dark:hover:bg-green-900 text-green-500" title="Save URL"><Save className="w-4 h-4" /></button>
                      <button onClick={handleCancelUrlEdit} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500" title="Cancel"><X className="w-4 h-4" /></button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center group/link">
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors underline-offset-4 hover:underline">
                      <EditableText
                        as="span"
                        isAdminMode={isAdminMode}
                        initialValue={link.text}
                        onSave={(newValue) => onUpdate('linkText', newValue, index)}
                        label={`Footer Link ${index + 1} Text`}
                      />
                    </a>
                    {isAdminMode && (
                      <button
                        onClick={() => handleEditUrlClick(index, link.href)}
                        className="ml-2 p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-500 opacity-0 group-hover/link:opacity-100 transition-opacity"
                        title={`Edit URL for ${link.text}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-gray-400 text-xs leading-relaxed border-t border-gray-700 pt-6">
            <p className="font-semibold text-gray-300">Public Works Department, Sarawak</p>
            <p>Wisma Saberkas, Jalan Tun Abang Haji Openg</p>
            <p>93582 Kuching, Sarawak, Malaysia</p>
            <div className="mt-3 flex justify-center items-center gap-x-6 gap-y-1 flex-wrap">
              <p>Tel: 082-203100, 082-203101</p>
              <p>Fax: 082-240097</p>
              <a href="mailto:corporatejkr@gmail.com" className="hover:text-red-400 transition-colors">Email: corporatejkr@gmail.com</a>
            </div>
          </div>

          <EditableText
            isAdminMode={isAdminMode}
            initialValue={data.copyright}
            onSave={(newValue) => onUpdate('copyright', newValue)}
            label="Copyright Notice"
            textClassName="mt-8 text-gray-400 text-xs"
            inputClassName="text-xs"
          />
        </div>
      </div>
    </footer>
  );
};