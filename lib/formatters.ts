/**
 * Indian Number Formatting & Utilities
 */

export function formatINR(value: number, decimals: number = 0): string {
  if (isNaN(value) || !isFinite(value)) return '₹0';
  
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  
  // Format with Indian numbering system (en-IN)
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(absValue);
  
  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export function formatNumberIndian(value: number, decimals: number = 0): string {
  if (isNaN(value) || !isFinite(value)) return '0';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}

export function formatCompactINR(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '₹0';
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 10000000) {
    // 1 Crore = 10,000,000
    const cr = abs / 10000000;
    return `${sign}₹${cr.toFixed(cr >= 100 ? 1 : 2)} Cr`;
  } else if (abs >= 100000) {
    // 1 Lakh = 100,000
    const lk = abs / 100000;
    return `${sign}₹${lk.toFixed(lk >= 100 ? 1 : 2)} L`;
  } else if (abs >= 1000) {
    const k = abs / 1000;
    return `${sign}₹${k.toFixed(1)} K`;
  }
  return `${sign}₹${Math.round(abs)}`;
}

export function numberToIndianWords(num: number): string {
  if (isNaN(num) || num === 0) return 'Zero Rupees';
  if (num < 0) return 'Minus ' + numberToIndianWords(-num);

  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ',
    'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ',
    'Seventeen ', 'Eighteen ', 'Nineteen '
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n: number): string => {
    let str = '';
    if (n > 19) {
      str += b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : ' ');
    } else {
      str += a[n];
    }
    return str;
  };

  let n = Math.floor(num);
  let output = '';

  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  const hundred = Math.floor(n / 100);
  n %= 100;

  if (crore > 0) {
    output += (crore > 99 ? inWords(Math.floor(crore / 100)) + 'Hundred ' + inWords(crore % 100) : inWords(crore)) + 'Crore ';
  }
  if (lakh > 0) {
    output += inWords(lakh) + 'Lakh ';
  }
  if (thousand > 0) {
    output += inWords(thousand) + 'Thousand ';
  }
  if (hundred > 0) {
    output += inWords(hundred) + 'Hundred ';
  }
  if (n > 0) {
    if (output !== '') output += 'and ';
    output += inWords(n);
  }

  return (output.trim() + ' Rupees').replace(/\s+/g, ' ');
}

export function parseFormattedNumber(value: string | number): number {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const cleaned = value.replace(/[₹,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
