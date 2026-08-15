import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const formatINR = (n) => `Rs. ${n.toLocaleString('en-IN')}.00`;

const colorSwatch = {
  Black: '#1a1a1a', Brown: '#7b5e4b', 'Sea Blue': '#3a7ca5', Blue: '#2b4a8b',
  'Creamish Pink': '#f0d8d0', 'Onion Pink': '#d98695', 'Bottle Green': '#0b5d43',
  'Light Peach': '#f7cbb0', Wine: '#722f37', 'Mustard Yellow': '#d4a017',
};

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [hover, setHover] = useState(false);

  const hasSecond = product.images && product.images.length > 1;
  const discount = product.compareAt ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100) : 0;

  const quickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative img-zoom-wrap bg-secondary aspect-[3/4] overflow-hidden">
          <img
            src={hover && hasSecond ? product.images[1] : product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[0.65rem] tracking-wider px-2 py-1">
              -{discount}%
            </span>
          )}
          <button
            onClick={quickAdd}
            className="absolute bottom-0 left-0 right-0 bg-white/95 text-foreground text-xs uppercase tracking-widest py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-1.5 hover:bg-primary hover:text-primary-foreground"
          >
            {added ? (<><Check className="w-3.5 h-3.5" /> Added</>) : (<><Plus className="w-3.5 h-3.5" /> Quick Add</>)}
          </button>
        </div>
      </Link>

      <div className="pt-3 text-center px-1">
        <Link to={`/products/${product.slug}`}>
          <h3 className="text-sm leading-snug line-clamp-2 hover:text-primary transition-colors min-h-[2.5rem]">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center justify-center gap-2 mt-1.5">
          <span className="text-sm font-medium">{formatINR(product.price)}</span>
          {product.compareAt && (
            <span className="text-xs text-muted-foreground line-through">{formatINR(product.compareAt)}</span>
          )}
        </div>
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {product.colors.slice(0, 5).map((c) => (
              <span
                key={c}
                title={c}
                className="w-3.5 h-3.5 rounded-full border border-border"
                style={{ backgroundColor: colorSwatch[c] || '#ccc' }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
