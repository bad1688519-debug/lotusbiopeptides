// Browser-like cart checks, using jsdom in GitHub Actions.
// Does not contact the live inquiry endpoint or open WhatsApp.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const html=`<!doctype html><html><head></head><body>
<button data-review>Review <span data-count>0</span></button>
<section data-product="Retatrutide">
  <label>Specification<select id="quote-spec">
    <option>30 mg × 10 vials · RT30</option>
    <option>50 mg × 10 vials · RT50</option>
  </select></label>
  <input type="number" id="quote-qty" min="1" max="100000" value="2">
  <button id="add-quote">Add to inquiry</button>
  <p id="quote-status"></p>
</section>
<dialog id="quote-review">
<button id="quote-close"></button><div id="quote-items"></div>
<p id="quote-storage"></p><a id="quote-email">Email</a><a id="quote-whatsapp">WhatsApp</a>
</dialog>
</body></html>`;
const dom=new JSDOM(html,{url:'https://lotusbiopeptides.com/',runScripts:'outside-only'});
const {window}=dom,{document}=window;
document.querySelector('#quote-review').showModal=()=>{};
document.querySelector('#quote-review').close=()=>{};
window.eval(readFileSync('quote.js','utf8'));
window.eval(readFileSync('listed-prices.js','utf8'));
document.querySelector('script[src="/listed-prices.js"]').dispatchEvent(new window.Event('load'));
assert.match(document.querySelector('#listed-price-display').textContent,/\$182\.00/);
const reply=document.querySelector('#quote-reply-email');
const company=document.querySelector('#quote-company');
const country=document.querySelector('#quote-country');
reply.value='buyer@example.com';reply.dispatchEvent(new window.Event('input'));
company.value='Sample Lab';company.dispatchEvent(new window.Event('input'));
country.value='Canada';country.dispatchEvent(new window.Event('input'));
document.querySelector('#add-quote').click();
assert.equal(document.querySelector('[data-count]').textContent,'1');
let list=document.querySelector('#quote-items').textContent;
assert.match(list,/\$364\.00/,'Two RT30 boxes should total $364');
let wa=new URL(document.querySelector('#quote-whatsapp').href);
let body=wa.searchParams.get('text');
assert.match(body,/RT30/);
assert.match(body,/\$182\.00/);
assert.match(body,/\$364\.00/);
assert.match(body,/buyer@example\.com/);
assert.match(body,/Sample Lab/);
assert.match(body,/Canada/);
assert.equal(new URL(document.querySelector('#quote-email').href).protocol,'mailto:');
const number=document.querySelector('.lb-quote-quantity input');
number.value='3';number.dispatchEvent(new window.Event('change'));
assert.match(document.querySelector('#quote-items').textContent,/\$546\.00/);
assert.match(new URL(document.querySelector('#quote-whatsapp').href).searchParams.get('text'),/\$546\.00/);
document.querySelector('#quote-spec').selectedIndex=1;
document.querySelector('#quote-spec').dispatchEvent(new window.Event('change'));
assert.match(document.querySelector('#listed-price-display').textContent,/\$245\.00/);
document.querySelector('#quote-qty').value='1';
document.querySelector('#add-quote').click();
assert.equal(document.querySelector('[data-count]').textContent,'2');
assert.match(document.querySelector('#quote-items').textContent,/\$791\.00/,'3 RT30 plus 1 RT50');
document.querySelector('.quote-row button').click();
assert.equal(document.querySelector('[data-count]').textContent,'1');
assert.match(document.querySelector('#quote-items').textContent,/\$245\.00/);
console.log('PASS: product prices, cart add/edit/remove, subtotal recalculation and coherent email/WhatsApp draft.');
