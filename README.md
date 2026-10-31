# CSZ – Computer Sell Zone (Storefront)

React + Vite + Tailwind CSS e-commerce frontend.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```
Requires Node.js 18 or newer.

## Structure

```
src/
  assets/images/   product, hero and logo images (SVG – replace with real photos)
  components/      UI pieces (Header, Hero, ProductCard, CartDrawer ...)
  hooks/           useCart, useProductFilter, useLocalStorage, useLockBodyScroll
  data/            products, categories, store config
  utils/           helpers (price formatting)
```

## Customise
- Products: `src/data/products.js`
- Free shipping limit, store name, contact: `src/data/config.js`
- Colours: CSS variables at the top of `src/index.css`
- Images: put your photos in `src/assets/images/` and update `src/assets/images/index.js`
