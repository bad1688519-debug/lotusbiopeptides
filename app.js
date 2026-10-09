document.querySelectorAll('form[data-inquiry]').forEach(form => {
  const params = new URLSearchParams(location.search);
  if (form.elements.product && params.get('product')) form.elements.product.value = params.get('product');
  if (form.elements.requirements && params.get('report')) form.elements.requirements.value = 'Please confirm the batch documentation associated with Janoshik report #' + params.get('report') + '.';
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const labels = {company:'Company / name',email:'Email',country:'Destination country',product:'Product / specification',quantity:'Estimated quantity',frequency:'Purchase frequency',whatsapp:'WhatsApp',requirements:'Requirements'};
    const body = Object.entries(labels).filter(([key])=>data.has(key)).map(([key,label])=>label+': '+data.get(key)).join('\n');
    const subject = data.get('request_type') === 'COA documentation request' ? 'LotusBio COA documentation request' : 'LotusBio wholesale inquiry';
    let panel = form.querySelector('#email-fallback');
    if (!panel) {panel=document.createElement('div');panel.id='email-fallback';form.append(panel);}
    panel.replaceChildren();
    const status=document.createElement('p');status.setAttribute('role','status');status.textContent='Sending your inquiry…';panel.append(status);
    const email=document.createElement('a');email.className='button';email.textContent='Open email draft';email.href='mailto:info@lotusbio.cn?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    const whatsapp=document.createElement('a');whatsapp.className='button';whatsapp.textContent='Open WhatsApp draft';whatsapp.href='https://wa.me/85292734987?text='+encodeURIComponent(body);whatsapp.target='_blank';whatsapp.rel='noopener';
    const copy=document.createElement('button');copy.type='button';copy.className='button';copy.textContent='Copy inquiry';copy.onclick=async()=>{try{await navigator.clipboard.writeText(body);status.textContent='Copied. Paste into an email to info@lotusbio.cn.';}catch{status.textContent='Copy is unavailable. Use the email or WhatsApp draft, or copy the fields manually.';}};
    panel.append(email,whatsapp,copy);
    const submit=form.querySelector('[type="submit"]');submit.disabled=true;
    const payload={subject,company:data.get('company'),email:data.get('email'),_replyto:data.get('email'),requirements:body};
    try {await window.sendLotusInquiry(payload);status.textContent='Your inquiry was accepted for delivery. Reply email: '+data.get('email')+'.';}
    catch {status.textContent='We could not confirm delivery. Your details remain in the form. Use an email or WhatsApp draft below.';}
    finally {submit.disabled=false;}
  });
});

// Native dialog keeps confirmation independent of any framework or hydration.
const gate = document.querySelector('#age-confirmation');
let accepted = false;
try { accepted = sessionStorage.getItem('lotusbio-rebuild-age') === 'accepted'; } catch {}
if (gate && !accepted) gate.showModal();
document.querySelector('#age-continue')?.addEventListener('click', () => {
  try { sessionStorage.setItem('lotusbio-rebuild-age', 'accepted'); } catch {}
  gate.close();
});
document.querySelector('#age-leave')?.addEventListener('click', () => { location.href = 'https://www.google.com/'; });
gate?.addEventListener('cancel', event => event.preventDefault());


// Keep the browser tab icon aligned with the green product-box brand mark.
const LOTUSBIO_FAVICON = '/assets/favicon.png';
(() => {
  let icon = document.querySelector('link[rel~="icon"]');
  if (!icon) {
    icon = document.createElement('link');
    icon.rel = 'icon';
    document.head.append(icon);
  }
  icon.type = 'image/png';
  icon.href = LOTUSBIO_FAVICON;
})();

// Use the transparent high-resolution LotusBio logo across shared site chrome.
const LOTUSBIO_SITE_LOGO = '/assets/logo.png';
(() => {
  document.querySelectorAll('img[src="/assets/logo.jpg"]').forEach((img) => {
    img.src = LOTUSBIO_SITE_LOGO;
    img.width = 1600;
    img.height = 486;
  });
})();

