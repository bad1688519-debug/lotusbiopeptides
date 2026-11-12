(() => {
 const input=document.querySelector('#catalog-search'); if(!input)return;
 const cards=[...document.querySelectorAll('[data-catalog-item]')];
 const normalize=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'');
 function renderListedPrices(){const priceMap=window.LOTUS_LISTED_PRICES;if(!priceMap)return;cards.forEach(card=>{const tokens=(card.dataset.search||'').toUpperCase().match(/[A-Z0-9-]+/g)||[];const matched=[...new Set(tokens.filter(s=>Object.prototype.hasOwnProperty.call(priceMap,s)))];if(!matched.length)return;const values=matched.map(s=>priceMap[s]);const lowest=Math.min(...values);let note=card.querySelector('.catalog-price-note');if(!note){note=document.createElement('p');note.className='catalog-price-note';const formats=card.querySelector('.catalog-formats');formats?.after(note);}if(note){note.textContent='Listed from ,()=>{const q=normalize(input.value); let count=0;
 cards.forEach(card=>{const match=normalize(card.dataset.search).includes(q);card.hidden=!match;if(match)count++;});
 document.querySelector('#catalog-count').textContent=`Showing ${count} of ${cards.length} products`;
 document.querySelector('#catalog-empty').hidden=count!==0;});
})();
+lowest.toFixed(2)+' / box';note.setAttribute('aria-label','Standard listed price starts at '+lowest.toFixed(2)+' US dollars per box. Shipping is excluded.');}});}document.addEventListener('lotus-prices-ready',renderListedPrices);renderListedPrices();
 input.addEventListener('input',()=>{const q=normalize(input.value); let count=0;
 cards.forEach(card=>{const match=normalize(card.dataset.search).includes(q);card.hidden=!match;if(match)count++;});
 document.querySelector('#catalog-count').textContent=`Showing ${count} of ${cards.length} products`;
 document.querySelector('#catalog-empty').hidden=count!==0;});
})();
