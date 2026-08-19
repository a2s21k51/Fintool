'use client';

import React, { useState } from 'react';
import { formatNumberIndian, numberToIndianWords } from '@/lib/formatters';
import { Check, Copy, Printer, RotateCcw, Share2 } from 'lucide-react';

interface InputSliderGroupProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unitPrefix?: string;
  unitSuffix?: string;
  onChange: (val: number) => void;
  presetValues?: { label: string; value: number }[];
  showWords?: boolean;
  helpText?: string;
}

export function InputSliderGroup({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  unitPrefix = '',
  unitSuffix = '',
  onChange,
  presetValues,
  showWords = false,
  helpText,
}: InputSliderGroupProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [localInput, setLocalInput] = useState<string>('');

  const displayValue = isFocused ? localInput : formatNumberIndian(value);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseFloat(e.target.value);
    onChange(num);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    setLocalInput(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      onChange(Math.min(max * 10, Math.max(0, parsed)));
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setLocalInput(String(value));
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {label}
        </label>
        
        {/* Number Input Box */}
        <div className="relative flex items-center">
          {unitPrefix && (
            <span className="absolute left-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 pointer-events-none">
              {unitPrefix}
            </span>
          )}
          <input
            id={id}
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`w-32 sm:w-36 text-right font-bold text-base py-1.5 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
              unitPrefix ? 'pl-6' : 'pl-3'
            } ${unitSuffix ? 'pr-8' : 'pr-3'} border-slate-300 dark:border-slate-700`}
          />
          {unitSuffix && (
            <span className="absolute right-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 pointer-events-none">
              {unitSuffix}
            </span>
          )}
        </div>
      </div>

      {/* Slider */}
      <div className="pt-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500 focus:outline-none"
        />
        <div className="flex justify-between text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1">
          <span>{unitPrefix}{formatNumberIndian(min)}{unitSuffix}</span>
          <span>{unitPrefix}{formatNumberIndian(max)}{unitSuffix}</span>
        </div>
      </div>

      {/* Preset Pills */}
      {presetValues && presetValues.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {presetValues.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                onChange(preset.value);
                setLocalInput(formatNumberIndian(preset.value));
              }}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                value === preset.value
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      {/* Words breakdown for big currency amounts */}
      {showWords && value > 0 && (
        <div className="text-[11px] text-blue-700 dark:text-blue-400 font-medium bg-blue-50/50 dark:bg-blue-950/30 px-2 py-1 rounded">
          {numberToIndianWords(value)}
        </div>
      )}

      {helpText && (
        <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
          {helpText}
        </span>
      )}
    </div>
  );
}

interface ActionButtonsBarProps {
  onReset: () => void;
  resultSummaryText: string;
}

export function ActionButtonsBar({ onReset, resultSummaryText }: ActionButtonsBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(resultSummaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FinTools India Calculation Result',
          text: resultSummaryText,
          url: window.location.href,
        });
      } catch {
        // ignore
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>Share</span>
      </button>

      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors hidden sm:inline-flex"
      >
        <Printer className="w-3.5 h-3.5" />
        <span>Print</span>
      </button>

      <div className="flex-1" />

      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset Inputs</span>
      </button>
    </div>
  );
}
