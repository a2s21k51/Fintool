'use client';

import React, { useState, useMemo } from 'react';
import { calculateSIP, calculateStepUpSIP, calculateLumpSum, calculateSWP } from '@/lib/calculators/sip';
import { calculateFD } from '@/lib/calculators/deposits';
import { formatINR, formatCompactINR } from '@/lib/formatters';
import { InputSliderGroup, ActionButtonsBar } from '@/components/ui-elements';
import { DonutChart, GrowthAreaChart } from '@/components/charts';
import { TrendingUp, Sparkles, Download, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface SIPViewProps {
  initialMode?: 'sip' | 'step-up' | 'lump-sum' | 'swp';
}

export function SIPView({ initialMode = 'sip' }: SIPViewProps) {
  const [mode, setMode] = useState(initialMode);

  // States
  const [monthlySIP, setMonthlySIP] = useState<number>(10000);
  const [lumpSumAmount, setLumpSumAmount] = useState<number>(500000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12.0);
  const [timeYears, setTimeYears] = useState<number>(15);
  const [annualStepUp, setAnnualStepUp] = useState<number>(10); // 10% annual increase

  // SWP specific
  const [swpInitialCorpus, setSwpInitialCorpus] = useState<number>(5000000); // 50 Lakhs
  const [swpMonthlyWithdrawal, setSwpMonthlyWithdrawal] = useState<number>(35000);

  const [activeTab, setActiveTab] = useState<'yearly' | 'formula' | 'faq'>('yearly');

  const handleReset = () => {
    setMonthlySIP(10000);
    setLumpSumAmount(500000);
    setExpectedReturn(12.0);
    setTimeYears(15);
    setAnnualStepUp(10);
    setSwpInitialCorpus(5000000);
    setSwpMonthlyWithdrawal(35000);
  };

  // Calculations
  const sipResult = useMemo(() => {
    return calculateSIP(monthlySIP, expectedReturn, timeYears);
  }, [monthlySIP, expectedReturn, timeYears]);

  const stepUpResult = useMemo(() => {
    return calculateStepUpSIP(monthlySIP, annualStepUp, expectedReturn, timeYears);
  }, [monthlySIP, annualStepUp, expectedReturn, timeYears]);

  const lumpSumResult = useMemo(() => {
    return calculateLumpSum(lumpSumAmount, expectedReturn, timeYears);
  }, [lumpSumAmount, expectedReturn, timeYears]);

  const swpResult = useMemo(() => {
    return calculateSWP(swpInitialCorpus, swpMonthlyWithdrawal, expectedReturn, timeYears);
  }, [swpInitialCorpus, swpMonthlyWithdrawal, expectedReturn, timeYears]);

  // Comparable FD calculation (to show SIP equity advantage vs fixed 7% FD)
  const comparableFD = useMemo(() => {
    if (mode === 'lump-sum') {
      return calculateFD(lumpSumAmount, 7.0, timeYears);
    }
    // Total invested in SIP deposited at 7%
    return calculateFD(sipResult.investedAmount, 7.0, timeYears);
  }, [mode, lumpSumAmount, timeYears, sipResult.investedAmount]);

  const activeResult = mode === 'step-up' ? stepUpResult : mode === 'lump-sum' ? lumpSumResult : sipResult;

  const donutSlices = [
    {
      label: 'Invested Amount',
      value: activeResult.investedAmount,
      color: '#94a3b8', // slate-400
      percentage: activeResult.investedRatio,
    },
    {
      label: 'Estimated Returns (Wealth Gained)',
      value: activeResult.estimatedReturns,
      color: '#2563eb', // blue-600
      percentage: activeResult.wealthGainedRatio,
    },
  ];

  const areaChartData = activeResult.yearlyBreakdown.map((item) => ({
    label: `Yr ${item.year}`,
    primaryValue: item.totalValue,
    secondaryValue: item.invested,
  }));

  const summaryText = mode === 'swp'
    ? `SWP Initial: ${formatINR(swpInitialCorpus)} | Monthly Withdrawal: ${formatINR(swpMonthlyWithdrawal)} | Total Withdrawn: ${formatINR(swpResult.totalWithdrawn)} | Final Balance: ${formatINR(swpResult.finalBalance)}`
    : `Invested: ${formatINR(activeResult.investedAmount)} | Estimated Returns: ${formatINR(activeResult.estimatedReturns)} | Total Value: ${formatINR(activeResult.totalMaturityValue)} (${expectedReturn}% for ${timeYears} Yrs)`;

  const exportScheduleCSV = () => {
    const headers = 'Year,Invested Amount,Estimated Growth,Total Portfolio Value\n';
    const rows = activeResult.yearlyBreakdown
      .map((r) => `${r.year},${r.invested},${r.returns},${r.totalValue}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SIP-Wealth-Progression-${activeResult.totalMaturityValue}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-8">
      {/* Mode Selector */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        {[
          { id: 'sip', label: 'Monthly SIP' },
          { id: 'step-up', label: 'Step-Up SIP (10% Annual Hike)' },
          { id: 'lump-sum', label: 'Lump Sum (One-Time)' },
          { id: 'swp', label: 'SWP (Monthly Pension/Income)' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMode(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === tab.id
                ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-6 space-y-5">
          {mode === 'swp' ? (
            <>
              <InputSliderGroup
                id="swp-corpus"
                label="Total Initial Investment Corpus"
                value={swpInitialCorpus}
                min={500000}
                max={50000000}
                step={100000}
                unitPrefix="₹"
                onChange={setSwpInitialCorpus}
                showWords={true}
                presetValues={[
                  { label: '₹25 Lakh', value: 2500000 },
                  { label: '₹50 Lakh', value: 5000000 },
                  { label: '₹1 Crore', value: 10000000 },
                ]}
              />

              <InputSliderGroup
                id="swp-withdrawal"
                label="Monthly Withdrawal Amount"
                value={swpMonthlyWithdrawal}
                min={5000}
                max={300000}
                step={2500}
                unitPrefix="₹"
                onChange={setSwpMonthlyWithdrawal}
                showWords={true}
                helpText="Monthly pension amount credited to your bank account"
              />

              <InputSliderGroup
                id="swp-return"
                label="Expected Portfolio Growth Rate (% p.a.)"
                value={expectedReturn}
                min={6}
                max={18}
                step={0.5}
                unitSuffix="%"
                onChange={setExpectedReturn}
                presetValues={[
                  { label: '8% (Hybrid)', value: 8 },
                  { label: '10% (Balanced)', value: 10 },
                  { label: '12% (Equity)', value: 12 },
                ]}
              />

              <InputSliderGroup
                id="swp-years"
                label="Withdrawal Time Period"
                value={timeYears}
                min={1}
                max={30}
                step={1}
                unitSuffix=" Years"
                onChange={setTimeYears}
              />
            </>
          ) : mode === 'lump-sum' ? (
            <>
              <InputSliderGroup
                id="lump-amount"
                label="Total One-Time Investment"
                value={lumpSumAmount}
                min={5000}
                max={20000000}
                step={25000}
                unitPrefix="₹"
                onChange={setLumpSumAmount}
                showWords={true}
                presetValues={[
                  { label: '₹1 Lakh', value: 100000 },
                  { label: '₹5 Lakh', value: 500000 },
                  { label: '₹10 Lakh', value: 1000000 },
                  { label: '₹25 Lakh', value: 2500000 },
                ]}
              />

              <InputSliderGroup
                id="lump-return"
                label="Expected Return Rate (% p.a.)"
                value={expectedReturn}
                min={5}
                max={30}
                step={0.5}
                unitSuffix="%"
                onChange={setExpectedReturn}
                presetValues={[
                  { label: '8% (Conservative)', value: 8 },
                  { label: '12% (Nifty Index)', value: 12 },
                  { label: '15% (Midcap / Smallcap)', value: 15 },
                ]}
              />

              <InputSliderGroup
                id="lump-tenure"
                label="Time Horizon (Years)"
                value={timeYears}
                min={1}
                max={35}
                step={1}
                unitSuffix=" Years"
                onChange={setTimeYears}
                presetValues={[
                  { label: '5 Yrs', value: 5 },
                  { label: '10 Yrs', value: 10 },
                  { label: '15 Yrs', value: 15 },
                  { label: '20 Yrs', value: 20 },
                ]}
              />
            </>
          ) : (
            <>
              {/* Standard or Step-Up SIP Inputs */}
              <InputSliderGroup
                id="monthly-sip"
                label="Monthly SIP Amount"
                value={monthlySIP}
                min={500}
                max={500000}
                step={500}
                unitPrefix="₹"
                onChange={setMonthlySIP}
                showWords={true}
                presetValues={[
                  { label: '₹2,500', value: 2500 },
                  { label: '₹5,000', value: 5000 },
                  { label: '₹10,000', value: 10000 },
                  { label: '₹25,000', value: 25000 },
                  { label: '₹50,000', value: 50000 },
                ]}
              />

              {mode === 'step-up' && (
                <InputSliderGroup
                  id="step-up-rate"
                  label="Annual Step-Up Increment (% every year)"
                  value={annualStepUp}
                  min={1}
                  max={30}
                  step={1}
                  unitSuffix="%"
                  onChange={setAnnualStepUp}
                  helpText="Recommended: 10% annual hike in sync with salary appraisals"
                  presetValues={[
                    { label: '5%', value: 5 },
                    { label: '10%', value: 10 },
                    { label: '15%', value: 15 },
                    { label: '20%', value: 20 },
                  ]}
                />
              )}

              <InputSliderGroup
                id="sip-return"
                label="Expected Return Rate (% p.a.)"
                value={expectedReturn}
                min={5}
                max={25}
                step={0.5}
                unitSuffix="%"
                onChange={setExpectedReturn}
                helpText="Historical Nifty 50 CAGR has been ~12% - 14% over 10+ years."
                presetValues={[
                  { label: '10% (Safe)', value: 10 },
                  { label: '12% (Equity)', value: 12 },
                  { label: '15% (Aggressive)', value: 15 },
                ]}
              />

              <InputSliderGroup
                id="sip-tenure"
                label="Investment Time Horizon"
                value={timeYears}
                min={1}
                max={40}
                step={1}
                unitSuffix=" Years"
                onChange={setTimeYears}
                presetValues={[
                  { label: '5 Yrs', value: 5 },
                  { label: '10 Yrs', value: 10 },
                  { label: '15 Yrs', value: 15 },
                  { label: '20 Yrs', value: 20 },
                  { label: '25 Yrs', value: 25 },
                ]}
              />
            </>
          )}

          <ActionButtonsBar onReset={handleReset} resultSummaryText={summaryText} />
        </div>

        {/* Live Results Card */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          {mode === 'swp' ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Total Regular Income Withdrawn
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {formatINR(swpResult.totalWithdrawn)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Over {timeYears} years ({timeYears * 12} monthly pension credits)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Initial Corpus</span>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {formatINR(swpInitialCorpus)}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
                  <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">Final Remaining Corpus</span>
                  <div className="text-base font-bold text-blue-600 dark:text-blue-400 mt-1">
                    {formatINR(swpResult.finalBalance)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              {/* Maturity Headline */}
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Expected Future Corpus
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                    {formatINR(activeResult.totalMaturityValue)}
                  </div>
                  <span className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                    Wealth gained: +{formatINR(activeResult.estimatedReturns)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-medium text-slate-400">Total Invested</span>
                  <div className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200">
                    {formatCompactINR(activeResult.investedAmount)}
                  </div>
                </div>
              </div>

              {/* Donut Visual */}
              <DonutChart
                slices={donutSlices}
                centerLabel="Total Corpus"
                centerValue={formatCompactINR(activeResult.totalMaturityValue)}
                size={210}
              />

              {/* Comparison with 7% Bank FD Callout */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-500 font-medium">Same money in 7% Bank FD:</span>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {formatINR(comparableFD.maturityValue)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    +{formatINR(Math.max(0, activeResult.totalMaturityValue - comparableFD.maturityValue))} extra
                  </span>
                  <span className="text-[11px] text-slate-400">from compounding</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Wealth Progression Trend Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>Power of Compounding Growth Curve (Year-on-Year)</span>
          </h3>
          <span className="text-xs text-slate-400">{timeYears} Year Horizon</span>
        </div>

        <GrowthAreaChart
          data={areaChartData}
          primaryLabel="Total Wealth Corpus"
          secondaryLabel="Principal Invested"
          primaryColor="#2563eb"
          secondaryColor="#94a3b8"
          height={190}
        />
      </div>

      {/* Progression Table & FAQs */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
          {[
            { id: 'yearly', label: 'Yearly Wealth Schedule' },
            { id: 'formula', label: 'Formula & Compounding Math' },
            { id: 'faq', label: 'SIP Frequently Asked Questions' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'yearly' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Year-on-year milestone breakdown</span>
              <button
                type="button"
                onClick={exportScheduleCSV}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Year</th>
                    <th className="py-3 px-4">Total Amount Invested</th>
                    <th className="py-3 px-4">Estimated Wealth Gained</th>
                    <th className="py-3 px-4">Expected Portfolio Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {activeResult.yearlyBreakdown.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Year {row.year}</td>
                      <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">{formatINR(row.invested)}</td>
                      <td className="py-2.5 px-4 text-blue-600 dark:text-blue-400 font-semibold">+{formatINR(row.returns)}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{formatINR(row.totalValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'formula' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-sm">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              Mutual Fund SIP Compounding Formula
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs sm:text-sm text-blue-700 dark:text-blue-400 border border-slate-200 dark:border-slate-700">
              M = P × [ ( (1 + i)^n - 1 ) ÷ i ] × (1 + i)
            </div>
            <div className="space-y-2 text-slate-600 dark:text-slate-300">
              <p>Where:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>M</strong> = Maturity corpus amount</li>
                <li><strong>P</strong> = Monthly investment amount ({formatINR(monthlySIP)})</li>
                <li><strong>i</strong> = Monthly compounding return rate = {expectedReturn}% ÷ 12 ÷ 100 = {(expectedReturn / 1200).toFixed(6)}</li>
                <li><strong>n</strong> = Number of monthly installments ({timeYears * 12} months)</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-sm">
            <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="pt-3">
                <h5 className="font-bold text-slate-900 dark:text-white">
                  Why is Step-Up SIP significantly better than standard SIP?
                </h5>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Increasing your monthly investment by just 10% every year along with your salary increment can double your final corpus compared to a flat SIP over a 15-20 year period.
                </p>
              </div>

              <div className="pt-3">
                <h5 className="font-bold text-slate-900 dark:text-white">
                  What is the taxation on Mutual Fund SIP returns in India?
                </h5>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  For Equity mutual funds held for more than 12 months, Long-Term Capital Gains (LTCG) above ₹1.25 Lakh in a financial year are taxed at 12.5%. Short-term gains (under 12 months) are taxed at 20%.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
