import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const loadProduct = async () => {
      if (!id) {
        setError("Invalid product ID");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const productResponse = await axios.get(`http://localhost:8080/api/products/${id}`);
        const currentProduct = productResponse.data;

        if (!currentProduct) {
          setError("Product not found");
          setProduct(null);
          setRelatedProducts([]);
          return;
        }

        setProduct(currentProduct);

        const allProductsResponse = await axios.get("http://localhost:8080/api/products");
        const allProducts = Array.isArray(allProductsResponse.data) ? allProductsResponse.data : [];

        setRelatedProducts(
          allProducts
            .filter((p: Product) => p.id !== currentProduct.id && p.category === currentProduct.category)
            .slice(0, 6)
        );
      } catch (err: any) {
        console.error("Failed to load product:", err);

        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError("Product not found");
          setProduct(null);
        } else {
          setError("Error loading product data. Please try again.");
          setProduct(null);
        }

        setRelatedProducts([]);
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
          <h2>{error || "Product Not Found"}</h2>
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

          <div className="product-layout">
            <div className="left-column">
              <ProductDetails product={product} />

              <div className="reviews-section">
                <Reviews />
              </div>
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