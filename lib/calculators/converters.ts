/**
 * Currency & Universal Unit Conversion Engine
 */

export interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rateToINR: number; // 1 Foreign Unit = X INR
}

export const POPULAR_CURRENCIES: CurrencyRate[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rateToINR: 87.25 },
  { code: 'EUR', name: 'Euro', symbol: '€', rateToINR: 92.40 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rateToINR: 110.80 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rateToINR: 23.75 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rateToINR: 65.10 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rateToINR: 56.40 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rateToINR: 62.80 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rateToINR: 0.58 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rateToINR: 98.60 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', rateToINR: 23.25 },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR', rateToINR: 23.95 },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD', rateToINR: 283.40 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rateToINR: 12.05 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rateToINR: 1.0 },
];

export const FOREX_RATES = POPULAR_CURRENCIES;

export function convertCurrency(
  amount: number,
  fromCode: string,
  toCode: string,
  customRates?: Record<string, number>
): {
  convertedAmount: number;
  exchangeRate: number;
  reverseRate: number;
} {
  const getRate = (code: string) => {
    if (code === 'INR') return 1.0;
    if (customRates && customRates[code]) return customRates[code];
    const found = POPULAR_CURRENCIES.find((c) => c.code === code);
    return found ? found.rateToINR : 1.0;
  };

  const fromRate = getRate(fromCode); // Value in INR
  const toRate = getRate(toCode); // Value in INR

  // Amount in INR
  const inINR = amount * fromRate;
  const converted = inINR / toRate;
  const unitRate = fromRate / toRate;
  const reverseRate = toRate / fromRate;

  return {
    convertedAmount: Number(converted.toFixed(4)),
    exchangeRate: Number(unitRate.toFixed(4)),
    reverseRate: Number(reverseRate.toFixed(4)),
  };
}

/**
 * Universal Unit Converter Types
 */
export type UnitCategory = 'length' | 'area' | 'weight' | 'temperature' | 'volume' | 'speed' | 'data';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  ratioToBase: number; // For linear conversion
  isSpecial?: boolean; // For temperature
}

export const UNIT_CATEGORIES: Record<
  UnitCategory,
  { label: string; baseUnit: string; units: UnitDefinition[] }