// Show both WhatsApp accounts as named contact cards.
(() => {
  const style = document.createElement('style');
  style.textContent = `
    .lb-support{grid-column:1/-1;min-width:0}
    .lb-support .lb-support-title{font-size:20px;line-height:1.3;letter-spacing:0;text-transform:none;margin:0 0 16px;color:inherit}
    .lb-support-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
    .lb-support .lb-support-card{display:grid;grid-template-columns:52px minmax(0,1fr);gap:12px;align-items:center;padding:20px;border:1px solid #d6e6df;border-radius:14px;background:#f4faf7;color:#112737;min-width:0}
    .lb-support .lb-support-avatar{display:block;width:52px;height:52px;max-width:none;margin:0;padding:7px;border-radius:50%;background:#fff;object-fit:contain;filter:none;opacity:1}
    .lb-support .lb-support-name{display:block;font-size:15px;font-weight:700;line-height:1.4}
    .lb-support .lb-support-role{display:block;margin-top:4px;font-size:12px;color:#526c63;line-height:1.4}
    .lb-support .lb-support-phone{display:block;grid-column:1/-1;margin:2px 0 0;font-size:16px;letter-spacing:.3px;color:#143e32;line-height:1.5}
    .lb-support .lb-support-button{display:flex;grid-column:1/-1;align-items:center;justify-content:center;gap:8px;margin:2px 0 0;padding:12px 14px;border-radius:8px;background:#176b4b;color:#fff;font-size:13px;font-weight:700;line-height:1.4;text-decoration:none}
    .lb-support .lb-support-button:hover{background:#105438;color:#fff}
    .lb-support .lb-support-phone:hover{text-decoration:underline;color:#176b4b}
    .lb-support a:focus-visible{outline:3px solid #199b89;outline-offset:4px}
    .inquiry .lb-support{margin-top:28px}
    .inquiry .lb-support-grid{grid-template-columns:1fr}
    .site-footer .lb-support{border-top:1px solid #ffffff25;padding-top:28px}
    @media(max-width:600px){.lb-support-grid{grid-template-columns:1fr}}
  `;
  document.head.append(style);
  const contacts = [
    {name:'LotusBio Support', role:'Customer service', phone:'+852 9273 4987', number:'85292734987'},
    {name:'LotusBio Backup Support', role:'Backup customer service', phone:'+852 6558 1902', number:'85265581902'}
  ];
  function createContacts() {
    const section = document.createElement('section');
    section.className = 'lb-support';
    section.setAttribute('aria-label', 'WhatsApp customer service contacts');
    const heading = document.createElement('h2');
    heading.className = 'lb-support-title';
    heading.textContent = 'Contact us on WhatsApp';
    const grid = document.createElement('div');
    grid.className = 'lb-support-grid';
    contacts.forEach(contact => {
      const card = document.createElement('article');
      card.className = 'lb-support-card';
      const avatar = document.createElement('img');
      avatar.className = 'lb-support-avatar';
      avatar.src = '/assets/favicon.png';
      avatar.alt = 'LotusBio logo';
      avatar.width = 52;
      avatar.height = 52;
      const identity = document.createElement('div');
      const name = document.createElement('strong');
      name.className = 'lb-support-name';
      name.textContent = contact.name;
      const role = document.createElement('span');
      role.className = 'lb-support-role';
      role.textContent = contact.role;
      identity.append(name, role);
      const phone = document.createElement('a');
      phone.className = 'lb-support-phone';
      phone.href = 'https://wa.me/' + contact.number;
      phone.target = '_blank';
      phone.rel = 'noopener noreferrer';
      phone.textContent = contact.phone;
      phone.setAttribute('aria-label', contact.name + ' on WhatsApp: ' + contact.phone);
      const button = phone.cloneNode(false);
      button.className = 'lb-support-button';
      button.textContent = 'Chat on WhatsApp ↗';
      card.append(avatar, identity, phone, button);
      grid.append(card);
    });
    section.append(heading, grid);
    return section;
  }
  document.querySelectorAll('a.contact[href="https://wa.me/85292734987"]').forEach(primary => primary.replaceWith(createContacts()));
})();
