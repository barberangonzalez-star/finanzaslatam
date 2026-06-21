import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import NavBar from "@/components/NavBar";

import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_URL = "https://finanzaslatam.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Latam Finanzas | Calculadoras financieras para Latinoamérica",
    template: "%s | Latam Finanzas",
  },
  description:
    "Calculadoras gratuitas de comisiones PayPal, criptomonedas y remesas para México, Colombia, Chile, Argentina, Bolivia y Venezuela. Datos actualizados 2026.",
  keywords: [
    "calculadora paypal latinoamerica",
    "comisiones paypal mexico",
    "comisiones paypal colombia",
    "calculadora cripto",
    "remesas latinoamerica",
  ],
  authors: [{ name: "Latam Finanzas" }],
  openGraph: {
    type: "website",
    locale: "es_419",
    url: SITE_URL,
    siteName: "Latam Finanzas",
    title: "Latam Finanzas | Calculadoras financieras para Latinoamérica",
    description:
      "Calculadoras gratuitas de comisiones, cripto y remesas para México, Colombia, Chile, Argentina, Bolivia y Venezuela.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Latam Finanzas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Latam Finanzas",
    description:
      "Calculadoras gratuitas de comisiones, cripto y remesas para Latinoamérica.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: "Z3N7RFyGoukRYCNhLFnkxqRz0Ib4TpwUdYRkHyssRxg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="es">
      <head>
        {adsenseClientId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {gaMeasurementId && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <NavBar />
        {children}
      </body>
    </html>
  );
}
