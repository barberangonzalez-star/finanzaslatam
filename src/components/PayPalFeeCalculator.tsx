"use client";

import { useMemo, useState } from "react";
import {
  COUNTRIES,
  Country,
  TransactionScope,
  calculatePayPalFee,
  calculateGrossForDesiredNet,
  formatCurrency,
} from "@/lib/paypal-fees";

type Mode = "receive" | "charge";

const COUNTRY_FLAGS: Record<Country, string> = {
  mx: "🇲🇽",
  co: "🇨🇴",
  cl: "🇨🇱",
  ar: "🇦🇷",
  ve: "🇻🇪",
};

function parseAmount(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  return cleaned ? parseFloat(cleaned) : 0;
}

export default function PayPalFeeCalculator() {
  const [mode, setMode] = useState<Mode>("receive");
  const [amountInput, setAmountInput] = useState("100");
  const [country, setCountry] = useState<Country>("co");
  const [scope, setScope] = useState<TransactionScope>("international");
  const [includeConversion, setIncludeConversion] = useState(true);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const amount = parseAmount(amountInput);
  const selectedCountry = COUNTRIES.find((c) => c.code === country)!;

  const result = useMemo(() => {
    if (mode === "receive") {
      return calculatePayPalFee(amount, country, scope, includeConversion);
    }
    const gross = calculateGrossForDesiredNet(amount, country, scope);
    return calculatePayPalFee(gross, country, scope, false);
  }, [amount, country, scope, includeConversion, mode]);

  function handleAmountChange(value: string) {
    const cleaned = value.replace(/[^0-9.]/g, "");
    setAmountInput(cleaned);
  }

  const displayResult =
    mode === "receive"
      ? includeConversion
        ? result.netAmountAfterConversion
        : result.netAmount
      : result.grossAmount;

  return (
    <div className="rounded-3xl bg-paper-raised shadow-[0_1px_3px_rgba(10,14,39,0.06),0_12px_32px_-12px_rgba(10,14,39,0.12)] overflow-hidden">
      {/* Mode toggle */}
      <div className="p-5 sm:p-7 pb-0">
        <div className="flex p-1 bg-paper rounded-2xl">
          <button
            type="button"
            onClick={() => setMode("receive")}
            aria-pressed={mode === "receive"}
            className={`flex-1 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
              mode === "receive"
                ? "bg-navy-deep text-white shadow-sm"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            Cuánto voy a recibir
          </button>
          <button
            type="button"
            onClick={() => setMode("charge")}
            aria-pressed={mode === "charge"}
            className={`flex-1 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
              mode === "charge"
                ? "bg-navy-deep text-white shadow-sm"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            Cuánto debo cobrar
          </button>
        </div>
      </div>

      {/* Amount input */}
      <div className="px-5 sm:px-7 py-6">
        <label
          htmlFor="amount"
          className="block text-[12px] font-semibold text-ink-soft mb-2"
        >
          {mode === "receive" ? "Monto que te envían" : "Monto neto que querés recibir"}
        </label>
        <div className="flex items-center gap-2 bg-paper rounded-2xl px-4 py-3.5">
          <span className="font-display text-3xl font-bold text-ink-soft">$</span>
          <input
            id="amount"
            type="text"
            inputMode="decimal"
            value={amountInput}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0"
            className="font-display text-3xl sm:text-4xl font-bold bg-transparent outline-none w-full text-ink placeholder:text-line"
          />
          <span className="font-mono text-xs font-medium text-ink-soft bg-line/60 px-2 py-1 rounded-lg shrink-0">
            USD
          </span>
        </div>
      </div>

      {/* Country pills */}
      <div className="px-5 sm:px-7 pb-5">
        <label className="block text-[12px] font-semibold text-ink-soft mb-2.5">
          País
        </label>
        <div className="flex flex-wrap gap-2">
          {COUNTRIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setCountry(c.code)}
              aria-pressed={country === c.code}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                country === c.code
                  ? "bg-violet text-white shadow-[0_4px_12px_-2px_rgba(108,92,231,0.45)]"
                  : "bg-paper text-ink-soft hover:bg-violet-soft"
              }`}
            >
              <span className="text-[15px]">{COUNTRY_FLAGS[c.code]}</span>
              {c.name}
            </button>
          ))}
        </div>
        {!selectedCountry.paypalSupported && (
          <p className="mt-2.5 text-[12px] text-coral font-medium">
            PayPal no opera oficialmente en Venezuela — la cifra es solo referencial.
          </p>
        )}
      </div>

      {/* Scope + conversion */}
      <div className="px-5 sm:px-7 pb-6 flex flex-wrap items-center gap-3">
        <div className="flex p-1 bg-paper rounded-xl">
          <button
            type="button"
            onClick={() => setScope("national")}
            aria-pressed={scope === "national"}
            className={`px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all cursor-pointer ${
              scope === "national"
                ? "bg-white text-ink shadow-sm"
                : "text-ink-soft"
            }`}
          >
            Nacional
          </button>
          <button
            type="button"
            onClick={() => setScope("international")}
            aria-pressed={scope === "international"}
            className={`px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all cursor-pointer ${
              scope === "international"
                ? "bg-white text-ink shadow-sm"
                : "text-ink-soft"
            }`}
          >
            Internacional
          </button>
        </div>

        {mode === "receive" && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeConversion}
              onChange={(e) => setIncludeConversion(e.target.checked)}
              className="w-4 h-4 accent-violet cursor-pointer rounded"
            />
            <span className="text-[12.5px] text-ink-soft font-medium">
              Convertir a {selectedCountry.currency}
            </span>
          </label>
        )}
      </div>

      {/* Result — gradient hero card */}
      <div className="mx-5 sm:mx-7 mb-5 sm:mb-7 rounded-2xl bg-gradient-to-br from-navy-deep via-navy-mid to-violet p-6 sm:p-8 text-white relative overflow-hidden">
        <div
          className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-mint/20 blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <div className="font-mono text-[11px] uppercase tracking-widest text-mint mb-1.5">
            {mode === "receive" ? "Vas a recibir" : "Tenés que cobrar"}
          </div>
          <div className="font-display text-4xl sm:text-5xl font-bold leading-none tracking-tight">
            {formatCurrency(displayResult)}
          </div>
          <div className="mt-2.5 text-[13px] text-white/70">
            {mode === "receive"
              ? `Comisión total: ${formatCurrency(result.totalFee)} (${(result.percentageFee * 100).toFixed(2)}% + $0.30)`
              : `Para que recibas ${formatCurrency(amount)} netos`}
          </div>

          <button
            type="button"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="mt-5 flex items-center gap-1.5 text-[12.5px] font-semibold text-white/90 hover:text-white transition-colors cursor-pointer"
            aria-expanded={showBreakdown}
          >
            {showBreakdown ? "Ocultar desglose" : "Ver desglose completo"}
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className={`transition-transform ${showBreakdown ? "rotate-180" : ""}`}
            >
              <path
                d="M2.5 4.5L6 8L9.5 4.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Breakdown — collapsible */}
      {showBreakdown && (
        <div className="px-5 sm:px-7 pb-6">
          <div className="rounded-2xl bg-paper p-4 sm:p-5">
            <table className="w-full text-sm">
              <tbody>
                <Row label="Monto bruto" value={formatCurrency(result.grossAmount)} />
                <Row
                  label={`Comisión PayPal (${(result.percentageFee * 100).toFixed(2)}%)`}
                  value={`−${formatCurrency(result.percentageFeeAmount)}`}
                  negative
                />
                <Row
                  label="Tarifa fija"
                  value={`−${formatCurrency(result.fixedFeeAmount)}`}
                  negative
                />
                <Row label="Monto neto (USD)" value={formatCurrency(result.netAmount)} />
                {mode === "receive" && includeConversion && (
                  <>
                    <Row
                      label={`Conversión a ${selectedCountry.currency} (~${(result.conversionMarkup * 100).toFixed(1)}%)`}
                      value={`−${formatCurrency(result.estimatedConversionLoss)}`}
                      negative
                    />
                    <tr>
                      <td className="py-2.5 font-mono text-[13px] font-bold text-ink">
                        Recibís en {selectedCountry.currency}
                      </td>
                      <td className="py-2.5 font-mono text-[13px] font-bold text-mint text-right">
                        {formatCurrency(result.netAmountAfterConversion)}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 space-y-2 text-[12.5px] text-ink-soft leading-relaxed">
            <p>
              Tarifas verificadas contra las páginas oficiales de PayPal
              para comercios, vigentes desde 2026. México tiene una
              estructura propia (3.95% nacional); Colombia, Chile y
              Argentina comparten la tarifa estándar de PayPal para el
              resto del mundo (5.40%).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  negative,
}: {
  label: string;
  value: string;
  negative?: boolean;
}) {
  return (
    <tr className="border-b border-line/60 last:border-0">
      <td className="py-2.5 font-mono text-[12.5px] text-ink-soft">{label}</td>
      <td
        className={`py-2.5 font-mono text-[12.5px] text-right font-medium ${
          negative ? "text-coral" : "text-ink"
        }`}
      >
        {value}
      </td>
    </tr>
  );
}
