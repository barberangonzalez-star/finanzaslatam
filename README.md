# Latam Finanzas

Portfolio de calculadoras financieras para Latinoamérica. Dominio: **finanzaslatam.xyz**.

## Estructura
- `/` — calculadora de comisiones PayPal (México, Colombia, Chile, Argentina, Venezuela como referencia)
- `/cripto` — brecha cambiaria (tasa oficial vs. Binance P2P / dólar blue) para Venezuela y Argentina
- `/remesas` — comparador de costo real (comisión + margen cambiario) entre Wise, Western Union y Payoneer
- `/paypal` — redirect 308 a `/` (ruta legada, conserva SEO de versiones anteriores)

## Stack
- Next.js 16 (App Router, TypeScript, Turbopack)
- Tailwind CSS v4
- Fuentes self-hosted vía `next/font` (Space Grotesk, Inter, JetBrains Mono)
- Estilo fintech moderno: navy + violeta + menta, tarjetas redondeadas, navbar fija

## Desarrollo local
```bash
npm install
npm run dev
```

## Deploy a Vercel
1. Subir este repo a GitHub
2. Importar en Vercel — detecta Next.js automáticamente
3. Settings → Domains → agregar `finanzaslatam.xyz`
4. En el DNS del dominio apuntar a Vercel

## Antes de salir a producción
- [ ] Reemplazar `pub-0000000000000000` en `public/ads.txt` con el publisher ID real de AdSense
- [ ] Agregar una imagen `og-image.png` (1200x630) real en `/public`
- [ ] Configurar `NEXT_PUBLIC_GA_MEASUREMENT_ID` en Vercel
- [ ] Enviar el sitemap a Google Search Console

## Por qué Cripto y Remesas no tienen tasas hardcodeadas

A diferencia de SDLT o las comisiones de PayPal (tarifas estructurales fijadas por ley o política, estables por meses), el precio del USDT en Binance P2P y el dólar blue argentino cambian por minuto. Hardcodear un número ahí sería publicar un dato falso desde el día siguiente. Por eso:

- **`/cripto`** le pide al usuario las dos tasas del momento (oficial y paralela) y calcula la brecha — la calculadora aporta el cálculo, no el dato de mercado.
- **`/remesas`** usa estructuras de comisión representativas (publicadas por cada proveedor) pero le pide al usuario el tipo de cambio del día — mismo principio.

## Fuente de datos

**PayPal** (`src/lib/paypal-fees.ts`): verificado contra `paypal.com/mx/business/paypal-business-fees` y `paypal.com/co/business/paypal-business-fees` (aplica también a Chile y Argentina).

**Brecha cambiaria** (`src/lib/exchange-gap.ts`): fórmula `(paralelo − oficial) / oficial × 100`, validada contra cifras reales reportadas en prensa (Venezuela BCV vs Binance P2P, Argentina oficial vs blue).

**Remesas** (`src/lib/remittance.ts`): estructuras de tarifa representativas de Wise (sin margen cambiario, comisión transparente), Western Union (margen 3-6% típico) y Payoneer (2% + margen), basadas en reportes 2026 de Consumer Reports y comparativas de prensa especializada.

Tests manuales en los tres módulos — ver historial de validación en cada archivo de lib.

## Agregar la siguiente calculadora
Mismo patrón: una carpeta de ruta nueva, su lógica separada en `src/lib/`, una entrada en `TOOLS` dentro de `src/components/NavBar.tsx`.
