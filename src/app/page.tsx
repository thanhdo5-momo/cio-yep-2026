import { Countdown } from "@/components/countdown";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FireworksBackground } from "@/components/ui/fireworks-background";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Mobile background */}
      <div className="absolute inset-0 bg-[url('/assets/background_mobile.png')] bg-cover bg-center bg-no-repeat md:hidden" />
      {/* Desktop background */}
      <div className="absolute inset-0 hidden bg-[url('/assets/background_web.png')] bg-[length:100%_auto] bg-top bg-no-repeat md:block" />

      <FireworksBackground
        className="pointer-events-auto z-0"
        population={25}
        color={[
          "#d1006c",
          "#ff4d7d",
          "#ff8fa3",
          "#ffd166",
          "#ff006c",
          "#e91e63",
        ]}
        autoLaunch={true}
        autoLaunchInterval={400}
        fireworkSpeed={{ min: 10, max: 16 }}
        particleSize={{ min: 2, max: 5 }}
      />
      <div className="pointer-events-none absolute -top-24 right-8 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(209,0,108,0.45),_transparent_70%)] blur-2xl animate-[float_9s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute left-10 top-1/3 h-52 w-52 rounded-full bg-[radial-gradient(circle,_rgba(255,106,167,0.4),_transparent_70%)] blur-2xl animate-[float_7s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute bottom-10 right-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(255,77,125,0.35),_transparent_70%)] blur-3xl animate-[float_10s_ease-in-out_infinite]" />

      <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6">

        <Card className="border-white/70 bg-white/80 shadow-[0_30px_60px_-40px_rgba(209,0,108,0.7)] backdrop-blur">
          <CardContent className="flex flex-col gap-6 p-6 md:p-8">
            <Countdown targetIso="2026-02-03T13:00:00.000Z" />
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
