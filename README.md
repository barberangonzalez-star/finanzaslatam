# Latam Finanzas

Portfolio de calculadoras financieras para Latinoamérica, empezando con comisiones de PayPal. Dominio: **finanzaslatam.xyz**.

## Estructura
- `/` — landing del portafolio
- `/paypal` — calculadora de comisiones PayPal (México, Colombia, Chile, Argentina, Venezuela como referencia)

## Stack
- Next.js 16 (App Router, TypeScript, Turbopack)
- Tailwind CSS v4
- Fuentes self-hosted vía `next/font` (Fraunces, Inter, JetBrains Mono)

## Desarrollo local
```bash
npm install
npm run dev
```

## Deploy a Vercel
1. Subir este repo a GitHub
2. Importar en Vercel — detecta Next.js automáticamente
3. Settings → Domains → agregar `finanzaslatam.xyz`
4. En el DNS del dominio (Cloudflare, Namecheap, etc.) apuntar a Vercel

## Antes de salir a producción
- [ ] Reemplazar `pub-0000000000000000` en `public/ads.txt` con el publisher ID real de AdSense
- [ ] Agregar una imagen `og-image.png` (1200x630) real en `/public`
- [ ] Configurar `NEXT_PUBLIC_GA_MEASUREMENT_ID` en Vercel cuando exista la propiedad de Analytics
- [ ] Enviar el sitemap a Google Search Console

## Fuente de datos
Tarifas de PayPal verificadas contra las páginas oficiales de comercios:
- `paypal.com/mx/business/paypal-business-fees`
- `paypal.com/co/business/paypal-business-fees` (aplica también a Chile y Argentina, misma tabla "resto del mundo")

Lógica en `src/lib/paypal-fees.ts`, testeada contra 5 casos manuales:
- México nacional $100 → $95.75 neto ✓
- México internacional $100 → $95.25 neto ✓
- Colombia nacional $100 → $94.30 neto ✓
- Chile internacional $100 → $94.30 neto ✓
- Cálculo inverso (cobrar para recibir $100 neto en Colombia) → $106.03 ✓

Si PayPal cambia sus tarifas, actualizar las constantes en `src/lib/paypal-fees.ts` — la UI se actualiza sola.

## Agregar la siguiente calculadora
Mismo patrón que `/paypal`: una carpeta de ruta nueva, su lógica separada en `src/lib/`, y una entrada en el array `tools` de `src/app/page.tsx`.
