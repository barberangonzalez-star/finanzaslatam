"use client";

import { useMemo, useState } from "react";
import { useCountryRates } from "@/components/RateCard";
import { convert, formatConverted, ConverterCurrency } from "@/lib/converter";

const CURRENCY_INFO: Record<ConverterCurrency, { name: string; symbol: string; flag: string }> = {
  ves: { name: "Bolívares", symbol: "Bs.", flag: "🇻🇪" },
  usd: { name: "Dólares", symbol: "$", flag: "🇺🇸" },
  eur: { name: "Euros", symbol: "€", flag: "🇪🇺" },
};

function parseAmount(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  return cleaned ? parseFloat(cleaned) : 0;
}

export default function VenezuelaConverter() {
  const rates = useCountryRates("ve", false, true);
  const [amountInput, setAmountInput] = useState("1");
  const [fromCurrency, setFromCurrency] = useState<ConverterCurrency>("usd");

  const amount = parseAmount(amountInput);

  const result = useMemo(
    () =>
      convert(amount, fromCurrency, {
        usdToVes: rates.official,
        eurToVes: rates.eurOfficial,
      }),
    [amount, fromCurrency, rates.official, rates.eurOfficial]
  );

  const ratesReady = rates.officialStatus === "success" || rates.eurStatus === "success";
  const fromInfo = CURRENCY_INFO[fromCurrency];

  const outputs = (["ves", "usd", "eur"] as ConverterCurrency[]).filter(
    (c) => c !== fromCurrency
  );

  return (
    <div className="rounded-3xl bg-paper-raised shadow-[0_1px_3px_rgba(10,14,39,0.06),0_12px_32px_-12px_rgba(10,14,39,0.12)] overflow-hidden">
      {/* Currency selector (what am I converting FROM) */}
      <div className="p-5 sm:p-7 pb-4">
        <label className="block text-[12px] font-semibold text-ink-soft mb-2.5">
          Tengo
        </label>
        <div className="flex gap-1.5 sm:gap-2">
          {(["usd", "eur", "ves"] as ConverterCurrency[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFromCurrency(c)}
              aria-pressed={fromCurrency === c}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-[12px] sm:text-[13px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                fromCurrency === c
                  ? "bg-violet text-white shadow-[0_4px_12px_-2px_rgba(108,92,231,0.45)]"
                  : "bg-paper text-ink-soft hover:bg-violet-soft"
              }`}
            >
              <span className="text-[15px]">{CURRENCY_INFO[c].flag}</span>
              {CURRENCY_INFO[c].name}
            </button>
          ))}
        </div>
      </div>

      {/* Amount input */}
      <div className="px-5 sm:px-7 pb-5">
        <label
          htmlFor="converter-amount"
          className="block text-[12px] font-semibold text-ink-soft mb-2"
        >
          Monto en {fromInfo.name.toLowerCase()}
        </label>
        <div className="flex items-center gap-2 bg-paper rounded-2xl px-4 py-3.5">
          <span className="font-display text-3xl font-bold text-ink-soft">
            {fromInfo.symbol}
          </span>
          <input
            id="converter-amount"
            type="text"
            inputMode="decimal"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0"
            className="font-display text-3xl sm:text-4xl font-bold bg-transparent outline-none w-full text-ink placeholder:text-line"
          />
        </div>
      </div>

      {/* Results */}
      <div className="px-5 sm:px-7 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {outputs.map((c, i) => {
          const info = CURRENCY_INFO[c];
          const value = result[c];
          const status =
            c === "usd"
              ? rates.officialStatus
              : c === "eur"
                ? rates.eurStatus
                : "success"; // VES output never depends on its own fetch

          return (
            <div
              key={c}
              className={`rounded-2xl bg-gradient-to-br p-6 text-white relative overflow-hidden ${
                i === 0
                  ? "from-navy-deep via-navy-mid to-violet"
                  : "from-navy-deep via-navy-mid to-mint"
              }`}
            >
              <div className="font-mono text-[11px] uppercase tracking-widest text-white/60 mb-1.5">
                {info.flag} {info.name}
              </div>
              {status === "loading" && (
                <div className="font-display text-2xl font-bold text-white/40">
                  Cargando…
                </div>
              )}
              {status === "error" && value === null && (
                <div className="font-mono text-sm text-coral font-semibold">
                  Tasa no disponible
                </div>
              )}
              {(status === "success" || value !== null) && (
                <div className="font-display text-3xl sm:text-4xl font-bold leading-none tracking-tight">
                  {info.symbol} {formatConverted(value)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Rate reference + refresh */}
      <div className="px-5 sm:px-7 pb-6 flex items-center justify-between flex-wrap gap-2 text-[11.5px] text-ink-soft opacity-70">
        <p>
          {ratesReady
            ? `1 USD = Bs. ${formatConverted(rates.official)} · 1 EUR = Bs. ${formatConverted(rates.eurOfficial)} (tasa BCV)`
            : "Cargando tasas oficiales del BCV…"}
        </p>
        <button
          type="button"
          onClick={rates.refresh}
          className="font-semibold text-violet hover:underline cursor-pointer shrink-0"
        >
          Actualizar
        </button>
      </div>
    </div>
  );
}
