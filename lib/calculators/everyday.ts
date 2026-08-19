/**
 * Everyday & Investment Planning Calculations
 */

/**
 * CAGR = (End Value / Begin Value)^(1 / n) - 1
 */
export function calculateCAGR(
  beginningValue: number,
  endingValue: number,
  periodYears: number
): {
  cagr: number; // percentage
  absoluteReturn: number; // percentage
  totalGain: number;
} {
  const beg = Math.max(0.01, beginningValue);
  const end = Math.max(0, endingValue);
  const n = Math.max(0.01, periodYears);

  const cagr = (Math.pow(end / beg, 1 / n) - 1) * 100;
  const absoluteReturn = ((end - beg) / beg) * 100;
  const totalGain = end - beg;

  return {
    cagr: Number(cagr.toFixed(2)),
    absoluteReturn: Number(absoluteReturn.toFixed(2)),
    totalGain: Math.round(totalGain),
  };
}

/**
 * Goal Planner (Target Amount -> Required Monthly SIP)
 * Monthly SIP = Target × i / ((1 + i)^n - 1) / (1 + i)
 */
export function calculateGoalPlan(
  targetCorpus: number,
  yearsToGoal: number,
  expectedReturnRate: number,
  existingSavings: number = 0
): {
  requiredMonthlySIP: number;
  futureValueOfExistingSavings: number;
  remainingTarget: number;
  totalSelfInvested: number;
  estimatedGrowth: number;
} {
  const r = expectedReturnRate / 100;
  const i = r / 12;
  const n = yearsToGoal * 12;

  const fvExisting = existingSavings * Math.pow(1 + r, yearsToGoal);
  const remainingTarget = Math.max(0, targetCorpus - fvExisting);

  let monthlySIP = 0;
  if (i > 0 && n > 0 && remainingTarget > 0) {
    const factor = Math.pow(1 + i, n);
    monthlySIP = (remainingTarget * i) / ((factor - 1) * (1 + i));
  } else if (n > 0) {
    monthlySIP = remainingTarget / n;
  }

  const roundedSIP = Math.round(monthlySIP);
  const totalSelfInvested = roundedSIP * n;
  const estimatedGrowth = Math.max(0, remainingTarget - totalSelfInvested);

  return {
    requiredMonthlySIP: roundedSIP,
    futureValueOfExistingSavings: Math.round(fvExisting),
    remainingTarget: Math.round(remainingTarget),
    totalSelfInvested,
    estimatedGrowth,
  };
}

/**
 * Inflation & Future Cost Calculator
 * Future Value = Present Value × (1 + inflation/100)^years
 */
export function calculateInflation(
  currentExpense: number,
  annualInflationRate: number,
  timePeriodYears: number
): {
  futureCost: number;
  increaseAmount: number;
  purchasingPowerLossPercent: number;
} {
  const PV = Math.max(0, currentExpense);
  const r = Math.max(0, annualInflationRate) / 100;
  const t = Math.max(0, timePeriodYears);

  const futureCost = PV * Math.pow(1 + r, t);
  const increaseAmount = futureCost - PV;
  // Current money worth in future terms: PV / (1+r)^t
  const futureWorthOfSameMoney = PV / Math.pow(1 + r, t);
  const purchasingPowerLossPercent = PV > 0 ? ((PV - futureWorthOfSameMoney) / PV) * 100 : 0;

  return {
    futureCost: Math.round(futureCost),
    increaseAmount: Math.round(increaseAmount),
    purchasingPowerLossPercent: Number(purchasingPowerLossPercent.toFixed(1)),
  };
}

/**
 * Percentage Calculations
 */
export function calculatePercentage(type: 'whatIsXOfY' | 'percentOf' | 'percentChange', a: number, b: number): {
  result: number;
  formulaString: string;
} {
  let result = 0;
  let formulaString = '';

  if (type === 'whatIsXOfY') {
    // What percentage is A of B? -> (A / B) * 100
    result = b !== 0 ? (a / b) * 100 : 0;
    formulaString = `(${a} ÷ ${b}) × 100 = ${result.toFixed(2)}%`;
  } else if (type === 'percentOf') {
    // What is A% of B? -> (A / 100) * B
    result = (a / 100) * b;
    formulaString = `(${a}% × ${b}) = ${result.toFixed(2)}`;
  } else if (type === 'percentChange') {
    // % change from A to B -> ((B - A) / A) * 100
    result = a !== 0 ? ((b - a) / a) * 100 : 0;
    formulaString = `((${b} - ${a}) ÷ ${a}) × 100 = ${result > 0 ? '+' : ''}${result.toFixed(2)}%`;
  }

  return {
    result: Number(result.toFixed(2)),
    formulaString,
  };
}

