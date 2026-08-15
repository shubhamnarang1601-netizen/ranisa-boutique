import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../lib/api';
import { QUOTE, REVIEWS, FEATURES } from '../data/mock';

const QuoteStrip = () => (
  <div className="bg-primary text-primary-foreground py-3 overflow-hidden whitespace-nowrap">
    <div className="inline-flex animate-marquee">
      {[...Array(2)].map((_, k) => (
        <span key={k} className="inline-flex">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="font-serif-display italic text-lg px-8">{QUOTE}</span>
          ))}
        </span>
      ))}
    </div>
  </div>
);

const SectionTitle = ({ children, sub }) => (
  <div className="text-center mb-10">
    {sub && <p className="text-xs tracking-[0.35em] uppercase text-muted-foreground mb-3">{sub}</p>}
    <h2 className="font-serif-display text-4xl lg:text-5xl font-medium">{children}</h2>
    <div className="w-16 h-px bg-primary mx-auto mt-5" />
  </div>
);

const ShopSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((list) => active && setItems(list))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16">
      <SectionTitle sub="Shop">Shop Our Collection</SectionTitle>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-secondary" />
              <div className="h-4 bg-secondary mt-3 w-3/4 mx-auto" />
              <div className="h-4 bg-secondary mt-2 w-1/3 mx-auto" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg font-serif-display italic">
            New arrivals are on their way — check back very soon.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
            {items.slice(0, 12).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/collections/casual-wear"
              className="inline-flex items-center gap-2 border border-foreground/80 px-8 py-3 text-xs uppercase tracking-[0.25em] hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

const initials = (name) => name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

const Reviews = () => (
  <section className="bg-secondary/50 py-20 mt-10">
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
      <SectionTitle sub="Testimonials">Feedback by Our Lovely Ladies</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REVIEWS.map((r) => (
          <div key={r.name} className="bg-white p-8 rounded-sm border border-border hover:shadow-lg transition-shadow">
            <div className="flex gap-0.5 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{r.text}"</p>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                {initials(r.name)}
              </span>
              <span className="font-medium text-sm">{r.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FeaturesStrip = () => (
  <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {FEATURES.map((f) => (
        <div key={f.title} className="text-center px-4">
          <h4 className="font-serif-display text-xl mb-3 text-primary">{f.title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{f.text}</p>
        </div>
      ))}
    </div>
  </section>
);

const Home = () => {
  return (
    <div className="fade-up">
      <HeroCarousel />
      <QuoteStrip />
      <ShopSection />
      <Reviews />
      <FeaturesStrip />
    </div>
  );
};

export default Home;
