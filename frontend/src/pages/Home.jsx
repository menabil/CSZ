import BannerSlider from "../components/BannerSlider";
import Features from "../components/Features";
import CategoryGrid from "../components/CategoryGrid";
import ProductGrid from "../components/ProductGrid";
import SectionHeading from "../components/SectionHeading";
import { useStore } from "../context/StoreContext";

export default function Home() {
  const { products } = useStore();
  const deals = products.filter((p) => p.oldPrice).slice(0, 4);
  const best = products.filter((p) => p.rating >= 4.8 && !p.oldPrice).slice(0, 4);
  return (
    <>
      <BannerSlider />
      <Features />
      <section className="container-x py-6">
        <SectionHeading title="Shop by category" to="/categories" linkText="All categories" />
        <CategoryGrid />
      </section>
      <section className="container-x py-10">
        <SectionHeading title="Hot deals" to="/shop" />
        <ProductGrid products={deals} />
      </section>
      <section className="container-x py-6">
        <SectionHeading title="Top rated" to="/shop" />
        <ProductGrid products={best} />
      </section>
    </>
  );
}
