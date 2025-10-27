import React from 'react';
import { Shield, ShieldOff } from 'lucide-react';

interface AdminModeToggleProps {
  isAdminMode: boolean;
  toggleAdminMode: () => void;
}

export const AdminModeToggle: React.FC<AdminModeToggleProps> = ({ isAdminMode, toggleAdminMode }) => (
  <button
    onClick={toggleAdminMode}
    className={`p-2 rounded-full text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-colors focus-visible:ring-red-400 ${
      isAdminMode ? 'bg-red-500/50' : ''
    }`}
    aria-label={`Switch to ${isAdminMode ? 'user' : 'admin'} mode`}
    title={`Switch to ${isAdminMode ? 'user' : 'admin'} mode`}
  >
    {isAdminMode ? <ShieldOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Shield className="w-5 h-5 sm:w-6 sm:h-6" />}
  </button>
);