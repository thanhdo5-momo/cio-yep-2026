"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Images from throughout_the_year
const throughoutYearImages = [
  {
    src: "/recap/throughout_the_year/Innovation Contest 2022.jpg",
    caption: "Innovation Contest 2022 - Nơi những ý tưởng được thắp sáng",
  },
  {
    src: "/recap/throughout_the_year/Giải Hackathon (chung vài bạn Team khác).jpg",
    caption: "Hackathon - Cùng nhau vượt qua thử thách",
  },
  {
    src: "/recap/throughout_the_year/Cúp Innovation Leader of The year.jpg",
    caption: "Innovation Leader of The Year - Niềm tự hào của chúng ta",
  },
  {
    src: "/recap/throughout_the_year/MoMo Challenge 2024_Giải KK.jpg",
    caption: "MoMo Challenge 2024 - Đam mê không ngừng nghỉ",
  },
  {
    src: "/recap/throughout_the_year/IMG_2562.JPG",
    caption: "CBMC 2025 - Nơi những ý tưởng được thắp sáng",
  },
  {
    src: "/recap/throughout_the_year/IMG_7085 5.JPG",
    caption: "Team building - Gắn kết mọi thành viên",
  },
  {
    src: "/recap/throughout_the_year/IMG_9282.JPG",
    caption: "Những chiến thắng đáng tự hào",
  },
  {
    src: "/recap/throughout_the_year/IMG_9283.JPG",
    caption: "Hành trình 2025 đầy ắp kỷ niệm",
  },
];

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
] as const;

type Phase =
  | "intro"
  | "throughout-year"
  | "transition"
  | "within-yep"
  | "outro";

