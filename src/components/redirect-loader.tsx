"use client";

import { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

const TOTAL_DURATION_MS = 5000;

export function RedirectLoader({ url, id }: { url: string; id: string }) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (startRef.current === null) {
      startRef.current = Date.now();
    }
    const interval = setInterval(() => {
      const diff = Date.now() - (startRef.current ?? Date.now());
      setElapsed(Math.min(diff, TOTAL_DURATION_MS));
      if (diff >= TOTAL_DURATION_MS) {
        clearInterval(interval);
        window.location.assign(url);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [url]);

  const progress = Math.round((elapsed / TOTAL_DURATION_MS) * 100);
  const secondsLeft = Math.max(
    0,
    Math.ceil((TOTAL_DURATION_MS - elapsed) / 1000),
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_#ffe1ee,_#fff6fa_55%,_#fff8fc)] px-6">
      <div className="pointer-events-none absolute -top-20 left-12 h-52 w-52 rounded-full bg-[radial-gradient(circle,_rgba(209,0,108,0.4),_transparent_70%)] blur-2xl animate-[float_8s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-60 w-60 rounded-full bg-[radial-gradient(circle,_rgba(255,106,167,0.45),_transparent_70%)] blur-3xl animate-[float_9s_ease-in-out_infinite]" />

      <Card className="relative w-full max-w-xl border-white/70 bg-white/85 shadow-[0_30px_60px_-40px_rgba(209,0,108,0.7)] backdrop-blur">
        <CardContent className="flex flex-col gap-6 p-6 md:p-8">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--momo-ink)] opacity-60">
              YEP 2026 - Gift {id}
            </span>
            <h1 className="text-3xl font-semibold leading-tight text-[color:var(--momo-ink)] md:text-4xl font-[var(--font-display)]">
              Your surprise is loading.
            </h1>
            <p className="text-sm text-[color:var(--momo-ink)] opacity-70 md:text-base">
              Get ready to see your Year End Party present. We are preparing
              the reveal for you.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between text-xs font-medium text-[color:var(--momo-ink)] opacity-60">
              <span>{secondsLeft}s remaining</span>
              <span>{progress}%</span>
            </div>
          </div>

          <div className="rounded-2xl bg-[color:var(--momo-cream)] px-4 py-3 text-sm text-[color:var(--momo-ink)] opacity-70">
            If nothing happens,{" "}
            <a
              className="font-semibold text-[color:var(--momo-pink)] underline"
              href={url}
            >
              tap here to view your present
            </a>
            .
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
