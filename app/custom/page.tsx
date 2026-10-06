"use client";

import { useState } from "react";
import Reveal from "../components/reveal";

export default function CustomOrder() {
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [error, setError] = useState("");

  function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const files = data.getAll("referenceImages").filter((item): item is File => item instanceof File && item.size > 0);
    const oversized = files.find(file => file.size > 10 * 1024 * 1024);
    if (oversized) {
      setError(`${oversized.name} is larger than 10 MB. Please choose a smaller image.`);
      return;
    }
    const imageLine = files.length ? `\nReference images selected: ${files.map(file => file.name).join(", ")}\nPlease attach these selected image(s) in this WhatsApp chat.` : "\nReference images: None attached";
    const message = `Hello Ranisa Boutique, I would like to enquire about a custom order.\n\nName: ${data.get("name")}\nPhone: ${data.get("phone") || "Not provided"}\nOutfit: ${data.get("outfit")}\nOccasion: ${data.get("occasion") || "Not specified"}\nPreferred colour: ${data.get("colour") || "Not specified"}\nFabric preference: ${data.get("fabric") || "Not specified"}\nMeasurements / size: ${data.get("measurements") || "To be discussed"}\nDesign details: ${data.get("details")}${imageLine}`;
    window.location.href = `https://wa.me/919004517938?text=${encodeURIComponent(message)}`;
  }

  function chooseImages(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 5) {
      e.target.value = "";
      setImageNames([]);
      setError("Please select up to 5 reference images.");
      return;
    }
    setError("");
    setImageNames(selected.map(file => file.name));
  }

  return <main className="page">
    
    <Reveal><p className="kicker">A LOOK OF YOUR OWN</p>
    <h1>Dream it.<br/><i>We’ll make it yours.</i></h1>
    <p>Share your outfit idea, occasion and reference images. Your order details will be prepared in a WhatsApp message to our boutique.</p>
    <form className="adminform custom-order-form" onSubmit={send}>
      <h2>Tell us about your order</h2>
      <label>Your name<input name="name" autoComplete="name" required/></label>
      <label>Your phone number<input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="Optional"/></label>
      <label>Outfit<select name="outfit" required defaultValue=""><option value="" disabled>Choose one</option><option>Suit</option><option>Lehenga</option><option>Saree</option><option>Dress material</option></select></label>
      <label>Occasion<input name="occasion" placeholder="Wedding, festive, party…"/></label>
      <label>Preferred colour<input name="colour" placeholder="For example, maroon and gold"/></label>
      <label>Fabric preference<input name="fabric" placeholder="If known"/></label>
      <label>Measurements or size<input name="measurements" placeholder="Optional; can be discussed on WhatsApp"/></label>
      <label className="form-wide">Design details<textarea name="details" required rows={4} placeholder="Describe the style, embroidery, sleeves, neckline or other details"/></label>
      <label className="form-wide upload-field">Reference images<input name="referenceImages" type="file" accept="image/*" multiple onChange={chooseImages}/><small>Select up to 5 images, 10 MB each. WhatsApp does not transfer images from this form, so after the chat opens, attach the same selected images there.</small></label>
      {imageNames.length > 0 && <p className="selected-images form-wide" aria-live="polite"><b>Selected:</b> {imageNames.join(", ")}</p>}
      {error && <p className="form-error form-wide" role="alert">{error}</p>}
      <button className="btn form-wide" type="submit">SEND ORDER DETAILS ON WHATSAPP</button>
    </form>
    <section className="section">
      <h2>Made to order, with care</h2>
      <div className="products">
        <article className="product"><b>01 · Share your idea</b><p>Tell us the outfit, occasion, colours and details you have in mind.</p></article>
        <article className="product"><b>02 · Plan it together</b><p>We’ll confirm design, measurements, price and estimated timing.</p></article>
        <article className="product"><b>03 · Made for you</b><p>Once details are agreed, we’ll begin creating your order.</p></article>
      </div>
    </section>
  </Reveal></main>;
}
