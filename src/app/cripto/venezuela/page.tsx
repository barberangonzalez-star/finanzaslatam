import type { Metadata } from "next";
import VenezuelaRatesView from "@/components/VenezuelaRatesView";

export const metadata: Metadata = {
  title: "Dólar y Euro BCV Hoy | Tasas Oficiales Venezuela",
  description:
    "Tasa BCV del Dólar y el Euro hoy, actualizadas automáticamente, más la brecha contra el precio Binance P2P en Venezuela.",
  alternates: {
    canonical: "https://finanzaslatam.xyz/cripto/venezuela",
  },
};

export default function VenezuelaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Tasas BCV Venezuela",
    url: "https://finanzaslatam.xyz/cripto/venezuela",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Tasa BCV del Dólar y el Euro actualizadas automáticamente, con cálculo de brecha contra el precio Binance P2P.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VenezuelaRatesView />
    </>
  );
}
