"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toPng } from "html-to-image";

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
    {
      name: "Instagram",
      color: "#E4405F",
      href: `https://www.instagram.com/`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      color: "#000000",
      href: `https://www.tiktok.com/`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
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

export default function AppreciationExp() {
  const [phase, setPhase] = useState<
    "envelope" | "opening" | "opened" | "card" | "content"
  >("envelope");
  const cardRef = useRef<HTMLDivElement>(null);

  const greeting = "Tuyết thân mến,";
  const message =
    "Đằng sau sự chuyển mình mạnh mẽ của CIO là niềm tin và sự đồng hành bền bỉ từ Trang và SPS. CIO không thể đi xa đến vậy nếu thiếu sự tin tưởng và hỗ trợ kịp thời từ Trang, từ việc chia sẻ dữ liệu merchants, ủng hộ các sản phẩm mới, đến việc trực tiếp giới thiệu sản phẩm của CIO, đọc và áp dụng các báo cáo nghiên cứu. Trang cũng thường xuyên đồng hành cùng CIO với vai trò giám khảo và diễn giả, góp phần kết nối insight với bài toán thực tiễn và nâng tầm giá trị CIO trong tổ chức. \n  \n Trang luôn toát ra một nguồn năng lượng tích cực và sự chỉnh chu rất rõ nét trong mọi sản phẩm mình làm, từ những bản kế hoạch năm dài (vâng rất dài) và chi tiết, đến cách tổ chức các cuộc thi và sự kiện nội bộ của SPS. Trang là nguồn cảm hứng cho business head ở sự bền bỉ và quyết liệt trong các dự án lớn, đồng thời cũng mang lại tinh thần hứng khởi cho đội ngũ qua những hoạt động gắn kết, từ các trận “quậy banh panda” cho đến sân khấu Offsite hay M15. \n  \n Những buổi họp business của SPS đôi khi truyền cảm hứng, đôi khi tạo áp lực, nhưng CIO tin rằng chính phong cách lãnh đạo đó đã góp phần quan trọng giúp SPS đạt được những kết quả tích cực, từ Offline Payment trước đây cho đến Soundbox ở hiện tại. CIO cũng trân trọng việc Trang luôn gần gũi, chia sẻ với các thành viên CIO về quản lý, về cơ hội phát triển, và thường xuyên đồng hành cùng CIO trong các hoạt động chung như CBMC. \n  \n CIO thật sự biết ơn sự tin tưởng, nâng đỡ và ủng hộ cả về tinh thần lẫn tài chính (😛) mà Trang dành cho CIO. Hình ảnh Trang, một người lãnh đạo giỏi, một “vận động viên đa môn” xuất sắc, một diễn giả duyên dáng và một đồng nghiệp đáng tin cậy, luôn là nguồn cảm hứng để đội ngũ CIO nỗ lực hơn mỗi ngày. \n  \n Chúc cho năm 2026 của Trang và của SPS thật rực rỡ. Và như Trang đã biết, bất cứ khi nào SPS cần, CIO luôn sẵn sàng đồng hành và hỗ trợ trong mọi “trận đánh”";
  const signature = "Anh Khang";

  const greetingTw = { displayed: greeting, done: true };
  const messageTw = { displayed: message, done: true };
  const signatureTw = { displayed: signature, done: true };

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
      link.download = "thu-cam-on.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      el.style.width = prevWidth;
      el.style.maxWidth = prevMaxWidth;
    }
  };

  // Auto-open after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("opening");
      setTimeout(() => setPhase("opened"), 800);
      setTimeout(() => setPhase("card"), 1600);
      setTimeout(() => setPhase("content"), 2400);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#f5f0eb] px-4 py-8">
      {/* Envelope */}
      <div
        className="w-full max-w-lg transition-all duration-1000"
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
        className="w-full max-w-lg transition-all duration-1000 ease-out"
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

          {/* Message */}
          <div className="px-8 pb-8 pt-2">
            <p
              className="mb-4 text-xl text-[#1a2a5e]"
              style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
              {greetingTw.displayed}
            </p>
            <p
              className="mb-6 whitespace-pre-line text-base leading-relaxed text-[#1a2a5e]"
              style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
              {messageTw.displayed}
            </p>
            <p
              className="mt-6 text-center text-xl leading-relaxed"
              style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
              <span className="text-[#d1006c] italic">
                Thank you for being one of the reasons
              </span>
              <br />
              <span className="text-[#1a2a5e] font-bold italic">
                that make CIO truly special
              </span>
            </p>
            <p
              className="mt-4 text-right text-xl font-semibold italic text-[#1a2a5e]"
              style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
              {signatureTw.displayed}
            </p>
          </div>
        </div>
        {signatureTw.done && (
          <div className="mt-5 flex flex-col items-center gap-4">
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
            <Link
              href="/appreciation"
              className="rounded-full bg-[#1a2a5e] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#d1006c] hover:shadow-lg">
              Khám phá các lời gửi gắm khác
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
