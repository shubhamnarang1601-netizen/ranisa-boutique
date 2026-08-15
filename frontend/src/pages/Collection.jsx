import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, NAV_COLLECTIONS } from '../data/mock';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const titleFor = (handle) => {
  const found = NAV_COLLECTIONS.find((c) => c.handle === handle);
  if (found) return found.title;
  return handle
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

const Collection = () => {
  const { handle } = useParams();
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [handle]);

  const products = useMemo(() => {
    let list = PRODUCTS.filter((p) =>
      p.collections.some((c) => c === handle || c.startsWith(handle))
    );
    // Fallback: if a sub-category has no products, show all so page never looks empty
    if (list.length === 0) list = PRODUCTS;
    const sorted = [...list];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [handle, sort]);

  return (
    <div className="fade-up">
      {/* Breadcrumb + title */}
      <div className="bg-secondary/50 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10 text-center">
          <nav className="text-xs text-muted-foreground mb-3 tracking-wider">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{titleFor(handle)}</span>
          </nav>
          <h1 className="font-serif-display text-4xl lg:text-5xl font-medium">{titleFor(handle)}</h1>
          <p className="text-sm text-muted-foreground mt-3">{products.length} products</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <button className="flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            <SlidersHorizontal className="w-4 h-4" /> Filter
          </button>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-52 rounded-none border-border text-xs uppercase tracking-widest">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
