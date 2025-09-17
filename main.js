(function(){
  const social = (window.SITE || {}).socials || {};
  const setHref = (id, url)=>{ const el=document.getElementById(id); if(el&&url) el.href=url; };
  setHref('yt', social.youtube); setHref('ig', social.instagram); setHref('fb', social.facebook); setHref('x', social.x);

  const cl=document.getElementById('crew-link'); if (cl && window.SITE?.crewLink) cl.href = window.SITE.crewLink;
  const sh=document.getElementById('shop-link'); if (sh && window.SITE?.shopLink) sh.href = window.SITE.shopLink;

  const latestVideoEl=document.getElementById('latest-video'); const latestId=window.SITE?.latestVideoId;
  if (latestVideoEl && latestId){
    latestVideoEl.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${latestId}" title="YouTube video" frameborder="0" allowfullscreen></iframe>`;
  }

  const latestPostEl=document.getElementById('latest-post');
  if (latestPostEl && window.__BLOG_CACHE && window.__BLOG_CACHE[0]){
    const p = window.__BLOG_CACHE[0];
    latestPostEl.innerHTML = `
      <div class="grid" style="grid-template-columns: 120px 1fr; align-items:center;">
        <img src="${p.photo}" alt="" style="width:100%; border-radius:12px; aspect-ratio:1/1; object-fit:cover;"/>
        <div style="padding-left:14px">
          <h4 style="margin:0 0 6px 0">${p.title}</h4>
          <p class="muted" style="margin:0">${p.teaser || ''}</p>
        </div>
      </div>`;
  }

  const videoGrid=document.getElementById('video-grid');
  if (videoGrid){
    const ids = window.SITE?.videoIds || [];
    videoGrid.innerHTML = ids.length ? ids.map(id => `
      <div class="card">
        <div class="ratio"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/${id}" title="YouTube video" frameborder="0" allowfullscreen></iframe></div>
      </div>`).join('') : '<p class="muted">Add video IDs to SITE.videoIds in assets/js/config.js</p>';
  }
})();
