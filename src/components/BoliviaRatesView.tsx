"use client";

import Link from "next/link";
import { RateCard, useCountryRates } from "@/components/RateCard";
import SiteFooter from "@/components/SiteFooter";

export default function BoliviaRatesView() {
  const rates = useCountryRates("bo", true, false);

  const gapPercent =
    rates.official && rates.parallel && rates.official > 0
      ? ((rates.parallel - rates.official) / rates.official) * 100
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
          <span className="text-[15px]">🇧🇴</span>
          <span className="font-mono text-[11px] font-semibold text-violet uppercase tracking-wide">
            Bolivia
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold leading-[1.1] tracking-tight mb-3">
          Tasas de hoy en Bolivia
        </h1>
        <p className="text-ink-soft text-[15px] max-w-[54ch]">
          Tipo de cambio oficial del BCB y referencia Binance se cargan
          solos.
        </p>
        {rates.fetchedAt && (
          <p className="mt-2 font-mono text-[11px] text-ink-soft opacity-60">
            Última actualización: {new Date(rates.fetchedAt).toLocaleString("es-419")}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <RateCard
          label="Oficial (BCB)"
          value={rates.official}
          currency="BOB"
          status={rates.officialStatus}
          accent="violet"
        />
        <RateCard
          label="Paralelo (Binance)"
          value={rates.parallel}
          currency="BOB"
          status={rates.parallelStatus}
          accent="coral"
        />
      </div>

      {gapPercent !== null && (
        <div className="rounded-2xl bg-gradient-to-br from-navy-deep via-navy-mid to-coral p-6 sm:p-7 text-white mb-6">
          <div className="font-mono text-[11px] uppercase tracking-widest text-coral mb-1.5">
            Brecha cambiaria
          </div>
          <div className="font-display text-4xl sm:text-5xl font-bold leading-none tracking-tight">
            {gapPercent >= 0 ? "+" : ""}
            {gapPercent.toFixed(1)}%
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={rates.refresh}
        className="mb-8 text-[12.5px] font-semibold text-violet hover:underline cursor-pointer"
      >
        Actualizar tasas
      </button>

      <p className="text-[13px] text-ink-soft leading-relaxed">
        ¿Querés comparar montos exactos, no solo ver las tasas? Usá la{" "}
        <Link href="/cripto" className="text-violet hover:underline">
          calculadora de brecha cambiaria
        </Link>
        .
      </p>

      <SiteFooter />
    </main>
  );
}
