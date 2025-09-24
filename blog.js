/* LG2 Blog Script
   - Filters existing cards by category (All / Reviews / Guides / News)
   - OPTIONAL: Render posts from a Google Sheet CSV if BLOG_CSV_URL is set
*/

const BLOG_CSV_URL = ""; 
// Example when ready (publish to web as CSV):
// const BLOG_CSV_URL = "https://docs.google.com/spreadsheets/d/e/XXXXXXXX/pub?gid=0&single=true&output=csv";

/* Expected Sheet headers (any case/spacing works):
   Title, Category, Date, Location, ImageURL, YouTubeID, Excerpt, Tags, Slug, ExternalURL, SortKey
   - Category: one of review|guide|news (lowercase is best)
   - Either ImageURL OR YouTubeID should be filled
   - SortKey: lower numbers show first
*/

(function () {
  // ---------- util: robust CSV parser ----------
  function parseCSV(text) {
    const rows = [];
    let row = [], cur = "", inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i], n = text[i + 1];
      if (inQuotes) {
        if (c === '"' && n === '"') { cur += '"'; i++; }
        else if (c === '"') { inQuotes = false; }
        else { cur += c; }
      } else {
        if (c === '"') inQuotes = true;
        else if (c === ',') { row.push(cur); cur = ""; }
        else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ""; }
        else if (c !== '\r') { cur += c; }
      }
    }
    if (cur.length || row.length) { row.push(cur); rows.push(row); }
    return rows;
  }
  const norm = s => (s || "").toLowerCase().replace(/\s+/g, " ").trim().replace(/[^a-z0-9]/g, "");
  const findIdx = (header, ...keys) => {
    const H = header.map(norm);
    for (const k of keys) { const i = H.indexOf(k); if (i !== -1) return i; }
    return -1;
  };
  const esc = s => (s || "").replace(/"/g, "&quot;");

  // ---------- filters for existing or generated cards ----------
  function initFilters() {
    const btns = document.querySelectorAll('#filters [data-filter]');
    const posts = document.getElementById('posts');
    if (!posts) return;

    const apply = (tag) => {
      const cards = posts.querySelectorAll('.card');
      cards.forEach(c => {
        const tags = (c.getAttribute('data-tags') || '').toLowerCase();
        const show = tag === 'all' || tags.includes(tag);
        c.style.display = show ? "" : "none";
      });
      btns.forEach(b => b.classList.toggle('primary', b.dataset.filter === tag));
    };

    btns.forEach(b => b.addEventListener('click', () => apply(b.dataset.filter)));
    apply('all');
  }

  // ---------- optional: build cards from Google Sheet ----------
  async function maybeRenderFromSheet() {
    if (!BLOG_CSV_URL) { initFilters(); return; }

    const postsWrap = document.getElementById('posts');
    if (!postsWrap) return;

    // clear any static cards (we'll render fresh)
    postsWrap.innerHTML = "";

    try {
      const url = BLOG_CSV_URL + (BLOG_CSV_URL.includes("?") ? "&" : "?") + "t=" + Date.now();
      const res = await fetch(url, { cache: "no-store" });
      let text = await res.text();
      text = text.replace(/^\uFEFF/, "");
      const rows = parseCSV(text);
      if (!rows.length) throw new Error("CSV empty");

      const header = rows.shift().map(h => h.trim());
      const col = {
        Title:      findIdx(header, "title"),
        Category:   findIdx(header, "category"),
        Date:       findIdx(header, "date"),
        Location:   findIdx(header, "location"),
        ImageURL:   findIdx(header, "imageurl", "image"),
        YouTubeID:  findIdx(header, "youtubeid", "ytid", "videoid"),
        Excerpt:    findIdx(header, "excerpt", "summary"),
        Tags:       findIdx(header, "tags"),
        Slug:       findIdx(header, "slug"),
        External:   findIdx(header, "externalurl", "url"),
        SortKey:    findIdx(header, "sortkey")
      };
      const val = (r, i) => (i >= 0 ? (r[i] || "").trim() : "");
      const items = rows
        .filter(r => r.some(x => (x || "").trim() !== ""))
        .map(r => ({
          title:     val(r, col.Title),
          category:  (val(r, col.Category) || "").toLowerCase(),
          date:      val(r, col.Date),
          location:  val(r, col.Location),
          image:     val(r, col.ImageURL),
          ytid:      val(r, col.YouTubeID),
          excerpt:   val(r, col.Excerpt),
          tags:      val(r, col.Tags),
          slug:      val(r, col.Slug),
          external:  val(r, col.External),
          sortKey:   Number(val(r, col.SortKey) || 999999999)
        }))
        .filter(p => p.title)
        .sort((a, b) => a.sortKey - b.sortKey);

      // build cards
      items.forEach(p => {
        const card = document.createElement('article');
        card.className = 'card';
        card.setAttribute('data-tags', [p.category, (p.tags || "").toLowerCase()].join(","));

        const metaLine = [p.date, p.location].filter(Boolean).join(" • ");
        let media = "";

        if (p.ytid) {
          media = `
            <div class="ratio">
              <iframe width="560" height="315"
                src="https://www.youtube.com/embed/${esc(p.ytid)}"
                title="${esc(p.title)}" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>`;
        } else if (p.image) {
          media = `
            <div class="ratio">
              <img src="${esc(p.image)}" alt="${esc(p.title)}"
                   style="width:100%;height:100%;object-fit:cover" loading="lazy">
            </div>`;
        }

        // destination link: prefer ExternalURL, else slug, else no link
        const href = p.external || (p.slug ? `${encodeURIComponent(p.slug)}.html` : "");
        const titleBlock = href
          ? `<a href="${href}" ${p.external ? 'target="_blank" rel="noopener"' : ''} style="text-decoration:none"><h3 style="margin:.6rem 0 6px;">${esc(p.title)}</h3></a>`
          : `<h3 style="margin:.6rem 0 6px;">${esc(p.title)}</h3>`;

        card.innerHTML = `
          ${media}
          ${titleBlock}
          ${metaLine ? `<p class="muted small" style="margin:0 0 8px;">${esc(metaLine)}</p>` : ""}
          ${p.excerpt ? `<p class="muted">${esc(p.excerpt)}</p>` : ""}
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
            ${p.category ? `<span class="pill small">${esc(cap(p.category))}</span>` : ""}
            ${renderExtraTags(p.tags)}
          </div>
        `;

        postsWrap.appendChild(card);
      });

      // (re)bind filters now that cards exist
      initFilters();

    } catch (err) {
      console.error("Blog CSV load failed:", err);
      // fall back to any static cards in HTML
      initFilters();
    }
  }

  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function renderExtraTags(tags) {
    if (!tags) return "";
    return tags.split(",").slice(0, 6).map(t => `<span class="pill small">${esc(t.trim())}</span>`).join("");
  }

  // kick things off
  maybeRenderFromSheet();
})();
