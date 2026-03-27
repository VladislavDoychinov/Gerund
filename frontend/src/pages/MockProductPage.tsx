import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductPage.css";
import "./Categories.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Reviews from "./Components/Reviews";
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

    // Inside ProductPage.tsx, replace the loadProduct useEffect logic with this:
    useEffect(() => {
    const mockProduct = {
        id: Number(id),
        name: "Sample Item",
        price: 99.99,
        imageUrl: "/placeholder.png",
        description: "This is a mock description for layout testing.",
        quantity: 5,
        category: "electronics",
        createdByEmail: "test@user.com"
    };

    setProduct(mockProduct);
    setRelatedProducts([mockProduct, mockProduct]); // Dummy related items
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
    };

  return (
    <div className="product-page">
      <Header />

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

      <Footer />
    </div>
  );


}