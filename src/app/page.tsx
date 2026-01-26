import { Countdown } from "@/components/countdown";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#ffe1ee,_#fff6fa_55%,_#fff8fc)]">
      <div className="pointer-events-none absolute -top-24 right-8 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(209,0,108,0.45),_transparent_70%)] blur-2xl animate-[float_9s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute left-10 top-1/3 h-52 w-52 rounded-full bg-[radial-gradient(circle,_rgba(255,106,167,0.4),_transparent_70%)] blur-2xl animate-[float_7s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute bottom-10 right-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(255,77,125,0.35),_transparent_70%)] blur-3xl animate-[float_10s_ease-in-out_infinite]" />

      <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-16 md:gap-14 md:py-24">
        <div className="flex flex-col gap-6">
          <Badge className="w-fit rounded-full border-transparent bg-[color:var(--momo-pink)] text-white">
            MoMo CIO Year End Party 2026
          </Badge>
          <div className="flex flex-col gap-4">
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[color:var(--momo-ink)] md:text-6xl md:leading-tight font-[var(--font-display)]">
              CIO YEP 2026 countdown.
            </h1>
          </div>
        </div>

        <Card className="border-white/70 bg-white/80 shadow-[0_30px_60px_-40px_rgba(209,0,108,0.7)] backdrop-blur">
          <CardContent className="flex flex-col gap-6 p-6 md:p-8">
            <Countdown targetIso="2026-02-03T13:00:00.000Z" />
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3 text-sm font-medium text-[color:var(--momo-ink)] opacity-70">
          <span className="rounded-full bg-[color:var(--momo-cream)] px-4 py-2">
            Stay tuned for the reveal.
          </span>
          <span className="rounded-full bg-[color:var(--momo-cream)] px-4 py-2">
            #MoMoYEP2026
          </span>
        </div>
      </main>
    </div>
  );
}
