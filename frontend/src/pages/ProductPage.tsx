import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./ProductPage.css";
import "./Categories.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ProductDetails from "./Components/ProductDetails";
import RelatedProducts from "./Components/RelatedProducts";
import Reviews from "./Components/Reviews";

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  quantityValue: number;
  quantityUnit: string;
  category: string;
  createdByEmail: string;
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const loadProduct = async () => {
      try {
        const productResponse = await axios.get(
          `http://localhost:8080/api/products/${id}`
        );

        const currentProduct = productResponse.data;
        setProduct(currentProduct);

        const allProductsResponse = await axios.get(
          "http://localhost:8080/api/products"
        );

        setRelatedProducts(
          allProductsResponse.data.filter((p: Product) => p.id !== currentProduct.id)
        );
      } catch (error) {
        console.error("Failed to load product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="product-page">
        <Header />
        <div className="product-page-state">
          <h2>Loading product...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page">
        <Header />
        <div className="product-page-state">
          <h2>Product Not Found</h2>
          <Link to="/store" className="back-link">Back to Store</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="product-page">
      <Header />
      <div className="product-page-shell">
        <div className="purchase-page-topbar">
          <Link to="/store" className="back-link">Back to Store</Link>
        </div>

        <div className="purchase-layout">
          <div className="left-pane">
            <ProductDetails product={product} />

            <section className="reviews-panel" aria-label="Comments and reviews">
              <Reviews productId={product.id} productName={product.name} />
            </section>
          </div>

          <aside className="right-pane">
            <RelatedProducts products={relatedProducts} />
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}