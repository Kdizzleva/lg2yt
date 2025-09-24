/* LG2 UI: header burger + active link + reveal on scroll */
(function(){
  const header = document.querySelector('.nav');
  const burger = document.querySelector('.burger');
  if (burger && header) {
    burger.addEventListener('click', ()=> header.classList.toggle('open'));
  }

  // Active link (simple heuristic)
  const path = (location.pathname || '').split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a=>{
    const href = a.getAttribute('href') || '';
    if (href === path) a.classList.add('active');
  });

  // Reveal on scroll
  const els = document.querySelectorAll('.glass, .card, .ratio, .page-title, .title');
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('show'); obs.unobserve(e.target); }
    });
  }, {threshold:.12});
  els.forEach(el=>{ el.classList.add('reveal'); obs.observe(el); });
})();
