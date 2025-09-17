window.__BLOG_CACHE = window.__BLOG_CACHE || [];
(async function(){
  const listEl=document.getElementById('blog-list'); if(!listEl) return;
  const url = window.SITE?.SHEET_CSV_URL;
  if (!url){ listEl.innerHTML='<p class="muted">Set SHEET_CSV_URL in config.js (Google Sheets → Publish to web → CSV)</p>'; return; }
  try{
    const res = await fetch(url);
    const csv = await res.text();
    const rows = csv.trim().split(/\r?\n/);
    const headers = rows.shift().split(',').map(h=>h.trim().toLowerCase());
    const idx = name => headers.indexOf(name);
    const posts = rows.map(r=>{
      const c=r.split(',').map(s=>s.trim());
      return {date:c[idx('date')]||'', photo:c[idx('photo')]||'', title:c[idx('title')]||'', teaser:c[idx('teaser')]||'', rating:c[idx('rating')]||'', tags:(c[idx('tags')]||'').split('|').map(t=>t.trim()).filter(Boolean)}
    }).filter(p=>p.title);
    posts.sort((a,b)=> (new Date(b.date)) - (new Date(a.date)));
    window.__BLOG_CACHE = posts.slice();
    listEl.innerHTML = posts.map(p => `
      <article class="card">
        <div class="ratio" style="aspect-ratio:16/9; overflow:hidden;">${p.photo ? `<img src="${p.photo}" alt="" style="width:100%; height:100%; object-fit:cover;"/>` : ''}</div>
        <h3 style="margin:.6rem 0 0;">${p.title}</h3>
        <p class="muted" style="margin:.3rem 0 0;">${p.teaser || ''}</p>
        <div class="muted" style="margin-top:.6rem; font-size:.9rem;">${p.date} • ⭐ ${p.rating || '-'}</div>
        ${p.tags?.length ? `<div style="margin-top:.6rem; display:flex; flex-wrap:wrap; gap:.4rem;">${p.tags.map(t=>`<span style="border:1px solid rgba(255,255,255,.14); padding:.2rem .5rem; border-radius:999px; font-size:.85rem; opacity:.85">${t}</span>`).join('')}</div>` : ''}
      </article>`).join('');
  }catch(e){
    listEl.innerHTML = '<p class="muted">Could not load the sheet. Ensure it is Published to web as CSV.</p>';
  }
})();
