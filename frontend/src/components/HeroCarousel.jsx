import React from 'react';
import { Link } from 'react-router-dom';
import { HERO_SLIDES } from '../data/mock';

const HeroCarousel = () => {
  const slide = HERO_SLIDES[0];

  return (
    <section className="relative w-full grid grid-cols-1 lg:grid-cols-2 min-h-[520px] lg:min-h-[640px] bg-secondary/40">
      {/* Text panel */}
      <div className="order-2 lg:order-1 flex items-center justify-center px-8 py-14 lg:py-0 bg-[#f7eef0]">
        <div className="max-w-md text-center lg:text-left fade-up">
          <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4">{slide.sub}</p>
          <h2 className="font-serif-display text-4xl lg:text-6xl font-medium leading-tight text-foreground">
            {slide.heading}
          </h2>
          <p className="text-muted-foreground mt-5 leading-relaxed">
            Discover handcrafted elegance in every stitch. Timeless ethnic wear, made for the modern woman.
          </p>
          <Link
            to={slide.link}
            className="inline-block mt-8 bg-primary text-primary-foreground text-xs uppercase tracking-[0.25em] px-9 py-4 hover:bg-primary/90 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Image panel */}
      <div className="order-1 lg:order-2 relative overflow-hidden bg-[#ece4e2] min-h-[420px] lg:min-h-[640px]">
        <img
          src={slide.image}
          alt={slide.heading}
          className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
        />
      </div>
    </section>
  );
};

export default HeroCarousel;