/**
 * Age & Date Difference Calculator
 */
export function calculateAge(birthDateStr: string, asOfDateStr?: string): {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  daysToNextBirthday: number;
  nextBirthdayDays: number;
} {
  const birth = new Date(birthDateStr);
  const today = asOfDateStr ? new Date(asOfDateStr) : new Date();

  if (isNaN(birth.getTime())) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      totalWeeks: 0,
      totalHours: 0,
      daysToNextBirthday: 0,
      nextBirthdayDays: 0,
    };
  }

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const diffMs = today.getTime() - birth.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;

  // Next birthday
  let nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday < today) {
    nextBirthday = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }
  const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    totalDays: Math.max(0, totalDays),
    totalWeeks: Math.max(0, totalWeeks),
    totalHours: Math.max(0, totalHours),
    daysToNextBirthday: Math.max(0, daysToNextBirthday),
    nextBirthdayDays: Math.max(0, daysToNextBirthday),
  };
}

/**
 * BMI Calculator (With Indian/Asian specific cutoffs)
 * Asian/Indian BMI Standards:
 * < 18.5: Underweight
 * 18.5 - 22.9: Normal / Healthy
 * 23.0 - 24.9: Overweight
 * >= 25.0: Obese
 */
export function calculateBMI(weightKg: number, heightCm: number): {
  bmi: number;
  category: string;
  categoryColor: string;
  healthyWeightMin: number;
  healthyWeightMax: number;
} {
  const heightM = heightCm / 100;
  if (heightM <= 0 || weightKg <= 0) {
    return { bmi: 0, category: 'N/A', categoryColor: 'gray', healthyWeightMin: 0, healthyWeightMax: 0 };
  }

  const bmi = weightKg / (heightM * heightM);
  let category = 'Healthy Weight';
  let categoryColor = 'text-emerald-500';

  if (bmi < 18.5) {
    category = 'Underweight';
    categoryColor = 'text-amber-500';
  } else if (bmi <= 22.9) {
    category = 'Normal / Healthy (Asian Standard)';
    categoryColor = 'text-emerald-500';
  } else if (bmi <= 24.9) {
    category = 'Overweight';
    categoryColor = 'text-amber-500';
  } else {
    category = 'Obese';
    categoryColor = 'text-rose-500';
  }

  const healthyWeightMin = Number((18.5 * heightM * heightM).toFixed(1));
  const healthyWeightMax = Number((22.9 * heightM * heightM).toFixed(1));

  return {
    bmi: Number(bmi.toFixed(1)),
    category,
    categoryColor,
    healthyWeightMin,
    healthyWeightMax,
  };
}

/**
 * Profit and Loss Margin
 */
export function calculatePercentageOf(percentage: number, total: number): number {
  return Number(((percentage / 100) * total).toFixed(2));
}

export function calculatePercentageChange(initial: number, finalVal: number): {
  type: 'increase' | 'decrease';
  percentageChange: number;
  absoluteDiff: number;
} {
  const diff = finalVal - initial;
  const type = diff >= 0 ? 'increase' : 'decrease';
  const pct = initial !== 0 ? Math.abs((diff / initial) * 100) : 0;
  return {
    type,
    percentageChange: Number(pct.toFixed(2)),
    absoluteDiff: Math.abs(diff),
  };
}

export function calculateWhatPercentOf(value: number, total: number): number {
  if (total === 0) return 0;
  return Number(((value / total) * 100).toFixed(2));
}

export interface InHandSalaryResult {
  ctc: number;
  monthlyGross: number;
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  epfEmployee: number;
  monthlyEmployeePF: number;
  epfEmployer: number;
  professionalTax: number;
  professionalTaxMonthly: number;
  incomeTaxMonthly: number;
  monthlyTDS: number;
  takeHomeMonthly: number;
  monthlyInHand: number;
  takeHomeAnnual: number;
  totalDeductionsMonthly: number;
}

