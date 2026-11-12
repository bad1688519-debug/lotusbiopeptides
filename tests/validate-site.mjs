// Dependency-free verification for the Lotus Bio second-site static storefront.
// Run: node tests/validate-site.mjs  (Node.js 20+)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const sandbox={window:{}};
vm.runInNewContext(read('listed-prices.js'),sandbox);
const prices=sandbox.window.LOTUS_LISTED_PRICES;
const units=sandbox.window.LOTUS_LISTED_PRICE_UNITS;
assert.equal(Object.keys(prices).length,136,'Expect exactly 136 approved SKU prices from workbook (7)');
assert.equal(Object.values(prices).reduce((a,b)=>a+b,0),19604,'Unexpected change in price data');
assert.equal(prices.RT30,182);
assert.equal(prices.RT50,245);
assert.equal(prices.TI15,232);
assert.equal(prices.BA10,15);
assert.equal(units.PNA,'unit');
for(const [sku,value] of Object.entries(prices)){
  assert.match(sku,/^[A-Z0-9-]+$/);
  assert.ok(Number.isFinite(value)&&value>=0,'Invalid price for '+sku);
}
for(const js of ['app.js','quote.js','catalog.js','listed-prices.js']){
  new vm.Script(read(js),{filename:js});
}

const exceptions=new Set(['SM10','SM20','SM30','MS15']);
const productDir=path.join(root,'products');
let productPages=0,options=0,priced=0,requested=0;
for(const dirent of fs.readdirSync(productDir,{withFileTypes:true})){
  if(!dirent.isDirectory())continue;
  const filename=path.join(productDir,dirent.name,'index.html');
  if(!fs.existsSync(filename))continue;
  const html=fs.readFileSync(filename,'utf8');
  const select=html.match(/<select id="quote-spec">([\s\S]*?)<\/select>/);
  if(!select)continue;
  productPages++;
  assert.match(html,/\/quote\.js/,'Missing quote implementation: '+dirent.name);
  assert.match(html,/\/app\.js/,'Missing app actions: '+dirent.name);
  assert.match(html,/rel="canonical"/,'Missing canonical: '+dirent.name);
  for(const option of select[1].matchAll(/<option[^>]*>([^<]*)<\/option>/g)){
    options++;
    const sku=option[1].split('·').pop().trim();
    if(Object.hasOwn(prices,sku)){priced++;continue;}
    assert.ok(exceptions.has(sku),'Unpriced/unknown product SKU: '+dirent.name+' => '+sku);
    requested++;
  }
}
assert.ok(productPages>=40,'Unexpectedly few product pages');
assert.equal(requested,4,'Expected only four explicitly unpriced product options');
const catalog=read('wholesale-peptides/index.html');
for(const m of catalog.matchAll(/href="(\/products\/[^"]+\/?)"/g)){
  const target=path.join(root,m[1].slice(1),'index.html');
  assert.ok(fs.existsSync(target),'Broken product link: '+m[1]);
}
assert.match(read('index.html'),/https:\/\/lbiopeptides\.com\//,'Missing official site cross-link');
const quote=read('quote.js');
assert.match(quote,/mailto:info@lotusbio\.cn/);
assert.match(quote,/wa\.me\/85292734987/);
assert.match(quote,/listed-prices\.js/);
// Global procurement form must collect a destination, and every direct product draft
// must include the exact SKU and the listed-price line without displaying a discount.
const home=read('index.html');
assert.match(home,/name="country" required/,'Home inquiry country field must be required');
assert.match(home,/<form data-inquiry>/,'Home inquiry form missing');
const app=read('app.js');
assert.match(app,/lotus-prices-ready/,'Direct product drafts must update when prices load');
assert.match(app,/Listed unit price:/,'Direct product inquiry must list the confirmed unit price');
assert.match(app,/Listed subtotal:/,'Direct product inquiry must include calculated subtotal');
assert.match(quote,/\.qty=next|item\.qty=next/,'Buyer must be able to edit list quantities');
assert.match(quote,/quote-whatsapp/,'Cart must support WhatsApp draft');
assert.match(quote,/quote-email/,'Cart must support email draft');
assert.doesNotMatch(read('listed-prices.js'),/discount|coupon|percent off|special offer/i,
  'Do not advertise discounts in public price data');
console.log('PASS: '+productPages+' product pages, '+options+' selector options, '+priced+' priced options, '+requested+' marked price-on-request; 136 approved SKU prices, JS syntax, links and contact channels.');
