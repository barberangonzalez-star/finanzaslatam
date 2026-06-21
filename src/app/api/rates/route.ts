import { NextRequest, NextResponse } from "next/server";

// Proxies exchange-rate lookups so the client doesn't call third-party APIs
// directly (avoids CORS issues, lets us cache, centralizes error handling).
//
// Sources used (all public, no API key required):
// - Venezuela official (BCV): rates.dolarvzla.com/bcv/current.json — public
//   CDN, no key, no rate limit, CORS-open. Scrapes bcv.org.ve upstream.
// - Argentina (oficial + blue): dolarapi.com — open-source community API.
// - Bolivia (oficial + binance reference): bo.dolarapi.com — same project,
//   Bolivia-specific subdomain. Same JSON shape as Argentina's endpoints.
// - Colombia (TRM): datos.gov.co Socrata dataset 32sa-8pi3 — official
//   government open-data portal, anonymous/no-key access for light use.
// - Chile (dólar observado): mindicador.cl/api/dolar — community API
//   sourcing from Banco Central de Chile, no key required.
//
// Venezuela's parallel/P2P rate (Binance P2P) is intentionally NOT
// auto-fetched: every public source found for it requires a free but
// registered API key (Cotizave, dolarvzla.com's USDT endpoint). Rather
// than depend on a third-party key that could change plans or disappear,
// that field stays manual.
//
// Colombia and Chile don't have a structural exchange-control gap the way
// Venezuela, Argentina, and Bolivia do, so only the official rate (TRM /
// dólar observado) is auto-fetched for them — the "compare against" field
// stays fully manual and user-defined (a cambio house quote, P2P price,
// etc.), rather than assuming a P2P rate exists to compare against.
//
// Every fetch here is wrapped so a failure returns a clean "unavailable"
// response instead of crashing; the calculator on the client always
// allows manual entry as a fallback regardless of what this route returns.

export const revalidate = 120; // cache each lookup for 2 minutes

interface RateResponse {
  ok: boolean;
  official: number | null;
  parallel: number | null;
  eurOfficial?: number | null;
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
    const eurOfficial = typeof data?.current?.eur === "number" ? data.current.eur : null;

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

    return { ok: true, official, parallel: null, eurOfficial, source: "dolarvzla.com", fetchedAt };
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
    const [oficialRes, blueRes, eurRes] = await Promise.allSettled([
      fetch("https://dolarapi.com/v1/dolares/oficial", { next: { revalidate: 120 } }),
      fetch("https://dolarapi.com/v1/dolares/blue", { next: { revalidate: 120 } }),
      fetch("https://dolarapi.com/v1/cotizaciones/eur", { next: { revalidate: 120 } }),
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

    let eurOfficial: number | null = null;
    if (eurRes.status === "fulfilled" && eurRes.value.ok) {
      const data = await eurRes.value.json();
      eurOfficial = typeof data?.venta === "number" ? data.venta : null;
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

    return { ok: true, official, parallel, eurOfficial, source: "dolarapi.com", fetchedAt };
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

async function fetchBolivia(): Promise<RateResponse> {
  const fetchedAt = new Date().toISOString();
  try {
    const [oficialRes, binanceRes] = await Promise.allSettled([
      fetch("https://bo.dolarapi.com/v1/dolares/oficial", { next: { revalidate: 120 } }),
      fetch("https://bo.dolarapi.com/v1/dolares/binance", { next: { revalidate: 120 } }),
    ]);

    let official: number | null = null;
    if (oficialRes.status === "fulfilled" && oficialRes.value.ok) {
      const data = await oficialRes.value.json();
      official = typeof data?.venta === "number" ? data.venta : null;
    }

    let parallel: number | null = null;
    if (binanceRes.status === "fulfilled" && binanceRes.value.ok) {
      const data = await binanceRes.value.json();
      parallel = typeof data?.venta === "number" ? data.venta : null;
    }

    if (official === null && parallel === null) {
      return {
        ok: false,
        official: null,
        parallel: null,
        source: "bo.dolarapi.com",
        fetchedAt,
        error: "No se pudo obtener ninguna tasa en este momento.",
      };
    }

    return { ok: true, official, parallel, source: "bo.dolarapi.com", fetchedAt };
  } catch {
    return {
      ok: false,
      official: null,
      parallel: null,
      source: "bo.dolarapi.com",
      fetchedAt,
      error: "Error de red consultando la fuente de Bolivia.",
    };
  }
}

async function fetchColombia(): Promise<RateResponse> {
  const fetchedAt = new Date().toISOString();
  try {
    const res = await fetch(
      "https://www.datos.gov.co/resource/32sa-8pi3.json?$limit=1&$order=vigenciadesde%20DESC",
      { next: { revalidate: 120 } }
    );

    if (!res.ok) {
      return {
        ok: false,
        official: null,
        parallel: null,
        source: "datos.gov.co",
        fetchedAt,
        error: "La fuente de la TRM no respondió correctamente.",
      };
    }

    const data = await res.json();
    const row = Array.isArray(data) ? data[0] : null;
    const official = row && typeof row.valor === "string" ? parseFloat(row.valor) : null;

    if (official === null || Number.isNaN(official)) {
      return {
        ok: false,
        official: null,
        parallel: null,
        source: "datos.gov.co",
        fetchedAt,
        error: "La respuesta no tenía el formato esperado.",
      };
    }

    return { ok: true, official, parallel: null, source: "datos.gov.co", fetchedAt };
  } catch {
    return {
      ok: false,
      official: null,
      parallel: null,
      source: "datos.gov.co",
      fetchedAt,
      error: "Error de red consultando la TRM.",
    };
  }
}

async function fetchChile(): Promise<RateResponse> {
  const fetchedAt = new Date().toISOString();
  try {
    const res = await fetch("https://mindicador.cl/api/dolar", {
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      return {
        ok: false,
        official: null,
        parallel: null,
        source: "mindicador.cl",
        fetchedAt,
        error: "La fuente del dólar observado no respondió correctamente.",
      };
    }

    const data = await res.json();
    const serie = Array.isArray(data?.serie) ? data.serie : null;
    const official = serie && serie.length > 0 && typeof serie[0].valor === "number"
      ? serie[0].valor
      : null;

    if (official === null) {
      return {
        ok: false,
        official: null,
        parallel: null,
        source: "mindicador.cl",
        fetchedAt,
        error: "La respuesta no tenía el formato esperado.",
      };
    }

    return { ok: true, official, parallel: null, source: "mindicador.cl", fetchedAt };
  } catch {
    return {
      ok: false,
      official: null,
      parallel: null,
      source: "mindicador.cl",
      fetchedAt,
      error: "Error de red consultando el dólar observado.",
    };
  }
}

export async function GET(request: NextRequest) {
  const country = request.nextUrl.searchParams.get("country");

  if (country === "ve") {
    const result = await fetchVenezuelaOfficial();
    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  }

  if (country === "ar") {
    const result = await fetchArgentina();
    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  }

  if (country === "bo") {
    const result = await fetchBolivia();
    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  }

  if (country === "co") {
    const result = await fetchColombia();
    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  }

  if (country === "cl") {
    const result = await fetchChile();
    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  }

  return NextResponse.json(
    { ok: false, error: "País no soportado. Usá 've', 'ar', 'bo', 'co' o 'cl'." },
    { status: 400 }
  );
}
