(function () {
  "use strict";
  var TW = "https://widget.treatwell.it/salone/fashion-line/?utm_source=partner&utm_medium=partner-site-book-now-widget/#serviceIds=";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Servizi ---------- */
  var SERVICES = [
    { cat: "Taglio & piega", items: [
      ["Piega", "20–30 min", "da € 18,50", "TR1247760"],
      ["Taglio", "15 min", "€ 20,00", "TR2540018"],
      ["Taglio e piega con shampoo e crema", "30 min", "€ 42,00", "TR1250725"],
      ["Permanente", "1 h 30 min", "€ 40,00", "TR1250747"],
      ["Stiratura classica", "1 h 30 min", "€ 40,00", "TR1250745"],
      ["Lissage alla cheratina con piega", "3 h 30 min", "€ 224,00", "TP2040157"]
    ]},
    { cat: "Colore", items: [
      ["Colore completo", "1 h", "€ 40,00", "TR2540020"],
      ["Colore senza ammoniaca", "40 min", "€ 45,00", "TR2540022"],
      ["Colore completo e piega", "1 h 20 min", "da € 60,00", "TR3322793"],
      ["Colore senza ammoniaca e piega", "1 h 20 min", "da € 65,00", "TR3322794"],
      ["Colore senza ammoniaca, taglio e piega", "1 h 10 min", "€ 87,00", "TP2936480"],
      ["Riflessante", "55 min", "€ 33,00", "TR2540144"],
      ["Colpi di sole", "1 h 30 min", "€ 75,00", "TR2540134"],
      ["Shatush", "2 h", "€ 75,00", "TR1250743"],
      ["Air Touch", "3 h", "€ 120,00", "TR6664112"]
    ]},
    { cat: "Trattamenti", items: [
      ["Trattamenti con balsamo e del cuoio capelluto", "10–25 min", "da € 3,50", "TR1250732"]
    ]},
    { cat: "Extension", items: [
      ["Extension capelli", "1–2 h", "da € 4,50", "TR1378447"]
    ]},
    { cat: "Uomo", items: [
      ["Taglio uomo", "30 min", "€ 20,00", "TR2540016"]
    ]},
    { cat: "Manicure", items: [
      ["Manicure", "20 min", "€ 15,00", "TR1250752"]
    ]}
  ];

  var tabs = document.getElementById("tabs");
  var list = document.getElementById("serviceList");

  function renderCat(i) {
    var html = "";
    SERVICES[i].items.forEach(function (s, k) {
      html += '<div class="svc" style="animation-delay:' + (k * 45) + 'ms">' +
        '<div class="svc-name">' + s[0] + "</div>" +
        '<div class="svc-meta"><span class="svc-price">' + s[2] + "</span><span>· " + s[1] + "</span></div>" +
        '<a class="btn btn-gold" href="' + TW + s[3] + '" target="_blank" rel="noopener" aria-label="Prenota ' + s[0] + '">Prenota</a>' +
        "</div>";
    });
    list.innerHTML = html;
    Array.prototype.forEach.call(tabs.children, function (b, j) {
      b.setAttribute("aria-selected", j === i ? "true" : "false");
    });
  }
  SERVICES.forEach(function (c, i) {
    var b = document.createElement("button");
    b.className = "tab";
    b.type = "button";
    b.setAttribute("role", "tab");
    b.textContent = c.cat;
    b.addEventListener("click", function () {
      renderCat(i);
      b.scrollIntoView({ behavior: reduce ? "auto" : "smooth", inline: "center", block: "nearest" });
    });
    tabs.appendChild(b);
  });
  renderCat(0);

  /* ---------- Header + menu ---------- */
  var header = document.getElementById("header");
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  var bar = document.querySelector(".mobile-bar");
  var heroBg = document.getElementById("heroBg");

  function toggleMenu(open) {
    nav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    document.body.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function () { toggleMenu(!nav.classList.contains("open")); });
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") toggleMenu(false); });

  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("scrolled", y > 40);
    bar.classList.toggle("show", y > window.innerHeight * 0.55);
    if (!reduce && y < window.innerHeight) heroBg.style.transform = "translate3d(0," + (y * 0.25) + "px,0)";
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Reveal + contatori ---------- */
  function countUp(el) {
    var target = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), t0 = null, dur = 1400;
    if (reduce) { el.textContent = target.toFixed(dec).replace(".", ","); return; }
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * e).toFixed(dec).replace(".", ",");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add("in");
        var c = el.querySelector("[data-count]");
        if (c) countUp(c);
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(function (el, i) {
      var sib = el.parentElement.querySelectorAll(":scope > .reveal");
      el.style.transitionDelay = (Array.prototype.indexOf.call(sib, el) * 90) + "ms";
      io.observe(el);
    });
  } else {
    document.documentElement.classList.add("no-js");
    document.querySelectorAll("[data-count]").forEach(countUp);
  }

  /* ---------- Carosello generico ---------- */
  function slider(track, dotsBox, opts) {
    var items = Array.prototype.slice.call(track.children);
    var current = 0, timer = null;
    items.forEach(function (_, i) {
      var d = document.createElement("button");
      d.type = "button";
      d.setAttribute("aria-label", "Vai alla " + (i + 1));
      d.addEventListener("click", function () { go(i); restart(); });
      dotsBox.appendChild(d);
    });
    function go(i) {
      i = (i + items.length) % items.length;
      var it = items[i];
      track.scrollTo({ left: it.offsetLeft - (track.clientWidth - it.clientWidth) / 2, behavior: reduce ? "auto" : "smooth" });
    }
    function update() {
      var mid = track.scrollLeft + track.clientWidth / 2, best = 0, bd = Infinity;
      items.forEach(function (it, i) {
        var d = Math.abs(it.offsetLeft + it.clientWidth / 2 - mid);
        if (d < bd) { bd = d; best = i; }
      });
      current = best;
      items.forEach(function (it, i) { it.classList.toggle("active", i === best); });
      Array.prototype.forEach.call(dotsBox.children, function (d, i) { d.classList.toggle("on", i === best); });
    }
    var raf;
    track.addEventListener("scroll", function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
    function restart() {
      clearInterval(timer);
      if (!reduce && opts.auto) timer = setInterval(function () { if (!document.hidden) go(current + 1); }, opts.auto);
    }
    ["touchstart", "pointerdown", "mouseenter"].forEach(function (ev) {
      track.addEventListener(ev, function () { clearInterval(timer); }, { passive: true });
    });
    track.addEventListener("mouseleave", restart);
    track.addEventListener("touchend", function () { setTimeout(restart, 4000); });
    window.addEventListener("resize", update);
    update(); restart();
    return { next: function () { go(current + 1); restart(); }, prev: function () { go(current - 1); restart(); } };
  }

  var car = slider(document.getElementById("track"), document.getElementById("dots"), { auto: 4200 });
  document.querySelector(".car-btn.next").addEventListener("click", car.next);
  document.querySelector(".car-btn.prev").addEventListener("click", car.prev);
  slider(document.getElementById("revTrack"), document.getElementById("revDots"), { auto: 6000 });

  /* ---------- Orari: oggi + aperto ora (ora di Milano) ---------- */
  try {
    var parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    var get = function (t) { return parts.filter(function (p) { return p.type === t; })[0].value; };
    var dayIdx = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    var mins = parseInt(get("hour"), 10) * 60 + parseInt(get("minute"), 10);
    var todayLi = document.querySelector('.hours li[data-d="' + dayIdx + '"]');
    if (todayLi) todayLi.classList.add("today");
    var openDay = dayIdx >= 2 && dayIdx <= 6;
    var isOpen = openDay && mins >= 540 && mins < 1140;
    var msg;
    if (isOpen) msg = '<span class="dot-live"></span>Aperto ora · chiude alle 19:00';
    else if (openDay && mins < 540) msg = '<span class="dot-live off"></span>Chiuso · apre oggi alle 9:00';
    else {
      var next = dayIdx === 6 || dayIdx === 0 ? "martedì" : (dayIdx === 1 ? "domani" : "domani");
      msg = '<span class="dot-live off"></span>Chiuso · riapre ' + next + " alle 9:00";
    }
    document.getElementById("openStatus").innerHTML = msg;
  } catch (e) {}

  document.getElementById("year").textContent = new Date().getFullYear();
})();
