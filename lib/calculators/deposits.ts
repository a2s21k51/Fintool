/**
 * Fixed Deposit, Recurring Deposit, PPF & Interest Calculations
 */

export interface DepositResult {
  totalDeposited: number;
  totalInterest: number;
  maturityValue: number;
  interestRatio: number;
  yearlyBreakdown: {
    year: number;
    deposited: number;
    interest: number;
    balance: number;
  }[];
}

/**
 * Fixed Deposit (Quarterly Compounding by default in Indian Banks)
 * A = P × (1 + r / (n × 100))^(n × t)
 * where n = compounding frequency per year (quarterly = 4)
 */
export function calculateFD(
  principal: number,
  annualInterestRate: number,
  tenureYears: number,
  compoundingFrequencyPerYear: number = 4 // quarterly
): DepositResult {
  const P = Math.max(0, principal);
  const r = Math.max(0, annualInterestRate);
  const t = Math.max(0.1, tenureYears);
  const n = Math.max(1, compoundingFrequencyPerYear);

  const maturityValue = P * Math.pow(1 + r / (n * 100), n * t);
  const totalInterest = Math.max(0, maturityValue - P);

  const yearlyBreakdown: DepositResult['yearlyBreakdown'] = [];
  for (let yr = 1; yr <= Math.ceil(t); yr++) {
    const currentT = Math.min(yr, t);
    const val = P * Math.pow(1 + r / (n * 100), n * currentT);
    yearlyBreakdown.push({
      year: yr,
      deposited: P,
      interest: Math.round(val - P),
      balance: Math.round(val),
    });
  }

  const mat = Math.round(maturityValue);
  const intr = Math.round(totalInterest);

  return {
    totalDeposited: P,
    totalInterest: intr,
    maturityValue: mat,
    interestRatio: mat > 0 ? Number(((intr / mat) * 100).toFixed(1)) : 0,
    yearlyBreakdown,
  };
}

/**
 * Recurring Deposit (RD)
 * Indian banks use quarterly compounding for monthly deposits:
 * M = R × [(1+i)^n - 1] / (1 - (1+i)^(-1/3)) where i = r/400
 */
export function calculateRD(
  monthlyDeposit: number,
  annualInterestRate: number,
  tenureMonths: number
): DepositResult {
  const R = Math.max(0, monthlyDeposit);
  const r = Math.max(0, annualInterestRate);
  const n = Math.max(1, tenureMonths);
  const quarters = n / 3;

  const i = r / 400;
  let maturity = 0;

  if (r === 0) {
    maturity = R * n;
  } else {
    // Standard Indian post office / bank RD formula
    // Compounded quarterly: each monthly installment earns interest for remaining quarters
    let sum = 0;
    for (let m = 1; m <= n; m++) {
      const remainingQuarters = (n - m + 1) / 3;
      sum += R * Math.pow(1 + i, remainingQuarters);
    }
    maturity = sum;
  }

  const totalDeposited = R * n;
  const totalInterest = Math.max(0, maturity - totalDeposited);

  const yearlyBreakdown: DepositResult['yearlyBreakdown'] = [];
  const years = Math.ceil(n / 12);
  let runningDep = 0;

  for (let yr = 1; yr <= years; yr++) {
    const monthsInYr = Math.min(yr * 12, n);
    runningDep = R * monthsInYr;
    
    let yrMaturity = 0;
    for (let m = 1; m <= monthsInYr; m++) {
      const remQ = (monthsInYr - m + 1) / 3;
      yrMaturity += R * Math.pow(1 + i, remQ);
    }

    yearlyBreakdown.push({
      year: yr,
      deposited: Math.round(runningDep),
      interest: Math.round(yrMaturity - runningDep),
      balance: Math.round(yrMaturity),
    });
  }

  const mat = Math.round(maturity);
  const intr = Math.round(totalInterest);

  return {
    totalDeposited,
    totalInterest: intr,
    maturityValue: mat,
    interestRatio: mat > 0 ? Number(((intr / mat) * 100).toFixed(1)) : 0,
    yearlyBreakdown,
  };
}

