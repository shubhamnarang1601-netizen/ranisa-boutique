"use client";

import { useEffect, useState } from "react";

export default function CustomQuickForm() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('[data-customize-link], a[href="/custom"]');
      if (!link) return;
      event.preventDefault();
      setOpen(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = `Hello Ranisa Boutique, I would like a custom order enquiry.\\n\\nName: ${data.get("name")}\\nPhone: ${data.get("phone")}\\nOutfit: ${data.get("outfit")}\\nPreferred colour: ${data.get("colour") || "Not specified"}\\nDetails: ${data.get("details")}`;
    window.location.href = `https://wa.me/919004517938?text=${encodeURIComponent(message)}`;
  }
  if (!open) return null;
  return <div className="quick-form-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
    <section className="quick-form" role="dialog" aria-modal="true" aria-labelledby="quick-form-title">
      <div className="dialog-heading"><h2 id="quick-form-title">Create your custom look</h2><button type="button" className="icon-button" aria-label="Close custom order form" onClick={() => setOpen(false)}>×</button></div>
      <p className="quick-form-intro">Share a few details and we’ll continue personally on WhatsApp.</p>
      <form onSubmit={send}>
        <label>Your name<input name="name" autoComplete="name" required /></label>
        <label>Phone number<input name="phone" type="tel" inputMode="tel" autoComplete="tel" required /></label>
        <label>What would you like?<select name="outfit" defaultValue="Suit" required><option>Suit</option><option>Lehenga</option><option>Saree</option><option>Dress material</option></select></label>
        <label>Preferred colour<input name="colour" placeholder="Maroon and gold" /></label>
        <label className="form-wide">Tell us briefly<textarea name="details" rows={3} placeholder="Occasion, style, size or inspiration" required /></label>
        <button className="btn form-wide" type="submit">CONTINUE ON WHATSAPP</button>
      </form>
    </section>
  </div>;
}
