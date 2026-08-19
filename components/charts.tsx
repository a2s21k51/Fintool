'use client';

import React, { useState } from 'react';
import { formatCompactINR, formatINR } from '@/lib/formatters';

interface DonutSlice {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

interface DonutChartProps {
  slices: DonutSlice[];
  centerLabel?: string;
  centerValue?: string;
  size?: number;
  className?: string;
}

export function DonutChart({
  slices,
  centerLabel,
  centerValue,
  size = 220,
  className = '',
}: DonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = slices.reduce((acc, s) => acc + Math.max(0, s.value), 0);

  if (total === 0) {
    return (
      <div className={`flex flex-col items-center justify-center p-6 text-slate-400 text-sm ${className}`}>
        No data to display
      </div>
    );
  }

  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Pure computation of slice fractions and start offsets
  const computedSlices = slices.map((slice, index) => {
    const fraction = total > 0 ? Math.max(0, slice.value) / total : 0;
    const offset = slices
      .slice(0, index)
      .reduce((sum, item) => sum + (total > 0 ? Math.max(0, item.value) / total : 0), 0);
    return { ...slice, fraction, offset };
  });

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          {computedSlices.map((slice, index) => {
            const strokeDasharray = `${slice.fraction * circumference} ${circumference}`;
            const strokeDashoffset = -slice.offset * circumference;

            const isHovered = hoveredIndex === index;

            return (
              <circle
                key={slice.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          {hoveredIndex !== null && slices[hoveredIndex] ? (
            <>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {slices[hoveredIndex].label}
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {slices[hoveredIndex].percentage}%
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-300">
                {formatCompactINR(slices[hoveredIndex].value)}
              </span>
            </>
          ) : (
            <>
              {centerLabel && (
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-tight">
                  {centerLabel}
                </span>
              )}
              {centerValue && (
                <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {centerValue}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
        {slices.map((slice, index) => (
          <div
            key={slice.label}
            className={`flex items-center gap-2 cursor-pointer transition-opacity ${
              hoveredIndex !== null && hoveredIndex !== index ? 'opacity-40' : 'opacity-100'
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: slice.color }} />
            <span className="text-slate-700 dark:text-slate-300 font-medium">{slice.label}</span>
            <span className="text-slate-500 dark:text-slate-400">({slice.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface AreaChartPoint {
  label: string;
  primaryValue: number;
  secondaryValue?: number;
}

interface GrowthAreaChartProps {
  data: AreaChartPoint[];
  primaryLabel: string;
  secondaryLabel?: string;
  primaryColor?: string;
  secondaryColor?: string;
  height?: number;
  className?: string;
}

export function GrowthAreaChart({
  data,
  primaryLabel,
  secondaryLabel,
  primaryColor = '#2563EB', // Royal Blue
  secondaryColor = '#93C5FD', // Light Blue / Slate
  height = 200,
  className = '',
}: GrowthAreaChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<AreaChartPoint | null>(null);

  if (!data || data.length === 0) {
    return <div className="p-6 text-center text-slate-400 text-sm">No trend data</div>;
  }

  const maxValue = Math.max(
    ...data.map((d) => Math.max(d.primaryValue, d.secondaryValue || 0)),
    100
  );

  const width = 500;
  const paddingX = 40;
  const paddingY = 20;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const getCoordinates = (val: number, index: number) => {
    const x = paddingX + (index / (data.length - 1 || 1)) * chartWidth;
    const y = height - paddingY - (val / maxValue) * chartHeight;
    return { x, y };
  };

  const primaryPoints = data.map((d, i) => getCoordinates(d.primaryValue, i));
  const secondaryPoints = secondaryLabel
    ? data.map((d, i) => getCoordinates(d.secondaryValue || 0, i))
    : [];

  const createPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    return points.reduce((acc, curr, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '');
  };

  const createAreaPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    const linePath = createPath(points);
    const last = points[points.length - 1];
    const first = points[0];
    return `${linePath} L ${last.x} ${height - paddingY} L ${first.x} ${height - paddingY} Z`;
  };

  return (
    <div className={`w-full flex flex-col ${className}`}>
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={primaryColor} stopOpacity="0.0" />
            </linearGradient>
            {secondaryLabel && (
              <linearGradient id="secondaryGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.25" />
                <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.0" />
              </linearGradient>
            )}
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = height - paddingY - ratio * chartHeight;
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-400 dark:fill-slate-500 text-[9px]"
                >
                  {formatCompactINR(ratio * maxValue)}
                </text>
              </g>
            );
          })}

          {/* Secondary Area & Line (e.g. Invested Amount) */}
          {secondaryLabel && secondaryPoints.length > 0 && (
            <>
              <path d={createAreaPath(secondaryPoints)} fill="url(#secondaryGrad)" />
              <path
                d={createPath(secondaryPoints)}
                fill="none"
                stroke={secondaryColor}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Primary Area & Line (e.g. Total Value) */}
          <path d={createAreaPath(primaryPoints)} fill="url(#primaryGrad)" />
          <path
            d={createPath(primaryPoints)}
            fill="none"
            stroke={primaryColor}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Interactive touch/hover points */}
          {data.map((d, i) => {
            const p = primaryPoints[i];
            const isHovered = hoveredPoint?.label === d.label;
            return (
              <g
                key={d.label}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(d)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 4}
                  fill={primaryColor}
                  stroke="white"
                  strokeWidth="2"
                  className="transition-all duration-200 shadow-sm"
                />
                {/* X Axis Label */}
                {(i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 5) === 0) && (
                  <text
                    x={p.x}
                    y={height - 4}
                    textAnchor="middle"
                    className="fill-slate-400 dark:fill-slate-500 text-[10px] font-medium"
                  >
                    {d.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hover Info Tooltip or Summary */}
      <div className="mt-2 min-h-[32px] flex items-center justify-between px-2 text-xs bg-slate-50 dark:bg-slate-900/60 rounded-lg p-2 border border-slate-100 dark:border-slate-800">
        {hoveredPoint ? (
          <>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {hoveredPoint.label}
            </span>
            <div className="flex items-center gap-4">
              {secondaryLabel && hoveredPoint.secondaryValue !== undefined && (
                <span className="text-slate-600 dark:text-slate-400">
                  {secondaryLabel}: <strong className="text-slate-900 dark:text-white">{formatINR(hoveredPoint.secondaryValue)}</strong>
                </span>
              )}
              <span className="text-emerald-600 dark:text-emerald-400">
                {primaryLabel}: <strong className="text-slate-900 dark:text-white">{formatINR(hoveredPoint.primaryValue)}</strong>
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between w-full text-slate-500 dark:text-slate-400">
            <span>Hover on graph for yearly values</span>
            <div className="flex items-center gap-3">
              {secondaryLabel && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
                  <span>{secondaryLabel}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                <span>{primaryLabel}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
