(() => {
 const input=document.querySelector('#catalog-search'); if(!input)return;
 const cards=[...document.querySelectorAll('[data-catalog-item]')];
 const normalize=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'');
 input.addEventListener('input',()=>{const q=normalize(input.value); let count=0;
 cards.forEach(card=>{const match=normalize(card.dataset.search).includes(q);card.hidden=!match;if(match)count++;});
 document.querySelector('#catalog-count').textContent=`Showing ${count} of ${cards.length} products`;
 document.querySelector('#catalog-empty').hidden=count!==0;});
})();
