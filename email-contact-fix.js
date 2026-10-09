(function () {
  "use strict";

  var EMAIL = "info@lotusbio.cn";

  function injectStyles() {
    if (document.getElementById("lotusbio-email-modal-style")) return;

    var style = document.createElement("style");
    style.id = "lotusbio-email-modal-style";
    style.textContent = [
      ".lotusbio-email-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px}",
      ".lotusbio-email-modal{width:min(460px,100%);background:#fff;border-radius:14px;padding:28px;box-shadow:0 20px 60px rgba(0,0,0,.25);font-family:Arial,Helvetica,sans-serif;color:#111827;position:relative}",
      ".lotusbio-email-modal h3{margin:0 0 10px;font-size:24px}",
      ".lotusbio-email-modal p{margin:0 0 18px;line-height:1.6;color:#4b5563}",
      ".lotusbio-email-address{font-size:18px;font-weight:700;background:#f3f4f6;padding:12px;border-radius:8px;word-break:break-all;margin-bottom:18px}",
      ".lotusbio-email-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}",
      ".lotusbio-email-actions a,.lotusbio-email-actions button{display:flex;align-items:center;justify-content:center;min-height:46px;border-radius:8px;border:1px solid #d1d5db;background:#fff;color:#111827;text-decoration:none;font-size:15px;font-weight:600;cursor:pointer;padding:10px}",
      ".lotusbio-email-actions .lotusbio-primary{background:#111827;color:#fff;border-color:#111827}",
      ".lotusbio-email-close{position:absolute;right:12px;top:10px;border:0;background:transparent;font-size:28px;line-height:1;cursor:pointer;color:#6b7280}",
      "@media(max-width:480px){.lotusbio-email-actions{grid-template-columns:1fr}.lotusbio-email-modal{padding:24px 18px}}"
    ].join("");
    document.head.appendChild(style);
  }

  function closeModal() {
    var existing = document.querySelector(".lotusbio-email-overlay");
    if (existing) existing.remove();
  }

  function openModal() {
    closeModal();
    injectStyles();

    var overlay = document.createElement("div");
    overlay.className = "lotusbio-email-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    overlay.innerHTML =
      '<div class="lotusbio-email-modal">' +
        '<button class="lotusbio-email-close" aria-label="Close">&times;</button>' +
        '<h3>Contact LotusBio by Email</h3>' +
        '<p>You can email our wholesale team using your preferred email service.</p>' +
        '<div class="lotusbio-email-address">' + EMAIL + '</div>' +
        '<div class="lotusbio-email-actions">' +
          '<a class="lotusbio-primary" target="_blank" rel="noopener" href="https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(EMAIL) + '">Open Gmail</a>' +
          '<a target="_blank" rel="noopener" href="https://outlook.office.com/mail/deeplink/compose?to=' + encodeURIComponent(EMAIL) + '">Open Outlook</a>' +
          '<button type="button" class="lotusbio-copy-email">Copy Email Address</button>' +
          '<a href="mailto:' + EMAIL + '">Use Default Mail App</a>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay || event.target.closest(".lotusbio-email-close")) {
        closeModal();
        return;
      }

      if (event.target.closest(".lotusbio-copy-email")) {
        var btn = event.target.closest(".lotusbio-copy-email");
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(EMAIL).then(function () {
            btn.textContent = "Copied!";
            setTimeout(function () { btn.textContent = "Copy Email Address"; }, 1600);
          });
        } else {
          var textarea = document.createElement("textarea");
          textarea.value = EMAIL;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          textarea.remove();
          btn.textContent = "Copied!";
          setTimeout(function () { btn.textContent = "Copy Email Address"; }, 1600);
        }
      }
    });
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a.detail-email");
    if (!link) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    openModal();
  }, true);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeModal();
  });
})();