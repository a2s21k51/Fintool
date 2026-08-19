'use client';

import React, { useState, useMemo } from 'react';
import { calculateGST } from '@/lib/calculators/tax';
import { formatINR } from '@/lib/formatters';
import { InputSliderGroup, ActionButtonsBar } from '@/components/ui-elements';
import { DonutChart } from '@/components/charts';
import { FileSpreadsheet, ArrowLeftRight } from 'lucide-react';

export function GSTView() {
  const [amount, setAmount] = useState<number>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [isExclusive, setIsExclusive] = useState<boolean>(true); // true = Add GST, false = Extract GST
  const [isInterState, setIsInterState] = useState<boolean>(false); // IGST vs CGST+SGST

  const gstResult = useMemo(() => {
    return calculateGST(amount, gstRate, isExclusive, isInterState);
  }, [amount, gstRate, isExclusive, isInterState]);

  const handleReset = () => {
    setAmount(10000);
    setGstRate(18);
    setIsExclusive(true);
    setIsInterState(false);
  };

  const donutSlices = [
    {
      label: 'Base / Net Amount',
      value: gstResult.originalAmount,
      color: '#10b981',
      percentage: Number(((gstResult.originalAmount / gstResult.totalAmount) * 100).toFixed(1)),
    },
    {
      label: `Total GST (${gstRate}%)`,
      value: gstResult.gstAmount,
      color: '#6366f1',
      percentage: Number(((gstResult.gstAmount / gstResult.totalAmount) * 100).toFixed(1)),
    },
  ];

  const summaryText = `${isExclusive ? 'GST Added' : 'GST Extracted'}: Base ${formatINR(gstResult.originalAmount)} + ${gstRate}% GST (${formatINR(gstResult.gstAmount)}) = Total ${formatINR(gstResult.totalAmount)}`;

  return (
    <div className="w-full space-y-8">
      {/* Mode Switcher */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setIsExclusive(true)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            isExclusive
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Add GST (Exclusive / Base Price)
        </button>
        <button
          type="button"
          onClick={() => setIsExclusive(false)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            !isExclusive
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Remove / Extract GST (Inclusive / MRP)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-5">
          <InputSliderGroup
            id="gst-amount"
            label={isExclusive ? 'Initial Amount (without GST)' : 'Total Invoice Amount (inclusive of GST)'}
            value={amount}
            min={100}
            max={5000000}
            step={500}
            unitPrefix="₹"
            onChange={setAmount}
            showWords={true}
            presetValues={[
              { label: '₹1,000', value: 1000 },
              { label: '₹5,000', value: 5000 },
              { label: '₹10,000', value: 10000 },
              { label: '₹50,000', value: 50000 },
              { label: '₹1 Lakh', value: 100000 },
            ]}
          />

          {/* GST Slabs Buttons */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              GST Slab Rate (%):
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[0, 5, 12, 18, 28].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setGstRate(rate)}
                  className={`py-2 rounded-lg text-xs font-extrabold transition-all ${
                    gstRate === rate
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>

          {/* Transaction Type: Intra-state vs Inter-state */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Transaction Type:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsInterState(false)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  !isInterState
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Intra-State (CGST + SGST)
              </button>
              <button
                type="button"
                onClick={() => setIsInterState(true)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  isInterState
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Inter-State (IGST)
              </button>
            </div>
          </div>

          <ActionButtonsBar onReset={handleReset} resultSummaryText={summaryText} />
        </div>

        {/* Right Output */}
        <div className="lg:col-span-6 space-y-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Total Invoice Value (Gross Amount)
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
                {formatINR(gstResult.totalAmount)}
              </div>
            </div>

            <DonutChart
              slices={donutSlices}
              centerLabel="Invoice Total"
              centerValue={formatINR(gstResult.totalAmount)}
              size={190}
            />

            {/* GST Tax Breakdown Grid */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-medium">
                <span className="text-slate-500">Net / Base Price:</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatINR(gstResult.originalAmount)}</span>
              </div>

              {!isInterState ? (
                <>
                  <div className="flex justify-between p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-300 font-medium">
                    <span>CGST ({gstRate / 2}%):</span>
                    <span className="font-bold">{formatINR(gstResult.cgst)}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-300 font-medium">
                    <span>SGST / UTGST ({gstRate / 2}%):</span>
                    <span className="font-bold">{formatINR(gstResult.sgst)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-300 font-medium">
                  <span>IGST ({gstRate}%):</span>
                  <span className="font-bold">{formatINR(gstResult.igst)}</span>
                </div>
              )}

              <div className="flex justify-between p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-200 dark:border-emerald-900/40">
                <span>Total Tax Component:</span>
                <span>{formatINR(gstResult.gstAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
