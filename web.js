// Web del canal Garabato Nacional (motor/web.py). Sin cookies ni rastreadores: el reproductor de YouTube
// (youtube-nocookie.com) solo se carga cuando alguien pulsa un vídeo.
(function () {
  'use strict';

  function reproducir(caja, inicio) {
    var id = caja.getAttribute('data-id');
    var titulo = caja.getAttribute('data-titulo') || 'Vídeo de Garabato Nacional';
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1' + (inicio ? '&start=' + inicio : '');
    f.title = titulo;
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    f.allowFullscreen = true;
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    caja.innerHTML = '';
    caja.appendChild(f);
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('.video button');
    if (b) { e.preventDefault(); reproducir(b.closest('.video')); return; }
    var c = e.target.closest('a[data-t]');
    if (c) {
      var caja = document.querySelector('.articulo__video .video');
      if (caja) {
        e.preventDefault();
        reproducir(caja, c.getAttribute('data-t'));
        caja.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  // largo exacto de cada trazo para que se «dibuje» entero
  document.querySelectorAll('.trazo').forEach(function (p) {
    if (p.getTotalLength) p.style.setProperty('--l', Math.ceil(p.getTotalLength() + 2));
  });

  // las secciones entran al hacer scroll (y sus garabatos se dibujan entonces)
  var nodos = document.querySelectorAll('.aparece');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('visto'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    nodos.forEach(function (n) { io.observe(n); });
  } else {
    nodos.forEach(function (n) { n.classList.add('visto'); });
  }

  // miniatura grande que no existe (vídeos sin maxres): se baja a la de 480
  document.querySelectorAll('img[data-respaldo]').forEach(function (i) {
    function mirar() { if (i.naturalWidth && i.naturalWidth < 200) i.src = i.getAttribute('data-respaldo'); }
    if (i.complete) mirar(); else i.addEventListener('load', mirar);
    i.addEventListener('error', function () { i.src = i.getAttribute('data-respaldo'); });
  });
})();
