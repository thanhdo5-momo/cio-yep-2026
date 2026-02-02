"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import data from "@/data.json";

export default function AppreciationList() {
  const [search, setSearch] = useState("");

  const filtered = data.filter((item) =>
    item.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .includes(
        search
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      )
  );

  return (
    <div className="min-h-dvh bg-[#f5f0eb]">
      {/* Header */}
      <div className="px-6 pt-10 pb-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
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
        <h1
          className="text-3xl text-[#d1006c] mb-2"
          style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
          Những lời gửi gắm từ trái tim
        </h1>
        <p className="text-sm text-[#1a2a5e]/60">
          Chọn một lá thư để đọc lời tri ân
        </p>
      </div>

      {/* Search */}
      <div className="mx-auto max-w-5xl px-6 pb-4">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1a2a5e"
            strokeOpacity="0.4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-4 top-1/2 -translate-y-1/2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên..."
            className="w-full rounded-full bg-white py-3 pl-11 pr-4 text-sm text-[#1a2a5e] shadow-md outline-none ring-1 ring-black/5 placeholder:text-[#1a2a5e]/40 focus:ring-2 focus:ring-[#d1006c]/30"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-5xl px-6 pb-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/appreciation/${item.id}`}
              className="group relative flex flex-col items-center rounded-xl bg-white p-5 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
              {/* Avatar / Envelope fallback */}
              <div className="mb-3 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#fff1f6] transition-colors group-hover:bg-[#ffe0ee]">
                {item.image ? (
                  <Image
                    src={`/chibi/${item.image}`}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#d1006c"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform group-hover:scale-110">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                )}
              </div>
              {/* Name */}
              <p
                className="text-center text-base font-medium text-[#1a2a5e] leading-tight"
                style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
                {item.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
