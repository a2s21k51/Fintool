'use client';

import React, { useState, useMemo } from 'react';
import {
  convertUnit,
  UNIT_CATEGORIES,
  UnitCategory,
} from '@/lib/calculators/converters';
import { ArrowLeftRight, Ruler, Layers, Scale, Sparkles, Compass, CheckCircle2 } from 'lucide-react';

interface ConverterWorkspaceProps {
  initialCategory?: UnitCategory;
}

export function ConverterWorkspace({ initialCategory = 'area' }: ConverterWorkspaceProps) {
  // Unit converter states
  const [unitCategory, setUnitCategory] = useState<UnitCategory>(initialCategory);
  const [unitAmount, setUnitAmount] = useState<number>(1000);
  const [fromUnit, setFromUnit] = useState<string>('sqft');
  const [toUnit, setToUnit] = useState<string>('sqyd');

  // Calculation
  const unitResult = useMemo(() => {
    return convertUnit(unitCategory, unitAmount, fromUnit, toUnit);
  }, [unitAmount, unitCategory, fromUnit, toUnit]);

  const singleUnitRate = useMemo(() => {
    return convertUnit(unitCategory, 1, fromUnit, toUnit);
  }, [unitCategory, fromUnit, toUnit]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const currentCategoryData = UNIT_CATEGORIES[unitCategory];
  const currentCategoryUnits = currentCategoryData?.units || [];

  const handleCategorySelect = (catKey: UnitCategory) => {
    setUnitCategory(catKey);
    const cat = UNIT_CATEGORIES[catKey];
    setFromUnit(cat.units[0].id);
    setToUnit(cat.units[1]?.id || cat.units[0].id);
  };

  return (
    <div className="w-full space-y-8">
      {/* Unit Category Selector Ribbon */}
      <div className="p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap gap-1.5">
        {(Object.keys(UNIT_CATEGORIES) as UnitCategory[]).map((catKey) => {
          const cat = UNIT_CATEGORIES[catKey];
          const isSelected = unitCategory === catKey;
          return (
            <button
              key={catKey}
              type="button"
              onClick={() => handleCategorySelect(catKey)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Converter Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {currentCategoryData?.label} Conversion
            </h3>
            <p className="text-xs text-slate-500">
              Zero-latency static mathematical formulas. Standard conversion factors.
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800">
            Standard Constants
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
          {/* Amount input */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Quantity / Input Value
            </label>
            <input
              type="number"
              value={unitAmount}
              onChange={(e) => setUnitAmount(parseFloat(e.target.value) || 0)}
              className="w-full text-base font-bold p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>

          {/* From Unit */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              From Unit
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full text-sm font-semibold p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer"
            >
              {currentCategoryUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pt-4">
            <button
              type="button"
              onClick={swapUnits}
              className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer transition-transform active:scale-95 shadow-xs"
              title="Swap Units"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* To Unit */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              To Unit
            </label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full text-sm font-semibold p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer"
            >
              {currentCategoryUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Unit Result Card */}
        <div className="p-6 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 text-center space-y-2">
          <span className="text-xs text-blue-100 font-semibold uppercase tracking-wider">
            {unitAmount} {currentCategoryUnits.find((u) => u.id === fromUnit)?.name} =
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            {unitResult.toLocaleString('en-IN', { maximumFractionDigits: 6 })}
          </div>
          <p className="text-xs text-blue-100">
            1 {currentCategoryUnits.find((u) => u.id === fromUnit)?.name} ={' '}
            {singleUnitRate.toLocaleString('en-IN', {
              maximumFractionDigits: 6,
            })}{' '}
            {currentCategoryUnits.find((u) => u.id === toUnit)?.name}
          </p>
        </div>

        {/* Quick Click Values */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-medium text-slate-400">Quick Values:</span>
          {[1, 5, 10, 50, 100, 500, 1000, 5000].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setUnitAmount(v)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Indian Land Measurement Reference Matrix (100% Static Real Estate Cheatsheet) */}
      {unitCategory === 'area' && (
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Indian Land Measurement Units (Quick Reference Guide)
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white">1 Acre</span>
              <p className="text-slate-500 dark:text-slate-400">
                43,560 sq ft = 4,840 sq yd (Gaj) = 40 Guntha = 100 Cents
              </p>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white">1 Gaj (Square Yard)</span>
              <p className="text-slate-500 dark:text-slate-400">
                9 sq ft = 0.836 sq meters
              </p>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white">1 Guntha (West/South India)</span>
              <p className="text-slate-500 dark:text-slate-400">
                1,089 sq ft (33 ft × 33 ft) = 121 sq yd = 1/40 Acre
              </p>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white">1 Bigha (Standard)</span>
              <p className="text-slate-500 dark:text-slate-400">
                27,000 sq ft (approx 2,500 sq m) = 20 Biswa
              </p>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white">1 Cent (South India)</span>
              <p className="text-slate-500 dark:text-slate-400">
                435.6 sq ft = 40.468 sq meters = 1/100 Acre
              </p>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white">1 Hectare</span>
              <p className="text-slate-500 dark:text-slate-400">
                10,000 sq m = 1,07,639 sq ft = 2.471 Acres
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
