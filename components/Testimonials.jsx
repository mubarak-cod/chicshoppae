"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "Lagos, Nigeria",
    role: "Fashion Influencer",
    image: "",
    review:
      "The quality exceeded my expectations. The fabrics feel luxurious, delivery was incredibly fast, and the customer service made the entire experience effortless.",
  },
  {
    id: 2,
    name: "Daniel Williams",
    location: "Abuja, Nigeria",
    role: "Creative Director",
    image: "",
    review:
      "Every detail feels premium. Shopping here feels like buying from a luxury international brand. Absolutely impressive from start to finish.",
  },
  {
    id: 3,
    name: "Grace Adams",
    location: "Port Harcourt",
    role: "Entrepreneur",
    image: "",
    review:
      "I've ordered multiple times already. Beautiful packaging, premium quality and excellent customer care. Highly recommended.",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);

    return () => clearInterval(timer);
  }, [nextSlide]);

  const item = testimonials[current];

  return (
    <section className="relative overflow-hidden bg-[#F9F6F1] py-24">
      <div className="absolute left-[-150px] top-[-150px] h-[350px] w-[350px] rounded-full bg-white/60 blur-3xl" />
      <div className="absolute right-[-120px] bottom-[-120px] h-[320px] w-[320px] rounded-full bg-white/60 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center mb-16">
          <span className="text-sm uppercase tracking-[0.35em] text-stone-500">
            Testimonials
          </span>

          <h2 className="mt-4 text-5xl font-serif text-stone-900">
            What Our Clients Say
          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-stone-600 leading-8">
            Trusted by customers who appreciate timeless fashion,
            premium craftsmanship and exceptional service.
          </p>
        </div>

        <div className="relative">

          <AnimatePresence mode="wait">

            <motion.div
              key={item.id}
              initial={{
                opacity: 0,
                y: 40,
                scale: .95
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1
              }}
              exit={{
                opacity: 0,
                y: -40,
                scale: .95
              }}
              transition={{
                duration: .55
              }}
              className="relative mx-auto max-w-5xl rounded-[40px] bg-white shadow-[0_30px_80px_rgba(0,0,0,.08)]"
            >
              <div className="grid lg:grid-cols-2">

                <div className="relative h-[420px]">

                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="rounded-t-[40px] lg:rounded-l-[40px] lg:rounded-tr-none object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                </div>

                <div className="flex flex-col justify-center p-10 lg:p-16">

                  <div className="flex gap-1 text-amber-500 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xl">
                        ★
                      </span>
                    ))}
                  </div>

                  <p className="text-2xl leading-10 text-stone-700 italic">
                    {item.review}
                  </p>

                  <div className="mt-12 flex items-center gap-5">

                    <Image
                      src={item.image}
                      width={65}
                      height={65}
                      alt={item.name}
                      className="rounded-full border-4 border-[#F9F6F1]"
                    />

                    <div>

                      <h3 className="font-semibold text-xl text-stone-900">
                        {item.name}
                      </h3>

                      <p className="text-stone-500">
                        {item.role}
                      </p>

                      <p className="text-sm text-stone-400 mt-1">
                        📍 {item.location}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </motion.div>

          </AnimatePresence>

          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 h-14 w-14 rounded-full bg-white shadow-lg transition hover:scale-110"
          >
            ←
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 h-14 w-14 rounded-full bg-white shadow-lg transition hover:scale-110"
          >
            →
          </button>

        </div>

        <div className="mt-12 flex justify-center gap-3">

          {testimonials.map((_, index) => (

            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                current === index
                  ? "w-10 bg-stone-900"
                  : "w-3 bg-stone-300 hover:bg-stone-500"
              }`}
            />

          ))}

        </div>

      </div>
    </section>
  );
}