export default function RecapPage() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showTitle, setShowTitle] = useState(true);

  // Audio refs
  const chillMusicRef = useRef<HTMLAudioElement>(null);
  const hallOfFameRef = useRef<HTMLAudioElement>(null);
  const onTopRef = useRef<HTMLAudioElement>(null);

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

  // Music control based on phase
  useEffect(() => {
    if (!mounted || isMuted) return;

    const playMusic = (ref: React.RefObject<HTMLAudioElement | null>) => {
      const audio = ref.current;
      if (audio) {
        audio.volume = 0;
        audio.play().catch((error) => {
          // Silently handle autoplay restrictions or missing files
          console.log("Audio play prevented:", error);
        });
        fadeAudio(audio, true, 1500);
      }
    };

    const stopMusic = (ref: React.RefObject<HTMLAudioElement | null>) => {
      const audio = ref.current;
      if (audio) {
        fadeAudio(audio, false, 1000);
      }
    };

    // Stop all music first
    [chillMusicRef, hallOfFameRef, onTopRef].forEach((ref) => {
      if (ref.current && !ref.current.paused) {
        stopMusic(ref);
      }
    });

    // Play appropriate music for phase
    if (phase === "intro" || phase === "transition" || phase === "outro") {
      playMusic(chillMusicRef);
    } else if (phase === "throughout-year") {
      playMusic(hallOfFameRef);
    } else if (phase === "within-yep") {
      playMusic(onTopRef);
    }
  }, [mounted, phase, isMuted]);

  // Mute/unmute all audio
  useEffect(() => {
    [chillMusicRef, hallOfFameRef, onTopRef].forEach((ref) => {
      if (ref.current) {
        if (isMuted) {
          fadeAudio(ref.current, false, 500);
        }
      }
    });
  }, [isMuted]);

  useEffect(() => {
    if (!mounted) return;

    // Intro phase - 3 seconds
    const introTimer = setTimeout(() => {
      setPhase("throughout-year");
      setCurrentImageIndex(0);
    }, 3000);

    return () => clearTimeout(introTimer);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    if (phase === "throughout-year") {
      // Hide title after first image
      if (currentImageIndex === 0 && showTitle) {
        const titleTimer = setTimeout(() => {
          setShowTitle(false);
        }, 2000);
        return () => clearTimeout(titleTimer);
      }

      if (currentImageIndex < throughoutYearImages.length) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            setCurrentImageIndex((prev) => prev + 1);
            setIsVisible(true);
          }, 300);
        }, 2500);
        return () => clearTimeout(timer);
      } else {
        // Transition to YEP party
        setTimeout(() => {
          setPhase("transition");
          setTimeout(() => {
            setPhase("within-yep");
            setCurrentImageIndex(0);
            setIsVisible(true);
            setShowTitle(true); // Reset title for next section
          }, 2000);
        }, 300);
      }
    }

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

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f5f0eb]">
      {/* Audio Elements */}
      <audio ref={chillMusicRef} loop preload="auto">
        <source src="/music/chilling_background.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={hallOfFameRef} loop preload="auto">
        <source src="/music/hall_of_fame.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={onTopRef} loop preload="auto">
        <source src="/music/on_top_of_the_world.mp3" type="audio/mpeg" />
      </audio>

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
          <h1 className="mb-6 animate-[fadeIn_2s_ease-out] text-center text-3xl font-bold text-[#1a2a5e] md:text-5xl lg:text-7xl">
            CIO Year End Party 2026
          </h1>
          <p
            className="animate-[fadeIn_2s_ease-out_0.5s_backwards] text-center text-lg font-light text-[#d1006c] md:text-2xl lg:text-3xl"
            style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
            What we have together
          </p>
          <div className="mt-8 h-1 w-32 animate-[fadeIn_2s_ease-out_1s_backwards] bg-[#d1006c]/60" />
        </div>
      )}

      {/* Throughout Year Phase */}
      {phase === "throughout-year" &&
        currentImageIndex < throughoutYearImages.length && (
          <div className="absolute inset-0 z-10 flex flex-col">
            {currentImageIndex === 0 && (
              <div
                className={`absolute left-1/2 top-8 z-20 -translate-x-1/2 px-6 transition-all duration-700 ${
                  showTitle
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-4 opacity-0"
                }`}>
              <h2 className="text-center text-2xl font-bold text-[#1a2a5e] md:text-4xl lg:text-5xl">
                Hành trình 2025
              </h2>
              <p
                className="mt-1 text-center text-base text-[#d1006c] md:text-xl lg:text-2xl"
                style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
                Những thành tựu đáng tự hào
              </p>
              </div>
            )}

            <div className="relative flex flex-1 items-center justify-center overflow-hidden">
              <div
                className={`relative h-full w-full transition-all duration-700 ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-12 opacity-0"
                }`}>
                <Image
                  src={throughoutYearImages[currentImageIndex].src}
                  alt={throughoutYearImages[currentImageIndex].caption}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div
              className={`absolute bottom-8 left-0 right-0 px-6 transition-all duration-500 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}>
              <p
                className="mx-auto max-w-4xl text-center text-lg font-medium text-[#1a2a5e] md:text-2xl"
                style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
                {throughoutYearImages[currentImageIndex].caption}
              </p>
            </div>
          </div>
        )}

      {/* Transition Phase */}
      {phase === "transition" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
          <div className="animate-[fadeIn_1.5s_ease-out]">
            <h2 className="mb-4 text-center text-3xl font-bold text-[#1a2a5e] md:text-5xl lg:text-7xl">
              Year End Party 2026
            </h2>
            <p
              className="text-center text-lg font-light text-[#d1006c] md:text-2xl lg:text-3xl"
              style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
              Một đêm đáng nhớ cùng nhau
            </p>
          </div>
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
            <h2 className="mb-4 text-3xl font-bold text-[#1a2a5e] md:text-5xl lg:text-7xl">
              Cảm ơn mọi người!
            </h2>
            <p
              className="mb-2 text-lg text-[#d1006c] md:text-2xl lg:text-3xl"
              style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
              Thank you for an amazing year
            </p>
            <p className="text-base text-[#1a2a5e]/70 md:text-xl lg:text-2xl">
              Hẹn gặp lại trong những khoảnh khắc tuyệt vời tiếp theo
            </p>
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
      {phase !== "intro" && phase !== "outro" && phase !== "transition" && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center">
          <div className="max-w-[90vw] overflow-x-auto scrollbar-hide">
            <div className="flex gap-1.5 px-4 md:gap-2">
              {(phase === "throughout-year"
                ? throughoutYearImages
                : withinYepMedia
              ).map((_, i) => (
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
