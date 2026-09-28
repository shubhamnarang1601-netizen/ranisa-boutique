const RANISA_DB = 'https://bhfmhzwcogfbnzpdrzih.supabase.co';
const RANISA_KEY = 'sb_publishable_POe4-O4LRqn7I-4D_Rz8sw_mxuwHFgp';
const products = [];
let productRequest;
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validImage = value => {
  const url = String(value || '');
  return /^\/assets\/[a-zA-Z0-9_.-]+$/.test(url) ||
    /^https:\/\/bhfmhzwcogfbnzpdrzih\.supabase\.co\/storage\/v1\/object\/public\/ranisa-products\/products\/[a-zA-Z0-9_.-]+$/.test(url) ? url : '';
};
const money = amount => amount == null ? 'Price on request' : new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(Number(amount));
async function publicRows(table, query) {
  const response = await fetch(`${RANISA_DB}/rest/v1/${table}?${query}`, {headers:{apikey:RANISA_KEY}});
  if (!response.ok) throw new Error('The catalogue is unavailable. Please try again later.');
  return response.json();
}
function loadProducts() {
  if (!productRequest) productRequest = publicRows('ranisa_products','select=id,name,category,description,price,image_url,gallery_images,badge,sort_order&is_active=eq.true&order=sort_order.asc,id.asc')
    .then(rows => { products.splice(0, products.length, ...rows); updateCount(); return products; })
    .catch(error => { productRequest = null; throw error; });
  return productRequest;
}
function getSaved() {
  try { const ids=JSON.parse(localStorage.getItem('ranisaSaved')||'[]');return Array.isArray(ids)?ids.filter(Number.isInteger):[]; }
  catch { return []; }
}
function updateCount() {
  const counter=document.getElementById('savedCount');
  if (counter) counter.textContent=getSaved().filter(id=>products.some(p=>p.id===id)).length;
}
function notify(message) {
  const t=document.getElementById('toast');if (!t) return;
  t.textContent=message;t.style.display='block';setTimeout(()=>t.style.display='none',2400);
}
function card(p) {
  const saved=getSaved().includes(p.id), image=validImage(p.image_url);
  return `<article class="card"><a class="card-photo-link" href="/product/?item=${p.id}"><div class="photo">${image?`<img src="${escapeHtml(image)}" alt="${escapeHtml(p.name)}" loading="lazy">`:'<span class="photo-empty">Photo coming soon</span>'}${p.badge?`<span class="badge">${escapeHtml(p.badge)}</span>`:''}</div><h3>${escapeHtml(p.name)}</h3></a><div class="category">${escapeHtml(p.category)}</div><div class="product-price">${money(p.price)}</div><button class="card-action cart-add" data-add-cart="${p.id}" aria-label="Add ${escapeHtml(p.name)} to cart">Add to cart +</button> <a class="card-action" href="/contact/?style=${encodeURIComponent(p.name)}">Enquire ↗</a> <button class="card-action" data-save="${p.id}" aria-label="${saved?'Remove':'Save'} ${escapeHtml(p.name)}">${saved?'♥ Saved':'♡ Save'}</button></article>`;
}
function mediaImage(slot, image, alt) {
  const url=validImage(image);
  if (slot==='hero') { const hero=document.querySelector('.hero');if(hero)hero.style.backgroundImage=url?`url("${url}")`:'none'; }
  else if (slot==='story') { const story=document.querySelector('.story-image');if(story)story.style.backgroundImage=url?`url("${url}")`:'none'; }
  else {
    let targets=[];
    if(slot==='logo') targets=[...document.querySelectorAll('.brand-mark')];
    if(slot==='about') targets=[...document.querySelectorAll('.about-grid img')];
    if(slot.startsWith('editorial_')) { const target=document.querySelectorAll('.editorial img')[Number(slot.slice(-1))-1];if(target)targets=[target]; }
    targets.forEach(el=>{el.hidden=!url;if(url){el.src=url;if(slot!=='logo')el.alt=alt||'';}});
    if(slot==='about') document.querySelector('.about-grid')?.classList.toggle('no-photo',!url);
    if(slot==='logo' && url) {const icon=document.querySelector('link[rel="icon"]');if(icon)icon.href=url;}
  }
}
publicRows('ranisa_site_media','select=slot,image_url,alt_text').then(rows=>rows.forEach(row=>mediaImage(row.slot,row.image_url,row.alt_text))).catch(()=>{});
updateCount();
const menu=document.getElementById('menuButton');
if(menu)menu.onclick=()=>{const n=document.getElementById('navigation');n.classList.toggle('open');menu.setAttribute('aria-expanded',n.classList.contains('open'));};
const savedButton=document.getElementById('savedButton');
if(savedButton)savedButton.onclick=()=>location.href='/saved/';
const search=document.getElementById('search');
if(search)search.addEventListener('keydown',e=>{if(e.key==='Enter')location.href='/shop/?q='+encodeURIComponent(search.value);});
document.addEventListener('click',event=>{
  const button=event.target.closest('[data-save]');if(!button)return;
  const id=Number(button.dataset.save);let saved=getSaved();
  saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];
  localStorage.setItem('ranisaSaved',JSON.stringify(saved));updateCount();
  button.textContent=saved.includes(id)?'♥ Saved':'♡ Save';
  const product=products.find(p=>p.id===id);
  if(product)button.setAttribute('aria-label',`${saved.includes(id)?'Remove':'Save'} ${product.name}`);
  notify(saved.includes(id)?'Style saved':'Style removed');
  document.dispatchEvent(new Event('ranisa:saved'));
});