export function calculateInHandSalary(
  annualCTC: number,
  epfOptedOrCityTier: boolean | 'metro' | 'non-metro' = true,
  professionalTaxOrRegime: number | 'new' | 'old' = 200
): InHandSalaryResult {
  const ctc = Math.max(0, annualCTC);
  const monthlyGrossCTC = ctc / 12;

  // Check if epf is opted (boolean or city tier)
  const isEpfOpted = typeof epfOptedOrCityTier === 'boolean' ? epfOptedOrCityTier : true;
  const cityTier = typeof epfOptedOrCityTier === 'string' ? epfOptedOrCityTier : 'metro';

  // Typical Indian salary structure: Basic ~ 40-50% of CTC
  const basicSalaryAnnual = ctc * 0.40;
  const basicSalaryMonthly = basicSalaryAnnual / 12;

  // HRA ~ 40-50% of basic
  const hraAnnual = basicSalaryAnnual * (cityTier === 'metro' ? 0.50 : 0.40);
  const hraMonthly = hraAnnual / 12;

  // EPF: 12% of basic (capped or uncapped)
  const epfMonthly = isEpfOpted ? Math.min(basicSalaryMonthly * 0.12, 1800) : 0;
  const epfEmployerMonthly = isEpfOpted ? epfMonthly : 0;

  // Professional Tax: standard ~ ₹200/mo (₹2,500/yr)
  const ptMonthly = typeof professionalTaxOrRegime === 'number'
    ? professionalTaxOrRegime
    : ctc > 300000 ? 200 : 0;

  // Special allowances is remainder
  const otherAllowancesMonthly = Math.max(0, monthlyGrossCTC - basicSalaryMonthly - hraMonthly - epfEmployerMonthly);

  // Approximate income tax under New Regime (FY 2024-25 / 2025-26)
  // Standard deduction 75,000 for salaried
  const stdDeduction = 75000;
  const taxableIncome = Math.max(0, ctc - stdDeduction);
  let annualTax = 0;
  if (taxableIncome <= 300000) {
    annualTax = 0;
  } else if (taxableIncome <= 700000) {
    annualTax = (taxableIncome - 300000) * 0.05;
    // Sec 87A rebate if taxable <= 7L
    annualTax = 0;
  } else if (taxableIncome <= 1000000) {
    annualTax = 400000 * 0.05 + (taxableIncome - 700000) * 0.10;
  } else if (taxableIncome <= 1200000) {
    annualTax = 400000 * 0.05 + 300000 * 0.10 + (taxableIncome - 1000000) * 0.15;
  } else if (taxableIncome <= 1500000) {
    annualTax = 400000 * 0.05 + 300000 * 0.10 + 200000 * 0.15 + (taxableIncome - 1200000) * 0.20;
  } else {
    annualTax = 400000 * 0.05 + 300000 * 0.10 + 200000 * 0.15 + 300000 * 0.20 + (taxableIncome - 1500000) * 0.30;
  }
  // 4% cess
  annualTax = annualTax * 1.04;
  const incomeTaxMonthly = Math.round(annualTax / 12);

  const totalDeductionsMonthly = Math.round(epfMonthly + ptMonthly + incomeTaxMonthly);
  const actualGrossMonthly = basicSalaryMonthly + hraMonthly + otherAllowancesMonthly;
  const takeHomeMonthly = Math.max(0, Math.round(actualGrossMonthly - epfMonthly - ptMonthly - incomeTaxMonthly));
  const takeHomeAnnual = takeHomeMonthly * 12;

  return {
    ctc,
    monthlyGross: Math.round(monthlyGrossCTC),
    basicSalary: Math.round(basicSalaryMonthly),
    hra: Math.round(hraMonthly),
    specialAllowance: Math.round(otherAllowancesMonthly),
    epfEmployee: Math.round(epfMonthly),
    monthlyEmployeePF: Math.round(epfMonthly),
    epfEmployer: Math.round(epfEmployerMonthly),
    professionalTax: ptMonthly,
    professionalTaxMonthly: ptMonthly,
    incomeTaxMonthly,
    monthlyTDS: incomeTaxMonthly,
    takeHomeMonthly,
    monthlyInHand: takeHomeMonthly,
    takeHomeAnnual,
    totalDeductionsMonthly,
  };
}

export function calculateProfitLoss(costPrice: number, sellingPrice: number): {
  isProfit: boolean;
  amount: number;
  marginPercent: number; // on selling price
  markupPercent: number; // on cost price
} {
  const diff = sellingPrice - costPrice;
  const isProfit = diff >= 0;
  const amount = Math.abs(diff);

  const marginPercent = sellingPrice > 0 ? (diff / sellingPrice) * 100 : 0;
  const markupPercent = costPrice > 0 ? (diff / costPrice) * 100 : 0;

  return {
    isProfit,
    amount: Math.round(amount),
    marginPercent: Number(marginPercent.toFixed(2)),
    markupPercent: Number(markupPercent.toFixed(2)),
  };
}
