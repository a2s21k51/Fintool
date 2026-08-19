'use client';

import React, { useState, useMemo } from 'react';
import {
  calculateFD,
  calculateRD,
  calculatePPF,
  calculateCompoundInterest,
  calculateSimpleInterest,
} from '@/lib/calculators/deposits';
import { formatINR } from '@/lib/formatters';
import { InputSliderGroup, ActionButtonsBar } from '@/components/ui-elements';
import { DonutChart, GrowthAreaChart } from '@/components/charts';
import { ShieldCheck, Info } from 'lucide-react';

interface DepositsViewProps {
  initialType?: 'fd' | 'rd' | 'ppf' | 'ci' | 'si';
}

export function DepositsView({ initialType = 'fd' }: DepositsViewProps) {
  const [type, setType] = useState<'fd' | 'rd' | 'ppf' | 'ci' | 'si'>(initialType);

  // States
  const [depositAmount, setDepositAmount] = useState<number>(500000); // 5 Lakhs for FD / CI / SI
  const [rdMonthlyDeposit, setRdMonthlyDeposit] = useState<number>(5000); // 5k for RD
  const [ppfYearlyDeposit, setPpfYearlyDeposit] = useState<number>(150000); // 1.5 Lakh max for PPF
  const [interestRate, setInterestRate] = useState<number>(7.1);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [compoundingFreq, setCompoundingFreq] = useState<'quarterly' | 'monthly' | 'annually' | 'semi-annually' | 'daily'>('quarterly');

  const handleReset = () => {
    setDepositAmount(500000);
    setRdMonthlyDeposit(5000);
    setPpfYearlyDeposit(150000);
    setInterestRate(type === 'ppf' ? 7.1 : 7.0);
    setTenureYears(type === 'ppf' ? 15 : 5);
  };

  // Calculations
  const fdResult = useMemo(() => {
    const freqPerYear = compoundingFreq === 'monthly' ? 12 : compoundingFreq === 'quarterly' ? 4 : 1;
    return calculateFD(depositAmount, interestRate, tenureYears, freqPerYear);
  }, [depositAmount, interestRate, tenureYears, compoundingFreq]);

  const rdResult = useMemo(() => {
    return calculateRD(rdMonthlyDeposit, interestRate, tenureYears * 12);
  }, [rdMonthlyDeposit, interestRate, tenureYears]);

  const ppfResult = useMemo(() => {
    return calculatePPF(ppfYearlyDeposit, 7.1, tenureYears);
  }, [ppfYearlyDeposit, tenureYears]);

  const ciResult = useMemo(() => {
    return calculateCompoundInterest(depositAmount, interestRate, tenureYears, compoundingFreq);
  }, [depositAmount, interestRate, tenureYears, compoundingFreq]);

  const siResult = useMemo(() => {
    return calculateSimpleInterest(depositAmount, interestRate, tenureYears);
  }, [depositAmount, interestRate, tenureYears]);

  const activeResult =
    type === 'rd'
      ? rdResult
      : type === 'ppf'
      ? ppfResult
      : type === 'ci'
      ? ciResult
      : type === 'si'
      ? siResult
      : fdResult;

  const donutSlices = [
    {
      label: 'Principal Invested',
      value: activeResult.totalDeposited,
      color: '#6366f1',
      percentage: Math.max(0, 100 - activeResult.interestRatio),
    },
    {
      label: 'Total Interest Accrued',
      value: activeResult.totalInterest,
      color: '#10b981',
      percentage: activeResult.interestRatio,
    },
  ];

  const areaChartData = activeResult.yearlyBreakdown.map((item) => ({
    label: `Yr ${item.year}`,
    primaryValue: item.balance,
    secondaryValue: item.deposited,
  }));

  const summaryText = `${type.toUpperCase()} Calculator: Principal ${formatINR(activeResult.totalDeposited)} | Rate: ${
    type === 'ppf' ? '7.1% (Govt EEE)' : `${interestRate}%`
  } | Maturity: ${formatINR(activeResult.maturityValue)}`;

  return (
    <div className="w-full space-y-8">
      {/* Type Selector */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        {[
          { id: 'fd' as const, label: 'Fixed Deposit (FD)' },
          { id: 'rd' as const, label: 'Recurring Deposit (RD)' },
          { id: 'ppf' as const, label: 'PPF (7.1% Tax Free)' },
          { id: 'ci' as const, label: 'Compound Interest' },
          { id: 'si' as const, label: 'Simple Interest' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setType(tab.id);
              if (tab.id === 'ppf') {
                setTenureYears(15);
                setInterestRate(7.1);
              } else if (tab.id === 'fd') {
                setTenureYears(5);
                setInterestRate(7.0);
              } else if (tab.id === 'rd') {
                setTenureYears(3);
                setInterestRate(6.8);
              } else if (tab.id === 'ci') {
                setTenureYears(5);
                setInterestRate(8.0);
              } else if (tab.id === 'si') {
                setTenureYears(3);
                setInterestRate(6.0);
              }
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              type === tab.id
                ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-xs border border-slate-200 dark:border-slate-700 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-5">
          {type === 'ppf' ? (
            <>
              <InputSliderGroup
                id="ppf-yearly"
                label="Annual PPF Deposit (Max ₹1.5 Lakh/yr)"
                value={ppfYearlyDeposit}
                min={500}
                max={150000}
                step={5000}
                unitPrefix="₹"
                onChange={setPpfYearlyDeposit}
                showWords={true}
                presetValues={[
                  { label: '₹25,000', value: 25000 },
                  { label: '₹50,000', value: 50000 },
                  { label: '₹1 Lakh', value: 100000 },
                  { label: '₹1.5 Lakh', value: 150000 },
                ]}
              />

              <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>
                  <strong>Government of India PPF Interest Rate: 7.1% p.a.</strong> (Exempt-Exempt-Exempt tax status).
                </span>
              </div>

              <InputSliderGroup
                id="ppf-tenure"
                label="PPF Tenure Duration"
                value={tenureYears}
                min={15}
                max={30}
                step={5}
                unitSuffix=" Years"
                onChange={setTenureYears}
                helpText="Initial lock-in is 15 years, extendable in blocks of 5 years."
                presetValues={[
                  { label: '15 Yrs', value: 15 },
                  { label: '20 Yrs', value: 20 },
                  { label: '25 Yrs', value: 25 },
                ]}
              />
            </>
          ) : type === 'rd' ? (
            <>
              <InputSliderGroup
                id="rd-monthly"
                label="Monthly Recurring Deposit Amount"
                value={rdMonthlyDeposit}
                min={500}
                max={100000}
                step={500}
                unitPrefix="₹"
                onChange={setRdMonthlyDeposit}
                showWords={true}
                presetValues={[
                  { label: '₹1,000', value: 1000 },
                  { label: '₹2,500', value: 2500 },
                  { label: '₹5,000', value: 5000 },
                  { label: '₹10,000', value: 10000 },
                  { label: '₹25,000', value: 25000 },
                ]}
              />

              <InputSliderGroup
                id="rd-rate"
                label="Bank RD Interest Rate (% p.a.)"
                value={interestRate}
                min={4.0}
                max={10.0}
                step={0.1}
                unitSuffix="%"
                onChange={setInterestRate}
              />

              <InputSliderGroup
                id="rd-tenure"
                label="RD Duration (Years)"
                value={tenureYears}
                min={1}
                max={10}
                step={1}
                unitSuffix=" Years"
                onChange={setTenureYears}
              />
            </>
          ) : type === 'ci' ? (
            <>
              <InputSliderGroup
                id="ci-amount"
                label="Initial Principal Amount"
                value={depositAmount}
                min={1000}
                max={10000000}
                step={5000}
                unitPrefix="₹"
                onChange={setDepositAmount}
                showWords={true}
                presetValues={[
                  { label: '₹50,000', value: 50000 },
                  { label: '₹1 Lakh', value: 100000 },
                  { label: '₹5 Lakh', value: 500000 },
                  { label: '₹10 Lakh', value: 1000000 },
                ]}
              />

              <InputSliderGroup
                id="ci-rate"
                label="Annual Interest Rate (% p.a.)"
                value={interestRate}
                min={1.0}
                max={25.0}
                step={0.1}
                unitSuffix="%"
                onChange={setInterestRate}
              />

              <InputSliderGroup
                id="ci-tenure"
                label="Investment Horizon (Years)"
                value={tenureYears}
                min={1}
                max={30}
                step={1}
                unitSuffix=" Years"
                onChange={setTenureYears}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Compounding Frequency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'annually', label: 'Annually' },
                    { id: 'quarterly', label: 'Quarterly' },
                    { id: 'monthly', label: 'Monthly' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setCompoundingFreq(f.id as any)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                        compoundingFreq === f.id
                          ? 'bg-blue-50 dark:bg-blue-950 border-blue-500 text-blue-700 dark:text-blue-300 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : type === 'si' ? (
            <>
              <InputSliderGroup
                id="si-amount"
                label="Principal Amount (P)"
                value={depositAmount}
                min={1000}
                max={10000000}
                step={5000}
                unitPrefix="₹"
                onChange={setDepositAmount}
                showWords={true}
                presetValues={[
                  { label: '₹25,000', value: 25000 },
                  { label: '₹1 Lakh', value: 100000 },
                  { label: '₹5 Lakh', value: 500000 },
                ]}
              />

              <InputSliderGroup
                id="si-rate"
                label="Annual Simple Interest Rate (R % p.a.)"
                value={interestRate}
                min={1.0}
                max={30.0}
                step={0.1}
                unitSuffix="%"
                onChange={setInterestRate}
              />

              <InputSliderGroup
                id="si-tenure"
                label="Time Period (T in Years)"
                value={tenureYears}
                min={1}
                max={30}
                step={1}
                unitSuffix=" Years"
                onChange={setTenureYears}
              />

              <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-300 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <strong>Formula:</strong> Simple Interest = (Principal × Rate × Time) / 100
                </span>
              </div>
            </>
          ) : (
            <>
              {/* FD Inputs */}
              <InputSliderGroup
                id="fd-amount"
                label="Total Fixed Deposit Amount (Lump Sum)"
                value={depositAmount}
                min={10000}
                max={10000000}
                step={10000}
                unitPrefix="₹"
                onChange={setDepositAmount}
                showWords={true}
                presetValues={[
                  { label: '₹1 Lakh', value: 100000 },
                  { label: '₹2.5 Lakh', value: 250000 },
                  { label: '₹5 Lakh', value: 500000 },
                  { label: '₹10 Lakh', value: 1000000 },
                ]}
              />

              <InputSliderGroup
                id="fd-rate"
                label="Bank FD Rate (% p.a.)"
                value={interestRate}
                min={4.0}
                max={10.0}
                step={0.1}
                unitSuffix="%"
                onChange={setInterestRate}
                presetValues={[
                  { label: '6.5% (Regular)', value: 6.5 },
                  { label: '7.1% (Standard)', value: 7.1 },
                  { label: '7.6% (Senior Citizen)', value: 7.6 },
                ]}
              />

              <InputSliderGroup
                id="fd-tenure"
                label="Deposit Tenure (Years)"
                value={tenureYears}
                min={1}
                max={10}
                step={1}
                unitSuffix=" Years"
                onChange={setTenureYears}
              />
            </>
          )}

          <ActionButtonsBar onReset={handleReset} resultSummaryText={summaryText} />
        </div>

        {/* Right Outputs & Visualization */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Output Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Total Principal Invested
              </span>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {formatINR(activeResult.totalDeposited)}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 shadow-xs">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Total Interest Earned
              </span>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                +{formatINR(activeResult.totalInterest)}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/10">
            <span className="text-xs font-medium uppercase tracking-wider text-blue-100">
              Total Maturity Corpus
            </span>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
              {formatINR(activeResult.maturityValue)}
            </p>
            <p className="text-xs text-blue-100/90 mt-2">
              Wealth grew by {activeResult.interestRatio}% purely through interest compounding.
            </p>
          </div>

          {/* Donut Chart */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Corpus Breakdown (Principal vs Interest)
            </h4>
            <DonutChart slices={donutSlices} centerLabel="Maturity" centerValue={formatINR(activeResult.maturityValue)} />
          </div>

          {/* Growth Timeline Chart */}
          {activeResult.yearlyBreakdown.length > 1 && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                Year-by-Year Growth Progression
              </h4>
              <GrowthAreaChart
                data={areaChartData}
                primaryColor="#10b981"
                secondaryColor="#6366f1"
                primaryLabel="Total Value"
                secondaryLabel="Invested"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
