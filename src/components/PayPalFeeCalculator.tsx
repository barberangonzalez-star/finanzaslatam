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

  const amount = parseAmount(amountInput);
  const selectedCountry = COUNTRIES.find((c) => c.code === country)!;

  const result = useMemo(() => {
    if (mode === "receive") {
      return calculatePayPalFee(amount, country, scope, includeConversion);
    }
    // "charge" mode: amount entered is the desired NET, work out gross to request
    const gross = calculateGrossForDesiredNet(amount, country, scope);
    return calculatePayPalFee(gross, country, scope, false);
  }, [amount, country, scope, includeConversion, mode]);

  function handleAmountChange(value: string) {
    const cleaned = value.replace(/[^0-9.]/g, "");
    setAmountInput(cleaned);
  }

  return (
    <div className="rounded border border-line bg-paper-raised overflow-hidden">
      {/* Mode toggle */}
      <div className="p-6 sm:p-8 border-b border-line">
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2">
          ¿Qué querés calcular?
        </label>
        <div className="flex border border-line rounded overflow-hidden">
          <button
            type="button"
            onClick={() => setMode("receive")}
            aria-pressed={mode === "receive"}
            className={`flex-1 px-3 py-2.5 text-[13px] font-medium transition-colors border-r border-line cursor-pointer ${
              mode === "receive"
                ? "bg-ink text-paper"
                : "bg-paper-raised text-ink-soft hover:bg-paper"
            }`}
          >
            Cuánto voy a recibir
          </button>
          <button
            type="button"
            onClick={() => setMode("charge")}
            aria-pressed={mode === "charge"}
            className={`flex-1 px-3 py-2.5 text-[13px] font-medium transition-colors cursor-pointer ${
              mode === "charge"
                ? "bg-ink text-paper"
                : "bg-paper-raised text-ink-soft hover:bg-paper"
            }`}
          >
            Cuánto debo cobrar
          </button>
        </div>
      </div>

      {/* Amount input */}
      <div className="p-6 sm:p-8 border-b border-line">
        <label
          htmlFor="amount"
          className="block text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2"
        >
          {mode === "receive" ? "Monto que te envían (USD)" : "Monto neto que querés recibir (USD)"}
        </label>
        <div className="flex items-baseline gap-1 border-b-2 border-ink pb-2">
          <span className="font-display text-3xl font-medium text-ink-soft">$</span>
          <input
            id="amount"
            type="text"
            inputMode="decimal"
            value={amountInput}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0"
            className="font-display text-4xl sm:text-5xl font-medium bg-transparent outline-none w-full text-ink placeholder:text-line"
          />
          <span className="font-mono text-sm text-ink-soft">USD</span>
        </div>
      </div>

      {/* Country + scope */}
      <div className="p-6 sm:p-8 border-b border-line">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="country"
              className="block text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2"
            >
              País
            </label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value as Country)}
              className="w-full border border-line rounded px-3 py-2.5 text-[15px] bg-paper-raised text-ink cursor-pointer"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            {!selectedCountry.paypalSupported && (
              <p className="mt-1.5 text-[12px] text-clay">
                PayPal no opera oficialmente en Venezuela — la cifra es solo referencial.
              </p>
            )}
          </div>

          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2">
              Tipo de transacción
            </legend>
            <div className="flex border border-line rounded overflow-hidden">
              <button
                type="button"
                onClick={() => setScope("national")}
                aria-pressed={scope === "national"}
                className={`flex-1 px-2.5 py-2.5 text-[13px] font-medium transition-colors border-r border-line cursor-pointer ${
                  scope === "national"
                    ? "bg-ink text-paper"
                    : "bg-paper-raised text-ink-soft hover:bg-paper"
                }`}
              >
                Nacional
              </button>
              <button
                type="button"
                onClick={() => setScope("international")}
                aria-pressed={scope === "international"}
                className={`flex-1 px-2.5 py-2.5 text-[13px] font-medium transition-colors cursor-pointer ${
                  scope === "international"
                    ? "bg-ink text-paper"
                    : "bg-paper-raised text-ink-soft hover:bg-paper"
                }`}
              >
                Internacional
              </button>
            </div>
          </fieldset>
        </div>

        {mode === "receive" && (
          <label className="flex items-center gap-2.5 mt-5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeConversion}
              onChange={(e) => setIncludeConversion(e.target.checked)}
              className="w-4 h-4 accent-clay cursor-pointer"
            />
            <span className="text-[13px] text-ink-soft">
              Incluir conversión a {selectedCountry.currency} (tipo de cambio de PayPal)
            </span>
          </label>
        )}
      </div>

      {/* Result */}
      <div className="bg-ink text-paper p-6 sm:p-9">
        <div className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-1.5">
          {mode === "receive" ? "Vas a recibir" : "Tenés que cobrar"}
        </div>
        <div className="font-display text-5xl sm:text-6xl font-semibold leading-none">
          {mode === "receive"
            ? formatCurrency(
                includeConversion ? result.netAmountAfterConversion : result.netAmount
              )
            : formatCurrency(result.grossAmount)}
        </div>
        <div className="mt-2.5 text-sm text-[#D9C7BC]">
          {mode === "receive"
            ? `Comisión total: ${formatCurrency(result.totalFee)} (${(result.percentageFee * 100).toFixed(2)}% + $0.30)`
            : `Para que recibas ${formatCurrency(amount)} netos`}
        </div>
      </div>

      {/* Breakdown */}
      <div className="p-6 sm:p-8">
        <div className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-4">
          Desglose
        </div>
        <table className="w-full text-sm">
          <tbody>
            <Row label="Monto bruto" value={formatCurrency(result.grossAmount)} />
            <Row
              label={`Comisión PayPal (${(result.percentageFee * 100).toFixed(2)}%)`}
              value={`−${formatCurrency(result.percentageFeeAmount)}`}
            />
            <Row label="Tarifa fija" value={`−${formatCurrency(result.fixedFeeAmount)}`} />
            <Row label="Monto neto (USD)" value={formatCurrency(result.netAmount)} />
            {mode === "receive" && includeConversion && (
              <>
                <Row
                  label={`Conversión a ${selectedCountry.currency} (~${(result.conversionMarkup * 100).toFixed(1)}% sobre tipo base)`}
                  value={`−${formatCurrency(result.estimatedConversionLoss)}`}
                />
                <tr>
                  <td className="py-2.5 font-mono text-[13px] font-semibold text-ink">
                    Recibís en {selectedCountry.currency}
                  </td>
                  <td className="py-2.5 font-mono text-[13px] font-semibold text-ink text-right">
                    {formatCurrency(result.netAmountAfterConversion)}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Notes */}
      <div className="px-6 sm:px-8 pb-7 text-[13px] text-ink-soft space-y-2.5">
        <p>
          Tarifas verificadas contra las páginas oficiales de PayPal para
          comercios, vigentes desde 2026. México tiene una estructura propia
          (3.95% nacional); Colombia, Chile y Argentina comparten la tarifa
          estándar de PayPal para el resto del mundo (5.40%).
        </p>
        <p>
          Si recibís más de USD 3,000 al mes, PayPal puede aplicarte una
          tarifa de negocio más baja de forma escalonada — esta calculadora
          usa la tarifa estándar, que aplica a la mayoría de usuarios
          individuales y freelancers.
        </p>
        <p>
          El porcentaje de conversión de divisa es una estimación basada en
          el margen publicado por PayPal sobre su tipo de cambio base — el
          monto final exacto depende del tipo de cambio del día.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-line last:border-0">
      <td className="py-2.5 font-mono text-[13px] text-ink-soft">{label}</td>
      <td className="py-2.5 font-mono text-[13px] text-right">{value}</td>
    </tr>
  );
}
