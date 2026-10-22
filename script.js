/* ============================================================
   CONFIGURAÇÃO
   ============================================================ */
// Link de compra (Kiwify). Todos os botões com data-buy usam este valor.
const BUY_LINK = "https://pay.kiwify.com.br/UiFhUNS";

// Tracking: preencha SOMENTE com IDs reais. Vazio = nada é carregado.
// Atenção à LGPD: ao ativar analytics/pixel, informe na política de privacidade
// e avalie um aviso de cookies.
const TRACKING = {
  GA4_ID: "",   // ex.: "G-XXXXXXXXXX"
  GTM_ID: "",   // ex.: "GTM-XXXXXXX"
  META_PIXEL_ID: "", // ex.: "123456789012345"
  ADS_ID: "AW-18531501453",
  ADS_BUY_CLICK: "AW-18531501453/Tu9hCMakmKYdEI2LwYRF" // conversão "Clique em Comprar"
};

/* ============================================================ */
(function () {
  "use strict";
  var doc = document;

  // Botões de compra
  doc.querySelectorAll("a[data-buy]").forEach(function (a) {
    a.setAttribute("href", BUY_LINK);
    a.setAttribute("rel", "noopener");
    a.addEventListener("click", function () {
      var where = a.getAttribute("data-buy");
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "buy_click", buy_position: where });
      if (typeof window.gtag === "function") {
        window.gtag("event", "buy_click", { position: where });
        if (TRACKING.ADS_BUY_CLICK) window.gtag("event", "conversion", { send_to: TRACKING.ADS_BUY_CLICK });
      }
      if (typeof window.fbq === "function") window.fbq("track", "InitiateCheckout");
    });
  });

  // Ano
  var ano = doc.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  // Menu mobile
  var btn = doc.querySelector(".menu-btn"), nav = doc.getElementById("nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.focus(); }
    });
  }

  // CTA fixo no celular: aparece depois do hero e some na oferta
  var sticky = doc.getElementById("sticky"), hero = doc.querySelector(".hero"), oferta = doc.getElementById("oferta");
  if (sticky && hero && "IntersectionObserver" in window) {
    var heroOut = false, ofertaIn = false;
    var update = function () {
      var show = heroOut && !ofertaIn;
      sticky.classList.toggle("show", show);
      sticky.setAttribute("aria-hidden", String(!show));
      var link = sticky.querySelector("a"); if (link) link.tabIndex = show ? 0 : -1;
    };
    new IntersectionObserver(function (en) { heroOut = !en[0].isIntersecting; update(); }).observe(hero);
    if (oferta) new IntersectionObserver(function (en) { ofertaIn = en[0].isIntersecting; update(); }).observe(oferta);
  }

  // Revelar ao rolar (respeita prefers-reduced-motion)
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (items) {
      items.forEach(function (it) { if (it.isIntersecting) { it.target.classList.add("in"); io.unobserve(it.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    doc.querySelectorAll(".card,.pain li,.chave li,.gallery figure,.offer__box").forEach(function (el) { el.classList.add("rv"); io.observe(el); });
  }

  // Tracking opcional
  function addScript(src) { var s = doc.createElement("script"); s.async = true; s.src = src; doc.head.appendChild(s); }
  if (TRACKING.GTM_ID) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    addScript("https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(TRACKING.GTM_ID));
  }
  var gtagId = TRACKING.GA4_ID || TRACKING.ADS_ID;
  if (gtagId) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    if (TRACKING.GA4_ID) window.gtag("config", TRACKING.GA4_ID);
    if (TRACKING.ADS_ID) window.gtag("config", TRACKING.ADS_ID);
    addScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(gtagId));
  }
  if (TRACKING.META_PIXEL_ID) {
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, doc, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", TRACKING.META_PIXEL_ID); window.fbq("track", "PageView");
  }
})();
