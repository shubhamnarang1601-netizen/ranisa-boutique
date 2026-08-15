import React, { useMemo, useState, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from './ProductCard';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '3XL', '4XL'];

const COLOR_SWATCH = {
  Black: '#1a1a1a', White: '#f5f5f5', Brown: '#7b5e4b', 'Sea Blue': '#3a7ca5', Blue: '#2b4a8b',
  'Creamish Pink': '#f0d8d0', 'Onion Pink': '#d98695', 'Bottle Green': '#0b5d43', Green: '#3f7d4f',
  'Light Peach': '#f7cbb0', Peach: '#f7cbb0', Wine: '#722f37', Red: '#b0313b', Maroon: '#7d2230',
  'Mustard Yellow': '#d4a017', Yellow: '#e3c02a', Pink: '#e28aa5', Grey: '#8a8a8a', Gray: '#8a8a8a',
  Cream: '#f2e8db', Beige: '#e3d5c0', Orange: '#e08a3c', Purple: '#7a4f9e', Navy: '#1f2f56',
};

const CATEGORY_LABELS = {
  'casual-wear': 'Casual Wear',
  'party-wear': 'Party Wear',
  'ethnic-wear': 'Ethnic Wear',
};

const prettyCat = (h) =>
  CATEGORY_LABELS[h] || h.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const toggle = (arr, val) => (arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

const FilterGroup = ({ title, children }) => (
  <div className="py-5 border-b border-border">
    <h4 className="text-xs uppercase tracking-widest font-medium mb-4">{title}</h4>
    {children}
  </div>
);

const FilterableProducts = ({ products = [], lockedCategory = null }) => {
  // Derive option lists from the products
  const { colors, sizes, fabrics, categories, minPrice, maxPrice } = useMemo(() => {
    const colorSet = new Set();
    const sizeSet = new Set();
    const fabricSet = new Set();
    const catSet = new Set();
    let min = Infinity;
    let max = 0;
    products.forEach((p) => {
      (p.colors || []).forEach((c) => colorSet.add(c));
      (p.sizes || []).forEach((s) => sizeSet.add(s));
      if (p.fabric) fabricSet.add(p.fabric);
      (p.collections || []).forEach((c) => catSet.add(c));
      if (typeof p.price === 'number') {
        min = Math.min(min, p.price);
        max = Math.max(max, p.price);
      }
    });
    const sortedSizes = [...sizeSet].sort((a, b) => {
      const ia = SIZE_ORDER.indexOf(a);
      const ib = SIZE_ORDER.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
    return {
      colors: [...colorSet].sort(),
      sizes: sortedSizes,
      fabrics: [...fabricSet].sort(),
      categories: [...catSet].filter((c) => CATEGORY_LABELS[c] || true).sort(),
      minPrice: min === Infinity ? 0 : Math.floor(min),
      maxPrice: max === 0 ? 20000 : Math.ceil(max),
    };
  }, [products]);

  const [sort, setSort] = useState('featured');
  const [selColors, setSelColors] = useState([]);
  const [selSizes, setSelSizes] = useState([]);
  const [selFabrics, setSelFabrics] = useState([]);
  const [selCats, setSelCats] = useState([]);
  const [price, setPrice] = useState([minPrice, maxPrice]);

  // Reset price bounds when product set changes
  useEffect(() => {
    setPrice([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const clearAll = () => {
    setSelColors([]);
    setSelSizes([]);
    setSelFabrics([]);
    setSelCats([]);
    setPrice([minPrice, maxPrice]);
    setSort('featured');
  };

  const activeCount =
    selColors.length + selSizes.length + selFabrics.length + selCats.length +
    (price[0] !== minPrice || price[1] !== maxPrice ? 1 : 0);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (p.price < price[0] || p.price > price[1]) return false;
      if (selColors.length && !(p.colors || []).some((c) => selColors.includes(c))) return false;
      if (selSizes.length && !(p.sizes || []).some((s) => selSizes.includes(s))) return false;
      if (selFabrics.length && !selFabrics.includes(p.fabric)) return false;
      if (selCats.length && !(p.collections || []).some((c) => selCats.includes(c))) return false;
      return true;
    });
    list = [...list];
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'newest') list.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
    return list;
  }, [products, price, selColors, selSizes, selFabrics, selCats, sort]);

  const FilterControls = () => (
    <div>
      {/* Category */}
      {categories.length > 0 && !lockedCategory && (
        <FilterGroup title="Category">
          <div className="space-y-3">
            {categories.map((c) => (
              <label key={c} className="flex items-center gap-3 cursor-pointer group">
                <Checkbox checked={selCats.includes(c)} onCheckedChange={() => setSelCats((prev) => toggle(prev, c))} />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{prettyCat(c)}</span>
              </label>
            ))}
          </div>
        </FilterGroup>
      )}

      {/* Price */}
      {maxPrice > minPrice && (
        <FilterGroup title="Price">
          <Slider
            min={minPrice}
            max={maxPrice}
            step={100}
            value={price}
            onValueChange={setPrice}
            className="mt-2"
          />
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>Rs. {price[0].toLocaleString('en-IN')}</span>
            <span>Rs. {price[1].toLocaleString('en-IN')}</span>
          </div>
        </FilterGroup>
      )}

      {/* Size */}
      {sizes.length > 0 && (
        <FilterGroup title="Size">
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelSizes((prev) => toggle(prev, s))}
                className={`min-w-[2.75rem] h-10 px-3 border text-sm transition-colors ${
                  selSizes.includes(s)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:border-primary'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </FilterGroup>
      )}

      {/* Color */}
      {colors.length > 0 && (
        <FilterGroup title="Color">
          <div className="space-y-3">
            {colors.map((c) => (
              <label key={c} className="flex items-center gap-3 cursor-pointer group">
                <Checkbox checked={selColors.includes(c)} onCheckedChange={() => setSelColors((prev) => toggle(prev, c))} />
                <span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: COLOR_SWATCH[c] || '#ccc' }} />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{c}</span>
              </label>
            ))}
          </div>
        </FilterGroup>
      )}

      {/* Fabric */}
      {fabrics.length > 0 && (
        <FilterGroup title="Fabric">
          <div className="space-y-3">
            {fabrics.map((f) => (
              <label key={f} className="flex items-center gap-3 cursor-pointer group">
                <Checkbox checked={selFabrics.includes(f)} onCheckedChange={() => setSelFabrics((prev) => toggle(prev, f))} />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{f}</span>
              </label>
            ))}
          </div>
        </FilterGroup>
      )}

      {activeCount > 0 && (
        <button onClick={clearAll} className="text-xs uppercase tracking-widest text-primary hover:underline mt-5">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          {/* Mobile filter trigger */}
          <Sheet>
            <SheetTrigger className="lg:hidden flex items-center gap-2 text-sm uppercase tracking-widest hover:text-primary transition-colors">
              <SlidersHorizontal className="w-4 h-4" /> Filter
              {activeCount > 0 && <Badge className="ml-1 rounded-full px-1.5">{activeCount}</Badge>}
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="font-serif-display text-2xl">Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-2">
                <FilterControls />
              </div>
            </SheetContent>
          </Sheet>
          <span className="hidden lg:flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground">
            <SlidersHorizontal className="w-4 h-4" /> Filters
            {activeCount > 0 && <Badge className="ml-1 rounded-full px-1.5">{activeCount}</Badge>}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-xs text-muted-foreground">{filtered.length} products</span>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-48 rounded-none border-border text-xs uppercase tracking-widest">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active chips */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {[...selCats.map((v) => ['cat', v]), ...selSizes.map((v) => ['size', v]), ...selColors.map((v) => ['color', v]), ...selFabrics.map((v) => ['fabric', v])].map(([type, v]) => (
            <button
              key={`${type}-${v}`}
              onClick={() => {
                if (type === 'cat') setSelCats((p) => toggle(p, v));
                if (type === 'size') setSelSizes((p) => toggle(p, v));
                if (type === 'color') setSelColors((p) => toggle(p, v));
                if (type === 'fabric') setSelFabrics((p) => toggle(p, v));
              }}
              className="flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 hover:border-primary hover:text-primary transition-colors"
            >
              {type === 'cat' ? prettyCat(v) : v} <X className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterControls />
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">No products match these filters.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 lg:gap-x-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterableProducts;
