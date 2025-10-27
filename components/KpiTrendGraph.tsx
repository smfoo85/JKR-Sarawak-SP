import React, { useState, useRef, useMemo } from 'react';
import type { KPIHistory } from '../types';

interface KpiTrendGraphProps {
  history: KPIHistory[];
  targetValue: number;
  color: string;
}

// Helper to parse YYYY-MM-DD string as UTC to avoid timezone issues
const parseDateUTC = (dateString: string) => new Date(dateString + 'T00:00:00Z');

export const KpiTrendGraph: React.FC<KpiTrendGraphProps> = ({ history, targetValue, color }) => {
  if (!history || history.length < 2) {
    return (
      <div className="h-24 flex items-center justify-center text-xs text-gray-400 dark:text-slate-500">
        Not enough data for trend graph.
      </div>
    );
  }

  // State for tooltip
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    content: { date: string; value: number; trendValue?: number; };
    x: number;
    y: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Graph dimensions - adjusted for labels
  const width = 315;
  const height = 135;
  const padding = { top: 10, right: 10, bottom: 35, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const values = history.map(h => h.value);
  const minVal = 0;
  const maxVal = Math.max(targetValue, ...values) * 1.1 || 100; // handle case where all values are 0

  const getX = (index: number) => {
    if (history.length <= 1) return padding.left + graphWidth / 2;
    const x = padding.left + (index / (history.length - 1)) * graphWidth;
    return isFinite(x) ? x : padding.left;
  };

  const getY = (value: number) => {
    if (maxVal === minVal) return padding.top + graphHeight;
    const y = padding.top + graphHeight - ((value - minVal) / (maxVal - minVal)) * graphHeight;
    return isFinite(y) ? y : padding.top + graphHeight;
  };
  
  // Date formatting for axis labels
  const formatDateLabel = (dateString: string) => {
    const date = parseDateUTC(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' });
  };

  const yAxisLabels = useMemo(() => {
    const range = maxVal - minVal;
    if (range === 0) return [minVal];
    const numTicks = 4;
    const tickSize = range / (numTicks - 1);
    const labels = Array.from({ length: numTicks }, (_, i) => minVal + i * tickSize);
    return labels.map(l => Math.round(l));
  }, [minVal, maxVal]);

  const xAxisLabels = useMemo(() => {
      const labels = [];
      labels.push({ x: padding.left, text: formatDateLabel(history[0].date), anchor: 'start' as const });
      if (history.length > 3) {
          const midIndex = Math.floor(history.length / 2);
          labels.push({ x: getX(midIndex), text: formatDateLabel(history[midIndex].date), anchor: 'middle' as const });
      }
      labels.push({ x: width - padding.right, text: formatDateLabel(history[history.length - 1].date), anchor: 'end' as const });
      return labels;
  }, [history, width, padding.left, padding.right, getX]);


  const trendData = useMemo(() => {
    if (history.length < 2) return null;

    // Convert dates to numerical values (days from start) for regression
    const firstDate = parseDateUTC(history[0].date).getTime();
    const points = history.map(h => ({
      x: (parseDateUTC(h.date).getTime() - firstDate) / (1000 * 60 * 60 * 24),
      y: h.value
    }));

    const n = points.length;
    const sumX = points.reduce((acc, p) => acc + p.x, 0);
    const sumY = points.reduce((acc, p) => acc + p.y, 0);
    const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);
    const sumX2 = points.reduce((acc, p) => acc + p.x * p.x, 0);

    const numerator = (n * sumXY - sumX * sumY);
    const denominator = (n * sumX2 - sumX * sumX);

    // Avoid division by zero if all x values are the same
    if (denominator === 0) return null;

    const slope = numerator / denominator;
    const intercept = (sumY - slope * sumX) / n;

    // Calculate the y-values for the start and end points of the trendline
    const startX = points[0].x;
    const endX = points[points.length - 1].x;
    const startY = slope * startX + intercept;
    const endY = slope * endX + intercept;
    
    return {
      slope,
      intercept,
      line: {
        x1: getX(0),
        y1: getY(startY),
        x2: getX(history.length - 1),
        y2: getY(endY),
      }
    };
  }, [history, targetValue]);

  const linePath = history
    .map((point, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(point.value)}`)
    .join(' ');
    
  const targetY = getY(targetValue);

  // Tooltip handlers
  const handleMouseEnter = (e: React.MouseEvent, point: KPIHistory) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    let trendValue: number | undefined = undefined;
    if (trendData) {
      const firstDate = parseDateUTC(history[0].date).getTime();
      const currentX = (parseDateUTC(point.date).getTime() - firstDate) / (1000 * 60 * 60 * 24);
      trendValue = trendData.slope * currentX + trendData.intercept;
    }

    setTooltip({
      visible: true,
      content: { ...point, trendValue },
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };
  
  return (
    <div ref={containerRef} className="w-full relative">
      <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">Performance Trend</p>
      <svg viewBox={`0 0 ${width} ${height}`} className={`w-full h-auto ${color}`}>
        {/* Y-Axis Title */}
        <text
          transform="rotate(-90)"
          x={-(padding.top + graphHeight / 2)}
          y={15}
          textAnchor="middle"
          className="text-[10px] font-semibold fill-current text-gray-500 dark:text-slate-400"
        >
          Value
        </text>

        {/* Y-Axis Value Labels */}
        {yAxisLabels.map((label, i) => (
          <text key={i} x={padding.left - 5} y={getY(label)} dy="0.3em" textAnchor="end" className="text-[10px] fill-current text-gray-500 dark:text-slate-400">
              {label}
          </text>
        ))}
        
        {/* X-Axis Title */}
        <text
          x={padding.left + graphWidth / 2}
          y={height - 5}
          textAnchor="middle"
          className="text-[10px] font-semibold fill-current text-gray-500 dark:text-slate-400"
        >
          Date
        </text>

        {/* X-Axis Date Labels */}
        {xAxisLabels.map((label, i) => (
            <text key={i} x={label.x} y={height - padding.bottom + 15} textAnchor={label.anchor} className="text-[10px] fill-current text-gray-500 dark:text-slate-400">
                {label.text}
            </text>
        ))}

        {/* Target Line & Label */}
        <g>
            <line
              x1={padding.left}
              y1={targetY}
              x2={width - padding.right}
              y2={targetY}
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3,3"
              opacity="0.6"
            />
            <text
              x={width - padding.right + 2}
              y={targetY}
              dy="0.3em"
              className="text-[9px] font-semibold fill-current"
              opacity="0.8"
            >
              Target: {targetValue}
            </text>
        </g>
        
        {/* Trendline */}
        {trendData && (
          <line
            x1={trendData.line.x1}
            y1={trendData.line.y1}
            x2={trendData.line.x2}
            y2={trendData.line.y2}
            strokeWidth="1.5"
            strokeDasharray="4,4"
            className="stroke-gray-600 dark:stroke-slate-400"
          />
        )}
        
        {/* Actual Data Line */}
        <path d={linePath} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data Points with Hover areas */}
        {history.map((point, i) => (
          <g key={i}>
            <circle cx={getX(i)} cy={getY(point.value)} r="4" fill="currentColor" />
            <circle 
              cx={getX(i)} 
              cy={getY(point.value)} 
              r="10" 
              fill="transparent" 
              className="cursor-pointer"
              onMouseEnter={(e) => handleMouseEnter(e, point)}
              onMouseLeave={handleMouseLeave}
            />
          </g>
        ))}
      </svg>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-600 dark:text-slate-400">
        <div className="flex items-center space-x-1.5">
            <span className={`w-4 h-1 rounded-full ${color.replace('text-', 'bg-')}`}></span>
            <span>Actual</span>
        </div>
        {trendData && (
          <div className="flex items-center space-x-1.5">
              <span className="w-4 border-t-2 border-dashed border-gray-600 dark:border-slate-400"></span>
              <span>Trend</span>
          </div>
        )}
        <div className="flex items-center space-x-1.5">
            <span className={`w-4 border-t border-dashed ${color.replace('text-', 'border-')} opacity-60`}></span>
            <span>Target</span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && tooltip.visible && (
        <div 
          className="absolute bg-gray-900 dark:bg-black text-white text-xs rounded-lg shadow-xl p-2.5 pointer-events-none transition-opacity transform -translate-y-full -translate-x-1/2 z-10 min-w-[120px]"
          style={{ top: tooltip.y - 15, left: tooltip.x }}
        >
          <p className="font-bold text-center border-b border-gray-700 pb-1 mb-1.5 whitespace-nowrap">{parseDateUTC(tooltip.content.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })}</p>
          <div className="space-y-1">
              <div className="flex justify-between items-center">
                  <span className="flex items-center"><div className={`w-2 h-2 rounded-full mr-1.5 ${color.replace('text-', 'bg-')}`}></div>Actual:</span>
                  <span className="font-semibold ml-2">{tooltip.content.value}</span>
              </div>
              {tooltip.content.trendValue !== undefined && (
                  <div className="flex justify-between items-center text-slate-300">
                      <span className="flex items-center"><div className="w-2 h-2 rounded-full mr-1.5 bg-gray-500"></div>Trend:</span>
                      <span className="font-semibold ml-2">{tooltip.content.trendValue.toFixed(1)}</span>
                  </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};