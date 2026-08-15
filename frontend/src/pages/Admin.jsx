import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit2, LogOut, Package, X, ArrowLeft, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import {
  fetchProducts,
  adminLogin,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  getToken,
  clearToken,
} from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';

const emptyForm = {
  id: '', title: '', price: '', compareAt: '', fabric: '', description: '',
  collections: '', colors: '', sizes: '', images: [],
};

const LoginView = ({ onLogin }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await adminLogin(user, pass);
      onLogin();
    } catch {
      toast({ title: 'Invalid credentials', description: 'Try admin / ranisa123', variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm border border-border p-8 rounded-sm">
        <div className="text-center mb-8">
          <span className="font-serif-display text-3xl font-semibold text-primary">Ranisa</span>
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
          <Button type="submit" disabled={busy} className="w-full rounded-none uppercase tracking-widest">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-6">Demo: admin / ranisa123</p>
      </div>
    </div>
  );
};

const ProductForm = ({ initial, onClose, onSaved }) => {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const onFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const urls = [];
      for (const f of files) {
        const url = await uploadImage(f);
        urls.push(url);
      }
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
      toast({ title: `${urls.length} photo(s) added` });
    } catch {
      toast({ title: 'Upload failed', variant: 'destructive' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const addUrl = () => {
    const url = window.prompt('Paste image URL');
    if (url && url.trim()) setForm((prev) => ({ ...prev, images: [...prev.images, url.trim()] }));
  };

  const removeImg = (idx) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || form.images.length === 0) {
      toast({ title: 'Missing fields', description: 'Title, price and at least one photo are required.', variant: 'destructive' });
      return;
    }
    const payload = {
      title: form.title,
      price: Number(form.price),
      compareAt: form.compareAt ? Number(form.compareAt) : null,
      fabric: form.fabric,
      description: form.description,
      collections: form.collections.split(',').map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      images: form.images,
    };
    setSaving(true);
    try {
      if (form.id) await updateProduct(form.id, payload);
      else await createProduct(payload);
      toast({ title: form.id ? 'Product updated' : 'Product added', description: form.title });
      onSaved();
    } catch {
      toast({ title: 'Save failed', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-white z-10">
          <h2 className="font-serif-display text-2xl">{form.id ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-widest">Title *</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-none mt-1.5" />
          </div>

          {/* Photos */}
          <div>
            <Label className="text-xs uppercase tracking-widest">Photos *</Label>
            <div className="mt-2 grid grid-cols-4 sm:grid-cols-5 gap-2">
              {form.images.map((src, i) => (
                <div key={i} className="relative group aspect-[3/4] bg-secondary overflow-hidden border border-border">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImg(i)} className="absolute top-1 right-1 bg-black/60 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="aspect-[3/4] border border-dashed border-border flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary hover:text-primary transition-colors text-muted-foreground">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                <span className="text-[0.6rem] uppercase tracking-wider">Upload</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />
              </label>
            </div>
            <button type="button" onClick={addUrl} className="text-xs text-muted-foreground hover:text-primary mt-2 flex items-center gap-1">
              <ImageIcon className="w-3 h-3" /> or add by URL
            </button>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs uppercase tracking-widest">Collections</Label>
              <Input value={form.collections} onChange={(e) => setForm({ ...form, collections: e.target.value })} className="rounded-none mt-1.5" placeholder="casual-wear, party-wear, ethnic-wear" />
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
            <Button type="submit" disabled={saving} className="rounded-none uppercase tracking-widest flex-1">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Product'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="rounded-none">Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Admin = () => {
  const [authed, setAuthed] = useState(() => !!getToken());
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formInitial, setFormInitial] = useState(null);
  const { toast } = useToast();

  const load = useCallback(() => {
    setLoading(true);
    fetchProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  const logout = () => {
    clearToken();
    setAuthed(false);
  };

  const openNew = () => setFormInitial({ ...emptyForm });

  const openEdit = (p) => {
    setFormInitial({
      id: p.id,
      title: p.title,
      price: p.price,
      compareAt: p.compareAt || '',
      fabric: p.fabric || '',
      description: p.description || '',
      collections: (p.collections || []).join(', '),
      colors: (p.colors || []).join(', '),
      sizes: (p.sizes || []).join(', '),
      images: p.images || [],
    });
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      toast({ title: 'Product deleted' });
      load();
    } catch {
      toast({ title: 'Delete failed', variant: 'destructive' });
    }
  };

  if (!authed) return <LoginView onLogin={() => setAuthed(true)} />;

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mb-2"><ArrowLeft className="w-3 h-3" /> Back to store</Link>
          <h1 className="font-serif-display text-3xl font-medium flex items-center gap-2"><Package className="w-6 h-6 text-primary" /> Product Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">{loading ? 'Loading…' : `${products.length} products in catalogue`}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openNew} className="rounded-none uppercase tracking-widest gap-1.5"><Plus className="w-4 h-4" /> Add</Button>
          <Button variant="outline" onClick={logout} className="rounded-none gap-1.5"><LogOut className="w-4 h-4" /> Logout</Button>
        </div>
      </div>

      <div className="border border-border rounded-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-secondary text-xs uppercase tracking-widest text-muted-foreground">
          <div className="col-span-6">Product</div>
          <div className="col-span-2 hidden lg:block">Price</div>
          <div className="col-span-2 hidden lg:block">Collections</div>
          <div className="col-span-6 lg:col-span-2 text-right">Actions</div>
        </div>
        {loading ? (
          <div className="p-10 text-center text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
        ) : products.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">No products yet. Click "Add" to create one.</div>
        ) : (
          products.map((p) => (
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
          ))
        )}
      </div>

      {formInitial && (
        <ProductForm
          initial={formInitial}
          onClose={() => setFormInitial(null)}
          onSaved={() => {
            setFormInitial(null);
            load();
          }}
        />
      )}
    </div>
  );
};

export default Admin;
