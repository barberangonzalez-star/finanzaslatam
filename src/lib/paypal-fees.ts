// PayPal fee calculation for Latin American markets — verified against
// official PayPal merchant fee pages (paypal.com/mx/business/paypal-business-fees,
// paypal.com/co/business/paypal-business-fees) as of June 2026.
//
// México has its own fee structure. Colombia, Chile, and Argentina (along with
// most of the rest of the region) fall under PayPal's "Rest of World" standard
// commercial transaction fee table, which is identical across those markets.

export type Country = "mx" | "co" | "cl" | "ar" | "ve";

export type TransactionScope = "national" | "international";

export interface CountryInfo {
  code: Country;
  name: string;
  currency: string;
  currencySymbol: string;
  paypalSupported: boolean;
}

export const COUNTRIES: CountryInfo[] = [
  { code: "mx", name: "México", currency: "MXN", currencySymbol: "$", paypalSupported: true },
  { code: "co", name: "Colombia", currency: "COP", currencySymbol: "$", paypalSupported: true },
  { code: "cl", name: "Chile", currency: "CLP", currencySymbol: "$", paypalSupported: true },
  { code: "ar", name: "Argentina", currency: "ARS", currencySymbol: "$", paypalSupported: true },
  {
    code: "ve",
    name: "Venezuela",
    currency: "USD",
    currencySymbol: "$",
    paypalSupported: false,
  },
];

// Standard commercial transaction fee (receiving payments), before any
// monthly-volume discount. México has its own lower national rate; CO/CL/AR
// share PayPal's "Rest of World" standard rate.
const NATIONAL_FEE_RATE: Record<Country, number> = {
  mx: 0.0395,
  co: 0.054,
  cl: 0.054,
  ar: 0.054,
  ve: 0.054, // shown for reference only — PayPal access from Venezuela is unofficial/restricted
};

// Additional percentage fee added on top of the national rate for
// cross-border (international) commercial transactions.
const INTERNATIONAL_SURCHARGE: Record<Country, number> = {
  mx: 0.005,
  co: 0,
  cl: 0,
  ar: 0,
  ve: 0,
};

// International transactions for CO/CL/AR use a single combined rate of 5.40%
// rather than a separate add-on — México is the only market in this set with
// a distinct national vs. international split.
const INTERNATIONAL_FEE_RATE: Record<Country, number> = {
  mx: NATIONAL_FEE_RATE.mx + INTERNATIONAL_SURCHARGE.mx,
  co: 0.054,
  cl: 0.054,
  ar: 0.054,
  ve: 0.054,
};

// Fixed fee per transaction in USD (PayPal publishes this per currency;
// USD is used here as the common reference since most cross-border LATAM
// PayPal use is USD-denominated).
const FIXED_FEE_USD = 0.3;

// Currency conversion markup PayPal applies over its base exchange rate
// when converting received funds to another currency. The Americas region
// rate is used for CO/CL/AR/VE; México has its own published rate.
const CONVERSION_MARKUP: Record<Country, number> = {
  mx: 0.035,
  co: 0.045,
  cl: 0.045,
  ar: 0.045,
  ve: 0.045,
};

export interface PayPalFeeResult {
  grossAmount: number;
  percentageFee: number;
  percentageFeeAmount: number;
  fixedFeeAmount: number;
  totalFee: number;
  netAmount: number;
  conversionMarkup: number;
  estimatedConversionLoss: number;
  netAmountAfterConversion: number;
}

export function calculatePayPalFee(
  grossAmount: number,
  country: Country,
  scope: TransactionScope,
  includeConversion: boolean
): PayPalFeeResult {
  const percentageFee =
    scope === "national" ? NATIONAL_FEE_RATE[country] : INTERNATIONAL_FEE_RATE[country];

  const percentageFeeAmount = grossAmount * percentageFee;
  const fixedFeeAmount = grossAmount > 0 ? FIXED_FEE_USD : 0;
  const totalFee = percentageFeeAmount + fixedFeeAmount;
  const netAmount = Math.max(0, grossAmount - totalFee);

  const conversionMarkup = includeConversion ? CONVERSION_MARKUP[country] : 0;
  const estimatedConversionLoss = netAmount * conversionMarkup;
  const netAmountAfterConversion = netAmount - estimatedConversionLoss;

  return {
    grossAmount,
    percentageFee,
    percentageFeeAmount,
    fixedFeeAmount,
    totalFee,
    netAmount,
    conversionMarkup,
    estimatedConversionLoss,
    netAmountAfterConversion,
  };
}

// Reverse calculation: given a desired net amount, find the gross amount
// that must be requested so the sender's payment, after PayPal's fee,
// leaves exactly the desired net. Solves: net = gross - (gross * rate + fixed)
// => gross = (net + fixed) / (1 - rate)
export function calculateGrossForDesiredNet(
  desiredNet: number,
  country: Country,
  scope: TransactionScope
): number {
  const percentageFee =
    scope === "national" ? NATIONAL_FEE_RATE[country] : INTERNATIONAL_FEE_RATE[country];
  if (percentageFee >= 1) return desiredNet;
  return (desiredNet + FIXED_FEE_USD) / (1 - percentageFee);
}

export function formatCurrency(value: number, symbol: string = "$"): string {
  return `${symbol}${value.toLocaleString("es-419", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
