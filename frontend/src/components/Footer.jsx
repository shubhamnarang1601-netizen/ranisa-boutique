import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '../hooks/use-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const subscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast({ title: 'Subscribed!', description: 'Thank you for joining the Ranisa family.' });
    setEmail('');
  };

  const cols = [
    {
      title: 'Shop',
      links: [
        { label: 'Casual Wear', to: '/collections/casual-wear' },
        { label: 'Party Wear', to: '/collections/party-wear' },
        { label: 'Ethnic Wear', to: '/collections/ethnic-wear' },
      ],
    },
    {
      title: 'Information',
      links: [
        { label: 'About Us', to: '/' },
        { label: 'Contact Us', to: '/' },
        { label: 'Shipping Policy', to: '/' },
        { label: 'Returns & Exchange', to: '/' },
        { label: 'Track Order', to: '/' },
      ],
    },
  ];

  return (
    <footer className="bg-secondary/60 mt-20 border-t border-border">
      {/* Features strip */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16">
          <div className="md:col-span-1">
            <span className="font-serif-display text-3xl font-semibold text-primary">Ranisa</span>
            <span className="block text-[0.6rem] tracking-[0.45em] uppercase text-muted-foreground">Boutique</span>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              Your home for elegant, handcrafted women's ethnic wear. Where style meets culture, effortlessly.
            </p>
            <div className="flex gap-3 mt-5">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="uppercase tracking-widest text-xs font-medium mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="uppercase tracking-widest text-xs font-medium mb-5">Stay in Touch</h4>
            <p className="text-sm text-muted-foreground mb-4">Subscribe for new arrivals & exclusive offers.</p>
            <form onSubmit={subscribe} className="flex">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="rounded-none border-r-0 focus-visible:ring-0"
              />
              <Button type="submit" className="rounded-none shrink-0">Join</Button>
            </form>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> care@ranisaboutique.com</li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-primary mt-0.5" /> Jayanagar, Bangalore, India</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Ranisa Boutique. All rights reserved.</p>
          <p>Crafted with love • A 100% women-owned enterprise</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
