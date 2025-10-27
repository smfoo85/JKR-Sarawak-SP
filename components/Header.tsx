import React, { useState, useEffect } from 'react';
import { PDFDownloadButton } from './PDFDownloadButton';
import { ThemeToggleButton } from './ThemeToggleButton';
import { AdminModeToggle } from './AdminModeToggle';
import type { HeaderData } from '../types';
import { EditableText } from './EditableText';
import { Edit, Save, X, LibraryBig, Link, CheckCircle, RotateCcw } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isAdminMode: boolean;
  toggleAdminMode: () => void;
  data: HeaderData;
  onUpdate: (field: keyof HeaderData, value: string) => void;
  logoSrc: string;
  onOpenMediaLibrary: (callback?: (url: string) => void) => void;
  onUpdateLogo: (src: string) => void;
  onResetLogo: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  theme, 
  toggleTheme, 
  isAdminMode, 
  toggleAdminMode, 
  data, 
  onUpdate, 
  logoSrc, 
  onOpenMediaLibrary,
  onUpdateLogo,
  onResetLogo,
}) => {
  const [isEditingTagline, setIsEditingTagline] = useState(false);
  const [taglineValue, setTaglineValue] = useState(data.tagline);
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [linkValue, setLinkValue] = useState(data.headerLink);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);


  useEffect(() => {
    setTaglineValue(data.tagline);
    setLinkValue(data.headerLink);
    if (!isAdminMode) {
      setIsEditingTagline(false);
      setIsEditingLink(false);
    }
  }, [data.tagline, data.headerLink, isAdminMode]);

  const handleSaveTagline = () => {
    onUpdate('tagline', taglineValue);
    setIsEditingTagline(false);
  };

  const handleCancelTagline = () => {
    setTaglineValue(data.tagline);
    setIsEditingTagline(false);
  };

  const handleSaveLink = () => {
    onUpdate('headerLink', linkValue);
    setIsEditingLink(false);
  };

  const handleCancelLink = () => {
    setLinkValue(data.headerLink);
    setIsEditingLink(false);
  };
  
  const handleLogoUpdate = (src: string) => {
    onUpdateLogo(src);
    setConfirmationMessage("Logo updated!");
    setTimeout(() => setConfirmationMessage(null), 2500);
  };

  const handleLogoEdit = () => {
    onOpenMediaLibrary(handleLogoUpdate);
  };
  
  const handleResetLogo = () => {
    onResetLogo();
    setConfirmationMessage("Logo reset!");
    setTimeout(() => setConfirmationMessage(null), 2500);
  };

  const isCustomLogo = logoSrc !== '/assets/jkr-logo.svg';

  const renderColoredTagline = (tagline: string) => {
    const parts = tagline.split(/(Build|You)/i);
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
  
  const taglineTextClasses = "ml-3 italic hidden md:inline-block";
  const taglineInputClasses = "ml-3 italic";

  return (
  <header className="bg-black text-white dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <div className="relative group/logo">
          <Logo src={logoSrc} className="h-10 w-auto mr-3 flex-shrink-0" />
          {isAdminMode && !confirmationMessage && (
            <div className="absolute inset-0 w-full h-full bg-black/50 flex items-center justify-center gap-2 transition-opacity rounded-md opacity-0 group-hover/logo:opacity-100">
              <button
                onClick={handleLogoEdit}
                className="p-2 rounded-full bg-black/50 hover:bg-black/80"
                title="Change Logo"
              >
                <Edit className="w-5 h-5 text-white" />
              </button>
              {isCustomLogo && (
                <button
                  onClick={handleResetLogo}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/80"
                  title="Reset to Default Logo"
                >
                  <RotateCcw className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
          )}
          {confirmationMessage && (
            <div className="absolute inset-0 w-full h-full bg-black/70 flex flex-col items-center justify-center transition-opacity rounded-md">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-xs text-white mt-1">{confirmationMessage}</span>
            </div>
          )}
        </div>
        <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-wide uppercase">
            <EditableText
                as="span"
                isAdminMode={isAdminMode}
                initialValue={data.mainTitle}
                onSave={(newValue) => onUpdate('mainTitle', newValue)}
                label="Main Title"
            />
            
            {isAdminMode && isEditingTagline ? (
                <div className={`relative inline-block ${taglineTextClasses}`}>
                <input
                    value={taglineValue}
                    onChange={(e) => setTaglineValue(e.target.value)}
                    className={`bg-white dark:bg-slate-700 border border-red-500 rounded px-2 py-1 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 ${taglineInputClasses}`}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveTagline()}
                />
                <div className="absolute -top-2 -right-2 flex space-x-1 z-10">
                    <button onClick={handleSaveTagline} className="p-1.5 rounded-full bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-600 dark:text-green-300 shadow-lg" title="Save"><Save className="w-4 h-4" /></button>
                    <button onClick={handleCancelTagline} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 shadow-lg" title="Cancel"><X className="w-4 h-4" /></button>
                </div>
                </div>
            ) : (
                <span className={`relative group ${taglineTextClasses}`}>
                {renderColoredTagline(data.tagline)}
                {isAdminMode && (
                    <button 
                    onClick={() => setIsEditingTagline(true)} 
                    className="absolute -top-2 -right-7 p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-500 dark:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity" 
                    title="Edit Header Tagline"
                    >
                    <Edit className="w-4 h-4" />
                    </button>
                )}
                </span>
            )}

            </h1>
            {/* NEW LINK EDITING UI */}
            {isAdminMode && (
                <div className="text-sm font-normal normal-case relative group/link-editor">
                    {isEditingLink ? (
                        <div className="flex items-center space-x-1 p-1 bg-gray-900 dark:bg-slate-700 rounded-lg">
                            <Link className="w-4 h-4 text-gray-400 ml-1 flex-shrink-0" />
                            <input
                                value={linkValue}
                                onChange={(e) => setLinkValue(e.target.value)}
                                className="bg-gray-800 dark:bg-slate-600 border border-red-500 rounded px-2 py-1 text-white dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Enter URL"
                                size={25}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveLink()}
                            />
                            <button onClick={handleSaveLink} className="p-1.5 rounded-full bg-green-900 hover:bg-green-800 text-green-300" title="Save Link"><Save className="w-4 h-4" /></button>
                            <button onClick={handleCancelLink} className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300" title="Cancel"><X className="w-4 h-4" /></button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                             <span className="text-gray-400 truncate max-w-[150px] hidden lg:inline-block" title={data.headerLink}>{data.headerLink}</span>
                             <button 
                                onClick={() => setIsEditingLink(true)} 
                                className="p-1.5 rounded-full bg-blue-900 hover:bg-blue-800 text-blue-300"
                                title="Edit Header Link"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {isAdminMode && (
          <button
            onClick={() => onOpenMediaLibrary()}
            className="p-2 rounded-full text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-colors"
            title="Open Media Library"
          >
            <LibraryBig className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
        <PDFDownloadButton />
        <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
        <AdminModeToggle isAdminMode={isAdminMode} toggleAdminMode={toggleAdminMode} />
      </div>
    </div>
  </header>
  );
};