// Customer account access and quick WhatsApp contact on every public page.
function showAccountLink() {
  let active=false;
  try { const session=JSON.parse(sessionStorage.getItem('ranisaOtplessSession')||'null'); active=active||!!(session?.email&&session.expiresAt>Date.now()/1000); } catch {}
  document.querySelectorAll('[data-account-link]').forEach(link=>{link.textContent=active?'My account':'Login / Sign up';});
}
showAccountLink();
const cartNav=document.getElementById('navigation');
if(cartNav){const link=document.createElement('a');link.href='/cart/';link.id='cartNavLink';link.textContent='Cart';if(document.body.dataset.page==='cart')link.classList.add('active');cartNav.appendChild(link);}
const headerTools=document.querySelector('.tools');
if(headerTools&&!document.getElementById('cartHeaderLink')){
  const link=document.createElement('a');
  link.href='/cart/';
  link.id='cartHeaderLink';
  link.className='iconbtn header-cart';
  link.setAttribute('aria-label','View cart');
  link.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 4h2l2.2 10h10.9l2-7H6M9 19a1 1 0 1 0 0 .01M17 19a1 1 0 1 0 0 .01"/></svg><span class="count" id="cartHeaderCount" hidden>0</span>';
  headerTools.insertBefore(link,document.getElementById('savedButton')||document.getElementById('menuButton'));
}
const customerSession=()=>{try{const value=JSON.parse(sessionStorage.getItem('ranisaOtplessSession')||'null');return value?.idToken&&value.expiresAt>Date.now()/1000?value:null;}catch{return null;}};
let cartLoginContinues=false;
function cartLoginDialog(){
  let dialog=document.getElementById('cartLoginDialog');
  if(dialog)return dialog;
  dialog=document.createElement('dialog');
  dialog.id='cartLoginDialog';
  dialog.className='cart-login-dialog';
  dialog.setAttribute('aria-labelledby','cartLoginTitle');
  dialog.innerHTML='<div class="cart-login-content"><button class="cart-login-close" type="button" aria-label="Close sign in">×</button><span class="kicker">Your Ranisa cart</span><h2 id="cartLoginTitle">Sign in to add this style</h2><p>Please continue with Google. Your selected style will be added to your cart after you sign in.</p><div class="cart-login-actions"><a class="btn" href="/account/?return=%2Fcart%2F" data-cart-login-continue>Continue with Google</a><button class="btn btn-outline" type="button" data-cart-login-cancel>Cancel</button></div></div>';
  document.body.appendChild(dialog);
  const close=()=>{if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');};
  dialog.querySelector('[data-cart-login-continue]').addEventListener('click',()=>{cartLoginContinues=true;});
  dialog.querySelector('[data-cart-login-cancel]').addEventListener('click',close);
  dialog.querySelector('.cart-login-close').addEventListener('click',close);
  dialog.addEventListener('click',event=>{if(event.target===dialog)close();});
  dialog.addEventListener('close',()=>{if(!cartLoginContinues)sessionStorage.removeItem('ranisaPendingCartProduct');cartLoginContinues=false;});
  return dialog;
}
function showCartLogin(productId){
  sessionStorage.setItem('ranisaPendingCartProduct',String(productId));
  const dialog=cartLoginDialog();
  cartLoginContinues=false;
  if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
}
let cartItems=[];
function updateCartCount(){
  const total=cartItems.reduce((n,item)=>n+item.quantity,0);
  const navLink=document.getElementById('cartNavLink');
  if(navLink)navLink.textContent=`Cart${total?' ('+total+')':''}`;
  const headerLink=document.getElementById('cartHeaderLink'),badge=document.getElementById('cartHeaderCount');
  if(headerLink)headerLink.setAttribute('aria-label',total?`View cart, ${total} item${total===1?'':'s'}`:'View cart');
  if(badge){badge.textContent=total;badge.hidden=!total;}
}
async function cartRequest(action,productId,quantity){
  const session=customerSession();if(!session)throw new Error('Please sign in with Google to use your cart.');
  const response=await fetch(`${RANISA_DB}/functions/v1/ranisa-cart`,{method:'POST',headers:{apikey:RANISA_KEY,'Content-Type':'application/json'},body:JSON.stringify({idToken:session.idToken,action,productId,quantity})});
  const payload=await response.json();
  if(response.status===401){sessionStorage.removeItem('ranisaOtplessSession');showAccountLink();}
  if(!response.ok)throw new Error(payload.error||'The cart is unavailable. Please try again.');
  cartItems=payload.items||[];updateCartCount();document.dispatchEvent(new Event('ranisa:cart'));return cartItems;
}
async function addToCartItem(productId){
  if(!Number.isInteger(productId))throw new Error('Choose a valid style.');
  if(!customerSession()){showCartLogin(productId);return;}
  await cartRequest('list');
  const existing=cartItems.find(item=>item.product_id===productId);
  await cartRequest('set',productId,Math.min((existing?.quantity||0)+1,20));
  notify('Added to your cart');
}
if(customerSession())cartRequest('list').catch(()=>{});
document.addEventListener('click',async event=>{
  const button=event.target.closest('[data-add-cart]');if(!button||button.disabled)return;
  button.disabled=true;
  try{await addToCartItem(Number(button.dataset.addCart));}
  catch(error){notify(error.message);}
  finally{button.disabled=false;}
});
const whatsappLink=document.createElement('a');
whatsappLink.className='whatsapp-float';
whatsappLink.href='https://wa.me/919004517938?text='+encodeURIComponent('Hello Ranisa Boutique, I would like to enquire about your collection.');
whatsappLink.target='_blank';
whatsappLink.rel='noopener noreferrer';
whatsappLink.setAttribute('aria-label','Chat with Ranisa Boutique on WhatsApp');
whatsappLink.innerHTML='<svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 3a13 13 0 0 0-11.2 19.5L3 29l6.7-1.8A13 13 0 1 0 16 3Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M11 9c-.8 0-1.7 1.7-1.7 2.8 0 3.2 5.2 9.1 10 9.1 1.3 0 3.3-1.2 3.3-2.2 0-.6-2.8-2.1-3.3-2.1-.5 0-1.2 1.2-1.9 1.2-.8 0-3.5-2.7-4.3-3.8-.3-.5.7-1.3.7-1.8 0-.6-1.4-3-2.2-3Z" fill="currentColor"/></svg>';
document.body.appendChild(whatsappLink);
