const requestedId=Number(new URLSearchParams(location.search).get('item'));
loadProducts().then(()=>{
  const p=products.find(row=>row.id===requestedId);
  if(!p){document.querySelector('.product-info').innerHTML='<h1>Style unavailable</h1><p>This style is no longer shown in the collection.</p><a class="btn" href="/shop/">Browse styles ↗</a>';document.getElementById('productImage').hidden=true;return;}
  document.title=`${p.name} | Ranisa Boutique`;
  document.getElementById('crumb').textContent=p.name;
  document.getElementById('productCategory').textContent=p.category;
  document.getElementById('productName').textContent=p.name;
  document.getElementById('productDescription').textContent=p.description||'Ask the boutique about fabric, measurements and customisation.';
  document.getElementById('productPrice').textContent=p.price==null?'On request':money(p.price);
  const cartButton=document.getElementById('productCart');cartButton.dataset.addCart=p.id;cartButton.disabled=false;
  const photo=document.getElementById('productImage');
  const photos=[p.image_url,...(p.gallery_images||[])].map(validImage).filter(Boolean);
  if(photos.length){photo.src=photos[0];photo.alt=p.name;photo.hidden=false;}else{photo.hidden=true;document.getElementById('productNoImage').hidden=false;}
  const thumbs=document.getElementById('productGallery');
  thumbs.innerHTML=photos.length>1?photos.map((src,index)=>`<button type="button" aria-label="View photo ${index+1}" data-photo="${index}"><img src="${escapeHtml(src)}" alt="${escapeHtml(p.name)} photo ${index+1}"></button>`).join(''):'';
  thumbs.onclick=event=>{const button=event.target.closest('[data-photo]');if(button)photo.src=photos[Number(button.dataset.photo)];};
  const save=document.getElementById('productSave');
  function paint(){save.textContent=getSaved().includes(p.id)?'♥ Saved style':'♡ Save this style';}
  paint();save.onclick=()=>{let saved=getSaved();saved=saved.includes(p.id)?saved.filter(x=>x!==p.id):[...saved,p.id];localStorage.setItem('ranisaSaved',JSON.stringify(saved));updateCount();paint();notify(saved.includes(p.id)?'Style saved':'Style removed');};
  document.getElementById('relatedGrid').innerHTML=products.filter(x=>x.id!==p.id).slice(0,4).map(card).join('');
  document.querySelector('.product-info a[href="/contact/"]').href='/contact/?style='+encodeURIComponent(p.name);
}).catch(error=>{document.querySelector('.product-info').textContent=error.message;});
