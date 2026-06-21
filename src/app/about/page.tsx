import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Sobre el sitio",
  description:
    "Latam Finanzas es un conjunto independiente de calculadoras financieras para México, Colombia, Chile, Argentina y Venezuela.",
  alternates: {
    canonical: "https://finanzaslatam.xyz/about",
  },
};

export default function AboutPage() {
  return (
    <main className="max-w-[760px] mx-auto px-6 py-14 sm:py-16 pb-20">
      <Link
        href="/"
        className="inline-block font-mono text-xs text-ink-soft hover:text-clay transition-colors mb-6"
      >
        ← Latam Finanzas
      </Link>

      <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight tracking-tight mb-8">
        Sobre el sitio
      </h1>

      <div className="text-[15px] text-ink-soft space-y-5 leading-relaxed max-w-[60ch]">
        <p>
          Latam Finanzas es un conjunto pequeño e independiente de
          calculadoras para entender cuánto cuesta realmente mover dinero
          en Latinoamérica — comisiones de plataformas de pago, conversión
          de divisas y remesas. Empezó con una calculadora de comisiones de
          PayPal y va a ir sumando herramientas para criptomonedas y
          comparación de remesas.
        </p>
        <p>
          Cada calculadora se construye con las tarifas oficiales
          publicadas por cada plataforma, no con aproximaciones genéricas.
          Cuando esas tarifas cambian, las calculadoras se actualizan para
          reflejarlo.
        </p>
        <p>
          Este sitio es un proyecto independiente de Gabriel Barberán, sin
          afiliación con PayPal, Binance, ni ninguna otra plataforma
          financiera mencionada. No es un servicio oficial ni un sustituto
          del soporte al cliente de esas plataformas.
        </p>
        <p>
          Si encontrás un error, una tarifa desactualizada, o tenés una
          sugerencia, mirá la{" "}
          <Link href="/contact" className="text-clay hover:underline">
            página de contacto
          </Link>
          .
        </p>
      </div>

      <SiteFooter />
    </main>
  );
}
