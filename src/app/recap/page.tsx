"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Starting directly with YEP event - removed throughout_the_year section

// Media from within_yep (images and videos) - shuffled for variety
const withinYepMedia = [
  { src: "/recap/within_yep/IMG_3535.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_3545.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_7500.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_3551.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_3556.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_3557.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_7501.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_3561.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_3566.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_3568.JPG", type: "image" },
  { src: "/recap/within_yep/MVI_3520.MP4", type: "video" },
  { src: "/recap/within_yep/IMG_3575.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_3576.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_3578.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_7487.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_3579.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_3588.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_3590.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_3595.JPG", type: "image" },
  { src: "/recap/within_yep/MVI_3644.MP4", type: "video" },
  { src: "/recap/within_yep/IMG_3596.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_3601.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_7503.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_3602.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_3615.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_3619.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_3624.JPG", type: "image" },
  { src: "/recap/within_yep/MVI_3645.MP4", type: "video" },
  { src: "/recap/within_yep/IMG_3638.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_3664.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_7543.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_3682.JPG", type: "image" },
  { src: "/recap/within_yep/IMG_9283.JPG", type: "image" },
] as const;

type Phase = "intro" | "within-yep" | "outro";

export default function RecapPage() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [audioStarted, setAudioStarted] = useState(false);

  // Audio ref - only using On Top of the World throughout
  const musicRef = useRef<HTMLAudioElement>(null);

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fade audio helper
  const fadeAudio = (
    audio: HTMLAudioElement | null,
    fadeIn: boolean,
    duration: number = 1000,
  ) => {
    if (!audio) return;

    const steps = 50;
    const stepTime = duration / steps;
    const volumeStep = 1 / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      if (fadeIn) {
        audio.volume = Math.min(1, currentStep * volumeStep);
      } else {
        audio.volume = Math.max(0, 1 - currentStep * volumeStep);
      }

      currentStep++;

      if (currentStep >= steps) {
        clearInterval(interval);
        if (!fadeIn) {
          audio.pause();
          audio.currentTime = 0;
        }
      }
    }, stepTime);
  };

  // Music control - play throughout all phases
  useEffect(() => {
    if (!mounted || isMuted || !audioStarted) return;

    const audio = musicRef.current;
    if (audio && audio.paused) {
      audio.volume = 0;
      audio.play().catch((error) => {
        console.log("Audio play prevented:", error);
      });
      fadeAudio(audio, true, 1500);
    }
  }, [mounted, audioStarted, isMuted]);

  // Mute/unmute audio
  useEffect(() => {
    if (musicRef.current) {
      if (isMuted) {
        fadeAudio(musicRef.current, false, 500);
      } else if (audioStarted) {
        fadeAudio(musicRef.current, true, 500);
      }
    }
  }, [isMuted, audioStarted]);

  useEffect(() => {
    if (!mounted) return;

    // Intro phase - 3 seconds, then go directly to YEP
    const introTimer = setTimeout(() => {
      setPhase("within-yep");
      setCurrentImageIndex(0);
      setShowTitle(true);
    }, 3000);

    return () => clearTimeout(introTimer);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    if (phase === "within-yep") {
      // Hide title after first image
      if (currentImageIndex === 0 && showTitle) {
        const titleTimer = setTimeout(() => {
          setShowTitle(false);
        }, 1500);
        return () => clearTimeout(titleTimer);
      }

      if (currentImageIndex < withinYepMedia.length) {
        const currentMedia = withinYepMedia[currentImageIndex];
        // Videos stay 3s, images stay 1.5s
        const duration = currentMedia.type === "video" ? 3000 : 1500;

        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            setCurrentImageIndex((prev) => prev + 1);
            setIsVisible(true);
          }, 300);
        }, duration);
        return () => clearTimeout(timer);
      } else {
        // End of recap
        setTimeout(() => {
          setPhase("outro");
        }, 300);
      }
    }
  }, [mounted, phase, currentImageIndex, showTitle]);

  const handleReplay = () => {
    setPhase("intro");
    setCurrentImageIndex(0);
    setIsVisible(true);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-[#f5f0eb]" />
    );
  }

  const handleStartAudio = () => {
    setAudioStarted(true);
    // Start playing On Top of the World
    if (musicRef.current) {
      musicRef.current.volume = 0;
      musicRef.current.play().catch(() => {});
      fadeAudio(musicRef.current, true, 1500);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f5f0eb]">
      {/* Audio Element - On Top of the World throughout */}
      <audio ref={musicRef} loop preload="auto">
        <source src="/music/on_top_of_the_world.mp3" type="audio/mpeg" />
      </audio>

      {/* Start Audio Overlay */}
      {!audioStarted && mounted && (
        <div
          onClick={handleStartAudio}
          className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-[#f5f0eb]">
          <div className="animate-[fadeIn_1s_ease-out] text-center">
            <div className="mb-6 text-6xl">🎵</div>
            <p className="mb-2 text-2xl font-bold text-[#1a2a5e] md:text-3xl">
              Click để bắt đầu
            </p>
            <p className="text-lg text-[#1a2a5e]/70 md:text-xl">
              Nhấn vào bất kỳ đâu để xem recap
            </p>
          </div>
        </div>
      )}

      {/* Music Control Button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="fixed right-6 top-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:scale-110 hover:shadow-xl md:h-14 md:w-14"
        aria-label={isMuted ? "Bật nhạc" : "Tắt nhạc"}>
        {isMuted ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1a2a5e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M11 5 6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d1006c"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M11 5 6 9H2v6h4l5 4V5z" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>

      {/* Intro Phase */}
      {phase === "intro" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
          <div className="animate-[fadeIn_2s_ease-out] text-center">
            <h1 className="mb-4 text-3xl font-bold text-[#1a2a5e] md:text-5xl lg:text-7xl">
              CIO Year End Party 2026
            </h1>
            <p
              className="text-lg font-light text-[#d1006c] md:text-2xl lg:text-3xl"
              style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
              Từ thiệp mời với tình cảm
            </p>
          </div>
          <div className="mt-8 h-1 w-32 animate-[fadeIn_2s_ease-out_1s_backwards] bg-[#d1006c]/60" />
        </div>
      )}

      {/* Within YEP Phase */}
      {phase === "within-yep" && currentImageIndex < withinYepMedia.length && (
        <div className="absolute inset-0 z-10 flex flex-col">
          {currentImageIndex === 0 && (
            <div
              className={`absolute left-1/2 top-8 z-20 -translate-x-1/2 px-6 transition-all duration-700 ${
                showTitle
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-4 opacity-0"
              }`}>
              <h2 className="text-center text-2xl font-bold text-[#1a2a5e] md:text-4xl lg:text-5xl">
                Những khoảnh khắc đáng nhớ
              </h2>
              <p
                className="mt-1 text-center text-base text-[#d1006c] md:text-xl lg:text-2xl"
                style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
                YEP 2026 - Cùng nhau tạo nên kỷ niệm
              </p>
            </div>
          )}

          <div className="relative flex flex-1 items-center justify-center">
            <div
              className={`relative h-full w-full transition-all duration-500 ${
                isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`}>
              {withinYepMedia[currentImageIndex].type === "video" ? (
                <video
                  key={withinYepMedia[currentImageIndex].src}
                  src={withinYepMedia[currentImageIndex].src}
                  autoPlay
                  muted
                  playsInline
                  loop
                  className="h-full w-full object-contain"
                />
              ) : (
                <Image
                  src={withinYepMedia[currentImageIndex].src}
                  alt={`YEP moment ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Outro Phase */}
      {phase === "outro" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 px-6">
          <div className="animate-[fadeIn_2s_ease-out] text-center">
            <p
              className="mb-4 text-2xl text-[#d1006c] md:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
              Thank you for being one of the reasons
            </p>
            <p
              className="mb-8 text-2xl text-[#d1006c] md:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
              that make CIO truly special
            </p>
            <h2 className="mb-6 text-3xl font-bold text-[#1a2a5e] md:text-5xl lg:text-7xl">
              Happy New Year! 🎉
            </h2>
          </div>

          <div className="mt-8 flex flex-col gap-4 animate-[fadeIn_2s_ease-out_0.5s_backwards] sm:flex-row">
            <Button
              onClick={handleReplay}
              size="lg"
              className="border-2 border-[#1a2a5e] bg-white px-8 py-6 text-lg font-semibold text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white">
              🔄 Xem lại
            </Button>
            <Button
              onClick={() =>
                window.open(
                  "https://drive.google.com/drive/folders/1OCaaTFQsgBGFTxFkyoPhMAsJKxpMJNT4",
                  "_blank",
                )
              }
              size="lg"
              className="bg-[#d1006c] px-8 py-6 text-lg font-semibold text-white hover:bg-[#d1006c]/90">
              📸 Xem các bức ảnh trong YEP
            </Button>
          </div>
        </div>
      )}

      {/* Progress indicator */}
      {phase === "within-yep" && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center">
          <div className="max-w-[90vw] overflow-x-auto scrollbar-hide">
            <div className="flex gap-1.5 px-4 md:gap-2">
              {withinYepMedia.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-5 shrink-0 rounded-full transition-all duration-300 md:w-8 ${
                    i === currentImageIndex ? "bg-[#d1006c]" : "bg-[#1a2a5e]/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
