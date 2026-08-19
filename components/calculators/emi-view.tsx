'use client';

import React, { useState, useMemo } from 'react';
import { calculateEMI, calculatePrepayment, calculateFlatVsReducing, calculateLoanEligibility } from '@/lib/calculators/emi';
import { formatINR, formatCompactINR } from '@/lib/formatters';
import { InputSliderGroup, ActionButtonsBar } from '@/components/ui-elements';
import { DonutChart, GrowthAreaChart } from '@/components/charts';
import { Sparkles, Calendar, ArrowRight, Download, HelpCircle, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import Link from 'next/link';

interface EMIViewProps {
  initialType?: 'general' | 'home' | 'personal' | 'car' | 'prepayment' | 'flat-reducing' | 'eligibility';
}

export function EMIView({ initialType = 'general' }: EMIViewProps) {
  const [loanType, setLoanType] = useState(initialType);

  // Defaults based on loan type
  const defaultAmount = loanType === 'home' ? 5000000 : loanType === 'car' ? 1000000 : loanType === 'personal' ? 500000 : 2500000;
  const defaultRate = loanType === 'home' ? 8.5 : loanType === 'car' ? 9.2 : loanType === 'personal' ? 13.5 : 9.0;
  const defaultTenure = loanType === 'home' ? 20 : loanType === 'car' ? 5 : loanType === 'personal' ? 3 : 15;

  const [principal, setPrincipal] = useState<number>(defaultAmount);
  const [interestRate, setInterestRate] = useState<number>(defaultRate);
  const [tenureYears, setTenureYears] = useState<number>(defaultTenure);
  const [activeTab, setActiveTab] = useState<'schedule' | 'formula' | 'faq'>('schedule');
  const [scheduleView, setScheduleView] = useState<'yearly' | 'monthly'>('yearly');

  // Prepayment state
  const [extraMonthly, setExtraMonthly] = useState<number>(5000);
  const [lumpSumPrepayment, setLumpSumPrepayment] = useState<number>(100000);

  // Eligibility state
  const [monthlySalary, setMonthlySalary] = useState<number>(100000);
  const [existingEMI, setExistingEMI] = useState<number>(15000);

  // Flat vs reducing state
  const [flatRate, setFlatRate] = useState<number>(6.5);

  // Reset handler
  const handleReset = () => {
    setPrincipal(defaultAmount);
    setInterestRate(defaultRate);
    setTenureYears(defaultTenure);
    setExtraMonthly(5000);
    setLumpSumPrepayment(100000);
  };

  // Calculations
  const emiResult = useMemo(() => {
    return calculateEMI(principal, interestRate, tenureYears);
  }, [principal, interestRate, tenureYears]);

  const prepaymentResult = useMemo(() => {
    return calculatePrepayment(principal, interestRate, tenureYears, extraMonthly, lumpSumPrepayment, 12);
  }, [principal, interestRate, tenureYears, extraMonthly, lumpSumPrepayment]);

  const flatVsReducingResult = useMemo(() => {
    return calculateFlatVsReducing(principal, flatRate, tenureYears);
  }, [principal, flatRate, tenureYears]);

  const eligibilityResult = useMemo(() => {
    return calculateLoanEligibility(monthlySalary, existingEMI, interestRate, tenureYears);
  }, [monthlySalary, existingEMI, interestRate, tenureYears]);

  // Donut chart data
  const donutSlices = [
    {
      label: 'Principal Loan Amount',
      value: emiResult.principal,
      color: '#2563EB', // Royal Blue
      percentage: emiResult.principalRatio,
    },
    {
      label: 'Total Interest Payable',
      value: emiResult.totalInterest,
      color: '#93C5FD', // Light Blue
      percentage: emiResult.interestRatio,
    },
  ];

  // Growth / trend data for area chart
  const areaChartData = emiResult.yearlySchedule.map((item) => ({
    label: `Yr ${item.year}`,
    primaryValue: item.closingBalance,
    secondaryValue: item.principalPaid,
  }));

  const summaryText = `Loan Amount: ${formatINR(principal)} | Rate: ${interestRate}% | Tenure: ${tenureYears} Years | Monthly EMI: ${formatINR(emiResult.monthlyEMI)} | Total Interest: ${formatINR(emiResult.totalInterest)} | Total Repayment: ${formatINR(emiResult.totalAmount)}`;

  const exportScheduleCSV = () => {
    const headers = 'Year,Opening Balance,Principal Paid,Interest Paid,Total EMI,Closing Balance\n';
    const rows = emiResult.yearlySchedule
      .map(
        (r) =>
          `${r.year},${r.openingBalance},${r.principalPaid},${r.interestPaid},${r.totalEMIPaid},${r.closingBalance}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Loan-Amortization-Schedule-${principal}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-8">
      {/* Loan Type Selector Bar */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        {[
          { id: 'general', label: 'Standard EMI' },
          { id: 'home', label: 'Home Loan (8.5%)' },
          { id: 'personal', label: 'Personal Loan (13.5%)' },
          { id: 'car', label: 'Car Loan (9.2%)' },
          { id: 'prepayment', label: 'Prepayment Savings' },
          { id: 'flat-reducing', label: 'Flat vs Reducing' },
          { id: 'eligibility', label: 'Loan Eligibility' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setLoanType(tab.id as any);
              if (tab.id === 'home') {
                setPrincipal(5000000);
                setInterestRate(8.5);
                setTenureYears(20);
              } else if (tab.id === 'car') {
                setPrincipal(1000000);
                setInterestRate(9.2);
                setTenureYears(5);
              } else if (tab.id === 'personal') {
                setPrincipal(500000);
                setInterestRate(13.5);
                setTenureYears(3);
              }
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              loanType === tab.id
                ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Two-Column Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-6 space-y-5">
          {loanType === 'eligibility' ? (
            <>
              <InputSliderGroup
                id="monthly-salary"
                label="Gross Monthly Income"
                value={monthlySalary}
                min={20000}
                max={500000}
                step={5000}
                unitPrefix="₹"
                onChange={setMonthlySalary}
                showWords={true}
                presetValues={[
                  { label: '₹50K', value: 50000 },
                  { label: '₹1 Lakh', value: 100000 },
                  { label: '₹1.5 Lakh', value: 150000 },
                  { label: '₹2.5 Lakh', value: 250000 },
                ]}
              />
              <InputSliderGroup
                id="existing-emi"
                label="Existing Monthly Loan EMIs"
                value={existingEMI}
                min={0}
                max={200000}
                step={1000}
                unitPrefix="₹"
                onChange={setExistingEMI}
                helpText="Include credit card EMIs, personal loans, or vehicle loans currently running."
              />
              <InputSliderGroup
                id="eligibility-rate"
                label="Expected Loan Interest Rate (% p.a.)"
                value={interestRate}
                min={6}
                max={20}
                step={0.1}
                unitSuffix="%"
                onChange={setInterestRate}
              />
              <InputSliderGroup
                id="eligibility-tenure"
                label="Desired Loan Tenure"
                value={tenureYears}
                min={1}
                max={30}
                step={1}
                unitSuffix=" Yrs"
                onChange={setTenureYears}
              />
            </>
          ) : loanType === 'flat-reducing' ? (
            <>
              <InputSliderGroup
                id="flat-principal"
                label="Loan Amount"
                value={principal}
                min={50000}
                max={5000000}
                step={25000}
                unitPrefix="₹"
                onChange={setPrincipal}
                showWords={true}
              />
              <InputSliderGroup
                id="flat-rate"
                label="Quoted Flat Interest Rate"
                value={flatRate}
                min={4}
                max={20}
                step={0.25}
                unitSuffix="%"
                onChange={setFlatRate}
                helpText="Car & personal loan salesmen often advertise flat rates which hide higher true APR."
              />
              <InputSliderGroup
                id="flat-tenure"
                label="Loan Tenure"
                value={tenureYears}
                min={1}
                max={10}
                step={1}
                unitSuffix=" Yrs"
                onChange={setTenureYears}
              />
            </>
          ) : (
            <>
              {/* Standard Loan Inputs */}
              <InputSliderGroup
                id="loan-amount"
                label="Loan Amount (Principal)"
                value={principal}
                min={50000}
                max={20000000}
                step={50000}
                unitPrefix="₹"
                onChange={setPrincipal}
                showWords={true}
                presetValues={[
                  { label: '₹10 Lakh', value: 1000000 },
                  { label: '₹25 Lakh', value: 2500000 },
                  { label: '₹50 Lakh', value: 5000000 },
                  { label: '₹1 Crore', value: 10000000 },
                ]}
              />

              <InputSliderGroup
                id="interest-rate"
                label="Interest Rate (% p.a.)"
                value={interestRate}
                min={5.0}
                max={24.0}
                step={0.1}
                unitSuffix="%"
                onChange={setInterestRate}
                presetValues={[
                  { label: '8.5% (Home)', value: 8.5 },
                  { label: '9.2% (Car)', value: 9.2 },
                  { label: '11.5% (Edu)', value: 11.5 },
                  { label: '13.5% (Personal)', value: 13.5 },
                ]}
              />

              <InputSliderGroup
                id="loan-tenure"
                label="Loan Tenure (Duration)"
                value={tenureYears}
                min={1}
                max={30}
                step={1}
                unitSuffix=" Years"
                onChange={setTenureYears}
                presetValues={[
                  { label: '3 Yrs', value: 3 },
                  { label: '5 Yrs', value: 5 },
                  { label: '10 Yrs', value: 10 },
                  { label: '15 Yrs', value: 15 },
                  { label: '20 Yrs', value: 20 },
                  { label: '30 Yrs', value: 30 },
                ]}
              />

              {/* Extra Prepayment Options if in Prepayment mode */}
              {loanType === 'prepayment' && (
                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Prepayment Strategy Settings</span>
                  </div>
                  <InputSliderGroup
                    id="extra-monthly"
                    label="Extra Monthly Prepayment"
                    value={extraMonthly}
                    min={0}
                    max={50000}
                    step={1000}
                    unitPrefix="₹"
                    onChange={setExtraMonthly}
                    helpText="Paid on top of regular EMI every month"
                  />
                  <InputSliderGroup
                    id="lump-sum"
                    label="One-Time Lump Sum Payment (Month 12)"
                    value={lumpSumPrepayment}
                    min={0}
                    max={1000000}
                    step={25000}
                    unitPrefix="₹"
                    onChange={setLumpSumPrepayment}
                    helpText="Using bonus or savings at the end of year 1"
                  />
                </div>
              )}
            </>
          )}

          <ActionButtonsBar onReset={handleReset} resultSummaryText={summaryText} />
        </div>

        {/* Right Column: Dynamic Live Results */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          {loanType === 'eligibility' ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Estimated Sanction Limit
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {formatINR(eligibilityResult.maxEligibleLoanAmount)}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Based on 50% FOIR (Fixed Obligation to Income Ratio) standard bank norm.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Max Allowable EMI</span>
                  <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
                    {formatINR(eligibilityResult.maxAllowableEMI)}/mo
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Available for New EMI</span>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {formatINR(eligibilityResult.availableMonthlyDisposableForEMI)}/mo
                  </div>
                </div>
              </div>
            </div>
          ) : loanType === 'flat-reducing' ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  True Effective Reducing Rate
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                  {flatVsReducingResult.reducingEquivalentRate}% p.a.
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  A quoted <strong>{flatRate}% flat rate</strong> is actually equivalent to{' '}
                  <strong>{flatVsReducingResult.reducingEquivalentRate}% reducing rate</strong>!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                  <span className="font-semibold text-amber-900 dark:text-amber-300">Flat Rate EMI</span>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {formatINR(flatVsReducingResult.flatEMI)}/mo
                  </div>
                  <div className="text-slate-500 mt-1">
                    Total Interest: {formatINR(flatVsReducingResult.flatTotalInterest)}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
                  <span className="font-semibold text-emerald-900 dark:text-emerald-300">Same Reducing Rate (6.5%)</span>
                  <div className="text-base font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                    {formatINR(calculateEMI(principal, flatRate, tenureYears).monthlyEMI)}/mo
                  </div>
                  <div className="text-slate-500 mt-1">
                    Total Interest: {formatINR(calculateEMI(principal, flatRate, tenureYears).totalInterest)}
                  </div>
                </div>
              </div>
            </div>
          ) : loanType === 'prepayment' ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Total Interest Saved
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatINR(prepaymentResult.interestSaved)}
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    Loan closes in <strong>{Math.floor(prepaymentResult.newTenureMonths / 12)} Yrs {prepaymentResult.newTenureMonths % 12} Mos</strong> (Saved {Math.floor(prepaymentResult.monthsSaved / 12)} years!)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                  <span className="text-slate-500">Original Total Interest</span>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {formatINR(prepaymentResult.originalTotalInterest)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                  <span className="text-slate-500">New Total Interest</span>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {formatINR(prepaymentResult.newTotalInterest)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Standard EMI Live Result Card */
            <div className="space-y-5">
              {/* Clean Minimalism Hero Result Card in Royal Blue */}
              <div className="bg-blue-600 text-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-blue-500/20">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-blue-100 text-xs uppercase tracking-wider font-semibold">Monthly EMI</p>
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-1">{formatINR(emiResult.monthlyEMI)}</h2>
                    <span className="text-xs text-blue-200 mt-1 block">for {tenureYears * 12} monthly installments</span>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100 text-xs uppercase tracking-wider font-semibold">Total Payable</p>
                    <p className="text-xl sm:text-2xl font-bold mt-1">{formatCompactINR(emiResult.totalAmount)}</p>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-blue-500/60 flex justify-between gap-4">
                  <div>
                    <p className="text-blue-200 text-xs uppercase tracking-wider font-medium">Principal Amount</p>
                    <p className="text-lg sm:text-xl font-bold mt-0.5">{formatINR(principal)}</p>
                    <p className="text-[11px] text-blue-200 mt-0.5">{emiResult.principalRatio}% of total loan</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-200 text-xs uppercase tracking-wider font-medium">Total Interest</p>
                    <p className="text-lg sm:text-xl font-bold mt-0.5">{formatINR(emiResult.totalInterest)}</p>
                    <p className="text-[11px] text-blue-200 mt-0.5">{emiResult.interestRatio}% of total loan</p>
                  </div>
                </div>
              </div>

              {/* Breakdown Donut & Quick stats */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Loan Breakdown</h4>
                  <span className="text-xs text-slate-400">Principal vs Interest</span>
                </div>
                <DonutChart
                  slices={donutSlices}
                  centerLabel="Total Repayment"
                  centerValue={formatCompactINR(emiResult.totalAmount)}
                  size={200}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Balance Trend Area Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Loan Amortization Trend (Balance vs Principal Repaid)</span>
          </h3>
          <span className="text-xs text-slate-400">Year-on-Year Reduction</span>
        </div>

        <GrowthAreaChart
          data={areaChartData}
          primaryLabel="Outstanding Balance"
          secondaryLabel="Principal Repaid"
          primaryColor="#2563EB"
          secondaryColor="#93C5FD"
          height={180}
        />
      </div>

      {/* Bottom Tabs: Amortization Schedule, Formula & FAQs */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
          {[
            { id: 'schedule', label: 'Amortization Schedule Table' },
            { id: 'formula', label: 'Formula & Calculation Details' },
            { id: 'faq', label: 'Frequently Asked Questions' },
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

        {activeTab === 'schedule' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setScheduleView('yearly')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    scheduleView === 'yearly'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Yearly Breakdown ({emiResult.yearlySchedule.length} Yrs)
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleView('monthly')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    scheduleView === 'monthly'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Monthly Schedule ({emiResult.monthlySchedule.length} Months)
                </button>
              </div>

              <button
                type="button"
                onClick={exportScheduleCSV}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export as CSV</span>
              </button>
            </div>

            {/* Scrollable Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">{scheduleView === 'yearly' ? 'Year' : 'Month'}</th>
                    <th className="py-3 px-4">Opening Balance</th>
                    <th className="py-3 px-4">Principal Paid</th>
                    <th className="py-3 px-4">Interest Paid</th>
                    <th className="py-3 px-4">Total Payment</th>
                    <th className="py-3 px-4">Closing Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {scheduleView === 'yearly'
                    ? emiResult.yearlySchedule.map((row) => (
                        <tr key={row.year} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Year {row.year}</td>
                          <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">{formatINR(row.openingBalance)}</td>
                          <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400">{formatINR(row.principalPaid)}</td>
                          <td className="py-2.5 px-4 text-indigo-600 dark:text-indigo-400">{formatINR(row.interestPaid)}</td>
                          <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">{formatINR(row.totalEMIPaid)}</td>
                          <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">{formatINR(row.closingBalance)}</td>
                        </tr>
                      ))
                    : emiResult.monthlySchedule.slice(0, 120).map((row) => (
                        <tr key={row.month} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="py-2 px-4 font-bold text-slate-900 dark:text-white">Mo {row.month}</td>
                          <td className="py-2 px-4 text-slate-600 dark:text-slate-300">{formatINR(row.openingBalance)}</td>
                          <td className="py-2 px-4 text-emerald-600 dark:text-emerald-400">{formatINR(row.principalPaid)}</td>
                          <td className="py-2 px-4 text-indigo-600 dark:text-indigo-400">{formatINR(row.interestPaid)}</td>
                          <td className="py-2 px-4 font-semibold text-slate-900 dark:text-white">{formatINR(row.emi)}</td>
                          <td className="py-2 px-4 text-slate-600 dark:text-slate-300">{formatINR(row.closingBalance)}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
            {scheduleView === 'monthly' && emiResult.monthlySchedule.length > 120 && (
              <p className="text-xs text-slate-400 text-center">
                Showing first 120 months. Export full CSV to view all {emiResult.monthlySchedule.length} months.
              </p>
            )}
          </div>
        )}

        {activeTab === 'formula' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-sm">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              Standard Reducing Balance EMI Formula
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700">
              E = [P × r × (1 + r)^n] ÷ [(1 + r)^n - 1]
            </div>
            <div className="space-y-2 text-slate-600 dark:text-slate-300">
              <p>Where:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>E</strong> = Equated Monthly Installment (EMI)</li>
                <li><strong>P</strong> = Principal Loan Amount (e.g. {formatINR(principal)})</li>
                <li><strong>r</strong> = Monthly interest rate = Annual Rate ÷ 12 ÷ 100 ({interestRate}% ÷ 1200 = {(interestRate / 1200).toFixed(6)})</li>
                <li><strong>n</strong> = Loan duration in months ({tenureYears} years × 12 = {tenureYears * 12} months)</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-sm">
            <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="pt-3">
                <h5 className="font-bold text-slate-900 dark:text-white">
                  What is the difference between Flat Interest Rate and Reducing Balance Rate?
                </h5>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  In flat rate, interest is calculated on the entire principal throughout the tenure without considering repayments. In reducing balance rate, interest is charged only on the remaining balance. A 7% flat rate is approximately equal to a 12.5% to 13.5% reducing rate.
                </p>
              </div>

              <div className="pt-3">
                <h5 className="font-bold text-slate-900 dark:text-white">
                  Can I claim tax deduction on Home Loan EMI in India?
                </h5>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Yes, under the Old Tax Regime: Principal repayment is deductible up to ₹1,50,000 under Section 80C, and Interest payment is deductible up to ₹2,00,000 under Section 24(b) for self-occupied properties.
                </p>
              </div>

              <div className="pt-3">
                <h5 className="font-bold text-slate-900 dark:text-white">
                  How does prepayment reduce my loan burden?
                </h5>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Any prepayment directly reduces your outstanding principal, saving high interest compounding over the future remaining years and shortening your loan tenure dramatically.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
