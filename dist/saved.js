function renderSaved(){
  const ids=getSaved();const list=products.filter(p=>ids.includes(p.id));
  document.getElementById('savedGrid').innerHTML=list.map(card).join('');
  document.getElementById('savedEmpty').hidden=!!list.length;
}
loadProducts().then(renderSaved).catch(error=>{document.getElementById('savedGrid').textContent=error.message;});
document.addEventListener('ranisa:saved',renderSaved);
