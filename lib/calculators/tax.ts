/**
 * Indian Tax & Salary Calculations (Updated for AY 2025-26 / FY 2024-25 Budget)
 */

export interface TaxRegimeResult {
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  baseTax: number;
  rebate87A: number;
  taxAfterRebate: number;
  cess: number; // 4% Health & Education Cess
  totalTaxPayable: number;
  monthlyNetIncome: number;
  effectiveTaxRate: number; // percentage
  slabsBreakdown: {
    slab: string;
    rate: string;
    taxableAmountInSlab: number;
    taxForSlab: number;
  }[];
}

export interface IncomeTaxComparison {
  newRegime: TaxRegimeResult;
  oldRegime: TaxRegimeResult;
  recommendedRegime: 'new' | 'old';
  taxDifference: number; // Positive = savings with recommended
}

/**
 * New Tax Regime (Budget 2024-25 / AY 2025-26):
 * Standard Deduction = ₹75,000 (Salaried)
 * 0 - 3,00,000: Nil
 * 3,00,001 - 7,00,000: 5%
 * 7,00,001 - 10,00,000: 10%
 * 10,00,001 - 12,00,000: 15%
 * 12,00,001 - 15,00,000: 20%
 * Above 15,00,000: 30%
 * Section 87A rebate: Taxable income up to ₹7,00,000 has zero tax.
 */
export function calculateNewTaxRegime(grossSalary: number, isSalaried: boolean = true): TaxRegimeResult {
  const stdDeduction = isSalaried ? 75000 : 0;
  const taxableIncome = Math.max(0, grossSalary - stdDeduction);

  const slabs = [
    { min: 0, max: 300000, rate: 0, label: '₹0 - ₹3,00,000' },
    { min: 300000, max: 700000, rate: 0.05, label: '₹3,00,001 - ₹7,00,000' },
    { min: 700000, max: 1000000, rate: 0.10, label: '₹7,00,001 - ₹10,00,000' },
    { min: 1000000, max: 1200000, rate: 0.15, label: '₹10,00,001 - ₹12,00,000' },
    { min: 1200000, max: 1500000, rate: 0.20, label: '₹12,00,001 - ₹15,00,000' },
    { min: 1500000, max: Infinity, rate: 0.30, label: 'Above ₹15,00,000' },
  ];

  let baseTax = 0;
  const slabsBreakdown = [];

  for (const slab of slabs) {
    if (taxableIncome > slab.min) {
      const taxableInSlab = Math.min(taxableIncome, slab.max) - slab.min;
      const tax = taxableInSlab * slab.rate;
      baseTax += tax;
      slabsBreakdown.push({
        slab: slab.label,
        rate: `${slab.rate * 100}%`,
        taxableAmountInSlab: Math.round(taxableInSlab),
        taxForSlab: Math.round(tax),
      });
    }
  }

  // Section 87A rebate for taxable income <= 7,00,000
  let rebate87A = 0;
  if (taxableIncome <= 700000) {
    rebate87A = baseTax;
  }

  const taxAfterRebate = Math.max(0, baseTax - rebate87A);
  const cess = taxAfterRebate * 0.04;
  const totalTaxPayable = Math.round(taxAfterRebate + cess);
  const annualNet = grossSalary - totalTaxPayable;
  const monthlyNet = Math.round(annualNet / 12);
  const effectiveTaxRate = grossSalary > 0 ? Number(((totalTaxPayable / grossSalary) * 100).toFixed(2)) : 0;

  return {
    grossIncome: grossSalary,
    totalDeductions: stdDeduction,
    taxableIncome,
    baseTax: Math.round(baseTax),
    rebate87A: Math.round(rebate87A),
    taxAfterRebate: Math.round(taxAfterRebate),
    cess: Math.round(cess),
    totalTaxPayable,
    monthlyNetIncome: monthlyNet,
    effectiveTaxRate,
    slabsBreakdown,
  };
}

/**
 * Old Tax Regime:
 * Standard Deduction: ₹50,000
 * 0 - 2.5L: Nil
 * 2.5L - 5L: 5%
 * 5L - 10L: 20%
 * Above 10L: 30%
 * Section 87A rebate: Taxable income up to ₹5,00,000 has zero tax.
 */
