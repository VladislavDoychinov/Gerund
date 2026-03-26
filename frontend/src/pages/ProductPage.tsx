import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./ProductPage.css";
import "./Categories.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ProductDetails from "./Components/ProductDetails";
import RelatedProducts from "./Components/RelatedProducts";

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  quantity: number;
  category: string;
  createdByEmail: string;
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

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
      }
    };

    loadProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="product-page">
        <Header />
        <h2>Product Not Found</h2>
        <Link to="/store" className="back-link">Back to Store</Link>
        <Footer />
      </div>
    );
  }

  return (
    <div className="product-page">
      <Header />
      <ProductDetails product={product} />
      <RelatedProducts products={relatedProducts} />
      <Footer />
    </div>
  );
}