import React from 'react';

interface RadialProgressProps {
  percentage: number;
  color: string;
}

export const RadialProgress: React.FC<RadialProgressProps> = ({ percentage, color }) => {
  const radius = 50;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-28 h-28">
      <svg
        height="100%"
        width="100%"
        viewBox="0 0 120 120"
        className="transform -rotate-90"
      >
        <circle
          className="text-gray-200 dark:text-slate-700"
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius + stroke/2}
          cy={radius + stroke/2}
        />
        <circle
          className={`${color} transition-all duration-1000`}
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={radius + stroke/2}
          cy={radius + stroke/2}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800 dark:text-slate-200">
        {Math.round(percentage)}
        <span className="text-sm font-medium">%</span>
      </span>
    </div>
  );
};
