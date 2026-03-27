import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./ProductPage.css";
import "./Categories.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ProductDetails, { Product } from "./Components/ProductDetails";
import RelatedProducts from "./Components/RelatedProducts";
import Reviews from "./Components/Reviews";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });

    const loadProduct = async () => {
      if (!id) return;

      try {
        const productRes = await axios.get(
          `http://localhost:8080/api/products/${id}`
        );
        const current = productRes.data;

        setProduct(current);

        const allRes = await axios.get(
          "http://localhost:8080/api/products"
        );

        setRelatedProducts(
          allRes.data
            .filter(
              (p: Product) =>
                p.id !== current.id && p.category === current.category
            )
            .slice(0, 6)
        );
      } catch {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>{error}</div>;
  }

  return (
    <div className="product-page">
      <Header />

      <div className="product-page-shell">
        <Link to="/store" className="back-link">
          Back to Store
        </Link>

        <div className="product-layout">
          <div className="left-column">
            <ProductDetails product={product} />

            <section className="reviews-panel" aria-label="Comments and reviews">
              <Reviews productId={product.id} productName={product.name} />
            </section>
          </div>

          <div className="right-column">
            <RelatedProducts products={relatedProducts} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}