export interface EMIResult {
  monthlyEMI: number;
  totalInterest: number;
  totalAmount: number;
  principal: number;
  interestRatio: number; // percentage
  principalRatio: number; // percentage
  yearlySchedule: YearlyAmortization[];
  monthlySchedule: MonthlyAmortization[];
}

export interface MonthlyAmortization {
  month: number;
  openingBalance: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
}

export interface YearlyAmortization {
  year: number;
  openingBalance: number;
  totalEMIPaid: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
}

/**
 * Formula: E = P × r × (1 + r)^n / ((1 + r)^n - 1)
 * P = Principal, r = Monthly interest rate (annual / 12 / 100), n = months
 */
export function calculateEMI(
  principal: number,
  annualInterestRate: number,
  tenureYears: number,
  tenureMonthsOffset: number = 0
): EMIResult {
  const P = Math.max(0, principal);
  const r = Math.max(0, annualInterestRate) / 12 / 100;
  const totalMonths = Math.max(1, Math.round(tenureYears * 12 + tenureMonthsOffset));

  let emi = 0;
  if (r === 0) {
    emi = P / totalMonths;
  } else {
    const factor = Math.pow(1 + r, totalMonths);
    emi = (P * r * factor) / (factor - 1);
  }

  emi = Math.round(emi);
  const totalAmount = emi * totalMonths;
  const totalInterest = Math.max(0, totalAmount - P);

  const monthlySchedule: MonthlyAmortization[] = [];
  const yearlySchedule: YearlyAmortization[] = [];

  let balance = P;
  let yearPrincipal = 0;
  let yearInterest = 0;
  let yearOpening = P;

  for (let m = 1; m <= totalMonths; m++) {
    const interestForMonth = r > 0 ? balance * r : 0;
    let principalForMonth = emi - interestForMonth;

    if (m === totalMonths || balance - principalForMonth < 0) {
      principalForMonth = balance;
    }

    const opening = balance;
    balance = Math.max(0, balance - principalForMonth);

    monthlySchedule.push({
      month: m,
      openingBalance: Math.round(opening),
      emi: Math.round(principalForMonth + interestForMonth),
      principalPaid: Math.round(principalForMonth),
      interestPaid: Math.round(interestForMonth),
      closingBalance: Math.round(balance),
    });

    yearPrincipal += principalForMonth;
    yearInterest += interestForMonth;

    if (m % 12 === 0 || m === totalMonths) {
      const yearIndex = Math.ceil(m / 12);
      yearlySchedule.push({
        year: yearIndex,
        openingBalance: Math.round(yearOpening),
        totalEMIPaid: Math.round(yearPrincipal + yearInterest),
        principalPaid: Math.round(yearPrincipal),
        interestPaid: Math.round(yearInterest),
        closingBalance: Math.round(balance),
      });
      yearOpening = balance;
      yearPrincipal = 0;
      yearInterest = 0;
    }
  }

  const interestRatio = totalAmount > 0 ? (totalInterest / totalAmount) * 100 : 0;
  const principalRatio = totalAmount > 0 ? (P / totalAmount) * 100 : 100;

  return {
    monthlyEMI: emi,
    totalInterest,
    totalAmount,
    principal: P,
    interestRatio: Number(interestRatio.toFixed(1)),
    principalRatio: Number(principalRatio.toFixed(1)),
    yearlySchedule,
    monthlySchedule,
  };
}

export interface PrepaymentResult {
  originalEMI: number;
  originalTotalInterest: number;
  newTotalInterest: number;
  interestSaved: number;
  originalTenureMonths: number;
  newTenureMonths: number;
  monthsSaved: number;
}

export function calculatePrepayment(
  principal: number,
  annualInterestRate: number,
  tenureYears: number,
  monthlyExtraPrepayment: number = 0,
  oneTimeLumpSum: number = 0,
  lumpSumAfterMonths: number = 12
): PrepaymentResult {
  const original = calculateEMI(principal, annualInterestRate, tenureYears);
  const r = annualInterestRate / 12 / 100;
  const emi = original.monthlyEMI;
  const originalMonths = tenureYears * 12;

  let balance = principal;
  let totalInterest = 0;
  let months = 0;

  while (balance > 0 && months < 600) {
    months++;
    const interest = balance * r;
    totalInterest += interest;

    let extra = monthlyExtraPrepayment;
    if (months === lumpSumAfterMonths) {
      extra += oneTimeLumpSum;
    }

    const principalPayment = emi - interest + extra;
    balance -= principalPayment;
    if (balance <= 0) break;
  }

  const interestSaved = Math.max(0, original.totalInterest - totalInterest);
  const monthsSaved = Math.max(0, originalMonths - months);

  return {
    originalEMI: emi,
    originalTotalInterest: original.totalInterest,
    newTotalInterest: Math.round(totalInterest),
    interestSaved: Math.round(interestSaved),
    originalTenureMonths: originalMonths,
    newTenureMonths: months,
    monthsSaved,
  };
}

export interface FlatVsReducingResult {
  flatRate: number;
  flatTotalInterest: number;
  flatEMI: number;
  reducingEquivalentRate: number;
  reducingEMI: number;
  reducingTotalInterest: number;
}

export function calculateFlatVsReducing(
  principal: number,
  flatRateAnnual: number,
  tenureYears: number
): FlatVsReducingResult {
  const P = principal;
  const totalMonths = tenureYears * 12;
  const flatTotalInterest = (P * (flatRateAnnual / 100) * tenureYears);
  const flatEMI = Math.round((P + flatTotalInterest) / totalMonths);

  // Approximate equivalent reducing interest rate
  // Rough estimate: flat rate * 1.8 to 1.9 depending on tenure
  // Exact binary search
  let low = 0.01;
  let high = 50.0;
  let bestRate = flatRateAnnual;

  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2;
    const r = mid / 12 / 100;
    const factor = Math.pow(1 + r, totalMonths);
    const emi = (P * r * factor) / (factor - 1);
    if (emi < flatEMI) {
      low = mid;
      bestRate = mid;
    } else {
      high = mid;
    }
  }

  const reducing = calculateEMI(P, bestRate, tenureYears);

  return {
    flatRate: flatRateAnnual,
    flatTotalInterest: Math.round(flatTotalInterest),
    flatEMI,
    reducingEquivalentRate: Number(bestRate.toFixed(2)),
    reducingEMI: reducing.monthlyEMI,
    reducingTotalInterest: reducing.totalInterest,
  };
}

export function calculateLoanEligibility(
  monthlyIncome: number,
  existingMonthlyEMI: number,
  interestRate: number,
  tenureYears: number,
  foirPercentage: number = 50 // Fixed Obligation to Income Ratio (standard in India is 40-60%)
): {
  maxAllowableEMI: number;
  maxEligibleLoanAmount: number;
  availableMonthlyDisposableForEMI: number;
} {
  const maxAllowableTotalEMI = (monthlyIncome * foirPercentage) / 100;
  const availableEMI = Math.max(0, maxAllowableTotalEMI - existingMonthlyEMI);
  
  const r = interestRate / 12 / 100;
  const n = tenureYears * 12;
  
  let maxLoan = 0;
  if (r > 0) {
    const factor = Math.pow(1 + r, n);
    maxLoan = (availableEMI * (factor - 1)) / (r * factor);
  } else {
    maxLoan = availableEMI * n;
  }

  return {
    maxAllowableEMI: Math.round(maxAllowableTotalEMI),
    maxEligibleLoanAmount: Math.round(maxLoan),
    availableMonthlyDisposableForEMI: Math.round(availableEMI),
  };
}
