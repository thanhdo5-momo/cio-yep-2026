"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
}

interface Firework {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
  exploded: boolean;
}

interface FireworksBackgroundProps
  extends Omit<React.ComponentProps<"div">, "color"> {
  canvasProps?: React.ComponentProps<"canvas">;
  population?: number;
  color?: string | string[];
  fireworkSpeed?: { min: number; max: number } | number;
  fireworkSize?: { min: number; max: number } | number;
  particleSpeed?: { min: number; max: number } | number;
  particleSize?: { min: number; max: number } | number;
  autoLaunch?: boolean;
  autoLaunchInterval?: number;
}

function getRandomInRange(
  value: { min: number; max: number } | number
): number {
  if (typeof value === "number") return value;
  return Math.random() * (value.max - value.min) + value.min;
}

function getRandomColor(colors: string | string[]): string {
  if (typeof colors === "string") return colors;
  return colors[Math.floor(Math.random() * colors.length)];
}

export function FireworksBackground({
  className,
  canvasProps,
  population = 3,
  color = ["#ff006c", "#ff4d7d", "#ff8fa3", "#ffd166", "#06d6a0", "#118ab2"],
  fireworkSpeed = { min: 8, max: 15 },
  fireworkSize = { min: 3, max: 5 },
  particleSpeed = { min: 2, max: 8 },
  particleSize = { min: 1, max: 4 },
  autoLaunch = true,
  autoLaunchInterval = 800,
  ...props
}: FireworksBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fireworksRef = useRef<Firework[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const createFirework = useCallback(
    (x: number, targetY: number) => {
      const firework: Firework = {
        x,
        y: dimensions.height,
        targetY,
        vy: -getRandomInRange(fireworkSpeed),
        color: getRandomColor(color),
        exploded: false,
      };
      fireworksRef.current.push(firework);
    },
    [dimensions.height, fireworkSpeed, color]
  );

  const createParticles = useCallback(
    (x: number, y: number, fireworkColor: string) => {
      const particleCount = 30 + Math.floor(Math.random() * 30);
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.2;
        const speed = getRandomInRange(particleSpeed);
        const particle: Particle = {
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: fireworkColor,
          size: getRandomInRange(particleSize),
          decay: 0.015 + Math.random() * 0.015,
        };
        particlesRef.current.push(particle);
      }
    },
    [particleSpeed, particleSize]
  );

  const launchRandomFirework = useCallback(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    const x = Math.random() * dimensions.width;
    const targetY = dimensions.height * 0.1 + Math.random() * dimensions.height * 0.4;
    createFirework(x, targetY);
  }, [dimensions.width, dimensions.height, createFirework]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!autoLaunch || dimensions.width === 0) return;

    const interval = setInterval(() => {
      if (fireworksRef.current.length < population) {
        launchRandomFirework();
      }
    }, autoLaunchInterval);

    return () => clearInterval(interval);
  }, [autoLaunch, autoLaunchInterval, population, launchRandomFirework, dimensions.width]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Update and draw fireworks
      fireworksRef.current = fireworksRef.current.filter((firework) => {
        if (!firework.exploded) {
          firework.y += firework.vy;
          firework.vy += 0.15; // gravity

          // Draw firework trail
          ctx.beginPath();
          ctx.arc(firework.x, firework.y, getRandomInRange(fireworkSize), 0, Math.PI * 2);
          ctx.fillStyle = firework.color;
          ctx.fill();

          // Check if reached target or slowed down enough
          if (firework.vy >= -2 || firework.y <= firework.targetY) {
            firework.exploded = true;
            createParticles(firework.x, firework.y, firework.color);
            return false;
          }
          return true;
        }
        return false;
      });

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.08; // gravity
        particle.vx *= 0.98; // friction
        particle.alpha -= particle.decay;

        if (particle.alpha <= 0) return false;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        return true;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions, createParticles, fireworkSize]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    createFirework(x, y);
  };

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden", className)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onClick={handleClick}
        className="absolute inset-0 cursor-pointer"
        {...canvasProps}
      />
    </div>
  );
}