> = {
  area: {
    label: 'Area (with Indian Land Units)',
    baseUnit: 'sqm',
    units: [
      { id: 'sqft', name: 'Square Feet', symbol: 'sq ft', ratioToBase: 0.092903 },
      { id: 'sqyd', name: 'Square Yards (Gaj)', symbol: 'Gaj / sq yd', ratioToBase: 0.836127 },
      { id: 'sqm', name: 'Square Meters', symbol: 'sq m', ratioToBase: 1 },
      { id: 'acre', name: 'Acres', symbol: 'acre', ratioToBase: 4046.86 },
      { id: 'hectare', name: 'Hectares', symbol: 'ha', ratioToBase: 10000 },
      { id: 'guntha', name: 'Guntha (Maharashtra/Karnataka/AP)', symbol: 'Guntha', ratioToBase: 101.17 },
      { id: 'bigha', name: 'Bigha (Standard North India)', symbol: 'Bigha', ratioToBase: 2500 },
      { id: 'biswa', name: 'Biswa', symbol: 'Biswa', ratioToBase: 125 },
      { id: 'cent', name: 'Cent (South India / Kerala / TN)', symbol: 'Cent', ratioToBase: 40.4686 },
      { id: 'marla', name: 'Marla (Punjab/Haryana)', symbol: 'Marla', ratioToBase: 25.2929 },
    ],
  },
  length: {
    label: 'Length',
    baseUnit: 'm',
    units: [
      { id: 'mm', name: 'Millimeters', symbol: 'mm', ratioToBase: 0.001 },
      { id: 'cm', name: 'Centimeters', symbol: 'cm', ratioToBase: 0.01 },
      { id: 'm', name: 'Meters', symbol: 'm', ratioToBase: 1 },
      { id: 'km', name: 'Kilometers', symbol: 'km', ratioToBase: 1000 },
      { id: 'inch', name: 'Inches', symbol: 'in', ratioToBase: 0.0254 },
      { id: 'ft', name: 'Feet', symbol: 'ft', ratioToBase: 0.3048 },
      { id: 'yd', name: 'Yards', symbol: 'yd', ratioToBase: 0.9144 },
      { id: 'mi', name: 'Miles', symbol: 'mi', ratioToBase: 1609.344 },
    ],
  },
  weight: {
    label: 'Weight & Mass',
    baseUnit: 'kg',
    units: [
      { id: 'mg', name: 'Milligrams', symbol: 'mg', ratioToBase: 0.000001 },
      { id: 'g', name: 'Grams', symbol: 'g', ratioToBase: 0.001 },
      { id: 'kg', name: 'Kilograms', symbol: 'kg', ratioToBase: 1 },
      { id: 'quintal', name: 'Quintal', symbol: 'q', ratioToBase: 100 },
      { id: 'ton', name: 'Metric Tonne', symbol: 't', ratioToBase: 1000 },
      { id: 'tola', name: 'Tola (Gold / Indian Standard)', symbol: 'Tola', ratioToBase: 0.0116638 },
      { id: 'lb', name: 'Pounds', symbol: 'lbs', ratioToBase: 0.453592 },
      { id: 'oz', name: 'Ounces', symbol: 'oz', ratioToBase: 0.0283495 },
    ],
  },
  temperature: {
    label: 'Temperature',
    baseUnit: 'c',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', ratioToBase: 1, isSpecial: true },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', ratioToBase: 1, isSpecial: true },
      { id: 'k', name: 'Kelvin', symbol: 'K', ratioToBase: 1, isSpecial: true },
    ],
  },
  volume: {
    label: 'Volume & Liquids',
    baseUnit: 'l',
    units: [
      { id: 'ml', name: 'Milliliters', symbol: 'ml', ratioToBase: 0.001 },
      { id: 'l', name: 'Liters', symbol: 'L', ratioToBase: 1 },
      { id: 'cum', name: 'Cubic Meters', symbol: 'm³', ratioToBase: 1000 },
      { id: 'gal_us', name: 'US Gallons', symbol: 'gal', ratioToBase: 3.78541 },
      { id: 'cup', name: 'Cups', symbol: 'cup', ratioToBase: 0.24 },
    ],
  },
  speed: {
    label: 'Speed',
    baseUnit: 'mps',
    units: [
      { id: 'kmph', name: 'Kilometers / Hour', symbol: 'km/h', ratioToBase: 0.277778 },
      { id: 'mps', name: 'Meters / Second', symbol: 'm/s', ratioToBase: 1 },
      { id: 'mph', name: 'Miles / Hour', symbol: 'mph', ratioToBase: 0.44704 },
      { id: 'knot', name: 'Knots', symbol: 'kn', ratioToBase: 0.514444 },
    ],
  },
  data: {
    label: 'Digital Storage',
    baseUnit: 'mb',
    units: [
      { id: 'kb', name: 'Kilobytes', symbol: 'KB', ratioToBase: 0.001 },
      { id: 'mb', name: 'Megabytes', symbol: 'MB', ratioToBase: 1 },
      { id: 'gb', name: 'Gigabytes', symbol: 'GB', ratioToBase: 1000 },
      { id: 'tb', name: 'Terabytes', symbol: 'TB', ratioToBase: 1000000 },
    ],
  },
};

export function convertUnit(
  category: UnitCategory,
  value: number,
  fromUnitId: string,
  toUnitId: string
): number {
  if (isNaN(value)) return 0;
  if (fromUnitId === toUnitId) return value;

  const cat = UNIT_CATEGORIES[category];
  if (!cat) return value;

  // Temperature special formula
  if (category === 'temperature') {
    let inCelsius = value;
    if (fromUnitId === 'f') inCelsius = ((value - 32) * 5) / 9;
    if (fromUnitId === 'k') inCelsius = value - 273.15;

    if (toUnitId === 'c') return Number(inCelsius.toFixed(2));
    if (toUnitId === 'f') return Number(((inCelsius * 9) / 5 + 32).toFixed(2));
    if (toUnitId === 'k') return Number((inCelsius + 273.15).toFixed(2));
    return inCelsius;
  }

  const fromDef = cat.units.find((u) => u.id === fromUnitId);
  const toDef = cat.units.find((u) => u.id === toUnitId);

  if (!fromDef || !toDef) return value;

  const baseValue = value * fromDef.ratioToBase;
  const result = baseValue / toDef.ratioToBase;

  return Number(result.toFixed(6));
}
