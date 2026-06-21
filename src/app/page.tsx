import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

const tools = [
  {
    href: "/paypal",
    name: "Calculadora de Comisiones PayPal",
    description:
      "Cuánto cobra PayPal en México, Colombia, Chile y Argentina, y cuánto tenés que cobrar para recibir el monto exacto que necesitás.",
    status: "live" as const,
  },
  {
    href: "#",
    name: "Calculadora de Cripto (Binance P2P)",
    description: "Comparar el precio P2P de Binance contra el tipo de cambio oficial.",
    status: "soon" as const,
  },
  {
    href: "#",
    name: "Comparador de Remesas",
    description: "Wise, Payoneer y Western Union: comisiones y tiempos comparados.",
    status: "soon" as const,
  },
];

export default function Home() {
  return (
    <main className="max-w-[760px] mx-auto px-6 py-14 sm:py-16 pb-20">
      <header>
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-clay mb-3.5">
          <span className="w-4 h-px bg-clay inline-block" aria-hidden />
          Herramientas financieras &middot; Latinoamérica
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight tracking-tight mb-4">
          Latam Finanzas
        </h1>
        <p className="text-ink-soft text-base max-w-[52ch]">
          Calculadoras gratuitas para entender exactamente cuánto cuesta
          mover tu dinero — comisiones, conversión de divisa y remesas,
          calculadas con datos reales para México, Colombia, Chile,
          Argentina y Venezuela.
        </p>
      </header>

      <div className="mt-12 space-y-4">
        {tools.map((tool) => (
          <ToolCard key={tool.name} {...tool} />
        ))}
      </div>

      <SiteFooter />
    </main>
  );
}

function ToolCard({
  href,
  name,
  description,
  status,
}: {
  href: string;
  name: string;
  description: string;
  status: "live" | "soon";
}) {
  const content = (
    <div
      className={`rounded border border-line bg-paper-raised p-6 transition-colors ${
        status === "live" ? "hover:border-ink cursor-pointer" : "opacity-60"
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <h2 className="font-display text-xl font-semibold">{name}</h2>
        {status === "soon" && (
          <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft border border-line rounded-full px-2 py-0.5 shrink-0">
            Próximamente
          </span>
        )}
      </div>
      <p className="text-[14px] text-ink-soft leading-relaxed">{description}</p>
    </div>
  );

  if (status === "soon") return content;

  return (
    <Link href={href} aria-label={name}>
      {content}
    </Link>
  );
}
