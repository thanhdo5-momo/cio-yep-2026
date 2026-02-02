"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import data from "@/data.json";
import teamData from "@/team.json";

type Phase = "idle" | "shuffling" | "reveal";

const TEAM_COLORS = [
  { bg: "from-pink-500 to-rose-500", light: "bg-pink-50", border: "border-pink-300", text: "text-pink-700", badge: "bg-pink-500" },
  { bg: "from-violet-500 to-purple-500", light: "bg-violet-50", border: "border-violet-300", text: "text-violet-700", badge: "bg-violet-500" },
  { bg: "from-amber-500 to-orange-500", light: "bg-amber-50", border: "border-amber-300", text: "text-amber-700", badge: "bg-amber-500" },
  { bg: "from-emerald-500 to-teal-500", light: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-700", badge: "bg-emerald-500" },
];

function normalizeName(name: string) {
  return name
    .normalize("NFC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function findUserData(memberName: string) {
  const normalized = normalizeName(memberName);
  return data.find((u) => normalizeName(u.name) === normalized);
}

function DefaultAvatar({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="rounded-full"
    >
      <rect width="40" height="40" rx="20" fill="#E0E0E0" />
      <circle cx="20" cy="16" r="7" fill="#BDBDBD" />
      <ellipse cx="20" cy="34" rx="12" ry="10" fill="#BDBDBD" />
    </svg>
  );
}

function Avatar({
  member,
  size = 56,
  className = "",
}: {
  member: string;
  size?: number;
  className?: string;
}) {
  const userData = findUserData(member);
  const hasImage = userData?.image && userData.image !== "undefined";

  if (!hasImage) {
    return (
      <div
        className={`rounded-full overflow-hidden flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <DefaultAvatar size={size} />
      </div>
    );
  }

  return (
    <div
      className={`rounded-full overflow-hidden flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={`/chibi/${userData!.image}`}
        alt={member}
        width={size}
        height={size}
        className="object-cover w-full h-full"
      />
    </div>
  );
}

// All unique members from team data
const allMembers = teamData.teams.flatMap((t) => t.members);

export default function GameMatchingPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [rotation, setRotation] = useState(0);
  const [shufflePositions, setShufflePositions] = useState<
    { x: number; y: number; scale: number; rotation: number }[]
  >([]);
  const [revealedTeams, setRevealedTeams] = useState(0);

  // Rotate avatars in idle phase
  useEffect(() => {
    if (phase !== "idle") return;
    const interval = setInterval(() => {
      setRotation((r) => r + 0.3);
    }, 16);
    return () => clearInterval(interval);
  }, [phase]);

  // Shuffle animation
  useEffect(() => {
    if (phase !== "shuffling") return;

    const interval = setInterval(() => {
      setShufflePositions(
        allMembers.map(() => ({
          x: (Math.random() - 0.5) * 300,
          y: (Math.random() - 0.5) * 300,
          scale: 0.5 + Math.random() * 0.8,
          rotation: Math.random() * 720 - 360,
        }))
      );
    }, 150);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setPhase("reveal");
      setRevealedTeams(0);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [phase]);

  // Staggered team reveal
  useEffect(() => {
    if (phase !== "reveal") return;
    if (revealedTeams >= teamData.teams.length) return;

    const timeout = setTimeout(() => {
      setRevealedTeams((r) => r + 1);
    }, 500);

    return () => clearTimeout(timeout);
  }, [phase, revealedTeams]);

  const handleSplit = useCallback(() => {
    setPhase("shuffling");
    setShufflePositions(
      allMembers.map(() => ({
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
      }))
    );
  }, []);

  const handleReset = useCallback(() => {
    setPhase("idle");
    setRevealedTeams(0);
    setShufflePositions([]);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[var(--momo-cream)] via-white to-pink-50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-pink-200/30 blur-3xl"
          style={{ animation: "float 9s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-violet-200/30 blur-3xl"
          style={{ animation: "float 7s ease-in-out infinite 1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-amber-200/20 blur-3xl"
          style={{ animation: "float 10s ease-in-out infinite 2s" }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center pt-8 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--momo-ink)] font-display">
          Game Chia Đội
        </h1>
        <p className="text-[var(--momo-ink)]/60 mt-1 text-sm md:text-base">
          CIO Year End Party 2026
        </p>
      </div>

      {/* IDLE: Rotating circle of avatars + button */}
      {phase === "idle" && (
        <div className="relative z-10 flex items-center justify-center" style={{ height: "calc(100vh - 140px)" }}>
          <div className="relative" style={{ width: 500, height: 500 }}>
            {/* Avatars in orbit */}
            {allMembers.map((member, i) => {
              const angle = (i / allMembers.length) * Math.PI * 2 + (rotation * Math.PI) / 180;
              const radius = 200;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <div
                  key={member}
                  className="absolute transition-none"
                  style={{
                    left: 250 + x - 28,
                    top: 250 + y - 28,
                  }}
                >
                  <div className="group relative">
                    <div className="ring-2 ring-white shadow-lg rounded-full hover:scale-125 transition-transform duration-200 hover:z-50">
                      <Avatar member={member} size={56} />
                    </div>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[var(--momo-ink)] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      {member}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Center button */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <button
                onClick={handleSplit}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--momo-pink)] to-[var(--momo-rose)] text-white font-bold text-lg shadow-2xl hover:shadow-pink-500/50 hover:scale-110 transition-all duration-300 cursor-pointer active:scale-95"
                style={{ animation: "glow 2s ease-in-out infinite" }}
              >
                Chia Đội!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHUFFLING: Chaotic animation */}
      {phase === "shuffling" && (
        <div className="relative z-10 flex items-center justify-center" style={{ height: "calc(100vh - 140px)" }}>
          <div className="relative" style={{ width: 500, height: 500 }}>
            {allMembers.map((member, i) => {
              const pos = shufflePositions[i] || { x: 0, y: 0, scale: 1, rotation: 0 };
              return (
                <div
                  key={member}
                  className="absolute transition-all duration-150 ease-out"
                  style={{
                    left: 250 + pos.x - 24,
                    top: 250 + pos.y - 24,
                    transform: `scale(${pos.scale}) rotate(${pos.rotation}deg)`,
                  }}
                >
                  <div className="ring-2 ring-white shadow-lg rounded-full">
                    <Avatar member={member} size={48} />
                  </div>
                </div>
              );
            })}

            {/* Center spinner */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--momo-pink)] to-[var(--momo-rose)] flex items-center justify-center shadow-2xl animate-spin">
                <span className="text-white text-3xl">&#x2728;</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REVEAL: Team cards */}
      {phase === "reveal" && (
        <div className="relative z-10 px-4 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {teamData.teams.map((team, teamIdx) => {
              const color = TEAM_COLORS[teamIdx];
              const isVisible = teamIdx < revealedTeams;

              return (
                <div
                  key={team.name}
                  className={`rounded-2xl border-2 ${color.border} ${color.light} p-5 transition-all duration-700 ${
                    isVisible
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-12 scale-95"
                  }`}
                >
                  {/* Team header */}
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold text-sm mb-4 bg-gradient-to-r ${color.bg}`}>
                    <span className="text-lg">
                      {teamIdx === 0 && "🔥"}
                      {teamIdx === 1 && "💜"}
                      {teamIdx === 2 && "🌟"}
                      {teamIdx === 3 && "🍀"}
                    </span>
                    {team.name}
                  </div>

                  {/* Members list */}
                  <div className="space-y-2">
                    {team.members.map((member, memberIdx) => (
                      <div
                        key={member}
                        className={`flex items-center gap-3 p-2 rounded-xl bg-white/70 shadow-sm transition-all duration-500 ${
                          isVisible
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-8"
                        }`}
                        style={{
                          transitionDelay: isVisible
                            ? `${memberIdx * 80 + 200}ms`
                            : "0ms",
                        }}
                      >
                        <div className="ring-2 ring-white shadow-sm rounded-full">
                          <Avatar member={member} size={40} />
                        </div>
                        <span className={`text-sm font-medium ${color.text}`}>
                          {member}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reset button */}
          {revealedTeams >= teamData.teams.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleReset}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[var(--momo-pink)] to-[var(--momo-rose)] text-white font-bold shadow-lg hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                Chơi lại
              </button>
            </div>
          )}
        </div>
      )}

      {/* Confetti overlay during reveal */}
      {phase === "reveal" && <ConfettiOverlay />}
    </main>
  );
}

function ConfettiOverlay() {
  const [particles, setParticles] = useState<
    { id: number; x: number; delay: number; color: string; size: number; duration: number }[]
  >([]);

  useEffect(() => {
    const colors = ["#d1006c", "#ff6aa7", "#ff4d7d", "#8b5cf6", "#f59e0b", "#10b981", "#ec4899", "#6366f1"];
    const ps = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 10,
      duration: 2 + Math.random() * 3,
    }));
    setParticles(ps);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
