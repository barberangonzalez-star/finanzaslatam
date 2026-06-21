"use client";

import Link from "next/link";
import VenezuelaConverter from "@/components/VenezuelaConverter";
import SiteFooter from "@/components/SiteFooter";

export default function ConverterView() {
  return (
    <main className="max-w-[760px] mx-auto px-5 sm:px-6 pt-10 sm:pt-14 pb-20">
      <Link
        href="/"
        className="inline-block font-mono text-xs text-ink-soft hover:text-violet transition-colors mb-6"
      >
        ← Latam Finanzas
      </Link>

      <header className="mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-soft mb-4">
          <span className="text-[15px]">🇻🇪</span>
          <span className="font-mono text-[11px] font-semibold text-violet uppercase tracking-wide">
            Venezuela · Tasa BCV
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold leading-[1.1] tracking-tight mb-3">
          Conversor de Dólares, Euros y Bolívares
        </h1>
        <p className="text-ink-soft text-[15px] max-w-[54ch]">
          Convertí en cualquier dirección — Dólar a Bolívar, Euro a Bolívar,
          o Bolívar a Dólar/Euro — con la tasa oficial del BCV, actualizada
          sola.
        </p>
      </header>

      <VenezuelaConverter />

      <section className="mt-14 space-y-9">
        <article>
          <h2 className="font-display text-xl font-bold mb-2.5">
            ¿Por qué usamos la tasa BCV y no el paralelo?
          </h2>
          <p className="text-[14.5px] text-ink-soft leading-relaxed">
            Este conversor usa la tasa oficial del Banco Central de
            Venezuela porque es la que se aplica en transacciones formales:
            pagos con tarjeta, facturación, trámites bancarios. Si lo que
            buscás es comparar la tasa oficial contra el precio del dólar
            en Binance P2P (lo que muchos venezolanos usan como referencia
            real del día a día), esa comparación está en{" "}
            <Link href="/cripto/venezuela" className="text-violet hover:underline">
              tasas de Venezuela
            </Link>
            , donde también podés calcular la brecha entre ambas.
          </p>
        </article>
      </section>

      <SiteFooter />
    </main>
  );
}
