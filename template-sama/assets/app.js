/* Sama Al-Dahia — shared UI. All data comes from window.SITE (assets/data.js). */
(function () {
  var K = window.SITE, B = K.brand;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var P = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
  var I = {
    pin: P('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    area: P('<path d="M4 4h16v16H4z"/><path d="M4 9h16M9 4v16"/>'),
    floor: P('<path d="M3 21h18M6 21V8l6-4 6 4v13"/><path d="M10 21v-5h4v5"/>'),
    sun: P('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    gem: P('<path d="M6 3h12l3 6-9 12L3 9z"/><path d="M3 9h18M9 3l3 18 3-18"/>'),
    arrow: P('<path d="M19 12H5M11 18l-6-6 6-6"/>'),
    check: P('<path d="M20 6 9 17l-5-5"/>'),
    search: P('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    phone: P('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>'),
    mail: P('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    menu: P('<path d="M4 7h16M4 12h16M4 17h10"/>'),
    type: P('<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>'),
    sort: P('<path d="M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4"/>'),
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8V6.5c0-.7.5-1 1-1h2V2h-3c-3 0-4 2-4 4.5V8H7.5v3.5H10V22h4V11.5h2.8L17.5 8z"/></svg>',
    ig: P('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>')
  };
  var LOGO = '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="30" cy="22" r="13" fill="#5BB8F0"/><path d="M8 36 22 24l14 12" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><path d="M26 34 40 22l16 14" fill="none" stroke="#8FD0F7" stroke-width="4" stroke-linejoin="round"/><rect x="16" y="33" width="5" height="5" fill="#fff"/><rect x="42" y="31" width="6" height="6" fill="#8FD0F7"/><path d="M6 50c14-8 34-10 54-6" fill="none" stroke="#EBDCC3" stroke-width="4" stroke-linecap="round"/></svg>';

  var byId = function (id) { return K.listings.filter(function (l) { return String(l.id) === String(id); })[0]; };
  var price = function (l) { return l.price ? Number(l.price).toLocaleString('en-US') + '$' : (l.priceNote || 'السعر عند الطلب'); };
  var size = function (l) { return l.size ? (l.sizeApprox ? '~' : '') + Number(l.size).toLocaleString('en-US') + ' م²' : ''; };
  var place = function (l) { return [l.area, l.sub].filter(Boolean).join(' · '); };
  var img = function (n) { return 'assets/img/' + n + '.jpg'; };
  var wa = function (msg) { return 'https://wa.me/' + K.whatsapp + (msg ? '?text=' + encodeURIComponent(msg) : ''); };
  var askMsg = function (l) { return 'مرحبا، بسأل عن العرض ' + l.ref + ': ' + l.title + ' (' + l.area + ')'; };
  var url = function (l) { return 'property-' + l.id + '.html'; };

  function card(l) {
    var chips = '<span class="chip">' + esc(l.type) + '</span>' + (l.isNew ? '<span class="chip sky">جديد</span>' : '') + (l.badge ? '<span class="chip sand">' + esc(l.badge) + '</span>' : '');
    var f = [];
    if (l.size) f.push('<span>' + I.area + '<b class="num">' + esc(size(l)) + '</b></span>');
    if (l.floor) f.push('<span>' + I.floor + esc(l.floor) + '</span>');
    else if (l.finish) f.push('<span>' + I.gem + esc(l.finish) + '</span>');
    return '<a class="card rv" href="' + url(l) + '" data-goatcounter-click="card-' + l.id + '">' +
      '<div class="ph"><img loading="lazy" src="' + img(l.photos[0]) + '" alt="' + esc(l.title) + '"><div class="chips">' + chips + '</div>' +
      (l.video ? '<span class="vid"><i>' + I.play + '</i>جولة فيديو</span>' : '') + '<span class="ref num">' + esc(l.ref) + '</span></div>' +
      '<div class="bd"><span class="where">' + I.pin + esc(place(l)) + '</span><h3>' + esc(l.title) + '</h3><div class="facts">' + f.join('') + '</div>' +
      '<div class="ft"><span class="price">' + esc(price(l)) + '</span><span class="go">' + I.arrow + '</span></div></div></a>';
  }

  function reel(l) {
    return '<a class="reel rv" href="' + esc(l.video) + '" target="_blank" rel="noopener" data-goatcounter-click="reel-' + l.id + '">' +
      '<img loading="lazy" src="' + img(l.photos[0]) + '" alt="' + esc(l.title) + '">' +
      '<div class="top"><span class="chip">' + esc(l.type) + '</span></div><span class="pl">' + I.play + '</span>' +
      '<div class="tx"><small>' + esc(l.area) + '</small><b>' + esc(l.title) + '</b></div></a>';
  }

  function mountChrome(active) {
    var demo = document.createElement('div');
    demo.className = 'demo'; demo.setAttribute('role', 'note');
    demo.innerHTML = 'نسخة تجريبية مقترحة لـ <b>' + esc(B.name) + '</b> · ' + esc(K.demoBy || '');
    document.body.prepend(demo);
    var links = [['index.html', 'الرئيسية', 'home'], ['listings.html', 'كل العروض', 'buy'], ['index.html#reels', 'الفيديوهات', 'reels'], ['index.html#areas', 'المناطق', 'areas'], ['index.html#hashem', 'حبيبي يا هاشم', 'hashem']];
    var h = document.createElement('header');
    h.className = 'hdr' + (active === 'home' ? '' : ' light');
    h.innerHTML = '<div class="wrap"><a class="logo" href="index.html">' + LOGO + '<span><b>' + esc(B.name) + '</b><small>' + esc(B.sub) + '</small></span></a>' +
      '<nav class="nav" id="nav">' + links.map(function (x) { return '<a href="' + x[0] + '"' + (x[2] === active ? ' class="on"' : '') + '>' + x[1] + '</a>'; }).join('') + '</nav>' +
      '<div class="hdr-cta"><a class="btn btn-sky btn-sm" href="' + wa('مرحبا ' + B.name) + '" target="_blank" rel="noopener" data-goatcounter-click="hdr-wa">' + I.wa + 'واتساب</a>' +
      '<button class="burger" id="burger" aria-label="القائمة" aria-expanded="false">' + I.menu + '</button></div></div>';
    document.body.prepend(h); document.body.prepend(demo);
    $('#burger').onclick = function () { var n = $('#nav'); n.classList.toggle('open'); this.setAttribute('aria-expanded', n.classList.contains('open')); };
    $$('#nav a').forEach(function (a) { a.onclick = function () { $('#nav').classList.remove('open'); }; });
    if (active === 'home') { var on = function () { h.classList.toggle('solid', scrollY > 40); }; on(); addEventListener('scroll', on, { passive: true }); }

    var f = document.createElement('footer'); f.className = 'ftr';
    var areas = Object.keys(K.areas).slice(0, 6);
    f.innerHTML = '<div class="wrap"><div class="top"><div><a class="logo" href="index.html">' + LOGO + '<span><b>' + esc(B.name) + '</b><small>' + esc(B.sub) + '</small></span></a>' +
      '<p style="margin:18px 0 0;max-width:340px">' + esc(K.about) + '</p><div class="sig-s">' + esc(B.tagline) + '</div>' +
      '<div class="soc"><a href="' + K.social.facebook + '" target="_blank" rel="noopener" aria-label="فيسبوك">' + I.fb + '</a><a href="' + K.social.instagram + '" target="_blank" rel="noopener" aria-label="إنستغرام">' + I.ig + '</a><a href="' + wa() + '" target="_blank" rel="noopener" aria-label="واتساب">' + I.wa + '</a></div></div>' +
      '<div><h4>المناطق</h4>' + areas.map(function (a) { return '<a href="listings.html?area=' + encodeURIComponent(a) + '">' + esc(a) + '</a>'; }).join('') + '</div>' +
      '<div><h4>تصفّح</h4><a href="listings.html">كل العروض</a><a href="listings.html?type=' + encodeURIComponent('شقة') + '">شقق</a><a href="listings.html?type=' + encodeURIComponent('فيلا') + '">فيلات وقصور</a><a href="listings.html?type=' + encodeURIComponent('محل تجاري') + '">تجاري</a><a href="index.html#sell">بيع عقارك</a></div>' +
      '<div><h4>تواصل</h4><a href="tel:' + K.phone + '" class="num">' + esc(K.phoneDisplay) + '</a><a href="tel:' + K.phone2 + '" class="num">' + esc(K.phone2Display) + '</a><a href="mailto:' + K.email + '">' + esc(K.email) + '</a><a>' + esc(K.address) + '</a></div></div>' +
      '<div class="bot"><span>© ' + new Date().getFullYear() + ' ' + esc(B.name) + '</span><span>نموذج تجريبي · ليس الموقع الرسمي · ' + esc(K.demoBy || '') + '</span></div></div>';
    document.body.appendChild(f);
    var fab = document.createElement('a'); fab.className = 'fab'; fab.href = wa('مرحبا ' + B.name); fab.target = '_blank'; fab.rel = 'noopener';
    fab.setAttribute('aria-label', 'واتساب'); fab.setAttribute('data-goatcounter-click', 'fab-wa'); fab.innerHTML = I.wa;
    document.body.appendChild(fab);
  }

  function reveal() {
    var els = $$('.rv:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  function map(el, items, opts) {
    if (!window.L || !el) return null;
    var m = L.map(el, { scrollWheelZoom: false, attributionControl: true }).setView(opts && opts.center || K.map.center, opts && opts.zoom || K.map.zoom);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap &copy; CARTO' }).addTo(m);
    items.forEach(function (it) {
      L.marker(it.coords, { icon: L.divIcon({ className: '', html: '<span class="pin">' + esc(it.label) + '</span>', iconSize: [0, 0] }) }).addTo(m).on('click', function () { if (it.href) location.href = it.href; });
    });
    return m;
  }

  function lightbox(list) {
    var lb = $('#lb'); if (!lb) return function () {};
    var i = 0, show = function () { $('img', lb).src = img(list[i]); $('.c', lb).textContent = (i + 1) + ' / ' + list.length; };
    $('.x', lb).onclick = function () { lb.classList.remove('on'); };
    $('.pv', lb).onclick = function () { i = (i - 1 + list.length) % list.length; show(); };
    $('.nx', lb).onclick = function () { i = (i + 1) % list.length; show(); };
    addEventListener('keydown', function (e) { if (!lb.classList.contains('on')) return; if (e.key === 'Escape') lb.classList.remove('on'); if (e.key === 'ArrowLeft') $('.nx', lb).click(); if (e.key === 'ArrowRight') $('.pv', lb).click(); });
    return function (n) { i = n; show(); lb.classList.add('on'); };
  }

  window.UI = { $: $, $$: $$, esc: esc, I: I, byId: byId, price: price, size: size, place: place, img: img, wa: wa, askMsg: askMsg, url: url, card: card, reel: reel, mountChrome: mountChrome, reveal: reveal, map: map, lightbox: lightbox };
})();
