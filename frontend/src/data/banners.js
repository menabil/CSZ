import { hero, categoryImages } from "../assets/images";

// Slider content. Only the image and text change between slides.
export const BANNERS = [
  { id: 1, image: hero, eyebrow: "New season", title: "Build your dream PC with CSZ", text: "Genuine parts, clear specs and fast delivery for every budget.", cta: "Shop all parts", to: "/shop" },
  { id: 2, image: categoryImages["Graphics Cards"], eyebrow: "Up to $50 off", title: "RTX and Radeon graphics cards", text: "Play the latest games at high frame rates with top GPUs.", cta: "View graphics cards", to: "/category/graphics-cards" },
  { id: 3, image: categoryImages["Storage"], eyebrow: "Fast storage", title: "NVMe SSDs that load in seconds", text: "Upgrade your boot drive and cut waiting time for good.", cta: "View storage", to: "/category/storage" },
];
