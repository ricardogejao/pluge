/* Pluge embed mode — runs inside each screen when loaded with ?embed=1.
   Fills the iframe (no bezel chrome, scale to width), and forwards
   navigation intents to the parent shell via postMessage.

   Wiring: any element with data-nav="<target>" navigates on click.
   Special targets:
     back              → shell pops history (slide right)
     map|toast:Texto   → go to map AND show a toast
   Loaded AFTER each screen's own scaler script so its resize handler wins. */
(function () {
  var EMBED = new URLSearchParams(location.search).has("embed");
  if (!EMBED) return;

  var root = document.getElementById("root");
  var scaler = document.getElementById("scaler");

  function fill() {
    if (root) { root.style.alignItems = "flex-start"; root.style.justifyContent = "flex-start"; }
    if (scaler) {
      scaler.style.transformOrigin = "top left";
      scaler.style.transform = "scale(" + (window.innerWidth / 393) + ")";
    }
  }
  fill();
  window.addEventListener("resize", fill);

  // hide the device chrome — the shell supplies bezel/island/home indicator
  var s = document.createElement("style");
  s.textContent =
    ".bezel{box-shadow:none!important;border-radius:0!important;}" +
    ".island,.home-indicator{display:none!important;}" +
    ".bottomnav{display:none!important;}" +
    ".sheet-list,.content,.list{padding-bottom:96px!important;}" +
    ".charger-card{bottom:110px!important;}" +
    ".map-fab{bottom:120px!important;}" +
    "html,body{background:#0A0A0A!important;}";
  document.head.appendChild(s);

  function go(target, extra) { try { parent.postMessage(Object.assign({ plugeNav: target }, extra || {}), "*"); } catch (e) {} }
  window.PlugeGo = go;

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-nav]");
    if (!el) return;
    e.preventDefault();
    var extra = {};
    if (el.dataset.charger) extra.charger = el.dataset.charger;
    go(el.getAttribute("data-nav"), extra);
  });
})();
