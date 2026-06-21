import { NextRequest, NextResponse } from "next/server";

// Proxies exchange-rate lookups so the client doesn't call third-party APIs
// directly (avoids CORS issues, lets us cache, centralizes error handling).
//
// Sources used (both public, no API key required):
// - Venezuela official (BCV): rates.dolarvzla.com/bcv/current.json — public
//   CDN, no key, no rate limit, documented as CORS-open. Scrapes bcv.org.ve
//   upstream, so this mirrors the actual official rate.
// - Argentina (oficial + blue): dolarapi.com — open-source community API,
//   no key required, stable JSON shape.
//
// Venezuela's parallel/P2P rate (Binance P2P) is intentionally NOT
// auto-fetched here: every public source we found for it requires a free
// but registered API key (Cotizave, dolarvzla.com's USDT endpoint). Rather
// than depend on a third-party key that could change plans or go away,
// that field stays manual — the user enters today's P2P price themselves,
// same as before.
//
// Every fetch here is wrapped so a failure returns a clean "unavailable"
// response instead of crashing; the calculator on the client always
// allows manual entry as a fallback regardless of what this route returns.

export const revalidate = 120; // cache each lookup for 2 minutes

interface RateResponse {
  ok: boolean;
  official: number | null;
  parallel: number | null;
  source: string;
  fetchedAt: string;
  error?: string;
}

async function fetchVenezuelaOfficial(): Promise<RateResponse> {
  const fetchedAt = new Date().toISOString();
  try {
    const res = await fetch("https://rates.dolarvzla.com/bcv/current.json", {
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      return {
        ok: false,
        official: null,
        parallel: null,
        source: "dolarvzla.com",
        fetchedAt,
        error: "La fuente de la tasa BCV no respondió correctamente.",
      };
    }

    const data = await res.json();
    const official = typeof data?.current?.usd === "number" ? data.current.usd : null;

    if (official === null) {
      return {
        ok: false,
        official: null,
        parallel: null,
        source: "dolarvzla.com",
        fetchedAt,
        error: "La respuesta no tenía el formato esperado.",
      };
    }

    return { ok: true, official, parallel: null, source: "dolarvzla.com", fetchedAt };
  } catch {
    return {
      ok: false,
      official: null,
      parallel: null,
      source: "dolarvzla.com",
      fetchedAt,
      error: "Error de red consultando la tasa BCV.",
    };
  }
}

async function fetchArgentina(): Promise<RateResponse> {
  const fetchedAt = new Date().toISOString();
  try {
    const [oficialRes, blueRes] = await Promise.allSettled([
      fetch("https://dolarapi.com/v1/dolares/oficial", { next: { revalidate: 120 } }),
      fetch("https://dolarapi.com/v1/dolares/blue", { next: { revalidate: 120 } }),
    ]);

    let official: number | null = null;
    if (oficialRes.status === "fulfilled" && oficialRes.value.ok) {
      const data = await oficialRes.value.json();
      official = typeof data?.venta === "number" ? data.venta : null;
    }

    let parallel: number | null = null;
    if (blueRes.status === "fulfilled" && blueRes.value.ok) {
      const data = await blueRes.value.json();
      parallel = typeof data?.venta === "number" ? data.venta : null;
    }

    if (official === null && parallel === null) {
      return {
        ok: false,
        official: null,
        parallel: null,
        source: "dolarapi.com",
        fetchedAt,
        error: "No se pudo obtener ninguna tasa en este momento.",
      };
    }

    return { ok: true, official, parallel, source: "dolarapi.com", fetchedAt };
  } catch {
    return {
      ok: false,
      official: null,
      parallel: null,
      source: "dolarapi.com",
      fetchedAt,
      error: "Error de red consultando la fuente de Argentina.",
    };
  }
}

export async function GET(request: NextRequest) {
  const country = request.nextUrl.searchParams.get("country");

  if (country === "ve") {
    // Only the official BCV rate is auto-fetched. The parallel/P2P rate
    // has no key-free public source, so it's not included here — the
    // client keeps that field manual.
    const result = await fetchVenezuelaOfficial();
    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  }

  if (country === "ar") {
    const result = await fetchArgentina();
    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  }

  return NextResponse.json(
    { ok: false, error: "País no soportado. Usá 've' o 'ar'." },
    { status: 400 }
  );
}
