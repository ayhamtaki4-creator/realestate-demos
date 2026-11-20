/* Real-estate demo template — shared UI. All brand data comes from window.SITE (assets/data.js). */
(function () {
  var K = window.SITE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- icons ---------- */
  var I = {
    menu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    heart: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.5 8 3.4 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.6 0 5.5 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>',
    search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    pin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    chevL: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
    chevR: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
    arrowL: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>',
    phone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
    wa: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>',
    play: '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    check: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>',
    share: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v14"/></svg>',
    back: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    grid: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    map: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/></svg>',
    list: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
    filter: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg>'
  };

  /* ---------- helpers ---------- */
  var fmt = function (n) { return Math.round(n).toLocaleString('en-US') + '$'; };
  var img = function (n) { return 'assets/img/' + n + '.jpg'; };
  var wa = function (msg) { return 'https://wa.me/' + K.whatsapp + (msg ? '?text=' + encodeURIComponent(msg) : ''); };
  var refOf = function (l) { return l.ref || String(l.id).toUpperCase(); };
  var markHtml = function (cls) { return '<b class="' + (K.brand.arabic ? 'mark-ar' : 'latin') + '"' + (K.brand.arabic ? '' : ' style="font-size:28px;letter-spacing:2px"') + '>' + esc(K.brand.mark) + '</b>'; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var pageUrl = function (id) { return 'property-' + id + '.html'; };
  var byId = function (id) { return K.listings.filter(function (l) { return l.id === id; })[0]; };
  var priceText = function (l) {
    if (l.status === 'sold') return 'تم البيع';
    if (l.price == null) return l.priceNote || 'السعر عند الطلب';
    return fmt(l.price);
  };
  var priceSub = function (l) {
    if (l.status === 'sold' || l.price == null) return '';
    return [l.priceUnit, l.priceNote].filter(Boolean).join(' ');
  };
  var floorText = function (f) { return !f ? '' : /^ال/.test(f) ? 'الطابق ' + f : f; };
  var sizeText = function (l) { return l.size ? (l.sizeApprox ? '~' : '') + l.size.toLocaleString('en-US') + ' م²' + (l.sizeNote ? ' ' + l.sizeNote : '') : ''; };
  var metaParts = function (l) {
    return [l.beds ? l.beds + ' غرف نوم' : '', l.baths ? l.baths + ' حمام' : '', sizeText(l), floorText(l.floor)].filter(Boolean);
  };
  var place = function (l) { return [l.area, l.sub].filter(Boolean).join(' · '); };
  var statusLabel = { sale: 'للبيع', rent: 'للإيجار', sold: 'تم البيع' };

  /* ---------- saved ---------- */
  var saved = [];
  try { saved = JSON.parse(localStorage.getItem(K.slug + '_saved') || '[]'); } catch (e) { saved = []; }
  var persist = function () { try { localStorage.setItem(K.slug + '_saved', JSON.stringify(saved)); } catch (e) {} };
  var isSaved = function (id) { return saved.indexOf(id) > -1; };
  var toggleSave = function (id) {
    if (isSaved(id)) saved.splice(saved.indexOf(id), 1); else saved.push(id);
    persist(); syncSaved(); toast(isSaved(id) ? 'انحفظ العقار بالمفضلة' : 'انشال من المفضلة');
  };
  var syncSaved = function () {
    $$('[data-save]').forEach(function (b) { b.setAttribute('aria-pressed', isSaved(b.dataset.save) ? 'true' : 'false'); });
    $$('.badge-count').forEach(function (c) { c.textContent = saved.length; c.classList.toggle('on', saved.length > 0); });
  };

  /* ---------- toast ---------- */
  var toastEl, toastT;
  var toast = function (msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 2200);
  };

  /* ---------- card ---------- */
  var card = function (l, opts) {
    opts = opts || {};
    var href = pageUrl(l.id);
    var photos = (l.photos || []).slice(0, opts.single ? 1 : 5);
    var sold = l.status === 'sold';
    var slides = photos.length
      ? photos.map(function (p, i) { return '<a href="' + href + '" tabindex="' + (i ? -1 : 0) + '" aria-label="' + esc(l.title) + '"><img src="' + img(p) + '" alt="" loading="lazy" decoding="async"></a>'; }).join('')
      : '<a href="' + href + '" class="pcard__noimg"><div>' + markHtml() + '<span>الصور عند الطلب</span></div></a>';
    var tags = [];
    if (sold) tags.push('<span class="tag tag--sold">تم البيع</span>');
    else {
      tags.push('<span class="tag">' + statusLabel[l.status] + '</span>');
      if (l.signature) tags.push('<span class="tag tag--gold">عقار استثنائي</span>');
      else if (l.isNew) tags.push('<span class="tag tag--navy">جديد</span>');
    }
    var multi = photos.length > 1;
    return '<article class="pcard' + (sold ? ' is-sold' : '') + '" data-id="' + l.id + '">' +
      '<div class="pcard__media">' +
        '<div class="pcard__slides">' + slides + '</div>' +
        '<div class="pcard__tags">' + tags.join('') + '</div>' +
        (sold ? '' : '<button type="button" class="save-btn" data-save="' + l.id + '" aria-pressed="false" aria-label="حفظ العقار">' + I.heart + '</button>') +
        (multi ? '<div class="pcard__dots" aria-hidden="true">' + photos.map(function (_, i) { return '<i' + (i ? '' : ' class="on"') + '></i>'; }).join('') + '</div>' +
          '<button type="button" class="pcard__arrow pcard__arrow--prev" aria-label="الصورة السابقة">' + I.chevR + '</button>' +
          '<button type="button" class="pcard__arrow pcard__arrow--next" aria-label="الصورة التالية">' + I.chevL + '</button>' : '') +
      '</div>' +
      '<a href="' + href + '" class="pcard__body">' +
        '<div class="pcard__price"><b>' + priceText(l) + '</b>' + (priceSub(l) ? '<small>' + esc(priceSub(l)) + '</small>' : '') + '</div>' +
        '<div class="pcard__meta">' + metaParts(l).map(function (m) { return '<span>' + esc(m) + '</span>'; }).join('') + '</div>' +
        '<div class="pcard__title">' + esc(l.title) + '</div>' +
        '<div class="pcard__addr">' + esc(place(l)) + '</div>' +
      '</a>' +
    '</article>';
  };

  var wireCards = function (root) {
    $$('.pcard', root).forEach(function (c) {
      if (c._wired) return; c._wired = true;
      var s = $('.pcard__slides', c); var dots = $$('.pcard__dots i', c);
      if (s && dots.length) {
        s.addEventListener('scroll', function () {
          var i = Math.round(Math.abs(s.scrollLeft) / s.clientWidth);
          dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
        }, { passive: true });
        var go = function (dir) { s.scrollBy({ left: dir * s.clientWidth, behavior: 'smooth' }); };
        $('.pcard__arrow--next', c).addEventListener('click', function (e) { e.preventDefault(); go(-1); });
        $('.pcard__arrow--prev', c).addEventListener('click', function (e) { e.preventDefault(); go(1); });
      }
    });
    syncSaved();
  };

  /* ---------- rails ---------- */
  var wireRails = function () {
    $$('[data-rail]').forEach(function (nav) {
      var rail = document.getElementById(nav.dataset.rail); if (!rail) return;
      var prev = $('[data-dir=prev]', nav), next = $('[data-dir=next]', nav);
      var upd = function () {
        var max = rail.scrollWidth - rail.clientWidth, x = Math.abs(rail.scrollLeft);
        prev.disabled = x < 4; next.disabled = x > max - 4;
      };
      prev.addEventListener('click', function () { rail.scrollBy({ left: rail.clientWidth * .9, behavior: 'smooth' }); });
      next.addEventListener('click', function () { rail.scrollBy({ left: -rail.clientWidth * .9, behavior: 'smooth' }); });
      rail.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); upd();
    });
  };

  /* ---------- chrome (header / drawer / footer) ---------- */
  var mountChrome = function (page) {
    var overlay = page === 'home';
    var hasSig = K.listings.some(function (l) { return l.signature; });
    var nav = [
      ['listings.html?status=sale', 'شراء', 'buy'],
      ['listings.html?status=rent', 'إيجار', 'rent']
    ];
    if (K.budgets) nav.push(['index.html#budgets', 'حسب الميزانية', 'budgets']);
    if (K.projects) nav.push(['index.html#projects', 'المشاريع', 'projects']);
    if (hasSig) nav.push(['index.html#signature', 'عقارات استثنائية', 'sig']);
    nav.push(['index.html#sell', 'اعرض عقارك', 'sell']);
    var B = K.brand;
    var brand = '<a href="index.html" class="brand' + (B.arabic ? ' brand--ar' : '') + '" aria-label="' + esc(B.name) + ' – الرئيسية"><span class="brand__mark">' + esc(B.mark) + '</span><span class="brand__txt"><span class="brand__name"' + (B.arabic ? '' : ' dir="ltr"') + '>' + esc(B.name) + '</span><span class="brand__sub"' + (B.arabic ? '' : ' dir="ltr"') + '>' + esc(B.sub) + '</span></span></a>';
    var strip = document.createElement('div');
    strip.className = 'demo-strip'; strip.setAttribute('role', 'note');
    strip.innerHTML = 'نسخة تجريبية مقترحة لـ <b>' + esc(B.name) + '</b> · ' + esc(K.demoBy || '');
    document.body.insertBefore(strip, document.body.firstChild);
    var hdr = document.createElement('header');
    hdr.className = 'hdr' + (overlay ? ' is-overlay' : '');
    hdr.innerHTML = '<div class="container">' + brand +
      '<nav class="nav" aria-label="القائمة الرئيسية">' + nav.map(function (n) { return '<a href="' + n[0] + '"' + (page === n[2] ? ' aria-current="page"' : '') + '>' + n[1] + '</a>'; }).join('') + '</nav>' +
      '<div class="hdr__actions">' +
        '<a href="listings.html?saved=1" class="icon-btn" aria-label="العقارات المحفوظة">' + I.heart + '<span class="badge-count"></span></a>' +
        '<a href="' + wa('مرحبا، بدي استشارة عقارية') + '" target="_blank" rel="noopener" class="btn btn--gold btn--sm hdr__cta">' + I.wa + 'تواصل معنا</a>' +
        '<button type="button" class="icon-btn menu-btn" aria-label="فتح القائمة" aria-expanded="false" aria-controls="drawer">' + I.menu + '</button>' +
      '</div></div>';
    document.body.insertBefore(hdr, strip.nextSibling);
    if (!overlay) document.body.classList.add('has-hdr');

    var dr = document.createElement('div');
    dr.className = 'drawer'; dr.id = 'drawer'; dr.setAttribute('aria-hidden', 'true');
    dr.innerHTML = '<div class="drawer__scrim" data-close></div><div class="drawer__panel" role="dialog" aria-modal="true" aria-label="القائمة">' +
      '<div class="drawer__head">' + brand + '<button type="button" class="icon-btn" data-close aria-label="إغلاق">' + I.close + '</button></div>' +
      '<nav>' + nav.map(function (n) { return '<a href="' + n[0] + '">' + n[1] + I.chevL + '</a>'; }).join('') + '<a href="listings.html?saved=1">المحفوظة' + I.chevL + '</a></nav>' +
      '<div class="drawer__foot"><a class="btn btn--wa btn--block" target="_blank" rel="noopener" href="' + wa('مرحبا، بدي استشارة عقارية') + '">' + I.wa + 'راسلنا على الواتساب</a><a class="btn btn--line btn--block" href="tel:' + K.phone + '">' + I.phone + '<span class="num">' + K.phoneDisplay + '</span></a></div>' +
      '</div>';
    document.body.appendChild(dr);
    var mb = $('.menu-btn', hdr);
    var open = function (v) {
      dr.classList.toggle('open', v); dr.setAttribute('aria-hidden', v ? 'false' : 'true');
      mb.setAttribute('aria-expanded', v ? 'true' : 'false'); document.body.classList.toggle('lock', v);
      if (v) $('[data-close]', dr.querySelector('.drawer__head')).focus(); else mb.focus();
    };
    mb.addEventListener('click', function () { open(true); });
    $$('[data-close]', dr).forEach(function (b) { b.addEventListener('click', function () { open(false); }); });
    $$('nav a', dr).forEach(function (a) { a.addEventListener('click', function () { open(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && dr.classList.contains('open')) open(false); });

    if (overlay) {
      var onS = function () { var s = window.scrollY > 40; hdr.classList.toggle('is-overlay', !s); hdr.classList.toggle('is-scrolled', s); };
      window.addEventListener('scroll', onS, { passive: true }); onS();
    } else {
      window.addEventListener('scroll', function () { hdr.classList.toggle('is-scrolled', window.scrollY > 4); }, { passive: true });
    }

    var f = document.createElement('footer');
    f.className = 'ftr';
    var contact = [];
    if (K.address) contact.push('<li>' + esc(K.address) + '</li>');
    contact.push('<li><a href="tel:' + K.phone + '" class="num">' + K.phoneDisplay + '</a></li>');
    contact.push('<li><a href="' + wa() + '" target="_blank" rel="noopener">واتساب</a></li>');
    if (K.social && K.social.instagram) contact.push('<li><a href="' + K.social.instagram + '" target="_blank" rel="noopener">Instagram</a></li>');
    if (K.social && K.social.facebook) contact.push('<li><a href="' + K.social.facebook + '" target="_blank" rel="noopener">Facebook</a></li>');
    f.innerHTML = '<div class="container"><div class="ftr__grid">' +
      '<div>' + brand + '<p style="max-width:320px;line-height:1.8">' + esc(K.about) + '</p></div>' +
      '<div><h4>العقارات</h4><ul><li><a href="listings.html?status=sale">للبيع</a></li><li><a href="listings.html?status=rent">للإيجار</a></li>' + (K.listings.some(function (l) { return l.status === 'sold'; }) ? '<li><a href="listings.html?status=sold">تم البيع</a></li>' : '') + (K.budgets ? '<li><a href="index.html#budgets">حسب الميزانية</a></li>' : '') + '</ul></div>' +
      '<div><h4>المناطق</h4><ul>' + Object.keys(K.areas).map(function (a) { return '<li><a href="listings.html?area=' + encodeURIComponent(a) + '">' + a + '</a></li>'; }).join('') + '</ul></div>' +
      '<div><h4>تواصل</h4><ul>' + contact.join('') + '</ul></div>' +
      '</div><div class="ftr__bottom"><span>© ' + new Date().getFullYear() + ' ' + esc(B.legal || B.name) + '</span><span class="ftr__demo">نموذج تجريبي · ليس الموقع الرسمي · ' + esc(K.demoBy || '') + '</span></div></div>';
    document.body.appendChild(f);
  };

  /* ---------- reveal ---------- */
  var wireReveal = function () {
    var els = $$('.rv');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  };

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-save]');
    if (b) { e.preventDefault(); toggleSave(b.dataset.save); }
  });

  window.UI = {
    I: I, $: $, $$: $$, href: pageUrl, fmt: fmt, img: img, wa: wa, esc: esc, byId: byId,
    priceText: priceText, priceSub: priceSub, metaParts: metaParts, place: place, sizeText: sizeText, floorText: floorText,
    statusLabel: statusLabel, card: card, wireCards: wireCards, wireRails: wireRails, mountChrome: mountChrome,
    wireReveal: wireReveal, refOf: refOf, markHtml: markHtml, toast: toast, isSaved: isSaved, saved: function () { return saved.slice(); }, syncSaved: syncSaved
  };
})();
