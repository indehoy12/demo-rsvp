# Invitation & RSVP System — Demo (SRT-PRD-07B)
React + TypeScript + Vite + Tailwind. Data dummy di sessionStorage, tanpa login/database.

## Jalankan
npm install && npm run dev

## Deploy Netlify
Build command `npm run build`, publish directory `dist` (sudah di netlify.toml).
`public/_redirects` (`/* /index.html 200`) menangani SPA routing.
Lalu pasang URL demo di field `demoUrl` produk `invitation-rsvp` (tombol: target="_blank" rel="noopener noreferrer").
