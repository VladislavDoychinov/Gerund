import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import "./AccountPage.css";

interface CurrentUser {
  userId: number;
  email: string;
}

interface ProductRecord {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  quantityValue: number;
  quantityUnit: string;
  category: string;
  createdByEmail?: string;
}

const DEFAULT_DESCRIPTION = "This seller has not added a profile description yet.";

export default function SellerProfilePage() {
  const { email } = useParams<{ email: string }>();

  const sellerEmail = useMemo(() => {
    return decodeURIComponent(email ?? "").trim();
  }, [email]);

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [descriptionDraft, setDescriptionDraft] = useState(DEFAULT_DESCRIPTION);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!sellerEmail) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const [productsResponse, meResponse] = await Promise.all([
          api.get(`/api/products/seller/${encodeURIComponent(sellerEmail)}`),
          api
            .get("/api/auth/me", { withCredentials: true })
            .catch(() => ({ data: null })),
        ]);

        const sellerProducts: ProductRecord[] = Array.isArray(productsResponse.data)
          ? productsResponse.data
          : [];

        setProducts(sellerProducts);
        setCurrentUser(meResponse.data as CurrentUser | null);

        const descriptionStorageKey = `seller-description:${sellerEmail.toLowerCase()}`;
        const savedDescription =
          localStorage.getItem(descriptionStorageKey) || DEFAULT_DESCRIPTION;

        setDescription(savedDescription);
        setDescriptionDraft(savedDescription);
      } catch (error) {
        console.error("Failed to load seller profile:", error);
        setProducts([]);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sellerEmail]);

  const isOwnProfile =
    !!currentUser &&
    !!sellerEmail &&
    currentUser.email.toLowerCase() === sellerEmail.toLowerCase();

  const displayName = useMemo(() => {
    if (!sellerEmail) return "Unknown Seller";
    const localPart = sellerEmail.split("@")[0];
    return localPart || sellerEmail;
  }, [sellerEmail]);

  const saveDescription = () => {
    if (!sellerEmail) return;

    const nextDescription = descriptionDraft.trim() || DEFAULT_DESCRIPTION;
    const descriptionStorageKey = `seller-description:${sellerEmail.toLowerCase()}`;

    localStorage.setItem(descriptionStorageKey, nextDescription);
    setDescription(nextDescription);
    setDescriptionDraft(nextDescription);
    setIsEditingDescription(false);
  };

  return (
    <div className="account-page">
      <Header />

      <main className="account-main">
        {loading && <p className="account-loading">Loading seller profile...</p>}

        {!loading && !sellerEmail && (
          <section className="account-card">
            <h1>Seller not found</h1>
            <p className="account-subtitle">Missing seller email.</p>
            <Link to="/store" className="account-back-link">
              Back to marketplace
            </Link>
          </section>
        )}

        {!loading && sellerEmail && (
          <>
            <section className="account-card">
              <div className="account-header-row">
                <div>
                  <h1>{displayName}</h1>
                  <p className="account-subtitle">Seller profile</p>
                </div>

                <div className="account-avatar" aria-hidden="true">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="account-info-grid">
                <div className="account-info-item">
                  <span className="account-info-label">Display Name</span>
                  <span className="account-info-value">{displayName}</span>
                </div>

                <div className="account-info-item">
                  <span className="account-info-label">Contact Info</span>
                  <span className="account-info-value">{sellerEmail}</span>
                </div>
              </div>

              <div className="account-description-section">
                <div className="account-description-header">
                  <h2>Description</h2>

                  {isOwnProfile && !isEditingDescription && (
                    <button
                      type="button"
                      className="account-inline-button"
                      onClick={() => setIsEditingDescription(true)}
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isEditingDescription ? (
                  <>
                    <textarea
                      className="account-description-input"
                      value={descriptionDraft}
                      onChange={(e) => setDescriptionDraft(e.target.value)}
                      rows={4}
                    />
                    <div className="account-action-row">
                      <button
                        type="button"
                        className="account-inline-button save"
                        onClick={saveDescription}
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        className="account-inline-button"
                        onClick={() => {
                          setDescriptionDraft(description);
                          setIsEditingDescription(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="account-description-text">{description}</p>
                )}
              </div>
            </section>

            <section className="account-card">
              <h2>Products by this seller</h2>

              {products.length === 0 ? (
                <p className="account-subtitle">No products listed yet.</p>
              ) : (
                <div className="account-products-grid">
                  {products.map((product) => (
                    <article key={product.id} className="account-product-card">
                      <img
                        src={
                          product.imageUrl.startsWith("http")
                            ? product.imageUrl
                            : `http://localhost:8080${product.imageUrl}`
                        }
                        alt={product.name}
                        className="account-product-image"
                      />

                      <div className="account-product-body">
                        <h3>{product.name}</h3>
                        <p className="account-product-category">{product.category}</p>
                        <p className="account-product-price">
                          ${product.price.toFixed(2)}
                        </p>
                        <p className="account-product-description">
                          {product.description}
                        </p>
                        <p className="account-product-description">
                          Quantity: {product.quantityValue} {product.quantityUnit}
                        </p>

                        <Link
                          className="account-product-link"
                          to={`/product/${product.id}`}
                        >
                          View product
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}