export function calculateOldTaxRegime(
  grossSalary: number,
  deduction80C: number = 0,
  deduction80D: number = 0,
  hraExemption: number = 0,
  homeLoanInterest24b: number = 0,
  nps80CCD1B: number = 0,
  otherDeductions: number = 0,
  isSalaried: boolean = true
): TaxRegimeResult {
  const stdDeduction = isSalaried ? 50000 : 0;
  const capped80C = Math.min(150000, Math.max(0, deduction80C));
  const capped80D = Math.min(100000, Math.max(0, deduction80D));
  const capped24b = Math.min(200000, Math.max(0, homeLoanInterest24b));
  const cappedNps = Math.min(50000, Math.max(0, nps80CCD1B));

  const totalDeductions = stdDeduction + capped80C + capped80D + hraExemption + capped24b + cappedNps + otherDeductions;
  const taxableIncome = Math.max(0, grossSalary - totalDeductions);

  const slabs = [
    { min: 0, max: 250000, rate: 0, label: '₹0 - ₹2,50,000' },
    { min: 250000, max: 500000, rate: 0.05, label: '₹2,50,001 - ₹5,00,000' },
    { min: 500000, max: 1000000, rate: 0.20, label: '₹5,00,001 - ₹10,00,000' },
    { min: 1000000, max: Infinity, rate: 0.30, label: 'Above ₹10,00,000' },
  ];

  let baseTax = 0;
  const slabsBreakdown = [];

  for (const slab of slabs) {
    if (taxableIncome > slab.min) {
      const taxableInSlab = Math.min(taxableIncome, slab.max) - slab.min;
      const tax = taxableInSlab * slab.rate;
      baseTax += tax;
      slabsBreakdown.push({
        slab: slab.label,
        rate: `${slab.rate * 100}%`,
        taxableAmountInSlab: Math.round(taxableInSlab),
        taxForSlab: Math.round(tax),
      });
    }
  }

  let rebate87A = 0;
  if (taxableIncome <= 500000) {
    rebate87A = baseTax;
  }

  const taxAfterRebate = Math.max(0, baseTax - rebate87A);
  const cess = taxAfterRebate * 0.04;
  const totalTaxPayable = Math.round(taxAfterRebate + cess);
  const annualNet = grossSalary - totalTaxPayable;
  const monthlyNet = Math.round(annualNet / 12);
  const effectiveTaxRate = grossSalary > 0 ? Number(((totalTaxPayable / grossSalary) * 100).toFixed(2)) : 0;

  return {
    grossIncome: grossSalary,
    totalDeductions,
    taxableIncome,
    baseTax: Math.round(baseTax),
    rebate87A: Math.round(rebate87A),
    taxAfterRebate: Math.round(taxAfterRebate),
    cess: Math.round(cess),
    totalTaxPayable,
    monthlyNetIncome: monthlyNet,
    effectiveTaxRate,
    slabsBreakdown,
  };
}

export function compareTaxRegimes(
  grossSalary: number,
  deduction80C: number = 150000,
  deduction80D: number = 25000,
  hraExemption: number = 0,
  homeLoanInterest: number = 0,
  isSalaried: boolean = true
): IncomeTaxComparison {
  const newRegime = calculateNewTaxRegime(grossSalary, isSalaried);
  const oldRegime = calculateOldTaxRegime(
    grossSalary,
    deduction80C,
    deduction80D,
    hraExemption,
    homeLoanInterest,
    0,
    0,
    isSalaried
  );

  const diff = Math.abs(newRegime.totalTaxPayable - oldRegime.totalTaxPayable);
  const recommendedRegime = newRegime.totalTaxPayable <= oldRegime.totalTaxPayable ? 'new' : 'old';

  return {
    newRegime,
    oldRegime,
    recommendedRegime,
    taxDifference: diff,
  };
}

/**
 * GST Calculator
 */
export interface GSTResult {
  originalAmount: number;
  gstRate: number;
  gstAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  isExclusive: boolean;
}

export function calculateGST(
  amount: number,
  gstRate: number,
  isExclusive: boolean = true,
  isInterState: boolean = false
): GSTResult {
  const r = Math.max(0, gstRate);
  let original = amount;
  let gstAmount = 0;
  let totalAmount = 0;

  if (isExclusive) {
    // Price without GST -> add GST
    gstAmount = (amount * r) / 100;
    totalAmount = amount + gstAmount;
  } else {
    // Price with GST -> extract GST
    totalAmount = amount;
    original = (amount * 100) / (100 + r);
    gstAmount = totalAmount - original;
  }

  const cgst = isInterState ? 0 : gstAmount / 2;
  const sgst = isInterState ? 0 : gstAmount / 2;
  const igst = isInterState ? gstAmount : 0;

  return {
    originalAmount: Math.round(original * 100) / 100,
    gstRate: r,
    gstAmount: Math.round(gstAmount * 100) / 100,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    igst: Math.round(igst * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    isExclusive,
  };
}

/**
 * HRA Calculator under Section 10(13A)
 * Minimum of:
 * 1. Actual HRA received
 * 2. 50% of Basic salary (Metro) or 40% (Non-metro)
 * 3. Actual Rent paid - 10% of Basic salary
 */
export function calculateHRA(
  basicSalary: number,
  da: number = 0,
  hraReceived: number = 0,
  rentPaid: number = 0,
  isMetro: boolean = true
): {
  exemptHRA: number;
  taxableHRA: number;
  criteria1: number;
  criteria2: number;
  criteria3: number;
} {
  const salaryForHRA = basicSalary + da;
  const c1 = hraReceived;
  const c2 = (salaryForHRA * (isMetro ? 50 : 40)) / 100;
  const c3 = Math.max(0, rentPaid - salaryForHRA * 0.1);

  const exemptHRA = Math.max(0, Math.min(c1, c2, c3));
  const taxableHRA = Math.max(0, hraReceived - exemptHRA);

  return {
    exemptHRA: Math.round(exemptHRA),
    taxableHRA: Math.round(taxableHRA),
    criteria1: Math.round(c1),
    criteria2: Math.round(c2),
    criteria3: Math.round(c3),
  };
}

/**
 * Gratuity: G = (15 × Last Drawn Basic Salary × Years of Service) / 26
 */
export function calculateGratuity(
  monthlyBasicPlusDA: number,
  tenureYears: number
): {
  gratuityAmount: number;
  isEligible: boolean;
  maxExemptLimit: number;
  taxableGratuity: number;
} {
  const isEligible = tenureYears >= 5;
  const maxExemptLimit = 2000000; // ₹20 Lakh statutory exemption

  let gratuity = 0;
  if (tenureYears > 0) {
    gratuity = (15 * monthlyBasicPlusDA * tenureYears) / 26;
  }

  gratuity = Math.round(gratuity);
  const taxable = Math.max(0, gratuity - maxExemptLimit);

  return {
    gratuityAmount: gratuity,
    isEligible,
    maxExemptLimit,
    taxableGratuity: Math.round(taxable),
  };
}
