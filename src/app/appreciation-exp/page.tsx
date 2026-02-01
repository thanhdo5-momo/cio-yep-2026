"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

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

const TYPEWRITER_SPEED = 15;

function useTypewriter(text: string, start: boolean, speed = TYPEWRITER_SPEED) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!start) return;
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, start, speed]);

  return { displayed, done };
}

export default function AppreciationExp() {
  const [phase, setPhase] = useState<
    "envelope" | "opening" | "opened" | "card" | "content"
  >("envelope");

  const greeting = "Tuyết thân mến,";
  const message =
    "Chị thật sự biết ơn Tuyết vì đã luôn ở bên cạnh chị trong cả những giai đoạn thuận lợi lẫn những lúc khó khăn nhất. Có những thời điểm chị rơi vào trạng thái ngợp và mệt mỏi vì áp lực công việc và trách nhiệm, và chính sự lắng nghe, chia sẻ rất chân thành của Tuyết đã giúp chị có thêm điểm tựa để đi tiếp. Khi Tuyết quay trở lại làm việc, em không chỉ phải học lại và học thêm rất nhiều điều mới trong công việc, mà còn đồng thời đảm đương một vai trò hoàn toàn mới và đầy thử thách là làm mẹ. Trong bối cảnh đó, Tuyết vẫn giữ cho mình tinh thần trách nhiệm cao, nỗ lực thích nghi và hoàn thành công việc một cách nghiêm túc. Sự hiện diện và đóng góp của em đã giúp team dần ổn định hơn, và giúp chị thoát khỏi cảm giác phải gồng mình xử lý mọi thứ một mình. \nTừ góc nhìn của chị, em sở hữu một tiềm năng rất lớn, vượt xa những gì em đang tự nhìn nhận. Chị tin rằng nếu tiếp tục tin vào chính mình, Tuyết có thể phát triển và tỏa sáng ở bất kỳ đâu.";
  const signature = "Anh Khang";

  const greetingTw = useTypewriter(greeting, phase === "content", 20);
  const messageTw = useTypewriter(message, greetingTw.done, TYPEWRITER_SPEED);
  const signatureTw = useTypewriter(signature, messageTw.done, 25);

  const isCardVisible = phase === "card" || phase === "content";

  const handleEnvelopeClick = useCallback(() => {
    if (phase !== "envelope") return;
    setPhase("opening");
    setTimeout(() => setPhase("opened"), 800);
    setTimeout(() => setPhase("card"), 1400);
    setTimeout(() => setPhase("content"), 2200);
  }, [phase]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#f5f0eb] px-4 py-8">
      {/* Envelope */}
      <div
        className="w-full max-w-lg cursor-pointer transition-all duration-700"
        onClick={handleEnvelopeClick}
        style={{
          perspective: "1200px",
          opacity: isCardVisible ? 0 : 1,
          transform: isCardVisible ? "scale(0.9)" : "scale(1)",
          pointerEvents: isCardVisible ? "none" : "auto",
          position: isCardVisible ? "absolute" : "relative",
          animation: phase === "envelope" ? "wiggle 1.5s ease-in-out infinite" : "none",
        }}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-b-lg rounded-t-sm bg-gradient-to-b from-[#e8d5c4] to-[#d4b896] shadow-2xl">
          {/* Inner letter peek */}
          <div className="absolute inset-x-3 top-3 bottom-3 rounded bg-white/40" />

          {/* Envelope V-shape front */}
          <svg
            className="absolute bottom-0 left-0 right-0"
            viewBox="0 0 400 150"
            preserveAspectRatio="none">
            <polygon points="0,0 200,150 400,0 400,150 0,150" fill="#c9a882" />
            <polygon
              points="0,0 200,120 400,0"
              fill="#d4b896"
              stroke="#b89970"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        {/* Envelope flap */}
        <div
          className="absolute top-0 left-0 right-0 origin-top"
          style={{
            transformStyle: "preserve-3d",
            transform:
              phase === "opening" || phase === "opened"
                ? "rotateX(180deg)"
                : "rotateX(0deg)",
            transition: "transform 800ms ease-in-out",
            zIndex: phase === "opening" || phase === "opened" ? 0 : 10,
          }}>
          <svg viewBox="0 0 400 170" className="w-full">
            <polygon
              points="0,0 200,170 400,0"
              fill="#d4b896"
              stroke="#b89970"
              strokeWidth="0.5"
            />
          </svg>
          {/* Seal - CIO logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/4">
            <Image
              src="/assets/cio_logo.png"
              alt="CIO Logo"
              width={60}
              height={30}
              className="h-8 w-auto drop-shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-lg transition-all duration-700"
        style={{
          opacity: isCardVisible ? 1 : 0,
          transform: isCardVisible ? "translateY(0)" : "translateY(40px)",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: isCardVisible ? "auto" : "none",
          position: isCardVisible ? "relative" : "absolute",
        }}>
        <div className="overflow-hidden rounded-lg bg-white shadow-2xl">
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

          {/* Thank you + Calendar */}
          <div className="flex px-8 pt-5">
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
          <div className="flex justify-end px-8">
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

          {/* Message - Typewriter */}
          <div className="px-8 pb-8 pt-2">
            <p
              className="mb-4 min-h-8 text-xl text-[#1a2a5e]"
              style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
              {phase === "content" ? greetingTw.displayed : ""}
              {!greetingTw.done && phase === "content" && (
                <span className="animate-pulse">|</span>
              )}
            </p>
            <p
              className="mb-6 min-h-20 whitespace-pre-line text-base leading-relaxed text-[#1a2a5e]"
              style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
              {greetingTw.done ? messageTw.displayed : ""}
              {greetingTw.done && !messageTw.done && (
                <span className="animate-pulse">|</span>
              )}
            </p>
            <p
              className="min-h-8 text-right text-xl font-semibold italic text-[#1a2a5e]"
              style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
              {messageTw.done ? signatureTw.displayed : ""}
              {messageTw.done && !signatureTw.done && (
                <span className="animate-pulse">|</span>
              )}
            </p>

            {signatureTw.done && (
              <div className="mt-8 flex justify-center">
                <Link
                  href="/appreciation"
                  className="rounded-full bg-[#1a2a5e] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#d1006c] hover:shadow-lg"
                >
                  Khám phá các lời gửi gắm khác
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
