"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toPng } from "html-to-image";
import data from "@/data.json";

const calendar = {
  month: "FEBRUARY 2026",
  days: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
  weeks: [
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27, 28],
  ],
  highlightDay: 3,
};

function ShareMenu() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socials = [
    {
      name: "Facebook",
      color: "#1877F2",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm text-[#1a2a5e]/70 transition-colors hover:text-[#d1006c]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        Chia sẻ
      </button>
      {open && (
        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5">
          <div className="flex items-center gap-1">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.name}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-110"
                style={{ color: s.color }}>
                {s.icon}
              </a>
            ))}
            <button
              onClick={handleCopy}
              title="Copy link"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#1a2a5e]/60 transition-transform hover:scale-110 hover:text-[#1a2a5e]">
              {copied ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AppreciationPage() {
  const params = useParams();
  const item = data.find((d) => d.id === params.id);

  const [phase, setPhase] = useState<
    "envelope" | "opening" | "opened" | "card" | "content"
  >("envelope");
  const cardRef = useRef<HTMLDivElement>(null);

  const greeting = item?.open ?? "";
  const message = item?.body ?? "";
  const signature = item?.end ?? "";

  const thankYouText =
    "Thank you for being one of the reasons\nthat make CIO truly special";
  const sections = [greeting, message, thankYouText, signature];
  const cumLengths = sections.reduce<number[]>((acc, s, i) => {
    acc.push((i > 0 ? acc[i - 1] : 0) + s.length);
    return acc;
  }, []);
  const totalLength = cumLengths[cumLengths.length - 1] || 0;

  const [charIndex, setCharIndex] = useState(0);
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    if (phase !== "content") return;
    let idx = 0;
    setCharIndex(0);
    setTypingDone(false);
    const interval = setInterval(() => {
      idx++;
      setCharIndex(idx);
      if (idx >= totalLength) {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [phase, totalLength]);

  const displayedSections = sections.map((s, i) => {
    const start = i > 0 ? cumLengths[i - 1] : 0;
    const charsInto = charIndex - start;
    if (charsInto <= 0) return "";
    return s.slice(0, charsInto);
  });

  const isCardVisible = phase === "card" || phase === "content";

  const handleDownload = async () => {
    if (!cardRef.current) return;
    const el = cardRef.current;
    const prevWidth = el.style.width;
    const prevMaxWidth = el.style.maxWidth;
    try {
      el.style.width = "600px";
      el.style.maxWidth = "600px";

      const dataUrl = await toPng(el, {
        pixelRatio: 3,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = "cio-yep-2026-appreciation.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      el.style.width = prevWidth;
      el.style.maxWidth = prevMaxWidth;
    }
  };

  const [showThankYou, setShowThankYou] = useState(true);

  // Auto-open after 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("opening");
      setTimeout(() => setPhase("opened"), 800);
      setTimeout(() => setPhase("card"), 1600);
      setTimeout(() => {
        setShowThankYou(false);
      }, 2600); // 1s after card appears
      setTimeout(() => setPhase("content"), 3100); // fade out 500ms then start typing
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!item) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f5f0eb] px-4 py-8">
        <div className="text-center">
          <p className="text-2xl text-[#1a2a5e] mb-4">
            Không tìm thấy lời gửi gắm này
          </p>
          <Link
            href="/appreciation"
            className="rounded-full bg-[#1a2a5e] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#d1006c] hover:shadow-lg">
            Quay lại
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#f5f0eb] px-4 py-8">
      {/* Envelope */}
      <div
        className="w-full max-w-lg md:max-w-[800px] transition-all duration-1000"
        style={{
          opacity: isCardVisible ? 0 : 1,
          pointerEvents: isCardVisible ? "none" : "auto",
          position: isCardVisible ? "absolute" : "relative",
          animation:
            phase === "envelope" ? "wiggle 1.5s ease-in-out infinite" : "none",
          perspective: "800px",
        }}>
        <div className="relative w-full">
          {/* Envelope body */}
          <img
            src="/envelop-body.svg"
            alt="Envelope"
            className="w-full h-auto drop-shadow-2xl"
            draggable={false}
          />

          {/* Envelope flap (triangle, flips open) */}
          <div
            className="absolute top-0 left-0 right-0 origin-top"
            style={{
              transformStyle: "preserve-3d",
              transform:
                phase === "opening" || phase === "opened"
                  ? "rotateX(180deg)"
                  : "rotateX(0deg)",
              transition: "transform 800ms cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: phase === "opening" || phase === "opened" ? 0 : 10,
            }}>
            <img
              src="/envelop-flap.svg"
              alt=""
              className="w-full h-auto"
              draggable={false}
            />
          </div>

          {/* CIO Logo - small, top center on the flap */}
          <div
            className="absolute left-1/2 top-[5%] -translate-x-1/2 transition-opacity duration-500"
            style={{
              zIndex: 12,
              opacity: phase === "envelope" ? 1 : 0,
            }}>
            <Image
              src="/assets/cio_logo.png"
              alt="CIO Logo"
              width={48}
              height={24}
              className="h-4 w-auto"
            />
          </div>

          {/* Stamp - at the tip of the flap */}
          <div
            className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 w-[14%] transition-opacity duration-500"
            style={{
              zIndex: 11,
              opacity: phase === "envelope" ? 1 : 0,
            }}>
            <img
              src="/stamp.svg"
              alt="Stamp"
              className="w-full h-auto drop-shadow-md"
              draggable={false}
            />
          </div>

          {/* "To: Someone Special" text - centered */}
          <div
            className="absolute bottom-[10%] left-0 right-0 text-center transition-opacity duration-500"
            style={{
              zIndex: 11,
              opacity: phase === "envelope" ? 1 : 0,
            }}>
            <p style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
              <span className="text-xl text-[#1a2a5e] italic">To: </span>
              <span className="text-2xl text-[#d1006c] italic">
                Someone Special
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Card - fade in */}
      <div
        className="w-full max-w-lg md:max-w-[800px] transition-all duration-1000 ease-out"
        style={{
          opacity: isCardVisible ? 1 : 0,
          pointerEvents: isCardVisible ? "auto" : "none",
          position: isCardVisible ? "relative" : "absolute",
        }}>
        <div
          ref={cardRef}
          className="overflow-hidden rounded-lg bg-white shadow-2xl">
          {/* Logos */}
          <div className="flex items-center justify-end gap-3 px-8 pt-8">
            <Image
              src="/assets/momo_logo.png"
              alt="MoMo Logo"
              width={48}
              height={48}
              className="h-10 w-auto"
            />
            <Image
              src="/assets/cio_logo.png"
              alt="CIO Logo"
              width={80}
              height={40}
              className="h-7 w-auto"
            />
          </div>

          {/* Thank you + Calendar (shows first, then fades out) */}
          <div
            className="transition-all duration-500"
            style={{
              opacity: showThankYou ? 1 : 0,
              maxHeight: showThankYou ? "500px" : "0px",
              overflow: "hidden",
              transition: "opacity 500ms ease-out, max-height 500ms ease-out",
            }}>
            <div className="flex px-8 py-8">
              <div className="flex w-16 shrink-0 items-center justify-center">
                <span
                  className="-rotate-90 whitespace-nowrap text-5xl italic text-[#1a2a5e]"
                  style={{
                    fontFamily: "var(--font-dancing-script), cursive",
                  }}>
                  Thank you
                </span>
              </div>
              <div className="flex-1 pl-3">
                <h3 className="mb-3 text-center text-sm font-bold tracking-widest text-[#1a2a5e]">
                  {calendar.month}
                </h3>
                <table className="w-full text-center text-xs">
                  <thead>
                    <tr>
                      {calendar.days.map((day) => (
                        <th
                          key={day}
                          className="pb-2 font-semibold text-[#1a2a5e]">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {calendar.weeks.map((week, i) => (
                      <tr key={i}>
                        {week.map((day) => (
                          <td key={day} className="py-1 text-[#1a2a5e]">
                            {day === calendar.highlightDay ? (
                              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#d1006c] text-xs font-bold text-[#d1006c]">
                                {day}
                              </span>
                            ) : (
                              day
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Decorative leaf */}
            <div className="flex justify-end px-8 pb-2">
              <svg
                width="80"
                height="40"
                viewBox="0 0 80 40"
                fill="none"
                className="text-[#8a9a7a] opacity-60">
                <path
                  d="M5 35 Q20 20 40 22 Q60 24 75 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M40 22 Q38 15 42 8"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M40 22 Q45 16 50 12"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M40 22 Q35 18 33 12"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M55 15 Q58 10 62 7"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M55 15 Q52 10 50 6"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M25 28 Q22 22 24 16"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M25 28 Q28 23 32 18"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          {/* Message (appears after thank you fades out) */}
          {phase === "content" && (
            <div className="px-8 pb-8 pt-8">
              {displayedSections[0] && (
                <p
                  className="mb-4 text-xl text-[#1a2a5e]"
                  style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
                  {displayedSections[0]}
                </p>
              )}
              {displayedSections[1] && (
                <div
                  className="mb-6 text-base leading-relaxed text-[#1a2a5e]"
                  style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
                  {displayedSections[1]
                    .split("\n")
                    .filter(Boolean)
                    .map((paragraph: string, i: number) => (
                      <p key={i} className="mb-3">
                        {paragraph.trim()}
                      </p>
                    ))}
                </div>
              )}
              {displayedSections[2] && (
                <p
                  className="mt-6 text-center text-md leading-relaxed"
                  style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
                  {displayedSections[2]
                    .split("\n")
                    .map((line: string, i: number) => (
                      <span
                        key={i}
                        className={
                          i === 0
                            ? "text-[#d1006c] italic"
                            : "text-[#1a2a5e] font-bold italic"
                        }>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                </p>
              )}
              {displayedSections[3] && (
                <p
                  className="mt-4 text-right text-xl font-semibold italic text-[#1a2a5e]"
                  style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
                  {displayedSections[3]}
                </p>
              )}
            </div>
          )}
        </div>
        {typingDone && (
          <div className="mt-5 flex flex-col items-center gap-4 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center gap-4">
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 text-sm text-[#1a2a5e]/70 transition-colors hover:text-[#d1006c]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Tải xuống
              </button>
              <span className="text-[#1a2a5e]/20">|</span>
              <ShareMenu />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="rounded-full border border-[#1a2a5e] px-6 py-3 text-sm font-medium text-[#1a2a5e] transition-all hover:bg-[#1a2a5e] hover:text-white hover:shadow-lg">
                Xem lại
              </button>
              <Link
                href="/appreciation"
                className="rounded-full bg-[#1a2a5e] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#d1006c] hover:shadow-lg">
                Khám phá thêm
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
