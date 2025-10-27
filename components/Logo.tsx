import React from 'react';

interface LogoProps {
  src: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ src, className }) => (
  <img 
    src={src} 
    alt="JKR Sarawak Logo" 
    className={className} 
  />
);