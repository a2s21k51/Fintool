'use client';

import React, { useState, useMemo } from 'react';
import {
  calculatePercentageOf,
  calculatePercentageChange,
  calculateWhatPercentOf,
  calculateCAGR,
  calculateAge,
  calculateInHandSalary,
} from '@/lib/calculators/everyday';
import { formatINR } from '@/lib/formatters';
import { InputSliderGroup, ActionButtonsBar } from '@/components/ui-elements';
import { Percent, TrendingUp, Calendar, UserCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface EverydayViewsProps {
  initialTab?: 'percentage' | 'cagr' | 'salary' | 'age';
}

export function EverydayViews({ initialTab = 'percentage' }: EverydayViewsProps) {
  const [activeTool, setActiveTool] = useState(initialTab);

  // Percentage states
  const [percentX, setPercentX] = useState<number>(18);
  const [percentY, setPercentY] = useState<number>(2500);
  const [percentMode, setPercentMode] = useState<'what-is-x-percent-of-y' | 'percentage-change' | 'x-is-what-percent-of-y'>('what-is-x-percent-of-y');
  const [oldVal, setOldVal] = useState<number>(1000);
  const [newVal, setNewVal] = useState<number>(1450);

  // CAGR states
  const [cagrInitial, setCagrInitial] = useState<number>(100000);
  const [cagrFinal, setCagrFinal] = useState<number>(250000);
  const [cagrYears, setCagrYears] = useState<number>(5);

  // Salary states
  const [annualCTC, setAnnualCTC] = useState<number>(1200000); // 12 Lakhs
  const [epfOpted, setEpfOpted] = useState<boolean>(true);
  const [professionalTax, setProfessionalTax] = useState<number>(200);

  // Age states
  const [birthDate, setBirthDate] = useState<string>('2000-01-15');

  // Calculations
  const percentResult1 = useMemo(() => calculatePercentageOf(percentX, percentY), [percentX, percentY]);
  const percentResult2 = useMemo(() => calculatePercentageChange(oldVal, newVal), [oldVal, newVal]);
  const percentResult3 = useMemo(() => calculateWhatPercentOf(percentX, percentY), [percentX, percentY]);

  const cagrResult = useMemo(() => calculateCAGR(cagrInitial, cagrFinal, cagrYears), [cagrInitial, cagrFinal, cagrYears]);
  const salaryResult = useMemo(() => calculateInHandSalary(annualCTC, epfOpted, professionalTax), [annualCTC, epfOpted, professionalTax]);
  const ageResult = useMemo(() => calculateAge(birthDate), [birthDate]);

  return (
    <div className="w-full space-y-8">
      {/* Tool Selector Ribbon */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        {[
          { id: 'percentage', label: 'Percentage Calculator', icon: Percent },
          { id: 'cagr', label: 'CAGR Stock Return Calculator', icon: TrendingUp },
          { id: 'salary', label: 'In-Hand CTC Salary Calculator', icon: UserCheck },
          { id: 'age', label: 'Age & Milestone Calculator', icon: Calendar },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTool(t.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTool === t.id
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Percentage View */}
      {activeTool === 'percentage' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { id: 'what-is-x-percent-of-y', label: 'What is X% of Y?' },
              { id: 'percentage-change', label: '% Increase / Decrease' },
              { id: 'x-is-what-percent-of-y', label: 'X is what % of Y?' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPercentMode(m.id as any)}
                className={`p-3 rounded-xl text-xs font-bold transition-all border text-left ${
                  percentMode === m.id
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-300 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            {percentMode === 'what-is-x-percent-of-y' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <InputSliderGroup
                    id="pct-x"
                    label="Percentage (X)"
                    value={percentX}
                    min={1}
                    max={100}
                    step={0.5}
                    unitSuffix="%"
                    onChange={setPercentX}
                  />
                  <InputSliderGroup
                    id="pct-y"
                    label="Total Value (Y)"
                    value={percentY}
                    min={10}
                    max={1000000}
                    step={50}
                    onChange={setPercentY}
                  />
                </div>

                <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 text-center space-y-2">
                  <span className="text-xs text-slate-500">
                    {percentX}% of {percentY} is:
                  </span>
                  <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {percentResult1.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Calculation: ({percentX} ÷ 100) × {percentY}
                  </div>
                </div>
              </div>
            )}

            {percentMode === 'percentage-change' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <InputSliderGroup
                    id="old-val"
                    label="Initial Value (Old)"
                    value={oldVal}
                    min={1}
                    max={1000000}
                    step={50}
                    onChange={setOldVal}
                  />
                  <InputSliderGroup
                    id="new-val"
                    label="Final Value (New)"
                    value={newVal}
                    min={1}
                    max={1000000}
                    step={50}
                    onChange={setNewVal}
                  />
                </div>

                <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 text-center space-y-2">
                  <span className="text-xs text-slate-500">
                    Percentage {percentResult2.type === 'increase' ? 'Increase' : 'Decrease'}:
                  </span>
                  <div
                    className={`text-4xl font-extrabold ${
                      percentResult2.type === 'increase'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {percentResult2.type === 'increase' ? '+' : '-'}
                    {percentResult2.percentageChange}%
                  </div>
                  <div className="text-xs text-slate-400">
                    Difference: {Math.abs(newVal - oldVal).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            )}

            {percentMode === 'x-is-what-percent-of-y' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <InputSliderGroup
                    id="part-x"
                    label="Part Value (X)"
                    value={percentX}
                    min={1}
                    max={percentY}
                    step={1}
                    onChange={setPercentX}
                  />
                  <InputSliderGroup
                    id="whole-y"
                    label="Whole Value (Y)"
                    value={percentY}
                    min={10}
                    max={1000000}
                    step={50}
                    onChange={setPercentY}
                  />
                </div>

                <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 text-center space-y-2">
                  <span className="text-xs text-slate-500">
                    {percentX} is what percent of {percentY}?
                  </span>
                  <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {percentResult3}%
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Calculation: ({percentX} ÷ {percentY}) × 100
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CAGR View */}
      {activeTool === 'cagr' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-5">
            <InputSliderGroup
              id="cagr-initial"
              label="Initial Investment Amount"
              value={cagrInitial}
              min={5000}
              max={10000000}
              step={5000}
              unitPrefix="₹"
              onChange={setCagrInitial}
              showWords={true}
            />
            <InputSliderGroup
              id="cagr-final"
              label="Final Value of Investment"
              value={cagrFinal}
              min={5000}
              max={50000000}
              step={10000}
              unitPrefix="₹"
              onChange={setCagrFinal}
              showWords={true}
            />
            <InputSliderGroup
              id="cagr-period"
              label="Investment Duration (Years)"
              value={cagrYears}
              min={1}
              max={30}
              step={1}
              unitSuffix=" Years"
              onChange={setCagrYears}
            />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Compounded Annual Growth Rate (CAGR)
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  {cagrResult.cagr}%
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Annualized compound rate over {cagrYears} years
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                  <span className="text-slate-500 font-medium">Absolute Return</span>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {cagrResult.absoluteReturn}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Total Profit</span>
                  <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    +{formatINR(cagrResult.totalGain)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Salary View */}
      {activeTool === 'salary' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-5">
            <InputSliderGroup
              id="salary-ctc"
              label="Annual Cost to Company (CTC)"
              value={annualCTC}
              min={300000}
              max={5000000}
              step={25000}
              unitPrefix="₹"
              onChange={setAnnualCTC}
              showWords={true}
              presetValues={[
                { label: '₹6 Lakh', value: 600000 },
                { label: '₹10 Lakh', value: 1000000 },
                { label: '₹15 Lakh', value: 1500000 },
                { label: '₹25 Lakh', value: 2500000 },
              ]}
            />

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">EPF Deduction (12% of Basic)</div>
                <div className="text-slate-500">Includes Employee + Employer contribution</div>
              </div>
              <input
                type="checkbox"
                checked={epfOpted}
                onChange={(e) => setEpfOpted(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Estimated Monthly In-Hand Salary
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {formatINR(salaryResult.monthlyInHand)}
                </div>
                <span className="text-xs text-slate-500">Credited to your bank account every month</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-medium">
                  <span className="text-slate-500">Gross Monthly:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatINR(salaryResult.monthlyGross)}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-300 font-medium">
                  <span>Employee PF (EPF):</span>
                  <span className="font-bold">-{formatINR(salaryResult.monthlyEmployeePF)}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-300 font-medium">
                  <span>Estimated TDS (Income Tax):</span>
                  <span className="font-bold">-{formatINR(salaryResult.monthlyTDS)}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-medium">
                  <span>Professional Tax:</span>
                  <span>-{formatINR(salaryResult.professionalTaxMonthly)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Age View */}
      {activeTool === 'age' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="max-w-md space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Select Your Date of Birth:
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full text-sm font-semibold p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
              <span className="text-xs text-slate-500 font-medium">Exact Age</span>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                {ageResult.years} Yrs, {ageResult.months} Mos, {ageResult.days} Days
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-center">
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">Next Birthday In</span>
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {ageResult.nextBirthdayDays} Days
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
              <span className="text-xs text-slate-500 font-medium">Total Days Lived</span>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                {ageResult.totalDays.toLocaleString('en-IN')} Days
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
