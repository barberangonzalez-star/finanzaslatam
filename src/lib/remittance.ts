// Remittance comparison — the core insight (verified across multiple Spanish
// sources comparing Wise vs Western Union in 2026) is that the visible fee is
// only part of the cost. Providers that advertise low or "free" fees often
// make it up with a markup on the exchange rate, which doesn't show up as a
// line-item fee but reduces what the recipient actually gets.
//
// Wise: uses the real mid-market rate, fee is fixed + ~0.5-0.7% variable, fully disclosed.
// Western Union / similar cash-pickup services: lower advertised fee, but apply
// a 3-6% markup over the mid-market rate (varies by route).
//
// Because exchange rates change constantly, the user supplies the current
// mid-market rate (easily found via Google/XE) rather than this tool
// hardcoding a rate that goes stale.
//
// Origin and destination country selectors are intentionally about framing
// and currency, not a per-route fee matrix: actual provider fees vary by
// the exact origin-destination pair, amount, and payment method, and we
// don't have a verified table of every route. Selecting a destination sets
// the currency the result displays in; selecting an origin is shown as
// context (some providers have different availability or payment methods
// by origin country) without silently implying we have exact fees for
// that specific corridor.

export interface OriginCountry {
  code: string;
  name: string;
}

export const ORIGIN_COUNTRIES: OriginCountry[] = [
  { code: "us", name: "Estados Unidos" },
  { code: "es", name: "España" },
  { code: "mx", name: "México" },
  { code: "co", name: "Colombia" },
  { code: "ar", name: "Argentina" },
  { code: "cl", name: "Chile" },
];

export interface DestinationCountry {
  code: string;
  name: string;
  currency: string;
}

export const DESTINATION_COUNTRIES: DestinationCountry[] = [
  { code: "mx", name: "México", currency: "MXN" },
  { code: "co", name: "Colombia", currency: "COP" },
  { code: "ar", name: "Argentina", currency: "ARS" },
  { code: "bo", name: "Bolivia", currency: "BOB" },
  { code: "cl", name: "Chile", currency: "CLP" },
  { code: "ve", name: "Venezuela", currency: "VES" },
];

export interface RemittanceProvider {
  id: string;
  name: string;
  feeType: "fixed_plus_percent" | "percent_only";
  fixedFeeUSD: number;
  percentFee: number;
  rateMarkupPercent: number;
  description: string;
}

// Representative figures for the most commonly compared providers, based on
// published fee structures and markup ranges as of 2026. Real fees vary by
// exact route, amount, and payment method — this models typical behavior,
// not an exact quote for any specific transfer.
export const PROVIDERS: RemittanceProvider[] = [
  {
    id: "wise",
    name: "Wise",
    feeType: "fixed_plus_percent",
    fixedFeeUSD: 0.5,
    percentFee: 0.006,
    rateMarkupPercent: 0,
    description: "Tipo de cambio medio del mercado, sin margen. Comisión fija + variable baja.",
  },
  {
    id: "westernunion",
    name: "Western Union (online)",
    feeType: "fixed_plus_percent",
    fixedFeeUSD: 0,
    percentFee: 0.01,
    rateMarkupPercent: 0.045,
    description: "Comisión visible baja, pero aplica un margen de 3-6% sobre el tipo de cambio.",
  },
  {
    id: "payoneer",
    name: "Payoneer",
    feeType: "percent_only",
    fixedFeeUSD: 0,
    percentFee: 0.02,
    rateMarkupPercent: 0.02,
    description: "2% de comisión por retiro a cuenta bancaria local, más margen de conversión.",
  },
];

export interface RemittanceResult {
  providerId: string;
  providerName: string;
  sentAmount: number;
  visibleFee: number;
  effectiveRate: number;
  amountReceivedLocal: number;
  totalCostUSD: number;
  totalCostPercent: number;
}

export function calculateRemittance(
  sentAmountUSD: number,
  midMarketRate: number,
  provider: RemittanceProvider
): RemittanceResult {
  const visibleFee =
    provider.feeType === "fixed_plus_percent"
      ? provider.fixedFeeUSD + sentAmountUSD * provider.percentFee
      : sentAmountUSD * provider.percentFee;

  const amountAfterFee = Math.max(0, sentAmountUSD - visibleFee);
  const effectiveRate = midMarketRate * (1 - provider.rateMarkupPercent);
  const amountReceivedLocal = amountAfterFee * effectiveRate;

  // Total cost = what you would have received at the true mid-market rate
  // with zero fees, minus what you actually received.
  const idealAmountLocal = sentAmountUSD * midMarketRate;
  const totalCostLocal = idealAmountLocal - amountReceivedLocal;
  const totalCostUSD = midMarketRate > 0 ? totalCostLocal / midMarketRate : 0;
  const totalCostPercent = sentAmountUSD > 0 ? (totalCostUSD / sentAmountUSD) * 100 : 0;

  return {
    providerId: provider.id,
    providerName: provider.name,
    sentAmount: sentAmountUSD,
    visibleFee,
    effectiveRate,
    amountReceivedLocal,
    totalCostUSD,
    totalCostPercent,
  };
}

export function compareAllProviders(
  sentAmountUSD: number,
  midMarketRate: number
): RemittanceResult[] {
  return PROVIDERS.map((p) => calculateRemittance(sentAmountUSD, midMarketRate, p)).sort(
    (a, b) => b.amountReceivedLocal - a.amountReceivedLocal
  );
}
