"use client";

import Reveal from "../components/reveal";
import { useEffect, useState } from "react";

type Product = { id: string; name: string; category: string; fabric: string; price: number; imageUrl: string; description: string };
export default function AdminPanel({ accessToken, onSignOut }: { accessToken: string; onSignOut: () => void }) {
  const [items, setItems] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  const auth = { Authorization: `Bearer ${accessToken}` };

  async function load() {
    const response = await fetch("/api/products", { headers: auth, cache: "no-store" });
    const data = await response.json() as {products?:Product[];error?:string};
    setItems(data.products || []);
    if (data.error) setMessage(data.error);
  }

  useEffect(() => { void load(); }, []);

  async function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const form = event.currentTarget;
    const response = await fetch("/api/products", { method: "POST", headers: { ...auth, "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    const data = await response.json() as {products?:Product[];error?:string};
    if (!response.ok) { setMessage(data.error || "Could not save product."); return; }
    form.reset();
    setMessage("Product added to the live catalogue.");
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Remove this product from the shop?")) return;
    const response = await fetch("/api/products?id=" + encodeURIComponent(id), { method: "DELETE", headers: auth });
    if (response.ok) await load();
    else { const data = await response.json() as {products?:Product[];error?:string}; setMessage(data.error || "Could not delete product."); }
  }

  async function edit(product: Product) {
    const price = prompt("New price in rupees", String(product.price));
    if (price === null) return;
    const imageUrl = prompt("Product image URL (leave blank for no image)", product.imageUrl || "");
    if (imageUrl === null) return;
    const response = await fetch("/api/products?id=" + encodeURIComponent(product.id), { method: "PATCH", headers: { ...auth, "content-type": "application/json" }, body: JSON.stringify({ price, imageUrl }) });
    const data = await response.json() as {products?:Product[];error?:string};
    if (!response.ok) { setMessage(data.error || "Could not update product."); return; }
    setMessage("Product updated.");
    await load();
  }

  return <main className="page"><Reveal>
    <p className="kicker">CATALOGUE MANAGEMENT</p>
    <h1>Products</h1>
    <p>Add products, update prices and photos, or remove listings from the public shop.</p>
    <button className="text-link" type="button" onClick={onSignOut}>SIGN OUT</button>
    {message && <p role="status">{message}</p>}
    <form className="adminform" onSubmit={add}>
      <label>Product name<input name="name" required maxLength={140}/></label>
      <label>Clothing type<select name="category" required><option value="suit">Suit</option><option value="lehenga">Lehenga</option><option value="material">Dress material</option></select></label>
      <label>Fabric<input name="fabric" placeholder="Silk, georgette…" maxLength={100}/></label>
      <label>Price (₹)<input name="price" type="number" min="1" required/></label>
      <label>Image URL<input name="imageUrl" type="url" placeholder="https://…"/></label>
      <label>Description<input name="description" maxLength={3000}/></label>
      <button className="btn" type="submit">ADD PRODUCT</button>
    </form>
    <h2>Current products ({items.length})</h2>
    {items.length ? <table className="adminlist"><thead><tr><th>Product</th><th>Type / fabric</th><th>Price</th><th>Actions</th></tr></thead><tbody>{items.map(product => <tr key={product.id}><td>{product.name}</td><td>{product.category} · {product.fabric}</td><td>₹{product.price.toLocaleString("en-IN")}</td><td><button onClick={() => void edit(product)}>Edit price / photo</button> <button className="danger" onClick={() => void remove(product.id)}>Remove</button></td></tr>)}</tbody></table> : <div className="empty">No products yet. Add the first real boutique item above.</div>}
  </Reveal></main>;
}
