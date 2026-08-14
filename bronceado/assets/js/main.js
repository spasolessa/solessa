/* ============================================================
   SOLESSA BRONCEADO — main.js
   ⚙️  CONFIG — datos reales en un solo lugar.
   ============================================================ */
const CONFIG = {
  whatsapp: "573228729010",
  defaultMsg: "Hola Solessa Bronceado, quiero más información.",
  instagram: "@solessaclub",
  instagramUrl: "https://instagram.com/solessaclub",
  address: "Parque Comercial Las Dunas Open · Villa Campestre, Barranquilla",
  hours: "Martes a domingo · 8:00 a.m. – 2:00 p.m. · bajo cita previa",
  phoneText: "Escríbenos",
  worldSpa: "../spa/"   // sitio Spa
};

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const waLink = (msg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg || CONFIG.defaultMsg)}`;

function hydrate() {
  $$("[data-wa]").forEach(el => { el.href = waLink(el.dataset.msg); el.target = "_blank"; el.rel = "noopener"; });
  $$("[data-config]").forEach(el => { const v = CONFIG[el.dataset.config]; if (v) el.textContent = v; });
  $$("[data-config-href]").forEach(el => { const v = CONFIG[el.dataset.configHref]; if (v) el.href = v; });
  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();
}

function splash() {
  const el = $("#splash"); if (!el) return;
  const done = () => el.classList.add("is-done");
  if (reduceMotion) { done(); return; }
  window.addEventListener("load", () => setTimeout(done, 1100));
  setTimeout(done, 2600);
}

function nav() {
  const navEl = $("#nav"), burger = $("#burger"), drawer = $("#drawer");
  const onScroll = () => navEl.classList.toggle("is-stuck", window.scrollY > 12);
  onScroll(); addEventListener("scroll", onScroll, { passive: true });
  const setOpen = (open) => {
    navEl.classList.toggle("is-open", open);
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => setOpen(!drawer.classList.contains("is-open")));
  $$("a", drawer).forEach(a => a.addEventListener("click", () => setOpen(false)));
  addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });
}

function reveal() {
  const items = $$("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) { items.forEach(i => i.classList.add("in")); return; }
  const io = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: .14, rootMargin: "0px 0px -8% 0px" });
  items.forEach(i => io.observe(i));
}

function trap(panel, e) {
  const f = $$('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])', panel).filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function modal() {
  const m = $("#modal"), panel = $(".modal__panel", m); let lastFocus = null;
  const open = (card) => {
    $("#modalCat").textContent = card.dataset.cat || "";
    $("#modalTitle").textContent = card.dataset.name || "";
    const price = card.dataset.price || "";
    $("#modalPrice").textContent = price;
    $("#modalPrice").style.display = price ? "block" : "none";
    $("#modalDetail").innerHTML = $(".card__detail", card)?.innerHTML || "";
    $("#modalWa").href = waLink(`Hola, quiero agendar: ${card.dataset.name}.`);
    m.classList.add("is-open"); m.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lastFocus = document.activeElement; $(".modal__close", m).focus();
  };
  const close = () => {
    m.classList.remove("is-open"); m.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; lastFocus?.focus();
  };
  $$("[data-vermas]").forEach(btn => {
    btn.addEventListener("click", () => { const c = btn.closest(".card"); if (c) open(c); });
  });
  $$("[data-close]", m).forEach(b => b.addEventListener("click", close));
  addEventListener("keydown", e => {
    if (!m.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "Tab") trap(panel, e);
  });
}

function lightbox() {
  const lb = $("#lightbox"); let lastFocus = null;
  const open = (btn) => {
    $("#lbTag").textContent = btn.getAttribute("aria-label") || "foto";
    lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; lastFocus = btn; $("[data-lbclose]", lb).focus();
  };
  const close = () => {
    lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; lastFocus?.focus();
  };
  $$("[data-lightbox]").forEach(b => b.addEventListener("click", () => open(b)));
  $("[data-lbclose]", lb).addEventListener("click", close);
  lb.addEventListener("click", e => { if (e.target === lb) close(); });
  addEventListener("keydown", e => { if (e.key === "Escape" && lb.classList.contains("is-open")) close(); });
}

function slideshow() {
  const groups = $$(".card__slides");
  if (!groups.length || reduceMotion) return;
  let idx = 0;
  setInterval(() => {
    idx = 1 - idx;
    groups.forEach(g => {
      const s = $$(".slide", g);
      s.forEach((img, i) => img.classList.toggle("is-on", i === idx));
    });
  }, 2000);
}

function inclCarousel() {
  const slides = $$(".incl-slide");
  if (slides.length < 2 || reduceMotion) return;
  let i = 0;
  setInterval(() => {
    slides[i].classList.remove("is-on");
    i = (i + 1) % slides.length;
    slides[i].classList.add("is-on");
  }, 1000);
}

function bdayCarousel() {
  const slides = $$(".bday-slide");
  if (slides.length < 2 || reduceMotion) return;
  let i = 0;
  setInterval(() => {
    slides[i].classList.remove("is-on");
    i = (i + 1) % slides.length;
    slides[i].classList.add("is-on");
  }, 2500);
}

hydrate(); splash(); nav(); reveal(); modal(); lightbox(); slideshow(); inclCarousel(); bdayCarousel();
