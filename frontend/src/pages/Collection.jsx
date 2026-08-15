import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import FilterableProducts from '../components/FilterableProducts';
import { NAV_COLLECTIONS } from '../data/mock';
import { fetchProducts } from '../lib/api';

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
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    const parent = handle.split('-').slice(0, 2).join('-');
    fetchProducts(handle)
      .then(async (list) => {
        if (list.length === 0 && parent !== handle) {
          list = await fetchProducts(parent);
        }
        setRaw(list);
      })
      .catch(() => setRaw([]))
      .finally(() => setLoading(false));
  }, [handle]);

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
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">
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
        ) : raw.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">No products in this collection yet.</div>
        ) : (
          <FilterableProducts products={raw} lockedCategory={handle} />
        )}
      </div>
    </div>
  );
};

export default Collection;
