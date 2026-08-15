/* ============================================================
   SOLESSA SPA — main.js
   ────────────────────────────────────────────────────────────
   ⚙️  CONFIG — cambia AQUÍ los datos reales (un solo lugar).
   El número de WhatsApp va sin "+", sin espacios ni guiones.
   ============================================================ */
const CONFIG = {
  whatsapp: "573228729010",
  defaultMsg: "Quiero reservar una cita en Solessa Spa",
  instagram: "@solessaclub",
  instagramUrl: "https://instagram.com/solessaclub",
  address: "Parque Comercial Las Dunas Open · Villa Campestre, Barranquilla",
  hours: "Lun – Sáb · 8:00 a.m. – 5:00 p.m.",
  phoneText: "Escríbenos",
  // Mundos SOLESSA — cambia cuando estén las URLs reales (ej. https://bronceado.solessa.com)
  worldBronceado: "../bronceado/",           // sitio Bronceado
  worldHub: "../hub/"                         // hub (elige tu templo)
};

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

function waLink(msg) {
  const text = encodeURIComponent(msg || CONFIG.defaultMsg);
  return `https://wa.me/${CONFIG.whatsapp}?text=${text}`;
}

/* ---- Inyectar CONFIG en el DOM ---- */
function hydrate() {
  $$("[data-wa]").forEach(el => { el.href = waLink(el.dataset.msg); el.target = "_blank"; el.rel = "noopener"; });
  $$("[data-config]").forEach(el => { const v = CONFIG[el.dataset.config]; if (v) el.textContent = v; });
  $$("[data-config-href]").forEach(el => { const v = CONFIG[el.dataset.configHref]; if (v) el.href = v; });
  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();
}

/* ---- Splash ---- */
function splash() {
  const el = $("#splash");
  if (!el) return;
  const done = () => el.classList.add("is-done");
  if (reduceMotion) { done(); return; }
  window.addEventListener("load", () => setTimeout(done, 1100));
  setTimeout(done, 2600); // failsafe
}

/* ---- Nav stuck + burger/drawer ---- */
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

/* ---- Scroll reveal ---- */
function reveal() {
  const items = $$("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) { items.forEach(i => i.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: .14, rootMargin: "0px 0px -8% 0px" });
  items.forEach(i => io.observe(i));
}

/* ---- Focus trap helper ---- */
function trap(panel, e) {
  const f = $$('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])', panel).filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

/* ---- Modal de tratamiento ---- */
function modal() {
  const m = $("#modal"), panel = $(".modal__panel", m);
  let lastFocus = null;
  const open = (card) => {
    $("#modalCat").textContent = card.dataset.cat || "";
    $("#modalTitle").textContent = card.dataset.name || "";
    $("#modalDesc").innerHTML = ($(".card__detail", card)?.innerHTML || "").trim();
    $("#modalWa").href = waLink(`Quiero el ${card.dataset.name}`);
    m.classList.add("is-open"); m.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lastFocus = document.activeElement; $(".modal__close", m).focus();
  };
  const close = () => {
    m.classList.remove("is-open"); m.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; lastFocus?.focus();
  };
  $$(".card").forEach(card => {
    card.addEventListener("click", () => open(card));
    card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(card); } });
  });
  $$("[data-close]", m).forEach(b => b.addEventListener("click", close));
  addEventListener("keydown", e => {
    if (!m.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "Tab") trap(panel, e);
  });
}

/* ---- Lightbox galería ---- */
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

/* ---- Acordeón de tecnologías ---- */
function techAccordion() {
  const items = $$(".techlist__item");
  if (!items.length) return;
  items.forEach(it => {
    it.setAttribute("tabindex", "0");
    it.setAttribute("role", "button");
    const toggle = () => it.classList.toggle("open");
    it.addEventListener("click", toggle);
    it.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
  });
  items[0].classList.add("open"); // el primero abierto para mostrar el patrón
}

hydrate(); splash(); nav(); reveal(); modal(); lightbox(); techAccordion();
