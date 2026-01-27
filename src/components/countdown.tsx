"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

type CountdownValues = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
};

const pad = (value: number) => value.toString().padStart(2, "0");

const getCountdown = (targetMs: number): CountdownValues => {
  const now = Date.now();
  const diff = Math.max(0, targetMs - now);

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    isComplete: diff === 0,
  };
};

export function Countdown({ targetIso }: { targetIso: string }) {
  const targetMs = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  const [time, setTime] = useState(() => getCountdown(targetMs));

  useEffect(() => {
    const tick = () => setTime(getCountdown(targetMs));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetMs]);

  const items = [
    { label: "Days", value: time.days.toString() },
    { label: "Hours", value: pad(time.hours) },
    { label: "Minutes", value: pad(time.minutes) },
    { label: "Seconds", value: pad(time.seconds) },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-4">
      {items.map((item) => (
        <Card
          key={item.label}
          className="border-white/70 bg-white/80 shadow-[0_20px_40px_-28px_rgba(209,0,108,0.6)] backdrop-blur"
        >
          <CardContent className="flex flex-col items-center gap-1 p-2 md:gap-2 md:p-6">
            <span className="text-xl font-semibold tracking-tight text-[color:var(--momo-pink)] md:text-4xl">
              {item.value}
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--momo-ink)] opacity-70">
              {item.label}
            </span>
          </CardContent>
        </Card>
      ))}
      {time.isComplete && (
        <div className="col-span-2 md:col-span-4">
          <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-center text-sm font-medium text-[color:var(--momo-ink)] shadow-[0_20px_40px_-28px_rgba(209,0,108,0.6)] backdrop-blur">
            It is time. The celebration begins now.
          </div>
        </div>
      )}
    </div>
  );
}
