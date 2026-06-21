"use client";

import { useEffect, useState } from "react";

export interface RateCardData {
  label: string;
  value: number | null;
  currency: string;
  status: "loading" | "success" | "error";
  accent?: "violet" | "mint" | "coral";
}

const ACCENT_CLASSES: Record<NonNullable<RateCardData["accent"]>, string> = {
  violet: "from-navy-deep via-navy-mid to-violet",
  mint: "from-navy-deep via-navy-mid to-mint",
  coral: "from-navy-deep via-navy-mid to-coral",
};

export function RateCard({ label, value, currency, status, accent = "violet" }: RateCardData) {
  return (
    <div
      className={`rounded-2xl bg-gradient-to-br ${ACCENT_CLASSES[accent]} p-6 sm:p-7 text-white relative overflow-hidden`}
    >
      <div className="font-mono text-[11px] uppercase tracking-widest text-white/60 mb-1.5">
        {label}
      </div>
      {status === "loading" && (
        <div className="font-display text-3xl sm:text-4xl font-bold leading-none text-white/40">
          Cargando…
        </div>
      )}
      {status === "error" && (
        <div className="font-mono text-sm text-coral font-semibold">
          Sin datos por ahora
        </div>
      )}
      {status === "success" && value !== null && (
        <div className="font-display text-3xl sm:text-4xl font-bold leading-none tracking-tight">
          {value.toLocaleString("es-419", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          <span className="text-base font-medium text-white/60 ml-2">{currency}</span>
        </div>
      )}
    </div>
  );
}

export interface UseCountryRatesResult {
  official: number | null;
  parallel: number | null;
  eurOfficial: number | null;
  officialStatus: "loading" | "success" | "error";
  parallelStatus: "loading" | "success" | "error";
  eurStatus: "loading" | "success" | "error";
  fetchedAt: string | null;
  refresh: () => void;
}

// Shared fetch hook for the dedicated per-country pages. Mirrors the same
// /api/rates contract used by the ExchangeGapCalculator on /cripto, but
// owns its own state since these pages don't have manual rate inputs.
export function useCountryRates(
  countryCode: string,
  hasParallel: boolean,
  hasEur: boolean = false
): UseCountryRatesResult {
  const [official, setOfficial] = useState<number | null>(null);
  const [parallel, setParallel] = useState<number | null>(null);
  const [eurOfficial, setEurOfficial] = useState<number | null>(null);
  const [officialStatus, setOfficialStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [parallelStatus, setParallelStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [eurStatus, setEurStatus] = useState<"loading" | "success" | "error">("loading");
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setOfficialStatus("loading");
      if (hasParallel) setParallelStatus("loading");
      if (hasEur) setEurStatus("loading");

      try {
        const res = await fetch(`/api/rates?country=${countryCode}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        if (controller.signal.aborted) return;

        if (data.ok) {
          if (typeof data.official === "number") {
            setOfficial(data.official);
            setOfficialStatus("success");
            setFetchedAt(data.fetchedAt);
          } else {
            setOfficialStatus("error");
          }

          if (hasParallel) {
            if (typeof data.parallel === "number") {
              setParallel(data.parallel);
              setParallelStatus("success");
            } else {
              setParallelStatus("error");
            }
          }

          if (hasEur) {
            if (typeof data.eurOfficial === "number") {
              setEurOfficial(data.eurOfficial);
              setEurStatus("success");
            } else {
              setEurStatus("error");
            }
          }
        } else {
          setOfficialStatus("error");
          if (hasParallel) setParallelStatus("error");
          if (hasEur) setEurStatus("error");
        }
      } catch {
        if (controller.signal.aborted) return;
        setOfficialStatus("error");
        if (hasParallel) setParallelStatus("error");
        if (hasEur) setEurStatus("error");
      }
    })();

    return () => controller.abort();
  }, [countryCode, hasParallel, hasEur, refreshToken]);

  return {
    official,
    parallel,
    eurOfficial,
    officialStatus,
    parallelStatus,
    eurStatus,
    fetchedAt,
    refresh: () => setRefreshToken((t) => t + 1),
  };
}
