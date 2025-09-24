# LG2YT — Let's Go To…

Food • Travel • Theme Parks — videos, guides, and neon vibes.  
This site powers **[lg2yt.com](https://lg2yt.com)** via GitHub Pages, pulling content live from a Google Sheet.

---

## 🚀 Features

- **Responsive neon UI** with mobile header fixes
- **Google Sheets–powered content**  
  - Featured video  
  - Latest 6 on homepage  
  - Full grid + Watchlist on `/videos.html`
- **Formspree contact form** (`/contact.html`) with redirect to `/thanks.html`
- **SEO & share-ready**  
  - Favicons + Apple icons  
  - OpenGraph + Twitter cards  
  - `robots.txt` + `sitemap.xml`
- **Error + redirect handling**  
  - `/watch` → `/videos.html`  
  - Custom `404.html`

---

## 📂 Structure

/
├── index.html          # Homepage (Featured + Latest 6)
├── videos.html         # Videos grid + Featured + Watchlist
├── contact.html        # Contact form
├── thanks.html         # Redirect after form submit
├── about.html
├── blog.html
├── shop.html
├── watch.html          # Redirect to videos.html
├── 404.html            # Not found page
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── style.css           # Main stylesheet
├── css-additions.css   # Mobile header fixes (import or merge into style.css)
└── assets/
├── img/            # Favicons, OG images, logo
└── …

---

## 🛠️ Local testing

Open files in a browser directly:  
- Double-click `index.html` → opens locally  
- Navigation works for local preview  
- `videos.html` + `index.html` will **try to fetch Google Sheets**.  
  - This only works if you’re online.  
  - They pull from:  
    ```
    https://docs.google.com/spreadsheets/d/e/2PACX-1vSziN8EwaEBgx5c1BtKRThZycM8JDjxISm_Irsr-ji0eKGoO0POxS2L5rJUUMY496fAO3rm8GutyyTo/pub?gid=0&single=true&output=csv
    ```

---

## 🌐 Deployment

1. Upload all files to the repo that serves **lg2yt.com** (GitHub Pages).  
   - **Important**: drag the **contents** of the kit, not the parent folder.  
2. Commit and push.  
3. Wait 20–60s for GitHub Pages to redeploy.  
4. Hard refresh:  
   - Mac: Cmd+Shift+R  
   - Windows: Ctrl+F5  
   - Phone: close tab → reopen  

---

## 📌 Notes

- Update **`style.css`** by appending everything from `css-additions.css` (or `@import` it).  
- Edit meta tags in each page’s `<head>` for page-specific titles/descriptions.  
- To change videos, just update the Google Sheet → site updates instantly.  

---

✌️ Maintained by Kevin (LG2).  
