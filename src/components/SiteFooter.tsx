import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-16 pt-6 border-t border-line">
      <nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
        <Link href="/about" className="text-ink-soft hover:text-violet transition-colors font-medium">
          Sobre el sitio
        </Link>
        <Link href="/privacy-policy" className="text-ink-soft hover:text-violet transition-colors font-medium">
          Política de privacidad
        </Link>
        <Link href="/contact" className="text-ink-soft hover:text-violet transition-colors font-medium">
          Contacto
        </Link>
      </nav>
      <p className="mt-4 text-xs text-ink-soft opacity-70">
        Latam Finanzas &middot; Calculadoras independientes, no afiliadas a
        PayPal ni a ninguna entidad financiera
      </p>
    </footer>
  );
}
