// Bidirectional currency converter for Venezuela: VES <-> USD <-> EUR using
// the official BCV rate. Unlike the gap calculator on /cripto/venezuela
// (which compares official vs. parallel), this tool answers a simpler,
// more commonly searched question: "how many bolívares is $X" or "how
// many dollars is X bolívares" — using only the official BCV rate, since
// that's the rate a bank, store, or official transaction would use.

export type ConverterCurrency = "ves" | "usd" | "eur";

export interface ConversionRates {
  usdToVes: number | null;
  eurToVes: number | null;
}

export interface ConversionResult {
  ves: number | null;
  usd: number | null;
  eur: number | null;
}

// Given an amount entered in one currency, compute the equivalent in the
// other two. Returns null for outputs we can't compute (rate unavailable).
export function convert(
  amount: number,
  fromCurrency: ConverterCurrency,
  rates: ConversionRates
): ConversionResult {
  const { usdToVes, eurToVes } = rates;

  if (fromCurrency === "ves") {
    return {
      ves: amount,
      usd: usdToVes && usdToVes > 0 ? amount / usdToVes : null,
      eur: eurToVes && eurToVes > 0 ? amount / eurToVes : null,
    };
  }

  if (fromCurrency === "usd") {
    const vesAmount = usdToVes !== null ? amount * usdToVes : null;
    return {
      ves: vesAmount,
      usd: amount,
      eur: vesAmount !== null && eurToVes && eurToVes > 0 ? vesAmount / eurToVes : null,
    };
  }

  // fromCurrency === "eur"
  const vesAmount = eurToVes !== null ? amount * eurToVes : null;
  return {
    ves: vesAmount,
    usd: vesAmount !== null && usdToVes && usdToVes > 0 ? vesAmount / usdToVes : null,
    eur: amount,
  };
}

export const CONVERTER_CURRENCIES: { code: ConverterCurrency; name: string; symbol: string }[] = [
  { code: "ves", name: "Bolívares", symbol: "Bs." },
  { code: "usd", name: "Dólares", symbol: "$" },
  { code: "eur", name: "Euros", symbol: "€" },
];

export function formatConverted(value: number | null, decimals: number = 2): string {
  if (value === null) return "—";
  return value.toLocaleString("es-419", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
