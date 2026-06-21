import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Política de privacidad de Latam Finanzas, incluyendo el uso de cookies y publicidad de terceros.",
  alternates: {
    canonical: "https://finanzaslatam.xyz/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-[760px] mx-auto px-5 sm:px-6 pt-10 sm:pt-14 pb-20">
      <Link
        href="/"
        className="inline-block font-mono text-xs text-ink-soft hover:text-violet transition-colors mb-6"
      >
        ← Latam Finanzas
      </Link>

      <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight tracking-tight mb-3">
        Política de privacidad
      </h1>
      <p className="font-mono text-xs text-ink-soft opacity-70 mb-10">
        Última actualización: junio 2026
      </p>

      <div className="text-[15px] text-ink-soft space-y-8 leading-relaxed max-w-[60ch]">
        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-2.5">
            Qué es este sitio
          </h2>
          <p>
            Latam Finanzas (finanzaslatam.xyz) ofrece calculadoras
            financieras gratuitas para usuarios en Latinoamérica. Esta
            política explica qué información se recopila al usar el sitio
            y cómo se utiliza.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-2.5">
            Información que ingresás en las calculadoras
          </h2>
          <p>
            Los montos y datos que ingresás en cualquier calculadora se
            procesan completamente en tu navegador para mostrar el
            resultado en pantalla. Esa información no se envía ni se
            guarda en ningún servidor, y no queda registrada ni asociada a
            vos de ninguna forma.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-2.5">
            Cookies y publicidad
          </h2>
          <p>
            Este sitio puede mostrar anuncios servidos por Google AdSense.
            Google y sus socios usan cookies para mostrar anuncios
            basados en tus visitas anteriores a este sitio y a otros
            sitios en internet.
          </p>
          <p className="mt-3">
            Podés desactivar la publicidad personalizada de Google
            visitando{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet hover:underline"
            >
              la configuración de anuncios de Google
            </a>
            . También podés gestionar el uso de cookies de otros
            proveedores publicitarios en{" "}
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet hover:underline"
            >
              aboutads.info
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-2.5">
            Analítica
          </h2>
          <p>
            Este sitio puede usar herramientas estándar de analítica web
            para entender patrones generales de tráfico — qué páginas se
            visitan y con qué frecuencia, de forma agregada. Esta
            información está anonimizada y no se usa para identificar a
            visitantes individuales.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-2.5">
            Enlaces a terceros
          </h2>
          <p>
            Cuando este sitio enlaza a recursos externos —como las páginas
            oficiales de PayPal— esos sitios tienen sus propias políticas
            de privacidad, que esta política no cubre.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-2.5">
            Cambios a esta política
          </h2>
          <p>
            Esta política puede actualizarse de tanto en tanto. Los
            cambios se reflejan en esta página con una fecha de
            actualización nueva.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-2.5">
            Contacto
          </h2>
          <p>
            Preguntas sobre esta política se pueden enviar desde la{" "}
            <Link href="/contact" className="text-violet hover:underline">
              página de contacto
            </Link>
            .
          </p>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
