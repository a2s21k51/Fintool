export interface ToolItem {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  description?: string;
  category: 'loans' | 'investments' | 'savings' | 'tax' | 'everyday' | 'converters' | 'pdf';
  categoryLabel: string;
  icon: string; // Lucide icon name
  route: string;
  isPopular?: boolean;
  isNew?: boolean;
  badge?: string;
  keywords: string[];
}

export const CATEGORIES = [
  { id: 'all', label: 'All Tools', icon: 'LayoutGrid' },
  { id: 'loans', label: 'Loans & EMI', icon: 'Landmark' },
  { id: 'investments', label: 'Investments & Returns', icon: 'TrendingUp' },
  { id: 'savings', label: 'Savings & Deposits', icon: 'PiggyBank' },
  { id: 'tax', label: 'Tax & Salary', icon: 'Receipt' },
  { id: 'pdf', label: 'PDF Toolkit', icon: 'FileText' },
  { id: 'converters', label: 'Unit & Land Converters', icon: 'ArrowLeftRight' },
  { id: 'everyday', label: 'Everyday Tools', icon: 'Calculator' },
] as const;

export const TOOLS: ToolItem[] = [
  // Loans
  {
    id: 'emi-calculator',
    slug: 'emi-calculator',
    name: 'EMI Calculator',
    shortDesc: 'Calculate monthly loan EMI, total interest and comprehensive repayment schedule.',
    category: 'loans',
    categoryLabel: 'Loans & EMI',
    icon: 'Calculator',
    route: '/calculators/emi-calculator',
    isPopular: true,
    badge: 'Popular',
    keywords: ['emi', 'loan', 'home loan', 'personal loan', 'car loan', 'amortization', 'monthly payment', 'interest']
  },
  {
    id: 'home-loan-emi',
    slug: 'home-loan-emi-calculator',
    name: 'Home Loan EMI Calculator',
    shortDesc: 'Plan long-term home loans with tax deductions (Sec 24b & 80C) and prepayments.',
    category: 'loans',
    categoryLabel: 'Loans & EMI',
    icon: 'Home',
    route: '/calculators/home-loan-emi-calculator',
    isPopular: true,
    keywords: ['home loan', 'housing', 'property', 'emi', 'tax benefit', 'pmax']
  },
  {
    id: 'personal-loan-emi',
    slug: 'personal-loan-emi-calculator',
    name: 'Personal Loan EMI Calculator',
    shortDesc: 'Quickly estimate monthly outgo for personal financing, wedding or medical loans.',
    category: 'loans',
    categoryLabel: 'Loans & EMI',
    icon: 'UserCheck',
    route: '/calculators/personal-loan-emi-calculator',
    keywords: ['personal loan', 'instant loan', 'interest', 'quick emi']
  },
  {
    id: 'car-loan-emi',
    slug: 'car-loan-emi-calculator',
    name: 'Car Loan EMI Calculator',
    shortDesc: 'Calculate vehicle financing EMIs with down payment and on-road price estimates.',
    category: 'loans',
    categoryLabel: 'Loans & EMI',
    icon: 'Car',
    route: '/calculators/car-loan-emi-calculator',
    keywords: ['car loan', 'auto loan', 'bike loan', 'down payment', 'vehicle']
  },
  {
    id: 'loan-prepayment',
    slug: 'loan-prepayment-calculator',
    name: 'Loan Prepayment Calculator',
    shortDesc: 'See how extra monthly or lump-sum prepayments drastically reduce loan tenure & interest.',
    category: 'loans',
    categoryLabel: 'Loans & EMI',
    icon: 'Sparkles',
    route: '/calculators/loan-prepayment-calculator',
    isPopular: true,
    keywords: ['prepayment', 'part payment', 'tenure reduction', 'save interest']
  },
  {
    id: 'loan-eligibility',
    slug: 'loan-eligibility-calculator',
    name: 'Loan Eligibility Calculator',
    shortDesc: 'Determine maximum loan amount sanctioned based on monthly income and FOIR limits.',
    category: 'loans',
    categoryLabel: 'Loans & EMI',
    icon: 'ShieldCheck',
    route: '/calculators/loan-eligibility-calculator',
    keywords: ['eligibility', 'foir', 'salary loan', 'max loan']
  },
  {
    id: 'flat-vs-reducing',
    slug: 'flat-vs-reducing-calculator',
    name: 'Flat vs Reducing Interest Rate',
    shortDesc: 'Compare deceptive flat interest rates with actual effective reducing balance rates.',
    category: 'loans',
    categoryLabel: 'Loans & EMI',
    icon: 'Scale',
    route: '/calculators/flat-vs-reducing-calculator',
    keywords: ['flat interest', 'reducing interest', 'effective interest rate', 'apr']
  },

  // Investments
  {
    id: 'sip-calculator',
    slug: 'sip-calculator',
    name: 'SIP Calculator',
    shortDesc: 'Project future wealth from monthly mutual fund Systematic Investment Plans (SIP).',
    category: 'investments',
    categoryLabel: 'Investments & Returns',
    icon: 'TrendingUp',
    route: '/calculators/sip-calculator',
    isPopular: true,
    badge: 'Popular',
    keywords: ['sip', 'mutual fund', 'monthly investment', 'wealth', 'compound interest', 'equity']
  },
  {
    id: 'step-up-sip',
    slug: 'step-up-sip-calculator',
    name: 'Step-Up SIP Calculator',
    shortDesc: 'Model wealth creation by increasing monthly SIP amount by 5-15% annually with salary hikes.',
    category: 'investments',
    categoryLabel: 'Investments & Returns',
    icon: 'ArrowUpRight',
    route: '/calculators/step-up-sip-calculator',
    isPopular: true,
    badge: 'High Impact',
    keywords: ['step up sip', 'top up sip', 'annual increment', 'inflation sip']
  },
  {
    id: 'lump-sum-calculator',
    slug: 'lump-sum-calculator',
    name: 'Lump Sum Investment Calculator',
    shortDesc: 'Calculate compounded future returns on one-time mutual fund or stock investments.',
    category: 'investments',
    categoryLabel: 'Investments & Returns',
    icon: 'Coins',
    route: '/calculators/lump-sum-calculator',
    keywords: ['lump sum', 'one time investment', 'mutual fund', 'cagr returns']
  },
  {
    id: 'swp-calculator',
    slug: 'swp-calculator',
    name: 'SWP Calculator',
    shortDesc: 'Plan monthly regular income withdrawals while your remaining corpus stays invested.',
    category: 'investments',
    categoryLabel: 'Investments & Returns',
    icon: 'ArrowDownToLine',
    route: '/calculators/swp-calculator',
    keywords: ['swp', 'systematic withdrawal', 'pension', 'monthly cashflow', 'retirement']
  },
  {
    id: 'cagr-calculator',
    slug: 'cagr-calculator',
    name: 'CAGR Calculator',
    shortDesc: 'Calculate Compound Annual Growth Rate for stocks, real estate and mutual fund portfolios.',
    category: 'investments',
    categoryLabel: 'Investments & Returns',
    icon: 'LineChart',
    route: '/calculators/cagr-calculator',
    isPopular: true,
    keywords: ['cagr', 'annual growth', 'stock returns', 'portfolio growth']
  },
  {
    id: 'goal-planning',
    slug: 'goal-planning-calculator',
    name: 'Goal Planning Calculator',
    shortDesc: 'Find out the exact monthly investment needed to achieve your dream house, child education or retirement.',
    category: 'investments',
    categoryLabel: 'Investments & Returns',
    icon: 'Target',
    route: '/calculators/goal-planning-calculator',
    keywords: ['goal planning', 'target corpus', 'retirement corpus', 'child education']
  },
  {
    id: 'inflation-calculator',
    slug: 'inflation-calculator',
    name: 'Inflation & Purchasing Power Calculator',
    shortDesc: 'Understand how Indian inflation erodes purchasing power and calculate future cost of goods.',
    category: 'investments',
    categoryLabel: 'Investments & Returns',
    icon: 'Flame',
    route: '/calculators/inflation-calculator',
    keywords: ['inflation', 'purchasing power', 'future value of money', 'cost of living']
  },

  // Savings & Deposits
  {
    id: 'fd-calculator',
    slug: 'fd-calculator',
    name: 'FD Calculator (Fixed Deposit)',
    shortDesc: 'Calculate maturity value and interest payouts for bank and corporate fixed deposits.',
    category: 'savings',
    categoryLabel: 'Savings & Deposits',
    icon: 'PiggyBank',
    route: '/calculators/fd-calculator',
    isPopular: true,
    badge: 'Popular',
    keywords: ['fd', 'fixed deposit', 'bank interest', 'quarterly compounding', 'senior citizen fd']
  },
  {
    id: 'rd-calculator',
    slug: 'rd-calculator',
    name: 'RD Calculator (Recurring Deposit)',
    shortDesc: 'Calculate returns and quarterly compounding interest for monthly bank recurring deposits.',
    category: 'savings',
    categoryLabel: 'Savings & Deposits',
    icon: 'Layers',
    route: '/calculators/rd-calculator',
    keywords: ['rd', 'recurring deposit', 'monthly deposit', 'bank savings']
  },
  {
    id: 'ppf-calculator',
    slug: 'ppf-calculator',
    name: 'PPF Calculator (Public Provident Fund)',
    shortDesc: '15-year government guaranteed tax-free (EEE) wealth calculator at official 7.1% interest.',
    category: 'savings',
    categoryLabel: 'Savings & Deposits',
    icon: 'BadgePercent',
    route: '/calculators/ppf-calculator',
    isPopular: true,
    keywords: ['ppf', 'provident fund', 'tax free', '80c', 'government scheme', '7.1%']
  },
  {
    id: 'compound-interest',
    slug: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    shortDesc: 'Calculate compounding growth with daily, monthly, quarterly or annual compounding frequency.',
    category: 'savings',
    categoryLabel: 'Savings & Deposits',
    icon: 'Percent',
    route: '/calculators/compound-interest-calculator',
    keywords: ['compound interest', 'power of compounding', 'simple vs compound']
  },
  {
    id: 'simple-interest',
    slug: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    shortDesc: 'Quick standard SI calculation using Principal × Rate × Time formula.',
    category: 'savings',
    categoryLabel: 'Savings & Deposits',
    icon: 'Divide',
    route: '/calculators/simple-interest-calculator',
    keywords: ['simple interest', 'pnr', 'prt']
  },

  // Tax & Salary
  {
    id: 'income-tax-calculator',
    slug: 'income-tax-calculator',
    name: 'Income Tax Calculator (New vs Old Regime)',
    shortDesc: 'Compare New Tax Regime vs Old Tax Regime with standard deductions, 80C, 80D, and HRA exemptions.',
    category: 'tax',
    categoryLabel: 'Tax & Salary',
    icon: 'Receipt',
    route: '/calculators/income-tax-calculator',
    isPopular: true,
    badge: 'New vs Old',
    keywords: ['income tax', 'new regime', 'old regime', '80c', 'section 87a', 'standard deduction', 'tax slab']
  },
  {
    id: 'gst-calculator',
    slug: 'gst-calculator',
    name: 'GST Calculator (India)',
    shortDesc: 'Calculate GST inclusive and exclusive amounts with CGST, SGST & IGST bifurcation (5%, 12%, 18%, 28%).',
    category: 'tax',
    categoryLabel: 'Tax & Salary',
    icon: 'FileSpreadsheet',
    route: '/calculators/gst-calculator',
    isPopular: true,
    badge: 'Popular',
    keywords: ['gst', 'cgst', 'sgst', 'igst', 'tax invoice', 'reverse gst', 'exclusive gst']
  },
  {
    id: 'salary-calculator',
    slug: 'inhand-salary-calculator',
    name: 'In-Hand Salary Calculator',
    shortDesc: 'Calculate take-home monthly salary from CTC after PF, Gratuity, Professional Tax & TDS deductions.',
    category: 'tax',
    categoryLabel: 'Tax & Salary',
    icon: 'Banknote',
    route: '/calculators/inhand-salary-calculator',
    isPopular: true,
    keywords: ['in hand salary', 'ctc to inhand', 'epf deduction', 'take home salary', 'provident fund']
  },
  {
    id: 'hra-calculator',
    slug: 'hra-calculator',
    name: 'HRA Exemption Calculator',
    shortDesc: 'Calculate actual House Rent Allowance tax exemption under Section 10(13A) for metro and non-metro.',
    category: 'tax',
    categoryLabel: 'Tax & Salary',
    icon: 'Building2',
    route: '/calculators/hra-calculator',
    keywords: ['hra', 'house rent allowance', 'rent receipt', 'section 10 13a', 'tax exemption']
  },
  {
    id: 'gratuity-calculator',
    slug: 'gratuity-calculator',
    name: 'Gratuity Calculator',
    shortDesc: 'Calculate statutory gratuity payout as per Payment of Gratuity Act (15/26 formula) after 5+ years service.',
    category: 'tax',
    categoryLabel: 'Tax & Salary',
    icon: 'Award',
    route: '/calculators/gratuity-calculator',
    keywords: ['gratuity', '15 26 rule', 'retirement gratuity', 'last drawn salary']
  },
  {
    id: 'capital-gains-tax',
    slug: 'capital-gains-tax-calculator',
    name: 'Capital Gains Tax Calculator',
    shortDesc: 'Estimate STCG & LTCG tax liability on stocks, equity mutual funds & real estate with standard statutory rates.',
    category: 'tax',
    categoryLabel: 'Tax & Salary',
    icon: 'PieChart',
    route: '/calculators/capital-gains-tax-calculator',
    keywords: ['capital gains', 'ltcg', 'stcg', 'stock tax', 'property tax', 'long term capital gains']
  },

  // PDF Toolkit
  {
    id: 'merge-pdf',
    slug: 'merge-pdf',
    name: 'Merge PDF',
    shortDesc: 'Combine multiple PDF documents into one ordered file in seconds. 100% private in browser.',
    category: 'pdf',
    categoryLabel: 'PDF Toolkit',
    icon: 'Combine',
    route: '/pdf/merge-pdf',
    isPopular: true,
    badge: 'Fast & Secure',
    keywords: ['merge pdf', 'combine pdf', 'join pdf', 'attach pdf', 'pdf binder']
  },
  {
    id: 'split-pdf',
    slug: 'split-pdf',
    name: 'Split PDF',
    shortDesc: 'Extract specific page ranges (e.g. 1-3, 5, 8) or split into separate single-page PDFs.',
    category: 'pdf',
    categoryLabel: 'PDF Toolkit',
    icon: 'Scissors',
    route: '/pdf/split-pdf',
    isPopular: true,
    keywords: ['split pdf', 'extract pages', 'separate pdf', 'cut pdf pages']
  },
  {
    id: 'rotate-pdf',
    slug: 'rotate-pdf',
    name: 'Rotate PDF',
    shortDesc: 'Permanently rotate PDF orientation by 90°, 180°, or 270° clockwise.',
    category: 'pdf',
    categoryLabel: 'PDF Toolkit',
    icon: 'RotateCw',
    route: '/pdf/rotate-pdf',
    keywords: ['rotate pdf', 'turn pdf', 'landscape to portrait', 'flip pdf']
  },
  {
    id: 'compress-pdf',
    slug: 'compress-pdf',
    name: 'Compress & Optimize PDF',
    shortDesc: 'Reduce PDF file size for portal submissions, job applications and government forms.',
    category: 'pdf',
    categoryLabel: 'PDF Toolkit',
    icon: 'Minimize2',
    route: '/pdf/compress-pdf',
    isPopular: true,
    badge: 'Popular',
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'optimize pdf', 'less than 200kb']
  },
  {
    id: 'jpg-to-pdf',
    slug: 'jpg-to-pdf',
    name: 'JPG & PNG to PDF',
    shortDesc: 'Convert pictures, scanned ID cards, and document photos into a clean multi-page PDF.',
    category: 'pdf',
    categoryLabel: 'PDF Toolkit',
    icon: 'Image',
    route: '/pdf/jpg-to-pdf',
    isPopular: true,
    keywords: ['jpg to pdf', 'image to pdf', 'photo to pdf', 'png to pdf', 'scan to pdf']
  },
  {
    id: 'pdf-to-jpg',
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG Images',
    shortDesc: 'Render and extract high-resolution JPG images from each page of your PDF.',
    category: 'pdf',
    categoryLabel: 'PDF Toolkit',
    icon: 'FileImage',
    route: '/pdf/pdf-to-jpg',
    keywords: ['pdf to jpg', 'pdf to image', 'convert pdf to photo']
  },
  {
    id: 'watermark-pdf',
    slug: 'watermark-pdf',
    name: 'Add Watermark to PDF',
    shortDesc: 'Add custom security watermarks ("CONFIDENTIAL", "DRAFT", "COPY") with custom opacity.',
    category: 'pdf',
    categoryLabel: 'PDF Toolkit',
    icon: 'Stamp',
    route: '/pdf/watermark-pdf',
    keywords: ['watermark pdf', 'stamp pdf', 'confidential watermark', 'protect document']
  },
  {
    id: 'page-numbers-pdf',
    slug: 'page-numbers-pdf',
    name: 'Add Page Numbers to PDF',
    shortDesc: 'Insert numbered headers or footers ("Page 1 of N") to existing PDF documents.',
    category: 'pdf',
    categoryLabel: 'PDF Toolkit',
    icon: 'Hash',
    route: '/pdf/page-numbers-pdf',
    keywords: ['page numbers', 'number pdf', 'pagination', 'header footer']
  },

  // Unit & Land Converters
  {
    id: 'unit-converter',
    slug: 'unit-converter',
    name: 'Universal Unit & Land Area Converter',
    shortDesc: 'Convert Area (Square Feet, Gaj, Guntha, Bigha, Acres, Cent, Hectare), Length, Weight, Temperature, Volume & Speed.',
    category: 'converters',
    categoryLabel: 'Unit & Land Converters',
    icon: 'ArrowLeftRight',
    route: '/converters/unit-converter',
    isPopular: true,
    badge: 'Popular',
    keywords: ['unit converter', 'area converter', 'sq ft to sq yard', 'gaj', 'bigha to acre', 'guntha', 'cent', 'kg to lbs', 'temperature', 'land converter']
  },

  // Everyday Tools
  {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    shortDesc: 'Calculate percentage increase/decrease, X% of Y, discounts, and markups instantly.',
    category: 'everyday',
    categoryLabel: 'Everyday Tools',
    icon: 'Percent',
    route: '/calculators/percentage-calculator',
    isPopular: true,
    keywords: ['percentage', 'percent increase', 'percent decrease', 'what percent of', 'growth %']
  },
  {
    id: 'discount-calculator',
    slug: 'discount-calculator',
    name: 'Discount & Sale Price Calculator',
    shortDesc: 'Calculate final billing price after percentage discount, coupon code, and sales tax.',
    category: 'everyday',
    categoryLabel: 'Everyday Tools',
    icon: 'Tag',
    route: '/calculators/discount-calculator',
    keywords: ['discount', 'sale price', 'offer', 'shopping discount', 'cashback']
  },
  {
    id: 'age-calculator',
    slug: 'age-calculator',
    name: 'Age & Date Difference Calculator',
    shortDesc: 'Calculate exact chronological age in Years, Months, Days, and total weeks with next birthday countdown.',
    category: 'everyday',
    categoryLabel: 'Everyday Tools',
    icon: 'Calendar',
    route: '/calculators/age-calculator',
    keywords: ['age calculator', 'date difference', 'days between dates', 'birthday countdown']
  },
  {
    id: 'bmi-calculator',
    slug: 'bmi-calculator',
    name: 'BMI (Body Mass Index) Calculator',
    shortDesc: 'Calculate BMI and healthy weight range for Asian/Indian health benchmarks.',
    category: 'everyday',
    categoryLabel: 'Everyday Tools',
    icon: 'Activity',
    route: '/calculators/bmi-calculator',
    keywords: ['bmi', 'body mass index', 'healthy weight', 'obesity', 'asian bmi']
  },
  {
    id: 'profit-loss-calculator',
    slug: 'profit-loss-calculator',
    name: 'Profit & Loss Margin Calculator',
    shortDesc: 'Calculate gross profit, net margin percentage, and markup on cost price.',
    category: 'everyday',
    categoryLabel: 'Everyday Tools',
    icon: 'BarChart2',
    route: '/calculators/profit-loss-calculator',
    keywords: ['profit loss', 'margin', 'markup', 'selling price', 'cost price']
  },
  {
    id: 'tip-calculator',
    slug: 'tip-calculator',
    name: 'Tip & Bill Split Calculator',
    shortDesc: 'Easily calculate dining gratuity/tip and split total restaurant bills evenly across friends.',
    category: 'everyday',
    categoryLabel: 'Everyday Tools',
    icon: 'ReceiptText',
    route: '/calculators/tip-calculator',
    keywords: ['tip', 'bill split', 'restaurant bill', 'split bill']
  }
];

export type ToolDefinition = ToolItem;
export const TOOL_CATEGORIES = CATEGORIES;

export function getToolsByCategory(category: string): ToolItem[] {
  if (category === 'all') return TOOLS;
  return TOOLS.filter((tool) => tool.category === category);
}

export function getPopularTools(): ToolItem[] {
  return TOOLS.filter((tool) => tool.isPopular);
}

export function getToolBySlug(slug: string): ToolItem | undefined {
  return TOOLS.find((tool) => tool.slug === slug || tool.id === slug);
}

export function getRelatedTools(currentToolId: string, limit = 4): ToolItem[] {
  const current = TOOLS.find((t) => t.id === currentToolId);
  if (!current) return TOOLS.slice(0, limit);
  
  // same category first, then popular
  const sameCategory = TOOLS.filter((t) => t.id !== currentToolId && t.category === current.category);
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }
  const remaining = TOOLS.filter((t) => t.id !== currentToolId && t.category !== current.category);
  return [...sameCategory, ...remaining].slice(0, limit);
}
