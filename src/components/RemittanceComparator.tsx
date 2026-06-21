"use client";

import { useMemo, useState } from "react";
import {
  ORIGIN_COUNTRIES,
  DESTINATION_COUNTRIES,
  compareAllProviders,
} from "@/lib/remittance";
import { formatCurrency } from "@/lib/paypal-fees";

const ORIGIN_FLAGS: Record<string, string> = {
  us: "🇺🇸",
  es: "🇪🇸",
  mx: "🇲🇽",
  co: "🇨🇴",
  ar: "🇦🇷",
  cl: "🇨🇱",
};

const DESTINATION_FLAGS: Record<string, string> = {
  mx: "🇲🇽",
  co: "🇨🇴",
  ar: "🇦🇷",
  bo: "🇧🇴",
  cl: "🇨🇱",
  ve: "🇻🇪",
};

function parseAmount(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  return cleaned ? parseFloat(cleaned) : 0;
}

export default function RemittanceComparator() {
  const [amountInput, setAmountInput] = useState("300");
  const [rateInput, setRateInput] = useState("17.50");
  const [origin, setOrigin] = useState("us");
  const [destination, setDestination] = useState("mx");

  const amount = parseAmount(amountInput);
  const rate = parseAmount(rateInput);
  const destinationCountry = DESTINATION_COUNTRIES.find((c) => c.code === destination)!;
  const currency = destinationCountry.currency;

  const results = useMemo(() => compareAllProviders(amount, rate), [amount, rate]);
  const best = results[0];

  return (
    <div className="rounded-3xl bg-paper-raised shadow-[0_1px_3px_rgba(10,14,39,0.06),0_12px_32px_-12px_rgba(10,14,39,0.12)] overflow-hidden">
      {/* Origin / destination selectors */}
      <div className="p-5 sm:p-7 pb-3">
        <label className="block text-[12px] font-semibold text-ink-soft mb-2.5">
          Desde
        </label>
        <div className="flex flex-wrap gap-2 mb-5">
          {ORIGIN_COUNTRIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setOrigin(c.code)}
              aria-pressed={origin === c.code}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                origin === c.code
                  ? "bg-violet text-white shadow-[0_4px_12px_-2px_rgba(108,92,231,0.45)]"
                  : "bg-paper text-ink-soft hover:bg-violet-soft"
              }`}
            >
              <span className="text-[15px]">{ORIGIN_FLAGS[c.code]}</span>
              {c.name}
            </button>
          ))}
        </div>

        <label className="block text-[12px] font-semibold text-ink-soft mb-2.5">
          Hacia
        </label>
        <div className="flex flex-wrap gap-2">
          {DESTINATION_COUNTRIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setDestination(c.code)}
              aria-pressed={destination === c.code}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                destination === c.code
                  ? "bg-mint text-navy-deep shadow-[0_4px_12px_-2px_rgba(0,217,163,0.4)]"
                  : "bg-paper text-ink-soft hover:bg-mint-soft"
              }`}
            >
              <span className="text-[15px]">{DESTINATION_FLAGS[c.code]}</span>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Amount + rate inputs */}
      <div className="p-5 sm:p-7 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="rem-amount"
            className="block text-[12px] font-semibold text-ink-soft mb-2"
          >
            Monto a enviar
          </label>
          <div className="flex items-center gap-2 bg-paper rounded-2xl px-4 py-3.5">
            <span className="font-display text-2xl font-bold text-ink-soft">$</span>
            <input
              id="rem-amount"
              type="text"
              inputMode="decimal"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="0"
              className="font-display text-2xl sm:text-3xl font-bold bg-transparent outline-none w-full text-ink placeholder:text-line"
            />
            <span className="font-mono text-xs font-medium text-ink-soft bg-line/60 px-2 py-1 rounded-lg shrink-0">
              USD
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="rem-rate"
            className="block text-[12px] font-semibold text-ink-soft mb-2"
          >
            Tipo de cambio del día (USD → {currency})
          </label>
          <div className="flex items-center gap-2 bg-paper rounded-2xl px-4 py-3.5">
            <input
              id="rem-rate"
              type="text"
              inputMode="decimal"
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="0"
              className="font-display text-2xl sm:text-3xl font-bold bg-transparent outline-none w-full text-ink"
            />
            <span className="font-mono text-xs font-medium text-ink-soft bg-line/60 px-2 py-1 rounded-lg shrink-0">
              {currency}
            </span>
          </div>
        </div>
      </div>
      <p className="px-5 sm:px-7 -mt-1 pb-5 text-[11.5px] text-ink-soft opacity-70">
        Usá el tipo de cambio medio del mercado (buscalo en Google o XE.com) —
        cada proveedor le aplica su propio margen a partir de ahí. El país de
        origen es contexto: algunos proveedores varían método de pago o
        disponibilidad según desde dónde envíes, aunque la estructura de
        comisión que usamos acá es la misma para todos los orígenes.
      </p>

      {/* Best option highlight */}
      {best && (
        <div className="mx-5 sm:mx-7 mb-5 sm:mb-7 rounded-2xl bg-gradient-to-br from-navy-deep via-navy-mid to-violet p-6 sm:p-8 text-white relative overflow-hidden">
          <div
            className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-mint/20 blur-3xl"
            aria-hidden
          />
          <div className="relative">
            <div className="font-mono text-[11px] uppercase tracking-widest text-mint mb-1.5">
              Mejor opción: {best.providerName}
            </div>
            <div className="font-display text-4xl sm:text-5xl font-bold leading-none tracking-tight">
              {formatCurrency(best.amountReceivedLocal)} {currency}
            </div>
            <div className="mt-2.5 text-[13px] text-white/70">
              Costo total: {formatCurrency(best.totalCostUSD)} USD (
              {best.totalCostPercent.toFixed(2)}% del envío)
            </div>
          </div>
        </div>
      )}

      {/* Comparison table */}
      <div className="px-5 sm:px-7 pb-6">
        <div className="text-[12px] font-semibold text-ink-soft mb-3">
          Comparación completa
        </div>
        <div className="space-y-2.5">
          {results.map((r, i) => (
            <div
              key={r.providerId}
              className={`rounded-2xl p-4 flex items-center justify-between gap-3 ${
                i === 0 ? "bg-mint-soft" : "bg-paper"
              }`}
            >
              <div>
                <div className="font-display font-bold text-[15px] text-ink">
                  {r.providerName}
                </div>
                <div className="font-mono text-[11.5px] text-ink-soft mt-0.5">
                  Costo total: {formatCurrency(r.totalCostUSD)} USD ({r.totalCostPercent.toFixed(2)}%)
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-display font-bold text-[17px] text-ink">
                  {formatCurrency(r.amountReceivedLocal)}
                </div>
                <div className="font-mono text-[11px] text-ink-soft">{currency}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="px-5 sm:px-7 pb-6 text-[12.5px] text-ink-soft space-y-2 leading-relaxed">
        <p>
          La comisión visible no es el costo real. Western Union suele
          mostrar una tarifa baja o nula, pero compensa con un margen de
          3-6% escondido en el tipo de cambio. Wise usa el tipo de cambio
          real del mercado y cobra todo en una comisión transparente.
        </p>
        <p>
          Estas son estructuras de tarifa representativas — las comisiones
          exactas varían según la ruta, el monto y el método de pago.
          Verificá siempre la cotización final antes de confirmar un envío.
        </p>
      </div>
    </div>
  );
}
