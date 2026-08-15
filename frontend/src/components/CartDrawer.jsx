import React from 'react';
import { Link } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Button } from './ui/button';

const formatINR = (n) => `Rs. ${n.toLocaleString('en-IN')}.00`;

const CartDrawer = () => {
  const { items, open, setOpen, removeItem, updateQty, subtotal, count } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 py-5 border-b border-border">
          <SheetTitle className="font-serif-display text-2xl tracking-wide flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" /> Your Cart ({count})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" strokeWidth={1} />
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button asChild onClick={() => setOpen(false)} className="rounded-none uppercase tracking-widest">
              <Link to="/collections/new-in">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 no-scrollbar">
              {items.map((item) => (
                <div key={item.key} className="flex gap-4">
                  <Link to={`/products/${item.slug}`} onClick={() => setOpen(false)} className="shrink-0">
                    <img src={item.image} alt={item.title} className="w-20 h-28 object-cover bg-secondary" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.slug}`}
                      onClick={() => setOpen(false)}
                      className="text-sm leading-snug line-clamp-2 hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.color}{item.size ? ` / ${item.size}` : ''}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQty(item.key, item.qty - 1)}
                          className="p-1.5 hover:bg-secondary transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.key, item.qty + 1)}
                          className="p-1.5 hover:bg-secondary transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-medium">{formatINR(item.price * item.qty)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.key)}
                    className="self-start text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="uppercase tracking-widest text-sm text-muted-foreground">Subtotal</span>
                <span className="font-serif-display text-2xl">{formatINR(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Taxes and shipping calculated at checkout.</p>
              <Button className="w-full rounded-none uppercase tracking-widest py-6">Checkout</Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
