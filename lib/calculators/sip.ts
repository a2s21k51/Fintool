export interface SIPResult {
  investedAmount: number;
  estimatedReturns: number;
  totalMaturityValue: number;
  wealthGainedRatio: number; // percentage
  investedRatio: number; // percentage
  yearlyBreakdown: {
    year: number;
    invested: number;
    returns: number;
    totalValue: number;
  }[];
}

/**
 * Standard SIP Formula: M = P × ({[1 + i]^n - 1} / i) × (1 + i)
 * P = Monthly investment, i = periodic rate (annual rate / 12 / 100), n = months
 */
export function calculateSIP(
  monthlyInvestment: number,
  expectedReturnRate: number,
  timePeriodYears: number
): SIPResult {
  const P = Math.max(0, monthlyInvestment);
  const r = Math.max(0, expectedReturnRate) / 12 / 100;
  const totalMonths = Math.max(1, Math.round(timePeriodYears * 12));

  const yearlyBreakdown: SIPResult['yearlyBreakdown'] = [];

  let currentInvested = 0;
  let currentCorpus = 0;

  for (let m = 1; m <= totalMonths; m++) {
    currentInvested += P;
    // compound previous balance + add new investment with 1 month growth
    currentCorpus = (currentCorpus + P) * (1 + r);

    if (m % 12 === 0 || m === totalMonths) {
      const yr = Math.ceil(m / 12);
      const estRet = Math.max(0, currentCorpus - currentInvested);
      yearlyBreakdown.push({
        year: yr,
        invested: Math.round(currentInvested),
        returns: Math.round(estRet),
        totalValue: Math.round(currentCorpus),
      });
    }
  }

  const investedAmount = P * totalMonths;
  const totalMaturityValue = Math.round(currentCorpus);
  const estimatedReturns = Math.max(0, totalMaturityValue - investedAmount);

  const wealthGainedRatio = totalMaturityValue > 0 ? (estimatedReturns / totalMaturityValue) * 100 : 0;
  const investedRatio = totalMaturityValue > 0 ? (investedAmount / totalMaturityValue) * 100 : 100;

  return {
    investedAmount: Math.round(investedAmount),
    estimatedReturns: Math.round(estimatedReturns),
    totalMaturityValue,
    wealthGainedRatio: Number(wealthGainedRatio.toFixed(1)),
    investedRatio: Number(investedRatio.toFixed(1)),
    yearlyBreakdown,
  };
}

/**
 * Step-Up SIP (with annual % increment, e.g., 10% per year)
 */
export function calculateStepUpSIP(
  initialMonthlySIP: number,
  annualStepUpPercent: number,
  expectedReturnRate: number,
  timePeriodYears: number
): SIPResult & { finalMonthlySIP: number } {
  const r = Math.max(0, expectedReturnRate) / 12 / 100;
  const stepUp = Math.max(0, annualStepUpPercent) / 100;
  const totalMonths = Math.max(1, Math.round(timePeriodYears * 12));

  let currentMonthlySIP = Math.max(0, initialMonthlySIP);
  let totalInvested = 0;
  let currentCorpus = 0;
  const yearlyBreakdown: SIPResult['yearlyBreakdown'] = [];

  for (let m = 1; m <= totalMonths; m++) {
    // Increase monthly SIP at start of each new year (from month 13, 25, etc.)
    if (m > 1 && (m - 1) % 12 === 0) {
      currentMonthlySIP = currentMonthlySIP * (1 + stepUp);
    }

    totalInvested += currentMonthlySIP;
    currentCorpus = (currentCorpus + currentMonthlySIP) * (1 + r);

    if (m % 12 === 0 || m === totalMonths) {
      const yr = Math.ceil(m / 12);
      const estRet = Math.max(0, currentCorpus - totalInvested);
      yearlyBreakdown.push({
        year: yr,
        invested: Math.round(totalInvested),
        returns: Math.round(estRet),
        totalValue: Math.round(currentCorpus),
      });
    }
  }

  const maturity = Math.round(currentCorpus);
  const invested = Math.round(totalInvested);
  const returns = Math.max(0, maturity - invested);

  return {
    investedAmount: invested,
    estimatedReturns: returns,
    totalMaturityValue: maturity,
    wealthGainedRatio: maturity > 0 ? Number(((returns / maturity) * 100).toFixed(1)) : 0,
    investedRatio: maturity > 0 ? Number(((invested / maturity) * 100).toFixed(1)) : 100,
    yearlyBreakdown,
    finalMonthlySIP: Math.round(currentMonthlySIP),
  };
}

