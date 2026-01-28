import { Countdown } from "@/components/countdown";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FireworksBackground } from "@/components/ui/fireworks-background";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/assets/image.png')] bg-[length:100%_100%] bg-center bg-no-repeat md:hidden" />

      <FireworksBackground
        className="pointer-events-auto z-0"
        population={50}
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
        fireworkSpeed={{ min: 40, max: 80 }}
        particleSize={{ min: 2, max: 5 }}
      />
      <div className="pointer-events-none absolute -top-24 right-8 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(209,0,108,0.45),_transparent_70%)] blur-2xl animate-[float_9s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute left-10 top-1/3 h-52 w-52 rounded-full bg-[radial-gradient(circle,_rgba(255,106,167,0.4),_transparent_70%)] blur-2xl animate-[float_7s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute bottom-10 right-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(255,77,125,0.35),_transparent_70%)] blur-3xl animate-[float_10s_ease-in-out_infinite]" />

      <main className="fixed bottom-[10%] left-0 right-0 z-10 flex flex-col gap-6 px-6 md:bottom-[10%] md:gap-8">
        <Card className="mx-auto w-full max-w-6xl border-white/70 bg-white/80 shadow-[0_30px_60px_-40px_rgba(209,0,108,0.7)] backdrop-blur">
          <CardContent className="flex flex-col gap-6 p-6 md:p-8">
            <Countdown targetIso="2026-02-03T13:00:00.000Z" />
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-4">
          <Image
            src="/assets/momo_logo.png"
            alt="MoMo Logo"
            width={80}
            height={80}
            className="h-12 w-auto md:h-16"
          />
          <Image
            src="/assets/white_cio_logo.png"
            alt="CIO Logo"
            width={80}
            height={80}
            className="h-12 w-auto md:h-16"
          />
        </div>
      </main>
    </div>
  );
}
