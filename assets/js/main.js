/* Universal Window Cleaning — interactions */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Loading screen ---------- */
  var loader = document.querySelector(".loader");
  function hideLoader() {
    if (!loader) return;
    loader.classList.add("is-done");
    setTimeout(function () { if (loader) loader.remove(); }, 700);
  }
  window.addEventListener("load", function () {
    setTimeout(function () {
      hideLoader();
      setTimeout(function () { squeegeeReveal(); }, 260);
    }, reduce ? 0 : 650);
  });
  // Safety fallback
  setTimeout(hideLoader, 3500);

  /* ---------- Navbar ---------- */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 24) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".nav__menu a").forEach(function (a) {
      a.addEventListener("click", function () { document.body.classList.remove("menu-open"); toggle.setAttribute("aria-expanded", "false"); });
    });
  }

  /* ---------- Before / After sliders ---------- */
  var heroBa = null;
  document.querySelectorAll(".ba").forEach(function (ba) {
    var range = ba.querySelector(".ba__range");
    var isHero = !!ba.closest(".hero");
    function setPos(v) {
      var p = Math.max(0, Math.min(100, v));
      ba.style.setProperty("--pos", p + "%");
      if (range) range.value = p;
    }
    // Hero starts mostly "before" so the squeegee reveal has somewhere to wipe from.
    setPos(isHero && !reduce ? 12 : (range ? parseFloat(range.value) || 50 : 50));
    if (range) range.addEventListener("input", function () { setPos(parseFloat(range.value)); });
    // Direct pointer drag for a nicer feel
    var dragging = false;
    function fromEvent(e) {
      var rect = ba.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      setPos((x / rect.width) * 100);
    }
    ba.addEventListener("pointerdown", function (e) { dragging = true; ba.classList.remove("is-revealing"); fromEvent(e); });
    window.addEventListener("pointermove", function (e) { if (dragging) fromEvent(e); });
    window.addEventListener("pointerup", function () { dragging = false; });
    if (isHero) heroBa = { el: ba, setPos: setPos };
  });

  // Hero "squeegee" reveal: wipe the divider across once, then it's fully interactive.
  function squeegeeReveal() {
    if (!heroBa || reduce) return;
    var ba = heroBa.el, setPos = heroBa.setPos;
    ba.classList.add("is-revealing");
    var start = null, from = 12, to = 52, dur = 1150;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      setPos(from + (to - from) * eased);
      if (p < 1) requestAnimationFrame(step);
      else ba.classList.remove("is-revealing");
    }
    requestAnimationFrame(step);
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Count-up stats ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var dec = (el.getAttribute("data-dec") | 0);
    if (reduce) { el.textContent = target.toFixed(dec) + suffix; return; }
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var prog = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - prog, 3);
      el.textContent = (target * eased).toFixed(dec) + suffix;
      if (prog < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(dec) + suffix;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Booking form (submits to Formspree via AJAX) ---------- */
  var form = document.querySelector("#booking-form");
  if (form) {
    var success = form.parentElement.querySelector(".form__success");
    var statusEl = form.querySelector(".form__status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (statusEl) statusEl.classList.remove("show");
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var ok = input.checkValidity() && input.value.trim() !== "";
        if (!ok) { valid = false; field.classList.add("has-error"); }
        else field.classList.remove("has-error");
      });
      if (!valid) {
        var firstErr = form.querySelector(".field.has-error input, .field.has-error select, .field.has-error textarea");
        if (firstErr) firstErr.focus();
        return;
      }
      var btn = form.querySelector("button[type=submit]");
      var original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = "Sending…";
      function fail() {
        btn.disabled = false; btn.innerHTML = original;
        if (statusEl) statusEl.classList.add("show");
      }
      fetch(form.action, {
        method: (form.method || "POST"),
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      }).then(function (res) {
        if (res.ok) {
          form.style.display = "none";
          if (statusEl) statusEl.classList.remove("show");
          if (success) success.classList.add("show");
          btn.disabled = false; btn.innerHTML = original;
        } else { fail(); }
      }).catch(fail);
    });
    // Clear error as user types
    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field && field.classList.contains("has-error") && input.value.trim() !== "") field.classList.remove("has-error");
      });
    });
  }

  /* ---------- Smooth page transitions (multi-page fade-out) ---------- */
  function samePath(a, b) {
    var norm = function (p) { return p.replace(/index\.html$/, "").replace(/\/+$/, "") || "/"; };
    return norm(a) === norm(b);
  }
  if (!reduce) {
    document.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest ? e.target.closest("a[href]") : null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      var raw = a.getAttribute("href");
      if (!raw || /^(mailto:|tel:|#)/i.test(raw)) return;
      var url;
      try { url = new URL(a.href, location.href); } catch (_) { return; }
      if (url.origin !== location.origin) return;        // external → normal
      if (samePath(url.pathname, location.pathname)) return; // same doc (anchor/no-op) → let default
      e.preventDefault();
      document.body.classList.add("is-leaving");
      var go = function () { window.location.href = a.href; };
      setTimeout(go, 200);
    });
  }
  // Restore visibility if the page is shown from the back/forward cache.
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) document.body.classList.remove("is-leaving");
  });

  /* ---------- Footer year ---------- */
  var y = document.querySelector("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
