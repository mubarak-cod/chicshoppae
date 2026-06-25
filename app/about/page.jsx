import React from "react";
import {
  Heart,
  GraduationCap,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

export default function AboutPrecious() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FFF9F3] via-[#FBF6EE] to-white flex items-center justify-center text-[#2B2620]">

      {/* Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0 sm:left-10 w-72 h-72 rounded-full bg-pink-200/20 blur-3xl" />
        <div className="absolute bottom-10 right-0 sm:right-10 w-80 h-80 rounded-full bg-amber-200/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">

        {/* Hero */}
        <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF0E8] border border-[#F4D4C2] text-[#B5562E] text-sm font-semibold shadow-sm">
            <Sparkles size={16} />
            The Face Behind ChicShoppae
          </span>

          <div className="mt-8 flex justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#2F4A3E] to-[#496B59] flex items-center justify-center shadow-2xl ring-8 ring-[#F5E8D6]">
              <span className="text-3xl sm:text-4xl font-bold text-white">
                OP
              </span>
            </div>
          </div>

          <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Oyewole Precious
          </h1>

          <p className="mt-3 text-base sm:text-lg md:text-xl text-[#6B5E4C]">
            Student • Fashion Curator • Founder
          </p>
        </div>

        {/* Story Card */}
        <div className="mt-14 bg-white/80 backdrop-blur-xl border border-[#F0E3D2] rounded-[32px] p-5 sm:p-8 md:p-10 lg:p-12 shadow-xl hover:shadow-2xl transition-all duration-500">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            My Story 🌸
          </h2>

          <div className="space-y-5 text-[15px] sm:text-base leading-8 text-[#3A332A]">
            <p>
              Hi, I'm Precious 👋. I'm a full-time student with a passion
              for helping women look stylish without spending endlessly
              searching for the right pieces.
            </p>

            <p>
              What started as helping friends find beautiful outfits
              gradually became something bigger. Between lectures,
              assignments, and exams, I began sourcing fashion pieces
              people genuinely loved.
            </p>

            <p>
              Today, ChicShoppae is more than a fashion page. It's a
              growing community where style meets affordability,
              quality, and trust.
            </p>

            <p>
              Every item you see here is carefully selected with the
              same attention I'd give if I were shopping for my own
              friends and family.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-12">

          <div className="group bg-white rounded-3xl border border-[#F0E3D2] p-6 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF0E8] flex items-center justify-center mb-4">
              <Heart className="text-[#B5562E]" />
            </div>

            <h3 className="font-bold text-xl mb-2">
              Handpicked Pieces
            </h3>

            <p className="text-[#6B5E4C] leading-relaxed">
              Every item is selected with care, style, and quality in
              mind.
            </p>
          </div>

          <div className="group bg-white rounded-3xl border border-[#F0E3D2] p-6 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
            <div className="w-14 h-14 rounded-2xl bg-[#EEF6F2] flex items-center justify-center mb-4">
              <GraduationCap className="text-[#2F4A3E]" />
            </div>

            <h3 className="font-bold text-xl mb-2">
              Student Founder
            </h3>

            <p className="text-[#6B5E4C] leading-relaxed">
              Built alongside lectures, coursework, assignments, and
              late-night planning sessions.
            </p>
          </div>

          <div className="group bg-white rounded-3xl border border-[#F0E3D2] p-6 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 sm:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF8E6] flex items-center justify-center mb-4">
              <ShoppingBag className="text-[#D89B00]" />
            </div>

            <h3 className="font-bold text-xl mb-2">
              Trusted Service
            </h3>

            <p className="text-[#6B5E4C] leading-relaxed">
              Honest communication, smooth shopping, and customer-first
              service every step of the way.
            </p>
          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-14">

          <div className="bg-gradient-to-br from-[#FFF0E8] to-white border border-[#F4D4C2] rounded-3xl p-8 text-center shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-500">
            <div className="text-5xl mb-3">💎</div>

            <h3 className="text-3xl sm:text-4xl font-bold">
              100%
            </h3>

            <p className="mt-2 text-[#6B5E4C]">
              Handpicked Products
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#EEF6F2] to-white border border-[#D8E8DF] rounded-3xl p-8 text-center shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-500">
            <div className="text-5xl mb-3">🎓</div>

            <h3 className="text-3xl sm:text-4xl font-bold">
              Student
            </h3>

            <p className="mt-2 text-[#6B5E4C]">
              Founder & Curator
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#FFF6E8] to-white border border-[#F2E0B7] rounded-3xl p-8 text-center shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-500 sm:col-span-2 lg:col-span-1">
            <div className="text-5xl mb-3">❤️</div>

            <h3 className="text-3xl sm:text-4xl font-bold">
              Real
            </h3>

            <p className="mt-2 text-[#6B5E4C]">
              Honest Customer Service
            </p>
          </div>

        </div>

        {/* Quote */}
        <div className="flex justify-center mt-14">
          <div className="max-w-2xl w-full bg-white border border-[#F0E3D2] rounded-3xl px-6 sm:px-8 py-6 shadow-lg text-center">
            <p className="text-base sm:text-lg italic text-[#6B5E4C] leading-relaxed">
              ✨ "Style shouldn't wait until after graduation."
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}