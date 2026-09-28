let category='All';
const shopSearch=document.getElementById('shopSearch');
shopSearch.value=new URLSearchParams(location.search).get('q')||'';
function renderShop(){
  const query=shopSearch.value.toLowerCase().trim();
  const list=products.filter(p=>(category==='All'||p.category===category)&&(!query||`${p.name} ${p.category}`.toLowerCase().includes(query)));
  document.getElementById('shopGrid').innerHTML=list.map(card).join('');
  document.getElementById('resultCount').textContent=`Showing ${list.length} styles`;
  document.getElementById('noResults').hidden=!!list.length;
}
function renderCategories(){
  const panel=document.querySelector('.filter-panel');
  panel.innerHTML='<h2>Categories</h2>'+['All',...new Set(products.map(p=>p.category))].map(label=>`<button data-category="${escapeHtml(label)}" class="${category===label?'active':''}">${label==='All'?'All styles':escapeHtml(label)}</button>`).join('');
}
loadProducts().then(()=>{renderCategories();renderShop();}).catch(error=>{document.getElementById('resultCount').textContent=error.message;});
shopSearch.oninput=renderShop;
document.querySelector('.filter-panel').addEventListener('click',event=>{
  const button=event.target.closest('[data-category]');if(!button)return;
  category=button.dataset.category;renderCategories();renderShop();
});
document.addEventListener('ranisa:saved',renderShop);
