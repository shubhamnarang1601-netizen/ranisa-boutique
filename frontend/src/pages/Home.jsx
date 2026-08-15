import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import {
  QUOTE,
  COLLECTION_TILES,
  CATEGORY_BANNERS,
  INSTAGRAM_IMAGES,
  REVIEWS,
  FEATURES,
  PRODUCTS,
} from '../data/mock';

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

const CollectionsBrowse = () => (
  <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16">
    <SectionTitle sub="Explore">Collections by Roshni</SectionTitle>
    <p className="text-center text-muted-foreground italic max-w-2xl mx-auto mb-12 font-serif-display text-xl">
      Step into elegance, embrace tradition. Our ethnic wear is not just fashion; it's a celebration of
      womanhood, where style meets culture effortlessly.
    </p>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
      {COLLECTION_TILES.map((tile) => (
        <Link key={tile.handle} to={`/collections/${tile.handle}`} className="group">
          <div className="img-zoom-wrap aspect-[3/4] bg-secondary rounded-sm overflow-hidden relative">
            <img src={tile.image} alt={tile.title} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
        </Link>
      ))}
    </div>
  </section>
);

const ProductRow = ({ title, sub, handle, products }) => (
  <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16">
    <SectionTitle sub={sub}>{title}</SectionTitle>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
    <div className="text-center mt-12">
      <Link
        to={`/collections/${handle}`}
        className="inline-flex items-center gap-2 border border-foreground/80 px-8 py-3 text-xs uppercase tracking-[0.25em] hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
      >
        View More <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  </section>
);

const CategoryBanner = ({ block }) => (
  <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">
    <Link to={`/collections/${block.handle}`} className="block img-zoom-wrap rounded-sm overflow-hidden mb-6">
      <img src={block.banner} alt={block.title} className="w-full h-auto object-cover" loading="lazy" />
    </Link>
    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 lg:grid lg:grid-cols-8 lg:overflow-visible">
      {block.tiles.map((t) => (
        <Link key={t.handle} to={`/collections/${t.handle}`} className="group shrink-0 w-32 lg:w-auto">
          <div className="img-zoom-wrap aspect-square bg-secondary rounded-full overflow-hidden border border-border">
            <img src={t.image} alt={t.title} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <p className="text-center text-xs uppercase tracking-widest mt-3 group-hover:text-primary transition-colors">{t.title}</p>
        </Link>
      ))}
    </div>
  </section>
);

const InstagramGallery = () => (
  <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16">
    <SectionTitle sub="@roshniboutique">#CelebrateInRoshni</SectionTitle>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-3">
      {INSTAGRAM_IMAGES.map((src, i) => (
        <a key={i} href="#" className="group relative img-zoom-wrap aspect-square bg-secondary overflow-hidden rounded-sm">
          <img src={src} alt={`Roshni look ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors" />
        </a>
      ))}
    </div>
  </section>
);

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
              <img src={r.image} alt={r.name} className="w-10 h-10 rounded-full object-cover bg-secondary" />
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
  const latest = PRODUCTS.filter((p) => p.collections.includes('new-in')).slice(0, 4);
  const luxurio = PRODUCTS.filter((p) => p.collections.includes('luxurio')).slice(0, 4);

  return (
    <div className="fade-up">
      <HeroCarousel />
      <QuoteStrip />
      <CollectionsBrowse />
      <ProductRow title="Latest Collection by Roshni" sub="Just Arrived" handle="new-in" products={latest} />
      <ProductRow title="Luxurio - by Roshni" sub="Premium Edit" handle="luxurio" products={luxurio} />
      {CATEGORY_BANNERS.map((block) => (
        <CategoryBanner key={block.handle} block={block} />
      ))}
      <InstagramGallery />
      <Reviews />
      <FeaturesStrip />
    </div>
  );
};

export default Home;
