# CSZ – Computer Sell Zone (Storefront)

React + Vite + Tailwind CSS + React Router + Lenis smooth scroll.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```
Node.js 18+ required.

## Pages
`/` Home · `/shop` · `/category/:slug` · `/categories` · `/product/:id` · `/checkout` · `/about` · `/contact`

## Structure
```
src/
  assets/images/   product, banner and logo images (replace SVGs with real photos)
  components/      Header, Footer, BannerSlider, Preloader, ProductCard, CartDrawer ...
  pages/           one file per page
  hooks/           useCart, useProductFilter, useLocalStorage, useLockBodyScroll
  context/         CartContext, LenisContext
  data/            products.js, categories.js, banners.js, config.js
  utils/           format.js, product.js
```

## Customise
- Products: `src/data/products.js` · Banner slides: `src/data/banners.js`
- Store name, shipping, social links: `src/data/config.js`
- Colours: CSS variables at top of `src/index.css`
- When deploying, set an SPA fallback so every route serves `index.html`.
