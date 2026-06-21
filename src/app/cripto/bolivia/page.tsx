import type { Metadata } from "next";
import BoliviaRatesView from "@/components/BoliviaRatesView";

export const metadata: Metadata = {
  title: "Dólar Oficial y Paralelo Hoy | Tasas Bolivia",
  description:
    "Tipo de cambio oficial del Banco Central de Bolivia y referencia del paralelo (Binance), actualizados automáticamente, con la brecha calculada.",
  alternates: {
    canonical: "https://finanzaslatam.xyz/cripto/bolivia",
  },
};

export default function BoliviaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Tasas Bolivia",
    url: "https://finanzaslatam.xyz/cripto/bolivia",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Tipo de cambio oficial del BCB y referencia del paralelo en Bolivia, actualizados automáticamente, con la brecha calculada.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BoliviaRatesView />
    </>
  );
}
