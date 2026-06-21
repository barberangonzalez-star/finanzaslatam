import type { Metadata } from "next";
import ArgentinaRatesView from "@/components/ArgentinaRatesView";

export const metadata: Metadata = {
  title: "Dólar Oficial, Blue y Euro Hoy | Tasas Argentina",
  description:
    "Dólar oficial, dólar blue y Euro en Argentina, actualizados automáticamente, con la brecha cambiaria calculada al instante.",
  alternates: {
    canonical: "https://finanzaslatam.xyz/cripto/argentina",
  },
};

export default function ArgentinaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Tasas Argentina",
    url: "https://finanzaslatam.xyz/cripto/argentina",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Dólar oficial, blue y Euro en Argentina, actualizados automáticamente, con la brecha cambiaria calculada.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArgentinaRatesView />
    </>
  );
}
