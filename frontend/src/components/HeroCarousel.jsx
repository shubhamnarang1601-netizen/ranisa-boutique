import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES } from '../data/mock';

const HeroCarousel = () => {
  const [idx, setIdx] = useState(0);
  const total = HERO_SLIDES.length;

  const go = useCallback((n) => setIdx((prev) => (n + total) % total), [total]);

  useEffect(() => {
    const t = setInterval(() => go(idx + 1), 6000);
    return () => clearInterval(t);
  }, [idx, go]);

  return (
    <section className="relative w-full overflow-hidden bg-secondary">
      <div className="relative" style={{ aspectRatio: '16 / 7' }}>
        {HERO_SLIDES.map((slide, i) => (
          <Link
            to={slide.link}
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img src={slide.image} alt={slide.heading} className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            <div className="absolute left-6 lg:left-16 bottom-10 lg:bottom-16 text-white max-w-md">
              <p className="text-xs tracking-[0.4em] uppercase mb-3 opacity-90">{slide.sub}</p>
              <h2 className="font-serif-display text-4xl lg:text-6xl font-medium drop-shadow-sm">{slide.heading}</h2>
              <span className="inline-block mt-5 border border-white/80 text-white text-xs uppercase tracking-[0.25em] px-6 py-3 hover:bg-white hover:text-foreground transition-colors">
                Shop Now
              </span>
            </div>
          </Link>
        ))}
      </div>

      <button
        onClick={() => go(idx - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => go(idx + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-8 bg-white' : 'w-1.5 bg-white/60'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
