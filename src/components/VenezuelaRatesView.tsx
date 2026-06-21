"use client";

import Link from "next/link";
import { useState } from "react";
import { RateCard, useCountryRates } from "@/components/RateCard";
import SiteFooter from "@/components/SiteFooter";

function parseAmount(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  return cleaned ? parseFloat(cleaned) : 0;
}

export default function VenezuelaRatesView() {
  const rates = useCountryRates("ve", false, true);
  const [p2pInput, setP2pInput] = useState("803.90");
  const p2pRate = parseAmount(p2pInput);

  const gapPercent =
    rates.official && rates.official > 0
      ? ((p2pRate - rates.official) / rates.official) * 100
      : null;

  return (
    <main className="max-w-[760px] mx-auto px-5 sm:px-6 pt-10 sm:pt-14 pb-20">
      <Link
        href="/cripto"
        className="inline-block font-mono text-xs text-ink-soft hover:text-violet transition-colors mb-6"
      >
        ← Brecha cambiaria
      </Link>

      <header className="mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-soft mb-4">
          <span className="text-[15px]">🇻🇪</span>
          <span className="font-mono text-[11px] font-semibold text-violet uppercase tracking-wide">
            Venezuela
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold leading-[1.1] tracking-tight mb-3">
          Tasas de hoy en Venezuela
        </h1>
        <p className="text-ink-soft text-[15px] max-w-[54ch]">
          BCV Dólar y BCV Euro se cargan solos desde la fuente oficial.
          El precio P2P no tiene una fuente automática gratuita confiable,
          así que lo actualizás vos mismo más abajo.
        </p>
        {rates.fetchedAt && (
          <p className="mt-2 font-mono text-[11px] text-ink-soft opacity-60">
            Última actualización: {new Date(rates.fetchedAt).toLocaleString("es-419")}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <RateCard
          label="BCV · Dólar oficial"
          value={rates.official}
          currency="VES"
          status={rates.officialStatus}
          accent="violet"
        />
        <RateCard
          label="BCV · Euro oficial"
          value={rates.eurOfficial}
          currency="VES"
          status={rates.eurStatus}
          accent="mint"
        />
      </div>

      <button
        type="button"
        onClick={rates.refresh}
        className="mb-8 text-[12.5px] font-semibold text-violet hover:underline cursor-pointer"
      >
        Actualizar tasas
      </button>

      <div className="rounded-3xl bg-paper-raised shadow-[0_1px_3px_rgba(10,14,39,0.06),0_12px_32px_-12px_rgba(10,14,39,0.12)] overflow-hidden">
        <div className="p-5 sm:p-7">
          <label
            htmlFor="p2p-rate"
            className="block text-[12px] font-semibold text-ink-soft mb-2"
          >
            Precio USDT hoy (Binance P2P) — ingresalo vos
          </label>
          <div className="flex items-center gap-2 bg-paper rounded-2xl px-4 py-3.5">
            <input
              id="p2p-rate"
              type="text"
              inputMode="decimal"
              value={p2pInput}
              onChange={(e) => setP2pInput(e.target.value.replace(/[^0-9.]/g, ""))}
              className="font-display text-3xl sm:text-4xl font-bold bg-transparent outline-none w-full text-ink"
            />
            <span className="font-mono text-xs font-medium text-ink-soft bg-line/60 px-2 py-1 rounded-lg shrink-0">
              VES
            </span>
          </div>
        </div>

        {gapPercent !== null && (
          <div className="mx-5 sm:mx-7 mb-5 sm:mb-7 rounded-2xl bg-gradient-to-br from-navy-deep via-navy-mid to-coral p-6 sm:p-7 text-white">
            <div className="font-mono text-[11px] uppercase tracking-widest text-coral mb-1.5">
              Brecha P2P vs. BCV
            </div>
            <div className="font-display text-4xl sm:text-5xl font-bold leading-none tracking-tight">
              {gapPercent >= 0 ? "+" : ""}
              {gapPercent.toFixed(1)}%
            </div>
          </div>
        )}
      </div>

      <p className="mt-8 text-[13px] text-ink-soft leading-relaxed">
        ¿Querés comparar montos exactos, no solo ver las tasas? Usá la{" "}
        <Link href="/cripto" className="text-violet hover:underline">
          calculadora de brecha cambiaria
        </Link>
        . Si lo que necesitás es convertir un monto puntual de Dólares o
        Euros a Bolívares (o viceversa), probá el{" "}
        <Link href="/conversor" className="text-violet hover:underline">
          conversor de moneda
        </Link>
        .
      </p>

      <SiteFooter />
    </main>
  );
}
