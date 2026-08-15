import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { NAV_COLLECTIONS } from '../data/mock';
import { fetchProducts } from '../lib/api';
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
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    // Match on the top-level handle so sub-categories still resolve to parent products
    const parent = handle.split('-').slice(0, 2).join('-');
    fetchProducts(handle)
      .then(async (list) => {
        if (list.length === 0 && parent !== handle) {
          list = await fetchProducts(parent);
        }
        if (list.length === 0) list = await fetchProducts();
        setRaw(list);
      })
      .catch(() => setRaw([]))
      .finally(() => setLoading(false));
  }, [handle]);

  const products = useMemo(() => {
    const sorted = [...raw];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [raw, sort]);

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
          <p className="text-sm text-muted-foreground mt-3">{loading ? 'Loading…' : `${products.length} products`}</p>
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
        ) : products.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">No products in this collection yet.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
