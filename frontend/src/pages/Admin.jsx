import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, LogOut, Package, X, ArrowLeft } from 'lucide-react';
import { PRODUCTS as SEED } from '../data/mock';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';

const STORE_KEY = 'roshni_admin_products_v1';
const AUTH_KEY = 'roshni_admin_auth_v1';

// NOTE: This admin uses localStorage as a MOCK store for the frontend-only phase.
// It will be replaced by real backend APIs.
const loadProducts = () => {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED;
};

const emptyForm = {
  id: '', title: '', price: '', compareAt: '', fabric: '', description: '',
  collections: '', colors: '', sizes: '', images: '',
};

const LoginView = ({ onLogin }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const { toast } = useToast();

  const submit = (e) => {
    e.preventDefault();
    // MOCK auth: admin / roshni123
    if (user === 'admin' && pass === 'roshni123') {
      localStorage.setItem(AUTH_KEY, '1');
      onLogin();
    } else {
      toast({ title: 'Invalid credentials', description: 'Try admin / roshni123', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm border border-border p-8 rounded-sm">
        <div className="text-center mb-8">
          <span className="font-serif-display text-3xl font-semibold text-primary">Roshni</span>
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mt-1">Admin Panel</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-widest">Username</Label>
            <Input value={user} onChange={(e) => setUser(e.target.value)} className="rounded-none mt-1.5" placeholder="admin" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest">Password</Label>
            <Input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="rounded-none mt-1.5" placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full rounded-none uppercase tracking-widest">Sign In</Button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-6">Demo: admin / roshni123</p>
      </div>
    </div>
  );
};

const Admin = () => {
  const [authed, setAuthed] = useState(() => localStorage.getItem(AUTH_KEY) === '1');
  const [products, setProducts] = useState(loadProducts);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(products));
  }, [products]);

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  };

  const openNew = () => {
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setForm({
      id: p.id,
      title: p.title,
      price: p.price,
      compareAt: p.compareAt || '',
      fabric: p.fabric || '',
      description: p.description || '',
      collections: (p.collections || []).join(', '),
      colors: (p.colors || []).join(', '),
      sizes: (p.sizes || []).join(', '),
      images: (p.images || []).join(', '),
    });
    setShowForm(true);
  };

  const save = (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.images) {
      toast({ title: 'Missing fields', description: 'Title, price and at least one image are required.', variant: 'destructive' });
      return;
    }
    const parsed = {
      id: form.id || String(Date.now()),
      slug: (form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')) + '-' + (form.id || Date.now()).toString().slice(-4),
      title: form.title,
      price: Number(form.price),
      compareAt: form.compareAt ? Number(form.compareAt) : null,
      fabric: form.fabric,
      description: form.description,
      collections: form.collections.split(',').map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
    };
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === parsed.id);
      if (exists) return prev.map((p) => (p.id === parsed.id ? { ...p, ...parsed } : p));
      return [parsed, ...prev];
    });
    toast({ title: form.id ? 'Product updated' : 'Product added', description: parsed.title });
    setShowForm(false);
    setForm(emptyForm);
  };

  const remove = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast({ title: 'Product deleted' });
  };

  const resetSeed = () => {
    setProducts(SEED);
    toast({ title: 'Catalogue reset to defaults' });
  };

  if (!authed) return <LoginView onLogin={() => setAuthed(true)} />;

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mb-2"><ArrowLeft className="w-3 h-3" /> Back to store</Link>
          <h1 className="font-serif-display text-3xl font-medium flex items-center gap-2"><Package className="w-6 h-6 text-primary" /> Product Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} products in catalogue</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openNew} className="rounded-none uppercase tracking-widest gap-1.5"><Plus className="w-4 h-4" /> Add</Button>
          <Button variant="outline" onClick={logout} className="rounded-none gap-1.5"><LogOut className="w-4 h-4" /> Logout</Button>
        </div>
      </div>

      <div className="border border-border rounded-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-secondary text-xs uppercase tracking-widest text-muted-foreground">
          <div className="col-span-6 lg:col-span-6">Product</div>
          <div className="col-span-2 hidden lg:block">Price</div>
          <div className="col-span-4 lg:col-span-2 hidden lg:block">Collections</div>
          <div className="col-span-6 lg:col-span-2 text-right">Actions</div>
        </div>
        {products.map((p) => (
          <div key={p.id} className="grid grid-cols-12 gap-4 px-4 py-3 border-t border-border items-center">
            <div className="col-span-6 flex items-center gap-3 min-w-0">
              <img src={p.images?.[0]} alt="" className="w-12 h-14 object-cover bg-secondary shrink-0" />
              <span className="text-sm line-clamp-2">{p.title}</span>
            </div>
            <div className="col-span-2 hidden lg:block text-sm">Rs. {Number(p.price).toLocaleString('en-IN')}</div>
            <div className="col-span-2 hidden lg:block text-xs text-muted-foreground capitalize">{(p.collections || []).slice(0, 2).join(', ')}</div>
            <div className="col-span-6 lg:col-span-2 flex justify-end gap-2">
              <button onClick={() => openEdit(p)} className="p-2 border border-border hover:bg-secondary transition-colors" aria-label="Edit"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => remove(p.id)} className="p-2 border border-border hover:bg-destructive hover:text-destructive-foreground transition-colors" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={resetSeed} className="text-xs text-muted-foreground hover:text-primary mt-4">Reset catalogue to defaults</button>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-sm" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-white">
              <h2 className="font-serif-display text-2xl">{form.id ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={save} className="p-6 space-y-4">
              <div>
                <Label className="text-xs uppercase tracking-widest">Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-none mt-1.5" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs uppercase tracking-widest">Price (Rs) *</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-none mt-1.5" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-widest">Compare-at (Rs)</Label>
                  <Input type="number" value={form.compareAt} onChange={(e) => setForm({ ...form, compareAt: e.target.value })} className="rounded-none mt-1.5" />
                </div>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-widest">Image URLs (comma separated) *</Label>
                <Textarea value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="rounded-none mt-1.5" rows={2} placeholder="https://... , https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs uppercase tracking-widest">Collections</Label>
                  <Input value={form.collections} onChange={(e) => setForm({ ...form, collections: e.target.value })} className="rounded-none mt-1.5" placeholder="new-in, party-wear" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-widest">Fabric</Label>
                  <Input value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} className="rounded-none mt-1.5" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs uppercase tracking-widest">Colors</Label>
                  <Input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} className="rounded-none mt-1.5" placeholder="Black, Brown" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-widest">Sizes</Label>
                  <Input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className="rounded-none mt-1.5" placeholder="S, M, L, XL" />
                </div>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-widest">Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-none mt-1.5" rows={3} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="rounded-none uppercase tracking-widest flex-1">Save Product</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="rounded-none">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
