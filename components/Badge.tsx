
import React from 'react';

interface BadgeProps {
  text: string;
  color: string;
}

export const Badge: React.FC<BadgeProps> = ({ text, color }) => (
  <div className={`${color} text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md`}>
    {text}
  </div>
);
