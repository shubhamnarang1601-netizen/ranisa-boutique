let activeCategory='All';
const homeCards=document.getElementById('cards');
function renderHome(){
  const query=(document.getElementById('search')?.value||'').trim().toLowerCase();
  const found=products.filter(p=>(activeCategory==='All'||p.category===activeCategory)&&(!query||`${p.name} ${p.category}`.toLowerCase().includes(query)));
  homeCards.innerHTML=found.slice(0,8).map(card).join('');
  document.getElementById('empty').style.display=found.length?'none':'block';
  const arrivals=products.filter(p=>p.badge.toLowerCase()==='new');
  document.getElementById('arrivalCards').innerHTML=(arrivals.length?arrivals:products.slice(-4)).slice(0,4).map(card).join('');
}
function renderFilters(){
  const categories=['All',...new Set(products.map(p=>p.category))];
  const box=document.getElementById('filters');
  box.innerHTML=categories.map(category=>`<button class="chip ${category===activeCategory?'active':''}" data-filter="${escapeHtml(category)}">${category==='All'?'All styles':escapeHtml(category)}</button>`).join('');
}
loadProducts().then(()=>{renderFilters();renderHome();}).catch(error=>{homeCards.textContent=error.message;document.getElementById('empty').style.display='none';});
document.getElementById('filters').addEventListener('click',event=>{
  const button=event.target.closest('[data-filter]');if(!button)return;
  activeCategory=button.dataset.filter;renderFilters();renderHome();
  document.getElementById('collection').scrollIntoView({behavior:'smooth'});
});
document.querySelectorAll('.editorial [data-filter]').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();activeCategory=products.some(p=>p.category===link.dataset.filter)?link.dataset.filter:'All';
  renderFilters();renderHome();document.getElementById('collection').scrollIntoView({behavior:'smooth'});
}));
const homeSearch=document.getElementById('search');
if(homeSearch)homeSearch.addEventListener('input',()=>{activeCategory='All';renderFilters();renderHome();});
document.getElementById('contactButton').onclick=()=>location.href='/contact/';
document.addEventListener('ranisa:saved',renderHome);
const modal=document.getElementById('modal');
if(modal){document.getElementById('closeModal').onclick=()=>modal.classList.remove('open');modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});document.addEventListener('keydown',e=>{if(e.key==='Escape')modal.classList.remove('open')});}