/**
 * PPF (Public Provident Fund)
 * Official rate = 7.1% per annum, 15 years standard lock-in
 * Compounded annually
 */
export function calculatePPF(
  annualDeposit: number,
  interestRate: number = 7.1,
  tenureYears: number = 15
): DepositResult {
  const deposit = Math.min(150000, Math.max(500, annualDeposit)); // max 1.5L, min 500
  const r = interestRate / 100;
  const years = Math.max(1, tenureYears);

  let balance = 0;
  let totalDeposited = 0;
  const yearlyBreakdown: DepositResult['yearlyBreakdown'] = [];

  for (let yr = 1; yr <= years; yr++) {
    totalDeposited += deposit;
    // Deposited at beginning of financial year (max benefit)
    balance = (balance + deposit) * (1 + r);

    yearlyBreakdown.push({
      year: yr,
      deposited: totalDeposited,
      interest: Math.round(balance - totalDeposited),
      balance: Math.round(balance),
    });
  }

  const mat = Math.round(balance);
  const intr = Math.round(mat - totalDeposited);

  return {
    totalDeposited,
    totalInterest: intr,
    maturityValue: mat,
    interestRatio: mat > 0 ? Number(((intr / mat) * 100).toFixed(1)) : 0,
    yearlyBreakdown,
  };
}

/**
 * Compound Interest: A = P(1 + r/n)^(nt)
 */
export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  timeYears: number,
  frequency: 'annually' | 'semi-annually' | 'quarterly' | 'monthly' | 'daily' = 'annually'
): DepositResult {
  const P = Math.max(0, principal);
  const r = Math.max(0, annualRate) / 100;
  const t = Math.max(0.1, timeYears);

  const nMap = {
    annually: 1,
    'semi-annually': 2,
    quarterly: 4,
    monthly: 12,
    daily: 365,
  };
  const n = nMap[frequency] || 1;

  const maturity = P * Math.pow(1 + r / n, n * t);
  const totalInterest = Math.max(0, maturity - P);

  const yearlyBreakdown: DepositResult['yearlyBreakdown'] = [];
  for (let yr = 1; yr <= Math.ceil(t); yr++) {
    const curT = Math.min(yr, t);
    const val = P * Math.pow(1 + r / n, n * curT);
    yearlyBreakdown.push({
      year: yr,
      deposited: P,
      interest: Math.round(val - P),
      balance: Math.round(val),
    });
  }

  const mat = Math.round(maturity);
  const intr = Math.round(totalInterest);

  return {
    totalDeposited: P,
    totalInterest: intr,
    maturityValue: mat,
    interestRatio: mat > 0 ? Number(((intr / mat) * 100).toFixed(1)) : 0,
    yearlyBreakdown,
  };
}

/**
 * Simple Interest: SI = (P × R × T) / 100, A = P + SI
 */
export function calculateSimpleInterest(
  principal: number,
  annualRate: number,
  timeYears: number
): DepositResult {
  const P = Math.max(0, principal);
  const R = Math.max(0, annualRate);
  const T = Math.max(0.1, timeYears);

  const totalInterest = (P * R * T) / 100;
  const maturityValue = P + totalInterest;

  const yearlyBreakdown: DepositResult['yearlyBreakdown'] = [];
  for (let yr = 1; yr <= Math.ceil(T); yr++) {
    const curT = Math.min(yr, T);
    const yrIntr = (P * R * curT) / 100;
    yearlyBreakdown.push({
      year: yr,
      deposited: P,
      interest: Math.round(yrIntr),
      balance: Math.round(P + yrIntr),
    });
  }

  const mat = Math.round(maturityValue);
  const intr = Math.round(totalInterest);

  return {
    totalDeposited: P,
    totalInterest: intr,
    maturityValue: mat,
    interestRatio: mat > 0 ? Number(((intr / mat) * 100).toFixed(1)) : 0,
    yearlyBreakdown,
  };
}

