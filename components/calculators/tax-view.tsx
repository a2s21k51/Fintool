'use client';

import React, { useState, useMemo } from 'react';
import { compareTaxRegimes } from '@/lib/calculators/tax';
import { formatINR } from '@/lib/formatters';
import { InputSliderGroup, ActionButtonsBar } from '@/components/ui-elements';
import { DonutChart } from '@/components/charts';
import { Receipt, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export function TaxView() {
  const [grossIncome, setGrossIncome] = useState<number>(1200000); // 12 Lakhs
  const [deduction80C, setDeduction80C] = useState<number>(150000); // 1.5 Lakh max
  const [deduction80D, setDeduction80D] = useState<number>(25000); // Health insurance
  const [hraExemption, setHraExemption] = useState<number>(120000); // HRA
  const [homeLoanInterest, setHomeLoanInterest] = useState<number>(0);
  const [isSalaried, setIsSalaried] = useState<boolean>(true);

  const comparison = useMemo(() => {
    return compareTaxRegimes(
      grossIncome,
      deduction80C,
      deduction80D,
      hraExemption,
      homeLoanInterest,
      isSalaried
    );
  }, [grossIncome, deduction80C, deduction80D, hraExemption, homeLoanInterest, isSalaried]);

  const handleReset = () => {
    setGrossIncome(1200000);
    setDeduction80C(150000);
    setDeduction80D(25000);
    setHraExemption(120000);
    setHomeLoanInterest(0);
  };

  const summaryText = `Gross Income: ${formatINR(grossIncome)} | Recommended: ${comparison.recommendedRegime.toUpperCase()} Regime | Tax under New: ${formatINR(comparison.newRegime.totalTaxPayable)} | Tax under Old: ${formatINR(comparison.oldRegime.totalTaxPayable)} | Tax Savings: ${formatINR(comparison.taxDifference)}`;

  return (
    <div className="w-full space-y-8">
      {/* Statutory Disclaimer as required */}
      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          <strong>Important Note:</strong> Tax calculations are mathematical estimates comparing the New Tax Regime vs Old Tax Regime. 
          Standard Deduction for Salaried under New Regime is ₹75,000 and Section 87A rebate applies for zero tax on eligible brackets. 
          Verify with official income tax provisions before filing returns.
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form */}
        <div className="lg:col-span-6 space-y-5">
          <InputSliderGroup
            id="gross-salary"
            label="Annual Gross Salary / CTC"
            value={grossIncome}
            min={300000}
            max={5000000}
            step={25000}
            unitPrefix="₹"
            onChange={setGrossIncome}
            showWords={true}
            presetValues={[
              { label: '₹7.5 Lakh', value: 750000 },
              { label: '₹10 Lakh', value: 1000000 },
              { label: '₹12.5 Lakh', value: 1250000 },
              { label: '₹15 Lakh', value: 1500000 },
              { label: '₹20 Lakh', value: 2000000 },
            ]}
          />

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
              <span>Old Regime Deductions & Exemptions</span>
              <span className="text-slate-400 font-normal">Applies only to Old Regime</span>
            </div>

            <InputSliderGroup
              id="80c-deduction"
              label="Section 80C (EPF, PPF, ELSS, Life Insurance)"
              value={deduction80C}
              min={0}
              max={150000}
              step={5000}
              unitPrefix="₹"
              onChange={setDeduction80C}
              helpText="Max capped statutory limit: ₹1,50,000"
            />

            <InputSliderGroup
              id="80d-deduction"
              label="Section 80D (Health Insurance Premium)"
              value={deduction80D}
              min={0}
              max={75000}
              step={2500}
              unitPrefix="₹"
              onChange={setDeduction80D}
              helpText="Self & Parents mediclaim premiums"
            />

            <InputSliderGroup
              id="hra-exempt"
              label="HRA Exemption (House Rent Allowance)"
              value={hraExemption}
              min={0}
              max={500000}
              step={10000}
              unitPrefix="₹"
              onChange={setHraExemption}
              helpText="Section 10(13A) exemption based on rent receipts"
            />

            <InputSliderGroup
              id="homeloan-24b"
              label="Section 24(b) Home Loan Interest"
              value={homeLoanInterest}
              min={0}
              max={200000}
              step={10000}
              unitPrefix="₹"
              onChange={setHomeLoanInterest}
              helpText="Interest paid on self-occupied house loan (Max ₹2 Lakh)"
            />
          </div>

          <ActionButtonsBar onReset={handleReset} resultSummaryText={summaryText} />
        </div>

        {/* Right Comparison Card */}
        <div className="lg:col-span-6 space-y-5">
          {/* Recommendation Banner */}
          <div className="p-5 rounded-2xl border text-sm font-bold flex items-center justify-between bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <div className="text-base font-extrabold text-blue-950 dark:text-white">
                  {comparison.recommendedRegime === 'new' ? 'New Tax Regime is Better' : 'Old Tax Regime is Better'}
                </div>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  You save <strong>{formatINR(comparison.taxDifference)}</strong> in taxes!
                </div>
              </div>
            </div>

            <span className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-xl shadow-xs font-bold">
              Save {formatINR(comparison.taxDifference)}
            </span>
          </div>

          {/* Side by side regimes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* New Regime Card */}
            <div
              className={`p-5 rounded-2xl border transition-all ${
                comparison.recommendedRegime === 'new'
                  ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  New Tax Regime (Default)
                </span>
                {comparison.recommendedRegime === 'new' && (
                  <span className="text-[10px] font-extrabold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <span className="text-slate-500">Total Tax Payable:</span>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {formatINR(comparison.newRegime.totalTaxPayable)}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Standard Deduction:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">₹75,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxable Income:</span>
                    <span className="font-semibold">{formatINR(comparison.newRegime.taxableIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Take-Home:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatINR(comparison.newRegime.monthlyNetIncome)}/mo
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Effective Tax Rate:</span>
                    <span className="font-semibold">{comparison.newRegime.effectiveTaxRate}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Old Regime Card */}
            <div
              className={`p-5 rounded-2xl border transition-all ${
                comparison.recommendedRegime === 'old'
                  ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Old Tax Regime
                </span>
                {comparison.recommendedRegime === 'old' && (
                  <span className="text-[10px] font-extrabold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <span className="text-slate-500">Total Tax Payable:</span>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {formatINR(comparison.oldRegime.totalTaxPayable)}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Total Deductions Claimed:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {formatINR(comparison.oldRegime.totalDeductions)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxable Income:</span>
                    <span className="font-semibold">{formatINR(comparison.oldRegime.taxableIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Take-Home:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatINR(comparison.oldRegime.monthlyNetIncome)}/mo
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Effective Tax Rate:</span>
                    <span className="font-semibold">{comparison.oldRegime.effectiveTaxRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
