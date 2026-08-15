import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Minus, Plus, Heart, Share2, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { fetchProduct, fetchProducts } from '../lib/api';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';

const formatINR = (n) => `Rs. ${n.toLocaleString('en-IN')}.00`;

const colorSwatch = {
  Black: '#1a1a1a', Brown: '#7b5e4b', 'Sea Blue': '#3a7ca5', Blue: '#2b4a8b',
  'Creamish Pink': '#f0d8d0', 'Onion Pink': '#d98695', 'Bottle Green': '#0b5d43',
  'Light Peach': '#f7cbb0', Wine: '#722f37', 'Mustard Yellow': '#d4a017',
};

const ProductDetail = () => {
  const { slug } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeImg, setActiveImg] = useState(0);
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetchProduct(slug)
      .then((p) => {
        setProduct(p);
        setActiveImg(0);
        setColor(p.colors?.[0] || null);
        setSize(p.sizes?.[0] || null);
        setQty(1);
        if (p.collections?.[0]) {
          fetchProducts(p.collections[0]).then((list) =>
            setRelated(list.filter((x) => x.id !== p.id).slice(0, 4))
          );
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-pulse">
          <div className="aspect-[3/4] bg-secondary" />
          <div className="space-y-4">
            <div className="h-8 bg-secondary w-3/4" />
            <div className="h-6 bg-secondary w-1/3" />
            <div className="h-12 bg-secondary w-full" />
            <div className="h-12 bg-secondary w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto py-32 text-center px-4">
        <h1 className="font-serif-display text-3xl mb-4">Product not found</h1>
        <Link to="/collections/new-in" className="text-primary underline">Browse collections</Link>
      </div>
    );
  }

  const discount = product.compareAt ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100) : 0;

  return (
    <div className="fade-up">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">
        <nav className="text-xs text-muted-foreground mb-8 tracking-wider">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to={`/collections/${product.collections[0]}`} className="hover:text-primary capitalize">
            {product.collections[0].replace(/-/g, ' ')}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Product</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery */}
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            <div className="flex lg:flex-col gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-20 h-24 bg-secondary overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-primary' : 'border-transparent hover:border-border'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 img-zoom-wrap bg-secondary aspect-[3/4] overflow-hidden">
              <img src={product.images[activeImg]} alt={product.title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="font-serif-display text-3xl lg:text-4xl font-medium leading-tight">{product.title}</h1>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-2xl font-medium">{formatINR(product.price)}</span>
              {product.compareAt && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{formatINR(product.compareAt)}</span>
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 tracking-wider">-{discount}%</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</p>

            <div className="w-full h-px bg-border my-6" />

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest mb-3">Color: <span className="text-muted-foreground">{color}</span></p>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      title={c}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${color === c ? 'border-primary scale-110' : 'border-border'}`}
                      style={{ backgroundColor: colorSwatch[c] || '#ccc' }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest mb-3">Size: <span className="text-muted-foreground">{size}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`min-w-[3rem] h-11 px-3 border text-sm transition-colors ${size === s ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border border-border h-12">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 h-full hover:bg-secondary transition-colors" aria-label="Decrease">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm w-12 text-center">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-3 h-full hover:bg-secondary transition-colors" aria-label="Increase">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button
                onClick={() => addItem(product, { color, size, qty })}
                className="flex-1 h-12 rounded-none uppercase tracking-[0.2em]"
              >
                Add to Cart
              </Button>
            </div>
            <Button variant="outline" className="w-full h-12 rounded-none uppercase tracking-[0.2em] mb-4">
              Buy It Now
            </Button>

            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
              <button className="flex items-center gap-2 hover:text-primary transition-colors"><Heart className="w-4 h-4" /> Wishlist</button>
              <button className="flex items-center gap-2 hover:text-primary transition-colors"><Share2 className="w-4 h-4" /> Share</button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[{ icon: Truck, t: 'PAN India Delivery' }, { icon: RefreshCw, t: 'Easy Exchange' }, { icon: ShieldCheck, t: 'Secure Payments' }].map((b, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2 p-3 bg-secondary/50 rounded-sm">
                  <b.icon className="w-5 h-5 text-primary" />
                  <span className="text-xs text-muted-foreground">{b.t}</span>
                </div>
              ))}
            </div>

            <Accordion type="single" collapsible defaultValue="desc">
              <AccordionItem value="desc">
                <AccordionTrigger className="uppercase tracking-widest text-xs">Description</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="fabric">
                <AccordionTrigger className="uppercase tracking-widest text-xs">Fabric & Care</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  Fabric: {product.fabric}. Dry clean recommended. Store in a cool, dry place away from direct sunlight.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="ship">
                <AccordionTrigger className="uppercase tracking-widest text-xs">Shipping & Returns</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  Ships within 3-5 business days across India. Easy 7-day exchange on unworn items with tags intact.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-24">
            <div className="text-center mb-10">
              <h2 className="font-serif-display text-3xl lg:text-4xl font-medium">You May Also Love</h2>
              <div className="w-16 h-px bg-primary mx-auto mt-5" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
