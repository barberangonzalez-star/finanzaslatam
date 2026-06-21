"use client";

import { useMemo, useState } from "react";
import { compareAllProviders } from "@/lib/remittance";
import { formatCurrency } from "@/lib/paypal-fees";

function parseAmount(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  return cleaned ? parseFloat(cleaned) : 0;
}

export default function RemittanceComparator() {
  const [amountInput, setAmountInput] = useState("300");
  const [rateInput, setRateInput] = useState("17.50");
  const [currency, setCurrency] = useState("MXN");

  const amount = parseAmount(amountInput);
  const rate = parseAmount(rateInput);

  const results = useMemo(() => compareAllProviders(amount, rate), [amount, rate]);
  const best = results[0];

  return (
    <div className="rounded-3xl bg-paper-raised shadow-[0_1px_3px_rgba(10,14,39,0.06),0_12px_32px_-12px_rgba(10,14,39,0.12)] overflow-hidden">
      {/* Inputs */}
      <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            Tipo de cambio del día (USD → {currency || "moneda local"})
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
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value.toUpperCase().slice(0, 3))}
              maxLength={3}
              className="font-mono text-xs font-medium text-ink-soft bg-line/60 px-2 py-1 rounded-lg shrink-0 w-14 text-center outline-none"
              aria-label="Código de moneda"
            />
          </div>
        </div>
      </div>
      <p className="px-5 sm:px-7 -mt-1 pb-5 text-[11.5px] text-ink-soft opacity-70">
        Usá el tipo de cambio medio del mercado (buscalo en Google o XE.com) —
        cada proveedor le aplica su propio margen a partir de ahí.
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
