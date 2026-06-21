"use client";

import { useMemo, useState } from "react";
import {
  GAP_COUNTRIES,
  GapCountry,
  calculateExchangeGap,
  formatLocalCurrency,
} from "@/lib/exchange-gap";
import { formatCurrency } from "@/lib/paypal-fees";

const COUNTRY_FLAGS: Record<GapCountry, string> = {
  ve: "🇻🇪",
  ar: "🇦🇷",
  co: "🇨🇴",
  cl: "🇨🇱",
};

function parseAmount(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  return cleaned ? parseFloat(cleaned) : 0;
}

export default function ExchangeGapCalculator() {
  const [amountInput, setAmountInput] = useState("100");
  const [country, setCountry] = useState<GapCountry>("ve");
  const [officialInput, setOfficialInput] = useState("607.39");
  const [parallelInput, setParallelInput] = useState("803.90");
  const [showBreakdown, setShowBreakdown] = useState(false);

  const amount = parseAmount(amountInput);
  const officialRate = parseAmount(officialInput);
  const parallelRate = parseAmount(parallelInput);
  const selectedCountry = GAP_COUNTRIES.find((c) => c.code === country)!;

  const result = useMemo(
    () => calculateExchangeGap(amount, officialRate, parallelRate),
    [amount, officialRate, parallelRate]
  );

  const isPositiveGap = result.gapPercent >= 0;

  return (
    <div className="rounded-3xl bg-paper-raised shadow-[0_1px_3px_rgba(10,14,39,0.06),0_12px_32px_-12px_rgba(10,14,39,0.12)] overflow-hidden">
      {/* Amount input */}
      <div className="p-5 sm:p-7">
        <label
          htmlFor="gap-amount"
          className="block text-[12px] font-semibold text-ink-soft mb-2"
        >
          Monto en dólares
        </label>
        <div className="flex items-center gap-2 bg-paper rounded-2xl px-4 py-3.5">
          <span className="font-display text-3xl font-bold text-ink-soft">$</span>
          <input
            id="gap-amount"
            type="text"
            inputMode="decimal"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value.replace(/[^0-9.]/g, ""))}
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
        <label className="block text-[12px] font-semibold text-ink-soft mb-2.5">País</label>
        <div className="flex flex-wrap gap-2">
          {GAP_COUNTRIES.map((c) => (
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
      </div>

      {/* Rate inputs */}
      <div className="px-5 sm:px-7 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="official-rate"
            className="block text-[11.5px] font-semibold text-ink-soft mb-1.5"
          >
            {selectedCountry.officialLabel}
          </label>
          <input
            id="official-rate"
            type="text"
            inputMode="decimal"
            value={officialInput}
            onChange={(e) => setOfficialInput(e.target.value.replace(/[^0-9.]/g, ""))}
            className="w-full bg-paper rounded-xl px-3.5 py-2.5 font-mono text-[15px] font-semibold text-ink outline-none focus:ring-2 focus:ring-violet"
          />
        </div>
        <div>
          <label
            htmlFor="parallel-rate"
            className="block text-[11.5px] font-semibold text-ink-soft mb-1.5"
          >
            {selectedCountry.parallelLabel}
          </label>
          <input
            id="parallel-rate"
            type="text"
            inputMode="decimal"
            value={parallelInput}
            onChange={(e) => setParallelInput(e.target.value.replace(/[^0-9.]/g, ""))}
            className="w-full bg-paper rounded-xl px-3.5 py-2.5 font-mono text-[15px] font-semibold text-ink outline-none focus:ring-2 focus:ring-violet"
          />
        </div>
      </div>
      <p className="px-5 sm:px-7 -mt-3 pb-5 text-[11.5px] text-ink-soft opacity-70">
        Ingresá las tasas del momento — cambian constantemente, así que esta
        calculadora no las fija por vos.
      </p>

      {/* Result */}
      <div className="mx-5 sm:mx-7 mb-5 sm:mb-7 rounded-2xl bg-gradient-to-br from-navy-deep via-navy-mid to-violet p-6 sm:p-8 text-white relative overflow-hidden">
        <div
          className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl ${
            isPositiveGap ? "bg-coral/20" : "bg-mint/20"
          }`}
          aria-hidden
        />
        <div className="relative">
          <div className="font-mono text-[11px] uppercase tracking-widest text-mint mb-1.5">
            Brecha cambiaria
          </div>
          <div className="font-display text-4xl sm:text-5xl font-bold leading-none tracking-tight">
            {isPositiveGap ? "+" : ""}
            {result.gapPercent.toFixed(1)}%
          </div>
          <div className="mt-2.5 text-[13px] text-white/70">
            La {selectedCountry.parallelLabel.toLowerCase()} está{" "}
            {isPositiveGap ? "más cara" : "más barata"} que la{" "}
            {selectedCountry.officialLabel.toLowerCase()}
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

      {showBreakdown && (
        <div className="px-5 sm:px-7 pb-6">
          <div className="rounded-2xl bg-paper p-4 sm:p-5">
            <table className="w-full text-sm">
              <tbody>
                <Row
                  label={`${formatCurrency(amount)} al ${selectedCountry.officialLabel.toLowerCase()}`}
                  value={formatLocalCurrency(result.amountAtOfficial, selectedCountry.currency)}
                />
                <Row
                  label={`${formatCurrency(amount)} al ${selectedCountry.parallelLabel.toLowerCase()}`}
                  value={formatLocalCurrency(result.amountAtParallel, selectedCountry.currency)}
                />
                <tr>
                  <td className="py-2.5 font-mono text-[13px] font-bold text-ink">Diferencia</td>
                  <td
                    className={`py-2.5 font-mono text-[13px] font-bold text-right ${
                      isPositiveGap ? "text-coral" : "text-mint"
                    }`}
                  >
                    {formatLocalCurrency(result.differenceInLocal, selectedCountry.currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-line/60 last:border-0">
      <td className="py-2.5 font-mono text-[12.5px] text-ink-soft">{label}</td>
      <td className="py-2.5 font-mono text-[12.5px] text-right font-medium text-ink">{value}</td>
    </tr>
  );
}
