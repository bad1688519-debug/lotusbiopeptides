(() => {
 const input=document.getElementById('coa-search');
 const cards=[...document.querySelectorAll('.coa-card')];
 input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();let count=0;for(const card of cards){card.hidden=!card.textContent.toLowerCase().includes(q);if(!card.hidden)count++;}document.getElementById('coa-count').textContent=count+' reports';document.getElementById('coa-empty').hidden=count>0;});
})();
