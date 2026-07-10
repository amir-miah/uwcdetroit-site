# Deploying Universal Window Cleaning — uwcdetroit.com

This is a **fully static site** — plain HTML, CSS, JavaScript, and image files, with
**no build step**. It deploys to any static host. Below are exact instructions for
**GitHub + Cloudflare Pages** with the custom domain **uwcdetroit.com**.

---

## What's in this project

```
universal-window-cleaning/
├── index.html            # Home
├── services.html         # Services + quote-based pricing + FAQ
├── service-detail.html   # Residential service detail
├── privacy.html          # Privacy Policy
├── terms.html            # Terms of Service
├── robots.txt
├── sitemap.xml
├── DEPLOYMENT.md          # (this file)
└── assets/
    ├── css/styles.css
    ├── js/main.js
    └── img/               # logo.svg + real photos (hero, feature, work-1..6)
```

All asset paths are **relative** (`assets/...`), so the site works locally and at any
domain. The only external request is Google Fonts (Inter), which falls back to system
fonts automatically if unavailable.

---

## Step 1 — Push to GitHub

From inside the `universal-window-cleaning` folder:

```bash
git init
git add .
git commit -m "Universal Window Cleaning website"
git branch -M main
```

Create an empty repo at https://github.com/new (no README), then:

```bash
git remote add origin https://github.com/<your-username>/universal-window-cleaning.git
git push -u origin main
```

> GitHub CLI alternative: `gh repo create universal-window-cleaning --public --source=. --push`

---

## Step 2 — Deploy on Cloudflare Pages

1. Go to **https://dash.cloudflare.com** → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**.
2. Authorize GitHub and pick the **universal-window-cleaning** repo.
3. On the build-settings screen, enter exactly:

   | Setting | Value |
   |---|---|
   | Framework preset | **None** |
   | Build command | *(leave empty)* |
   | Build output directory | **`/`** |
   | Root directory | *(leave default / empty)* |

4. Click **Save and Deploy**. You'll get a live URL like
   `https://universal-window-cleaning.pages.dev` within a minute.

Every future `git push` to `main` redeploys automatically.

---

## Step 3 — Connect the custom domain (uwcdetroit.com)

**Easiest path — put the domain on Cloudflare first:**

1. In the Cloudflare dashboard: **Add a site** → enter `uwcdetroit.com` → follow the steps
   to change your registrar's **nameservers** to the two Cloudflare gives you. (Wait for it
   to show **Active** — usually minutes to a few hours.)
2. Open your **Pages** project → **Custom domains** → **Set up a custom domain**.
3. Add **`uwcdetroit.com`**. Because the domain is now on Cloudflare, the DNS record is
   created for you automatically. Click through to activate.
4. Add **`www.uwcdetroit.com`** the same way, then (optional but recommended) create a
   redirect so `www` → the apex (or vice versa) under **Rules → Redirect Rules**.
5. SSL is automatic — give it a few minutes and `https://uwcdetroit.com` will be live.

**If you keep DNS at your registrar instead:** in **Custom domains**, Cloudflare will show a
**CNAME target** (your `*.pages.dev` address). Add a CNAME for `www` pointing to it, and for
the apex `uwcdetroit.com` use your registrar's CNAME-flattening / ALIAS / ANAME feature (or
move DNS to Cloudflare as above — apex CNAMEs aren't supported by all registrars).

---

## Step 4 — Test the contact form (Formspree) after deploy

The quote form posts to Formspree endpoint **`https://formspree.io/f/meebbnnp`** via AJAX
(it stays on the page and shows a success message).

1. Open the **live** site (`https://uwcdetroit.com/#book`).
2. Fill in the form and submit.
3. **The very first submission from the live domain triggers a Formspree confirmation email**
   to the Formspree account owner. Open it and click **confirm** to activate the form.
   (This is a one-time Formspree step.)
4. Submit once more — the message should now arrive at the inbox connected to the Formspree
   form. Confirm you received it, including name, phone, email, city, service, and message.
5. Also test the failure UX offline or with the network blocked: the form should show the
   red "something went wrong — call/text us" message instead of silently failing.

> Tip: in your Formspree dashboard you can set the notification email, a custom subject, and
> spam filtering. A hidden `_gotcha` honeypot field is already included to reduce spam.

---

## Notes

- **Business hours** shown on the site: *Mon–Fri after 5:00 PM until sunset; Sat & Sun all
  day until sunset.* Update in the footer of each page if this changes.
- **Social links** point to the real Facebook, Instagram, and Google Business Profile.
- **Reviews** section links to the Google Business Profile so customers can read/leave
  reviews. Testimonials shown are none until you have real ones (sample text is kept only as
  an HTML comment in `index.html`).
- **Pricing** is quote-based throughout (no fixed prices).
- **Photos** are real UWC job photos. To add or swap, drop optimized JP/WebP files into
  `assets/img/` and update the `src` — see `assets/img/README-swap-images.md`.
- **sitemap.xml / robots.txt** already reference `https://uwcdetroit.com`.
