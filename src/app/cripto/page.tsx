import type { Metadata } from "next";
import Link from "next/link";
import ExchangeGapCalculator from "@/components/ExchangeGapCalculator";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Calculadora de Brecha Cambiaria | Binance P2P vs Oficial",
  description:
    "Calculá la brecha entre el tipo de cambio oficial y el paralelo (Binance P2P, dólar blue) en Venezuela, Argentina y Bolivia. Ingresá las tasas del día y mirá la diferencia real.",
  alternates: {
    canonical: "https://finanzaslatam.xyz/cripto",
  },
};

export default function CriptoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Calculadora de Brecha Cambiaria",
    url: "https://finanzaslatam.xyz/cripto",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Calculadora de brecha cambiaria entre tasa oficial y tasa paralela (Binance P2P, dólar blue) para Venezuela, Argentina y Bolivia.",
    about: {
      "@type": "Thing",
      name: "Brecha cambiaria",
    },
  };

  return (
    <main className="max-w-[760px] mx-auto px-5 sm:px-6 pt-10 sm:pt-14 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/"
        className="inline-block font-mono text-xs text-ink-soft hover:text-violet transition-colors mb-6"
      >
        ← Latam Finanzas
      </Link>

      <header className="mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-soft mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-violet" aria-hidden />
          <span className="font-mono text-[11px] font-semibold text-violet uppercase tracking-wide">
            Venezuela · Argentina · Bolivia · Colombia · Chile
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold leading-[1.1] tracking-tight mb-3">
          ¿Qué tan grande es la brecha hoy?
        </h1>
        <p className="text-ink-soft text-[15px] max-w-[54ch]">
          Comparar la tasa oficial contra la tasa paralela (Binance P2P,
          dólar blue) para ver exactamente cuánto vale tu dinero según qué
          mercado uses.
        </p>
      </header>

      <ExchangeGapCalculator />

      <section className="mt-14 space-y-9">
        <article>
          <h2 className="font-display text-xl font-bold mb-2.5">
            Por qué esta calculadora no muestra un precio fijo
          </h2>
          <div className="text-[14.5px] text-ink-soft space-y-3 leading-relaxed">
            <p>
              El precio del USDT en Binance P2P y el dólar blue argentino
              cambian todo el tiempo — a veces varias veces por hora. Una
              calculadora que mostrara &quot;el precio de hoy&quot; estaría
              desactualizada apenas la publicáramos. Por eso esta
              herramienta te pide las dos tasas del momento: la oficial y
              la paralela, y hace el cálculo de la brecha al instante.
            </p>
            <p>
              Podés consultar la tasa oficial en el sitio del Banco Central
              de tu país (BCV para Venezuela, BCRA para Argentina), y la
              tasa paralela directamente en la app de Binance P2P o en
              sitios que las recopilan en tiempo real.
            </p>
          </div>
        </article>

        <article>
          <h2 className="font-display text-xl font-bold mb-2.5">
            Qué significa la brecha cambiaria
          </h2>
          <p className="text-[14.5px] text-ink-soft leading-relaxed">
            La brecha es la diferencia porcentual entre lo que el gobierno
            dice que vale un dólar y lo que el mercado realmente paga por
            él. Una brecha alta —como la que históricamente tuvo
            Venezuela— refleja desconfianza en la tasa oficial: la gente
            prefiere comprar y vender divisas fuera del sistema regulado.
            Una brecha baja, como la que tuvo Argentina en distintos
            momentos de 2026, indica que el mercado considera que la tasa
            oficial está más alineada con la realidad.
          </p>
        </article>

        <article>
          <h2 className="font-display text-xl font-bold mb-2.5">
            Binance P2P en Venezuela
          </h2>
          <p className="text-[14.5px] text-ink-soft leading-relaxed">
            Para la mayoría de los venezolanos, el precio del USDT en
            Binance P2P funciona como el dólar de referencia real —
            incluso más que el efectivo paralelo tradicional. La tasa BCV
            es la oficial para efectos legales (facturación, impuestos),
            pero el precio P2P refleja lo que la gente realmente paga y
            cobra en el día a día.
          </p>
        </article>

        <article>
          <h2 className="font-display text-xl font-bold mb-2.5">
            El dólar en Argentina: más de un precio
          </h2>
          <p className="text-[14.5px] text-ink-soft leading-relaxed">
            Argentina no tiene un solo dólar — existe el oficial
            (minorista del BCRA), el blue (paralelo informal), el MEP, el
            CCL y el cripto, cada uno con un uso y un marco legal
            distinto. Esta calculadora compara el oficial contra el blue o
            el cripto, que suelen moverse juntos. Con la salida del cepo
            cambiario en 2025, la brecha entre ambos se redujo
            significativamente respecto a años anteriores.
          </p>
        </article>
        <article>
          <h2 className="font-display text-xl font-bold mb-2.5">
            Bolivia: un tipo de cambio fijo desde 2011
          </h2>
          <p className="text-[14.5px] text-ink-soft leading-relaxed">
            El Banco Central de Bolivia mantiene un tipo de cambio oficial
            fijo desde noviembre de 2011, sin moverse pese a la escasez de
            dólares en el sistema bancario formal. Como los bancos
            bolivianos limitan fuertemente cuánto dólar físico venden por
            persona al mes, gran parte de la demanda real se trasladó a
            plataformas P2P como Binance, donde el precio lo determina la
            oferta y la demanda — sin intervención del banco central. La
            brecha entre ambos ha estado en niveles altos, similar en
            magnitud a la de Venezuela.
          </p>
        </article>
      </section>

      <SiteFooter />
    </main>
  );
}
