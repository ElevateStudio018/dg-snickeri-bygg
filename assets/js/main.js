(function () {
  var P = window.PROJECTS || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };

  // Mobile nav
  var burger = $('.burger'), nav = $('nav.main');
  if (burger) burger.addEventListener('click', function () { nav.classList.toggle('open'); });

  // Reveal on scroll
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12 });
  function observe() { document.querySelectorAll('.reveal:not(.in)').forEach(function (el) { io.observe(el); }); }

  function card(p) {
    var a = document.createElement('article');
    a.className = 'pcard reveal';
    a.innerHTML = '<div class="ph"><img loading="lazy" src="' + p.images[p.cover].t + '" alt="' + p.title + '">' +
      '<span class="cnt">' + p.images.length + ' bilder</span></div>' +
      '<div class="pc-t"><h3>' + p.title + '</h3><span class="tag">' + p.category + '</span></div>' +
      '<p>' + (p.place ? p.place : 'Ale & Göteborgsregionen') + '</p>';
    a.addEventListener('click', function () { openLb(p, 0); });
    return a;
  }

  // Featured projects (start page)
  var feat = $('#featured');
  if (feat) P.filter(function (p) { return p.featured; }).slice(0, 6).forEach(function (p) { feat.appendChild(card(p)); });

  // Project archive with filters
  var grid = $('#pgrid'), filt = $('#filters');
  if (grid) {
    var cats = ['Alla'];
    P.forEach(function (p) { if (cats.indexOf(p.category) < 0) cats.push(p.category); });
    function render(c) {
      grid.innerHTML = '';
      P.filter(function (p) { return c === 'Alla' || p.category === c; }).forEach(function (p) { grid.appendChild(card(p)); });
      observe();
    }
    cats.forEach(function (c, i) {
      var b = document.createElement('button');
      b.textContent = c; if (!i) b.className = 'on';
      b.onclick = function () { filt.querySelectorAll('button').forEach(function (x) { x.className = ''; }); b.className = 'on'; render(c); };
      filt.appendChild(b);
    });
    var q = new URLSearchParams(location.search).get('kategori');
    render('Alla');
    if (q) filt.querySelectorAll('button').forEach(function (b) { if (b.textContent === q) b.click(); });
  }

  // Lightbox
  var lb = $('#lb'), cur = null, idx = 0;
  function show(i) {
    idx = (i + cur.images.length) % cur.images.length;
    $('#lb-img').src = cur.images[idx].f;
    $('#lb-count').textContent = (idx + 1) + ' / ' + cur.images.length;
    lb.querySelectorAll('.lb-thumbs img').forEach(function (t, j) {
      t.classList.toggle('on', j === idx);
      if (j === idx) t.scrollIntoView({ block: 'nearest', inline: 'center' });
    });
  }
  function openLb(p, i) {
    cur = p;
    $('#lb-title').textContent = p.title;
    var th = $('.lb-thumbs', lb); th.innerHTML = '';
    p.images.forEach(function (im, j) {
      var t = document.createElement('img'); t.src = im.t; t.loading = 'lazy'; t.alt = '';
      t.onclick = function () { show(j); }; th.appendChild(t);
    });
    lb.classList.add('open'); document.body.style.overflow = 'hidden'; show(i);
  }
  function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  if (lb) {
    $('.lb-close', lb).onclick = closeLb;
    $('.lb-nav.prev', lb).onclick = function () { show(idx - 1); };
    $('.lb-nav.next', lb).onclick = function () { show(idx + 1); };
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  // Quote form -> mail
  var f = $('form.quote');
  if (f) f.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(f), body = '';
    d.forEach(function (v, k) { body += k + ': ' + v + '\n'; });
    location.href = 'mailto:daniel@dgbyggservice.se?subject=' + encodeURIComponent('Offertförfrågan – ' + (d.get('Tjänst') || '')) + '&body=' + encodeURIComponent(body);
  });

  observe();
})();
