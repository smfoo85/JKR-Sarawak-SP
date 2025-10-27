import React from 'react';
import { Logo } from '../Logo';
import { EditableText } from '../EditableText';
import type { WelcomePageContent } from '../../types';

interface WelcomeContentProps {
  isAdminMode?: boolean;
  pageContent?: WelcomePageContent;
  onUpdatePageContent?: (field: keyof WelcomePageContent, value: string) => void;
  logoSrc: string;
}

export const WelcomeContent: React.FC<WelcomeContentProps> = ({ isAdminMode = false, pageContent, onUpdatePageContent, logoSrc }) => {

  if (!pageContent) {
    return (
        <div className="text-center p-10 text-gray-500 dark:text-slate-400">
            Loading welcome content...
        </div>
    );
  }

  const renderColoredTagline = (tagline: string) => {
    const parts = tagline.split(/(Build|You)/gi); // Use 'gi' for case-insensitive matching
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === 'build' || part.toLowerCase() === 'you' ? (
            <span key={index} className="text-red-500">
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </>
    );
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-10">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="text-center md:text-left">
          {/* FIX: Pass the logoSrc prop to the Logo component. */}
          <Logo src={logoSrc} className="h-32 w-auto mx-auto md:mx-0 mb-6" />
          <h1 className="text-5xl font-extrabold text-gray-800 dark:text-slate-200 tracking-wider">
            WELCOME
          </h1>
          <p className="mt-4 text-2xl font-bold text-gray-700 dark:text-slate-300">
            {renderColoredTagline('WE BUILD FOR YOU')}
          </p>
        </div>
        
        <div className="border-t-2 md:border-t-0 md:border-l-2 border-gray-200 dark:border-slate-700 pt-8 md:pt-0 md:pl-10">
            <EditableText
              isAdminMode={isAdminMode}
              initialValue={pageContent.title}
              onSave={(newValue) => onUpdatePageContent && onUpdatePageContent('title', newValue)}
              label="Welcome Title"
              textClassName="text-2xl font-bold text-gray-900 dark:text-white mb-2"
              inputClassName="text-2xl font-bold"
            />
            <EditableText
              isAdminMode={isAdminMode}
              initialValue={pageContent.subtitle}
              onSave={(newValue) => onUpdatePageContent && onUpdatePageContent('subtitle', newValue)}
              label="Welcome Subtitle"
              textClassName="text-lg font-semibold text-red-600 dark:text-red-400 mb-4"
              inputClassName="text-lg font-semibold"
            />
            <EditableText
              isAdminMode={isAdminMode}
              initialValue={pageContent.body}
              onSave={(newValue) => onUpdatePageContent && onUpdatePageContent('body', newValue)}
              label="Welcome Body Text"
              isTextarea
              textClassName="text-gray-600 dark:text-slate-300 leading-relaxed"
            />
        </div>
      </div>
    </div>
  );
};
