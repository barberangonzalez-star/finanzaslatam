import type { Metadata } from "next";
import Link from "next/link";
import PayPalFeeCalculator from "@/components/PayPalFeeCalculator";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Calculadora de Comisiones PayPal 2026 | México, Colombia, Chile, Argentina",
  description:
    "Calculá cuánto cobra PayPal en México, Colombia, Chile y Argentina. Comisiones nacionales, internacionales y conversión de divisa actualizadas 2026.",
  alternates: {
    canonical: "https://finanzaslatam.xyz/paypal",
  },
};

export default function PayPalPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Calculadora de Comisiones PayPal",
    url: "https://finanzaslatam.xyz/paypal",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Calculadora de comisiones de PayPal para freelancers y vendedores en México, Colombia, Chile y Argentina, con desglose de tarifa porcentual, fija y conversión de divisa.",
    about: {
      "@type": "Thing",
      name: "Comisiones PayPal",
    },
  };

  return (
    <main className="max-w-[760px] mx-auto px-6 py-14 sm:py-16 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header>
        <Link
          href="/"
          className="inline-block font-mono text-xs text-ink-soft hover:text-clay transition-colors mb-6"
        >
          ← Latam Finanzas
        </Link>
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-clay mb-3.5">
          <span className="w-4 h-px bg-clay inline-block" aria-hidden />
          PayPal &middot; México, Colombia, Chile, Argentina
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight tracking-tight mb-4">
          Calculadora de Comisiones PayPal
        </h1>
        <p className="text-ink-soft text-base max-w-[52ch] mb-2">
          Sabé exactamente cuánto te descuenta PayPal y cuánto tenés que
          cobrar para recibir el monto que necesitás — con las tarifas
          reales por país, no aproximaciones.
        </p>
        <p className="font-mono text-xs text-ink-soft opacity-70">
          Tarifas verificadas contra PayPal oficial, vigentes 2026
        </p>
      </header>

      <div className="mt-10">
        <PayPalFeeCalculator />
      </div>

      {/* SEO support content — also doubles as AdSense-friendly editorial content */}
      <section className="mt-16 space-y-10">
        <article>
          <h2 className="font-display text-2xl font-semibold mb-3">
            Cómo cobra PayPal sus comisiones
          </h2>
          <div className="text-[15px] text-ink-soft space-y-3 leading-relaxed">
            <p>
              Cada vez que recibís un pago comercial por PayPal —ya sea por
              vender un producto, cobrar un servicio freelance o recibir el
              pago de un cliente— PayPal descuenta dos cosas: un porcentaje
              del monto total y una tarifa fija por transacción. No es un
              solo número parejo para toda la región: México tiene su
              propia tarifa, más baja que el resto.
            </p>
            <p>
              Colombia, Chile y Argentina comparten la misma tarifa estándar
              que PayPal aplica al &quot;resto del mundo&quot;: 5.40% más
              una tarifa fija, sin importar si el pago es nacional o viene
              de otro país.
            </p>
          </div>
        </article>

        <article>
          <h2 className="font-display text-2xl font-semibold mb-3">
            La diferencia entre México y el resto de la región
          </h2>
          <p className="text-[15px] text-ink-soft leading-relaxed">
            México es el único país de los cuatro con una estructura de
            comisión distinta: 3.95% para transacciones nacionales, con un
            0.50% adicional si el pago viene del exterior. Eso significa
            que un freelancer mexicano cobrando a un cliente en EE.UU. paga
            menos comisión proporcional que uno en Colombia o Argentina
            cobrando exactamente lo mismo.
          </p>
        </article>

        <article>
          <h2 className="font-display text-2xl font-semibold mb-3">
            El costo oculto de la conversión de divisa
          </h2>
          <div className="text-[15px] text-ink-soft space-y-3 leading-relaxed">
            <p>
              La comisión por transacción no es lo único que se lleva
              PayPal. Si recibís dólares y tu cuenta está en pesos
              (colombianos, chilenos o argentinos), PayPal convierte
              automáticamente esos dólares aplicando un margen sobre el
              tipo de cambio real — alrededor de 4.5% para la región.
            </p>
            <p>
              Ese margen no aparece como una línea separada en el recibo;
              está escondido dentro del tipo de cambio que PayPal te
              muestra. Por eso, dos personas que reciben el mismo monto en
              dólares pueden terminar con una diferencia notable en su
              moneda local según cuándo y cómo retiran los fondos.
            </p>
          </div>
        </article>

        <article>
          <h2 className="font-display text-2xl font-semibold mb-3">
            Venezuela: una situación distinta
          </h2>
          <p className="text-[15px] text-ink-soft leading-relaxed">
            PayPal no opera de forma oficial dentro de Venezuela — no es
            posible abrir una cuenta verificada con domicilio venezolano ni
            retirar fondos directamente a un banco local. Quienes usan
            PayPal desde Venezuela suelen hacerlo con cuentas registradas
            en otro país, o a través de intermediarios. Por eso, cualquier
            cifra de comisión para Venezuela en esta calculadora es solo
            referencial.
          </p>
        </article>

        <article>
          <h2 className="font-display text-2xl font-semibold mb-3">
            Cómo cobrar para recibir un monto exacto
          </h2>
          <p className="text-[15px] text-ink-soft leading-relaxed">
            Si necesitás que te lleguen exactamente $100 después de
            comisiones, no alcanza con sumar el porcentaje a ojo — el
            cálculo correcto tiene que tener en cuenta que la comisión se
            aplica sobre el monto que el cliente envía, no sobre lo que vos
            querés recibir. La opción &quot;Cuánto debo cobrar&quot; de la
            calculadora hace ese cálculo inverso automáticamente, así no
            perdés dinero por redondear mal.
          </p>
        </article>
      </section>

      <SiteFooter />
    </main>
  );
}
