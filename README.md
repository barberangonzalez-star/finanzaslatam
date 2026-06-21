# Latam Finanzas

Portfolio de calculadoras financieras para Latinoamérica. Dominio: **finanzaslatam.xyz**.

## Estructura
- `/` — calculadora de comisiones PayPal (México, Colombia, Chile, Argentina, Bolivia, Venezuela como referencia)
- `/cripto` — calculadora de brecha cambiaria (5 países) + links a las 3 páginas dedicadas
- `/cripto/venezuela` — dashboard de BCV Dólar y BCV Euro, auto-actualizados
- `/cripto/argentina` — dashboard de oficial, blue y Euro, auto-actualizados
- `/cripto/bolivia` — dashboard de oficial (BCB) y paralelo (Binance), auto-actualizados
- `/conversor` — conversor bidireccional Dólar/Euro/Bolívar usando solo la tasa oficial BCV
- `/remesas` — comparador de costo real (comisión + margen cambiario) entre Wise, Western Union y Payoneer, con selector de país origen y destino
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

- **`/cripto`** auto-completa la tasa oficial de los 5 países vía `src/app/api/rates/route.ts`, todas con fuentes públicas sin API key:
  - 🇻🇪 Venezuela: tasa BCV vía `rates.dolarvzla.com`
  - 🇦🇷 Argentina: oficial + blue vía `dolarapi.com` (auto-completa ambos lados)
  - 🇧🇴 Bolivia: oficial + referencia Binance vía `bo.dolarapi.com` (auto-completa ambos lados — Bolivia tiene un tipo fijo desde 2011 con una brecha real frente al paralelo, similar en estructura a Venezuela)
  - 🇨🇴 Colombia: TRM vía el portal oficial de datos abiertos `datos.gov.co` (dataset Socrata `32sa-8pi3`)
  - 🇨🇱 Chile: dólar observado vía `mindicador.cl` (fuente: Banco Central de Chile)

  El precio P2P de Venezuela queda manual porque ninguna fuente pública que encontramos lo expone sin requerir una API key registrada (Cotizave, dolarvzla.com). Colombia y Chile no tienen una brecha cambiaria estructural como Venezuela/Argentina/Bolivia (no hay control de cambios fuerte), así que ahí solo se auto-completa la oficial — el campo de comparación queda abierto para que el usuario meta cualquier tasa que quiera comparar (casa de cambio, P2P, etc.), en vez de forzar un concepto de "paralelo" que no aplica a esas economías.

  **Euro**: además del Dólar, `/api/rates` también devuelve la tasa oficial de Euro para Venezuela (BCV, mismo endpoint que el Dólar) y Argentina (`dolarapi.com/v1/cotizaciones/eur`) en un campo opcional `eurOfficial`. Bolivia no tiene una fuente de Euro confirmada, así que ese campo queda vacío para ese país.

  **Páginas dedicadas por país** (`/cripto/venezuela`, `/cripto/argentina`, `/cripto/bolivia`): en vez de pasar por el selector de país de la calculadora general, estas páginas muestran directamente las tasas del día para ese país específico — pensadas para quien quiere chequear "¿a cuánto está el dólar/euro hoy?" sin tener que tocar nada. Usan el mismo `/api/rates` y el hook compartido `useCountryRates` en `src/components/RateCard.tsx`.

  **Conversor** (`/conversor`): distinto de la calculadora de brecha — no compara tasas, solo convierte un monto puntual entre Dólar, Euro y Bolívar usando exclusivamente la tasa oficial BCV (la que aplica en transacciones formales). Bidireccional: cualquiera de las 3 monedas puede ser el origen. Lógica en `src/lib/converter.ts`, reutiliza el mismo `useCountryRates` hook.

- **`/remesas`** usa estructuras de comisión representativas (publicadas por cada proveedor) pero le pide al usuario el tipo de cambio del día — mismo principio: ese tipo de cambio cambia constantemente y no tiene fuente única confiable para todos los pares de moneda que cubre el comparador.
- Si una fuente automática falla (caída, cambio de formato), el campo cae a edición manual con un indicador visual ("sin datos — ingresá manual") — la calculadora nunca se rompe por una API externa caída.

## Fuente de datos

**PayPal** (`src/lib/paypal-fees.ts`): verificado contra `paypal.com/mx/business/paypal-business-fees`, `paypal.com/co/business/paypal-business-fees`, y `paypal.com/bo/business/paypal-business-fees`. Bolivia no aparece en ninguna tabla de tarifa diferenciada de PayPal, así que usa la misma estructura "resto del mundo" que Colombia, Chile y Argentina (5.40% + comisión fija).

**Remesas** (`/remesas`): el selector de país origen (Desde) y destino (Hacia) ajusta automáticamente la moneda de destino mostrada. El país de origen es contextual — las estructuras de comisión que usamos son representativas y no varían por origen específico, ya que no tenemos una matriz verificada de tarifas por cada corredor origen-destino exacto.

**Brecha cambiaria** (`src/lib/exchange-gap.ts`): fórmula `(paralelo − oficial) / oficial × 100`, validada contra cifras reales reportadas en prensa (Venezuela BCV vs Binance P2P, Argentina oficial vs blue).

**Remesas** (`src/lib/remittance.ts`): estructuras de tarifa representativas de Wise (sin margen cambiario, comisión transparente), Western Union (margen 3-6% típico) y Payoneer (2% + margen), basadas en reportes 2026 de Consumer Reports y comparativas de prensa especializada.

Tests manuales en los tres módulos — ver historial de validación en cada archivo de lib.

## Agregar la siguiente calculadora
Mismo patrón: una carpeta de ruta nueva, su lógica separada en `src/lib/`, una entrada en `TOOLS` dentro de `src/components/NavBar.tsx`.
