import type { Metadata } from "next";
import Link from "next/link";
import RemittanceComparator from "@/components/RemittanceComparator";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Comparador de Remesas | Wise vs Western Union vs Payoneer",
  description:
    "Compará cuánto recibe realmente tu familia con Wise, Western Union y Payoneer. El costo real incluye la comisión visible y el margen escondido en el tipo de cambio.",
  alternates: {
    canonical: "https://finanzaslatam.xyz/remesas",
  },
};

export default function RemesasPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Comparador de Remesas",
    url: "https://finanzaslatam.xyz/remesas",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Comparador de costos de remesas entre Wise, Western Union y Payoneer, incluyendo comisión visible y margen de tipo de cambio.",
    about: {
      "@type": "Thing",
      name: "Remesas internacionales",
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
            Wise · Western Union · Payoneer
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold leading-[1.1] tracking-tight mb-3">
          ¿Cuál te conviene para enviar plata?
        </h1>
        <p className="text-ink-soft text-[15px] max-w-[54ch]">
          La comisión que ves no es el costo real — comparamos comisión
          visible y margen de tipo de cambio juntos, así sabés cuánto
          recibe realmente quien lo necesita.
        </p>
      </header>

      <RemittanceComparator />

      <section className="mt-14 space-y-9">
        <article>
          <h2 className="font-display text-xl font-bold mb-2.5">
            El truco de la &quot;comisión cero&quot;
          </h2>
          <div className="text-[14.5px] text-ink-soft space-y-3 leading-relaxed">
            <p>
              Muchos servicios anuncian envíos &quot;sin comisión&quot; o
              con una tarifa muy baja. Eso es verdad en la letra chica,
              pero no cuenta toda la historia: en vez de cobrar una
              comisión visible, aplican un margen sobre el tipo de cambio
              — te dan menos pesos, reales o quetzales por cada dólar de
              los que realmente vale en el mercado.
            </p>
            <p>
              Ese margen no aparece como una línea de cargo en ningún
              lado. Solo se nota cuando comparás el monto que recibió tu
              familia contra lo que debería haber recibido al tipo de
              cambio real del día.
            </p>
          </div>
        </article>

        <article>
          <h2 className="font-display text-xl font-bold mb-2.5">
            Por qué Wise suele ganar
          </h2>
          <p className="text-[14.5px] text-ink-soft leading-relaxed">
            Wise se diferencia de la mayoría de los servicios porque usa
            el tipo de cambio medio del mercado —el mismo que ves en
            Google o XE.com— sin agregarle margen. Todo lo que cobra está
            en la comisión visible, que es baja y se muestra antes de
            confirmar el envío. Por eso, aunque su comisión nominal a
            veces no sea la más baja del mercado, el monto final que
            recibe el destinatario suele ser mayor.
          </p>
        </article>

        <article>
          <h2 className="font-display text-xl font-bold mb-2.5">
            Cuándo conviene cada servicio
          </h2>
          <p className="text-[14.5px] text-ink-soft leading-relaxed">
            Wise tiende a ganar en costo total para montos medianos y
            altos donde cada punto de margen cambiario importa. Western
            Union y servicios similares pueden seguir siendo la mejor
            opción si el destinatario necesita retirar efectivo en una
            sucursal física y no tiene cuenta bancaria — la comparación de
            costo puro no captura esa diferencia de acceso.
          </p>
        </article>

        <article>
          <h2 className="font-display text-xl font-bold mb-2.5">
            Sobre los números de esta calculadora
          </h2>
          <p className="text-[14.5px] text-ink-soft leading-relaxed">
            Las estructuras de comisión y margen que usamos están basadas
            en el comportamiento típico publicado de cada proveedor en
            2026, no en una cotización exacta para tu envío específico.
            Las tarifas reales varían según el país de destino, el monto,
            el método de pago y promociones vigentes (muchos servicios
            ofrecen el primer envío sin comisión). Usá esta herramienta
            para entender el patrón general, y verificá el monto exacto en
            la app del proveedor antes de confirmar.
          </p>
        </article>
      </section>

      <SiteFooter />
    </main>
  );
}
