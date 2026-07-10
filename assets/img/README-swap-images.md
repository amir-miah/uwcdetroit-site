# Swapping / adding photos

The site now uses **real UWC job photos**. To swap one, replace the file (keep the same
filename) or point the `src` in the HTML to your new file.

| File | Where it appears |
|------|------------------|
| `logo.svg`   | Navbar, footer, loading screen, favicon |
| `hero.jpg`   | Home hero (right-side image) |
| `feature.jpg`| Home "Why Universal" section |
| `work-1.jpg` … `work-6.jpg` | Home "Our work" gallery (work-1 also used on the service detail page) |

## Tips
- Use **landscape** shots for `hero.jpg` and the gallery's top row; **portrait** works for
  the rest (images are cropped with `object-fit: cover`).
- Convert phone photos from **HEIC/DNG** to **JPG or WebP** first — browsers can't display
  HEIC/DNG.
- Keep each file **under ~300 KB** (about 1300–1700px on the long edge) so the site stays fast.
- To add a gallery item, copy one `<figure class="reveal">…</figure>` block inside
  `<div class="gallery">` in `index.html` and point it at your new image.

## Business details (already set)
Phone `(248) 971-4494` · Email `universalwindowcleaning@outlook.com` · Hours in the footer ·
Social + Google review links in the footer · Form posts to Formspree. See `DEPLOYMENT.md`.
