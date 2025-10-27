import React, { useState, useEffect, useRef } from 'react';
import { navItems } from '../data/strategicData';
import type { NavItem } from '../types';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (sectionId: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeSection, setActiveSection }) => {
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const navContainerRef = useRef<HTMLDivElement>(null);
    const [indicatorContainerStyle, setIndicatorContainerStyle] = useState({ left: 0, width: 0 });
    const [isIndicatorVisible, setIsIndicatorVisible] = useState(false);
    const isInitialRender = useRef(true);

    // This effect ensures our refs array is the correct size.
    useEffect(() => {
        itemRefs.current = itemRefs.current.slice(0, navItems.length);
    }, []);

    useEffect(() => {
        const activeIndex = navItems.findIndex(item => item.id === activeSection);
        const activeItemEl = itemRefs.current[activeIndex];

        if (activeItemEl) {
            const newStyle = {
                left: activeItemEl.offsetLeft,
                width: activeItemEl.offsetWidth,
            };

            // On initial load, position the indicator without animation.
            if (isInitialRender.current) {
                setIndicatorContainerStyle(newStyle);
                setIsIndicatorVisible(true);
                isInitialRender.current = false;
            } else {
                // For subsequent changes, hide the bar first to reset the animation.
                setIsIndicatorVisible(false);
                // Move the container instantly.
                setIndicatorContainerStyle(newStyle);

                // Use a timeout to allow React to update the DOM, then trigger the animation.
                const timer = setTimeout(() => {
                    setIsIndicatorVisible(true);
                }, 10);

                return () => clearTimeout(timer);
            }
            
            // Scroll the active item into view if the nav is scrollable
            activeItemEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [activeSection]);

  return (
    <nav className="bg-gray-800 dark:bg-black text-white sticky top-0 z-50 shadow-lg dark:shadow-md dark:shadow-red-500/10">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        <div ref={navContainerRef} className="relative flex space-x-2 sm:space-x-4 overflow-x-auto">
          {navItems.map((item: NavItem, index) => (
            <button
              key={item.id}
              ref={el => { if(el) itemRefs.current[index] = el; }}
              onClick={() => setActiveSection(item.id)}
              className={`relative flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-3 sm:px-4 whitespace-nowrap transition-colors duration-300 text-sm sm:text-base outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 dark:focus-visible:ring-offset-black focus-visible:ring-red-400 rounded-t-md
                ${activeSection === item.id
                  ? 'text-red-400 font-bold'
                  : 'text-gray-300 hover:text-white font-medium'
                }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
          <div
            className="absolute bottom-0 h-1"
            style={indicatorContainerStyle}
          >
            <div
                className={`h-full bg-red-500 rounded-full origin-center transition-transform duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] ${isIndicatorVisible ? 'scale-x-100' : 'scale-x-0'}`}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};