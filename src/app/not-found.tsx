import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#ffe1ee,_#fff6fa_55%,_#fff8fc)] px-6">
      <Card className="w-full max-w-lg border-white/70 bg-white/85 shadow-[0_30px_60px_-40px_rgba(209,0,108,0.7)] backdrop-blur">
        <CardContent className="flex flex-col gap-4 p-6 text-center md:p-8">
          <h1 className="text-3xl font-semibold text-[color:var(--momo-ink)] font-[var(--font-display)]">
            This gift is still sealed.
          </h1>
          <p className="text-sm text-[color:var(--momo-ink)] opacity-70 md:text-base">
            We could not find that present ID. Double-check your link or head
            back to the countdown.
          </p>
          <Link
            href="/"
            className="rounded-full bg-[color:var(--momo-pink)] px-5 py-2 text-sm font-semibold text-white"
          >
            Back to countdown
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
