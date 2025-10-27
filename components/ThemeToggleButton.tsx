import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleButtonProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ theme, toggleTheme }) => (
  <button
    onClick={toggleTheme}
    className="p-2 rounded-full text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-red-400 transition-colors"
    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
  >
    {theme === 'light' ? <Moon className="w-5 h-5 sm:w-6 sm:h-6" /> : <Sun className="w-5 h-5 sm:w-6 sm:h-6" />}
  </button>
);