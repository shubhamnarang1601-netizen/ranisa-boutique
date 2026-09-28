const cartList=document.getElementById('cartList');
const cartStatus=document.getElementById('cartStatus');
const cartTotal=document.getElementById('cartTotal');
const cartEnquiry=document.getElementById('cartEnquiry');

function renderCart(){
  if(!customerSession()){
    cartList.innerHTML='<div class="cart-empty"><h2>Sign in to view your cart</h2><p>Your selected styles are saved to your Google account.</p><a class="btn" href="/account/?return=%2Fcart%2F">Continue with Google</a></div>';
    cartTotal.textContent='';cartEnquiry.hidden=true;return;
  }
  if(!cartItems.length){
    cartList.innerHTML='<div class="cart-empty"><h2>Your cart is empty</h2><p>Explore the collection and add styles you would like to ask about.</p><a class="btn" href="/shop/">Explore styles</a></div>';
    cartTotal.textContent='';cartEnquiry.hidden=true;return;
  }
  let total=0,allPriced=true;
  cartList.innerHTML=cartItems.map(item=>{
    const p=products.find(product=>product.id===item.product_id);
    if(!p)return `<article class="cart-row"><div><h2>Style no longer available</h2><p>Remove this style from your cart.</p></div><button class="btn btn-outline" data-cart-remove="${item.product_id}">Remove</button></article>`;
    const image=validImage(p.image_url);
    if(p.price==null)allPriced=false;else total+=Number(p.price)*item.quantity;
    return `<article class="cart-row">${image?`<a href="/product/?item=${p.id}"><img src="${escapeHtml(image)}" alt="${escapeHtml(p.name)}"></a>`:''}<div class="cart-row-info"><a href="/product/?item=${p.id}"><h2>${escapeHtml(p.name)}</h2></a><p>${escapeHtml(p.category)} · ${money(p.price)}</p><div class="cart-controls"><button data-cart-decrease="${p.id}" aria-label="Reduce quantity of ${escapeHtml(p.name)}">−</button><span aria-label="Quantity ${item.quantity}">${item.quantity}</span><button data-cart-increase="${p.id}" ${item.quantity>=20?'disabled':''} aria-label="Increase quantity of ${escapeHtml(p.name)}">+</button><button class="cart-remove" data-cart-remove="${p.id}">Remove</button></div></div></article>`;
  }).join('');
  cartTotal.textContent=allPriced?`Estimated total: ${money(total)}`:'Price on request · Final price and availability confirmed by Ranisa Boutique.';
  const summary=cartItems.map(item=>{const p=products.find(product=>product.id===item.product_id);return `• ${p?.name||'Style '+item.product_id} × ${item.quantity}`;}).join('\n');
  cartEnquiry.href='https://wa.me/919004517938?text='+encodeURIComponent(`Hello Ranisa Boutique, I would like to enquire about these styles from my cart:\n${summary}\nPlease confirm availability, price and custom measurements.`);
  cartEnquiry.hidden=false;
}

async function initializeCart(){
  if(!customerSession()){renderCart();return;}
  cartStatus.textContent='Loading your cart…';
  try{await Promise.all([loadProducts(),cartRequest('list')]);cartStatus.textContent='';renderCart();}
  catch(error){cartStatus.textContent=error.message;renderCart();}
}
cartList.addEventListener('click',async event=>{
  const button=event.target.closest('[data-cart-increase],[data-cart-decrease],[data-cart-remove]');
  if(!button||button.disabled)return;
  const id=Number(button.dataset.cartIncrease??button.dataset.cartDecrease??button.dataset.cartRemove);
  const item=cartItems.find(row=>row.product_id===id);
  if(!item)return;
  button.disabled=true;cartStatus.textContent='Updating cart…';
  try{
    if(button.hasAttribute('data-cart-remove')||(button.hasAttribute('data-cart-decrease')&&item.quantity===1))await cartRequest('remove',id);
    else await cartRequest('set',id,item.quantity+(button.hasAttribute('data-cart-increase')?1:-1));
    cartStatus.textContent='';renderCart();
  }catch(error){cartStatus.textContent=error.message;button.disabled=false;}
});
initializeCart();
