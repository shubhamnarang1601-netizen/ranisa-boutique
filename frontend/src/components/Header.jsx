import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, Heart } from 'lucide-react';
import { NAV_COLLECTIONS } from '../data/mock';
import { useCart } from '../context/CartContext';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from './ui/sheet';

const ANNOUNCEMENTS = [
  'PAN INDIA DELIVERY • 100% WOMEN OWNED',
  'NEW FESTIVE COLLECTION IS LIVE',
  'SECURE PAYMENTS • EASY RETURNS',
];

const Header = () => {
  const { count, setOpen } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [announceIdx, setAnnounceIdx] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setAnnounceIdx((i) => (i + 1) % ANNOUNCEMENTS.length), 3500);
    return () => clearInterval(t);
  }, []);

  const mainNav = NAV_COLLECTIONS;

  return (
    <header className="sticky top-0 z-40 bg-white">
      {/* Announcement bar */}
      <div className="bg-primary text-primary-foreground text-center text-xs tracking-[0.2em] py-2 px-4 overflow-hidden">
        <span className="inline-block">{ANNOUNCEMENTS[announceIdx]}</span>
      </div>

      <div className={`transition-shadow ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger aria-label="Open menu">
                  <Menu className="w-6 h-6" />
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <div className="px-6 py-6">
                    <p className="font-serif-display text-2xl mb-6">Roshni Collection</p>
                    <nav className="flex flex-col">
                      {mainNav.map((c) => (
                        <Link
                          key={c.handle}
                          to={`/collections/${c.handle}`}
                          className="py-3 border-b border-border text-sm uppercase tracking-widest hover:text-primary transition-colors"
                        >
                          {c.title}
                        </Link>
                      ))}
                      <Link to="/admin" className="py-3 text-sm uppercase tracking-widest text-muted-foreground hover:text-primary">Admin</Link>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <Link to="/" className="lg:flex-1 flex justify-center lg:justify-start">
              <div className="text-center lg:text-left">
                <span className="font-serif-display text-3xl lg:text-4xl font-semibold tracking-wide text-primary">Roshni</span>
                <span className="block text-[0.6rem] tracking-[0.45em] uppercase text-muted-foreground -mt-1">Boutique</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
              {mainNav.slice(0, 7).map((c) => (
                <Link
                  key={c.handle}
                  to={`/collections/${c.handle}`}
                  className="relative text-xs uppercase tracking-[0.15em] py-2 text-foreground/80 hover:text-primary transition-colors group"
                >
                  {c.title}
                  <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4 lg:gap-5 lg:flex-1 justify-end">
              <button aria-label="Search" className="hover:text-primary transition-colors" onClick={() => navigate('/collections/new-in')}>
                <Search className="w-5 h-5" />
              </button>
              <Link to="/admin" aria-label="Account" className="hidden sm:block hover:text-primary transition-colors">
                <User className="w-5 h-5" />
              </Link>
              <button aria-label="Wishlist" className="hidden sm:block hover:text-primary transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button aria-label="Cart" className="relative hover:text-primary transition-colors" onClick={() => setOpen(true)}>
                <ShoppingBag className="w-5 h-5" />
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[0.6rem] w-4 h-4 rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
