import React from "react";

export default function AboutPrecious() {
  return (
    <div className="min-h-screen w-full bg-[#FBF6EE] text-[#2B2620]">
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20">

        {/* Eyebrow */}
        <p className="text-xs tracking-[0.25em] uppercase text-[#B5562E] font-semibold mb-6">
          The Person Behind The Rack
        </p>

        {/* Header: initials badge + name */}
        <div className="flex items-center gap-5 mb-10">
          <div className="w-20 h-20 rounded-full bg-[#2F4A3E] flex items-center justify-center shrink-0 ring-4 ring-[#EADFC8]">
            <span className="text-2xl font-bold text-[#FBF6EE] font-serif">OP</span>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
              Oyewole Precious
            </h1>
            <p className="text-[#6B5E4C] mt-1">
              Student · Curator of Good Fits
            </p>
          </div>
        </div>

        {/* Divider with label */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-xs uppercase tracking-widest text-[#B5562E] font-semibold">
            About Me
          </span>
          <div className="flex-1 h-px bg-[#EADFC8]" />
        </div>

        {/* Bio */}
        <div className="space-y-5 text-[15px] sm:text-base leading-relaxed text-[#3A332A]">
          <p>
            I'm Precious — a full-time student with a part-time obsession:
            finding clothes worth wearing and getting them onto people who'll
            actually love them. What started as helping friends shop smarter
            has turned into something I run with real intention, one outfit
            at a time.
          </p>
          <p>
            Books by day, lookbooks by night. I balance lecture halls and
            assignments with sourcing pieces, styling them, and getting them
            to customers who want quality without the stress. It isn't
            always easy, but it's mine — and I'm building it brick by brick.
          </p>
          <p>
            If you're after something stylish, affordable, and put together
            with care, you're in the right place. I treat every sale like
            I'm dressing a friend, not just making a transaction.
          </p>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-3 gap-4 mt-12 mb-12">
          <div className="border-l-2 border-[#2F4A3E] pl-3">
            <p className="text-2xl font-serif font-bold">100%</p>
            <p className="text-xs text-[#6B5E4C] mt-1">Hand-picked pieces</p>
          </div>
          <div className="border-l-2 border-[#2F4A3E] pl-3">
            <p className="text-2xl font-serif font-bold">Student</p>
            <p className="text-xs text-[#6B5E4C] mt-1">Built around classes</p>
          </div>
          <div className="border-l-2 border-[#2F4A3E] pl-3">
            <p className="text-2xl font-serif font-bold">Real</p>
            <p className="text-xs text-[#6B5E4C] mt-1">Honest service, no fluff</p>
          </div>
        </div>

        {/* Footer note */}
        <div className="border-t border-[#EADFC8] pt-6">
          <p className="text-sm text-[#6B5E4C] italic">
            "Style shouldn't wait until after graduation."
          </p>
        </div>
      </div>
    </div>
  );
}