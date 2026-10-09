(function(){
  "use strict";
  function isProduct(href){ return /^\/products\/[a-z0-9-]+\/?$/.test(href||""); }
  document.addEventListener("click", function(event){
    if(event.defaultPrevented || event.button!==0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    var link=event.target.closest && event.target.closest("a[href]");
    if(!link || link.target==="_blank" || link.hasAttribute("download")) return;
    var href=link.getAttribute("href");
    if(!isProduct(href)) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    window.location.assign(href.endsWith("/") ? href : href+"/");
  }, true);
})();
