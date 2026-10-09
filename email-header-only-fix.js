(function () {
  "use strict";

  // Fix ONLY the product-page header button: "Email sales".
  // Do NOT touch any other mailto links or inquiry forms.
  function showEmailPanel() {
    if (document.getElementById("lotusbio-email-panel")) return;

    var panel = document.createElement("div");
    panel.id = "lotusbio-email-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", "Contact LotusBio by email");
    panel.innerHTML =
      '<div class="lotusbio-email-backdrop"></div>' +
      '<div class="lotusbio-email-modal">' +
        '<button type="button" class="lotusbio-email-close" aria-label="Close">×</button>' +
        '<h3>Contact LotusBio by Email</h3>' +
        '<p class="lotusbio-email-address">info@lotusbio.cn</p>' +
        '<div class="lotusbio-email-actions">' +
          '<a href="https://mail.google.com/mail/?view=cm&fs=1&to=info%40lotusbio.cn" target="_blank" rel="noopener">Open Gmail</a>' +
          '<a href="https://outlook.office.com/mail/deeplink/compose?to=info%40lotusbio.cn" target="_blank" rel="noopener">Open Outlook</a>' +
          '<button type="button" class="lotusbio-copy-email">Copy Email Address</button>' +
          '<a href="mailto:info@lotusbio.cn">Use Default Mail App</a>' +
        '</div>' +
        '<small>Choose the email option that works best on your device.</small>' +
      '</div>';

    var style = document.createElement("style");
    style.textContent =
      '#lotusbio-email-panel{position:fixed;inset:0;z-index:999999;font-family:Arial,Helvetica,sans-serif}' +
      '.lotusbio-email-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.52)}' +
      '.lotusbio-email-modal{position:relative;z-index:1;width:min(92vw,420px);margin:12vh auto;background:#fff;color:#111827;border-radius:14px;padding:28px 24px;box-shadow:0 20px 60px rgba(0,0,0,.3);text-align:center}' +
      '.lotusbio-email-modal h3{margin:0 0 10px;font-size:22px}' +
      '.lotusbio-email-address{font-weight:700;margin:0 0 20px;font-size:18px}' +
      '.lotusbio-email-actions{display:grid;gap:10px}' +
      '.lotusbio-email-actions a,.lotusbio-email-actions button{display:block;width:100%;box-sizing:border-box;padding:12px 14px;border-radius:8px;border:1px solid #d1d5db;background:#fff;color:#111827;text-decoration:none;font-size:15px;cursor:pointer}' +
      '.lotusbio-email-actions a:hover,.lotusbio-email-actions button:hover{background:#f3f4f6}' +
      '.lotusbio-email-modal small{display:block;color:#6b7280;margin-top:14px;line-height:1.5}' +
      '.lotusbio-email-close{position:absolute;right:12px;top:8px;border:0;background:transparent;font-size:30px;line-height:1;cursor:pointer;color:#6b7280}' +
      '@media(max-width:480px){.lotusbio-email-modal{margin:8vh auto;padding:26px 18px}}';
    document.head.appendChild(style);
    document.body.appendChild(panel);

    function closePanel() {
      panel.remove();
      style.remove();
    }

    panel.querySelector('.lotusbio-email-close').addEventListener('click', closePanel);
    panel.querySelector('.lotusbio-email-backdrop').addEventListener('click', closePanel);

    panel.querySelector('.lotusbio-copy-email').addEventListener('click', function () {
      var btn = this;
      function done() { btn.textContent = 'Copied: info@lotusbio.cn'; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('info@lotusbio.cn').then(done).catch(function () { window.prompt('Copy this email address:', 'info@lotusbio.cn'); });
      } else {
        window.prompt('Copy this email address:', 'info@lotusbio.cn');
      }
    });
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('a.detail-email');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    showEmailPanel();
  }, true);
})();
