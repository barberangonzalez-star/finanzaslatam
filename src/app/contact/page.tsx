import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contactanos sobre Latam Finanzas — correcciones, sugerencias o preguntas generales.",
  alternates: {
    canonical: "https://finanzaslatam.xyz/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="max-w-[760px] mx-auto px-5 sm:px-6 pt-10 sm:pt-14 pb-20">
      <Link
        href="/"
        className="inline-block font-mono text-xs text-ink-soft hover:text-violet transition-colors mb-6"
      >
        ← Latam Finanzas
      </Link>

      <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight tracking-tight mb-8">
        Contacto
      </h1>

      <div className="text-[15px] text-ink-soft space-y-5 leading-relaxed max-w-[60ch]">
        <p>
          ¿Encontraste un error en algún cálculo, una tarifa desactualizada,
          o tenés una idea para una nueva calculadora? Escribinos.
        </p>

        <div className="rounded border border-line bg-paper-raised p-6">
          <div className="font-mono text-[11px] uppercase tracking-wide text-ink-soft mb-1.5">
            Correo
          </div>
          <a
            href="mailto:gabriel@gabrielbarberan.com"
            className="font-display text-xl text-ink hover:text-violet transition-colors"
          >
            gabriel@gabrielbarberan.com
          </a>
        </div>

        <p className="text-[13px] opacity-80">
          Este sitio lo maneja una sola persona — mirá la{" "}
          <Link href="/about" className="text-violet hover:underline">
            página sobre el sitio
          </Link>{" "}
          para más contexto.
        </p>
      </div>

      <SiteFooter />
    </main>
  );
}
