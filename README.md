# Solessa Spa

Sitio web estático (HTML/CSS/JS) para **Solessa Spa** — estética y bienestar en Barranquilla, Colombia. Marca hermana de Solessa Club.

## Estructura

```
index.html              Página única
assets/
  css/styles.css        Estilos (dirección "Arena & Oro")
  js/main.js            Interacción + CONFIG editable
  img/                  Logo, favicon, OG
robots.txt · sitemap.xml · _headers   SEO + Cloudflare Pages
```

## Editar datos de contacto

Todo está centralizado en el bloque `CONFIG` al inicio de [`assets/js/main.js`](assets/js/main.js):

```js
const CONFIG = {
  whatsapp: "573000000000",   // número real, sin + ni espacios
  instagram: "@solessa.spa",
  instagramUrl: "https://instagram.com/...",
  address: "…",
  hours: "…"
};
```

También actualiza el dominio (`solessaspa.com`) en los `<meta>` de [`index.html`](index.html), `robots.txt` y `sitemap.xml` cuando sea el definitivo.

## Reemplazar placeholders de imágenes

Los bloques `.ph` son placeholders tonales. Para usar fotos reales: reemplaza cada `<div class="ph …">` por un `<img>` con `width`, `height` y `loading="lazy"` (formato WebP recomendado).

## Desarrollo local

```bash
python3 -m http.server 8090
# abre http://localhost:8090
```

## Despliegue

GitHub privado → Cloudflare Pages. Build command: *(ninguno)*. Output directory: `/` (raíz).
