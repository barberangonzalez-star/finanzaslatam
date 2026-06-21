import type { Metadata } from "next";
import ConverterView from "@/components/ConverterView";

export const metadata: Metadata = {
  title: "Conversor Dólar, Euro y Bolívar | Tasa BCV Hoy",
  description:
    "Convertí Dólares y Euros a Bolívares, o Bolívares a Dólares y Euros, con la tasa oficial del BCV actualizada automáticamente.",
  alternates: {
    canonical: "https://finanzaslatam.xyz/conversor",
  },
};

export default function ConverterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Conversor Dólar, Euro y Bolívar",
    url: "https://finanzaslatam.xyz/conversor",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Conversor bidireccional de Dólares, Euros y Bolívares usando la tasa oficial del BCV.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ConverterView />
    </>
  );
}