/**
 * Lump Sum Calculator: A = P × (1 + r/100)^t
 */
export function calculateLumpSum(
  principal: number,
  expectedReturnRate: number,
  timePeriodYears: number
): SIPResult {
  const P = Math.max(0, principal);
  const r = Math.max(0, expectedReturnRate) / 100;
  const t = Math.max(0.1, timePeriodYears);

  const yearlyBreakdown: SIPResult['yearlyBreakdown'] = [];

  for (let yr = 1; yr <= Math.ceil(t); yr++) {
    const value = P * Math.pow(1 + r, yr);
    yearlyBreakdown.push({
      year: yr,
      invested: P,
      returns: Math.round(value - P),
      totalValue: Math.round(value),
    });
  }

  const totalMaturityValue = Math.round(P * Math.pow(1 + r, t));
  const estimatedReturns = Math.max(0, totalMaturityValue - P);

  return {
    investedAmount: P,
    estimatedReturns,
    totalMaturityValue,
    wealthGainedRatio: totalMaturityValue > 0 ? Number(((estimatedReturns / totalMaturityValue) * 100).toFixed(1)) : 0,
    investedRatio: totalMaturityValue > 0 ? Number(((P / totalMaturityValue) * 100).toFixed(1)) : 100,
    yearlyBreakdown,
  };
}

/**
 * SWP (Systematic Withdrawal Plan)
 */
export interface SWPResult {
  initialInvestment: number;
  totalWithdrawn: number;
  finalBalance: number;
  yearlySchedule: {
    year: number;
    openingBalance: number;
    withdrawnDuringYear: number;
    growthDuringYear: number;
    closingBalance: number;
  }[];
}

export function calculateSWP(
  initialCorpus: number,
  monthlyWithdrawal: number,
  expectedReturnRate: number,
  tenureYears: number
): SWPResult {
  const P = initialCorpus;
  const W = monthlyWithdrawal;
  const r = expectedReturnRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  let balance = P;
  let totalWithdrawn = 0;
  const yearlySchedule: SWPResult['yearlySchedule'] = [];

  let yearOpening = balance;
  let yearWithdrawn = 0;
  let yearGrowth = 0;

  for (let m = 1; m <= totalMonths; m++) {
    if (balance <= 0) {
      break;
    }
    const growth = balance * r;
    yearGrowth += growth;
    balance += growth;

    const withdrawAmount = Math.min(balance, W);
    balance -= withdrawAmount;
    totalWithdrawn += withdrawAmount;
    yearWithdrawn += withdrawAmount;

    if (m % 12 === 0 || m === totalMonths || balance <= 0) {
      const yr = Math.ceil(m / 12);
      yearlySchedule.push({
        year: yr,
        openingBalance: Math.round(yearOpening),
        withdrawnDuringYear: Math.round(yearWithdrawn),
        growthDuringYear: Math.round(yearGrowth),
        closingBalance: Math.round(balance),
      });
      yearOpening = balance;
      yearWithdrawn = 0;
      yearGrowth = 0;
    }
  }

  return {
    initialInvestment: P,
    totalWithdrawn: Math.round(totalWithdrawn),
    finalBalance: Math.round(balance),
    yearlySchedule,
  };
}
