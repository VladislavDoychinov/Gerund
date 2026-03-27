import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import "./AccountPage.css";

interface UserRecord {
  id: number;
  username?: string | null;
  name?: string | null;
  email: string;
}

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
  createdByUserId?: number;
  createdByEmail?: string;
}

const DEFAULT_DESCRIPTION = "This user has not added a profile description yet.";

export default function AccountPage() {
  const { email } = useParams<{ email: string }>();

  const accountKey = useMemo(
    () => decodeURIComponent(email ?? "").trim().toLowerCase(),
    [email]
  );

  const [loading, setLoading] = useState(true);
  const [accountUser, setAccountUser] = useState<UserRecord | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [descriptionDraft, setDescriptionDraft] = useState(DEFAULT_DESCRIPTION);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersResponse, productsResponse, meResponse] = await Promise.all([
          api.get("/users"),
          api.get("/api/products"),
          api.get("/api/auth/me", { withCredentials: true }).catch(() => ({ data: null })),
        ]);

        const users: UserRecord[] = Array.isArray(usersResponse.data) ? usersResponse.data : [];
        const allProducts: ProductRecord[] = Array.isArray(productsResponse.data)
          ? productsResponse.data
          : [];

        const foundUser =
          users.find((user) => {
            const username = (user.username ?? "").toLowerCase();
            const name = (user.name ?? "").toLowerCase();
            const userEmail = (user.email ?? "").toLowerCase();

            return (
              username === accountKey ||
              name === accountKey ||
              userEmail === accountKey
            );
          }) ?? null;

        setAccountUser(foundUser);
        setCurrentUser(meResponse.data as CurrentUser | null);

        if (foundUser) {
          const userProducts = allProducts.filter((product) => {
            if (typeof product.createdByUserId === "number") {
              return product.createdByUserId === foundUser.id;
            }
            return (
              (product.createdByEmail ?? "").toLowerCase() ===
              foundUser.email.toLowerCase()
            );
          });

          setProducts(userProducts);

          const descriptionStorageKey = `account-description:${foundUser.email.toLowerCase()}`;
          const savedDescription =
            localStorage.getItem(descriptionStorageKey) || DEFAULT_DESCRIPTION;

          setDescription(savedDescription);
          setDescriptionDraft(savedDescription);
        } else {
          setProducts([]);
          setDescription(DEFAULT_DESCRIPTION);
          setDescriptionDraft(DEFAULT_DESCRIPTION);
        }
      } catch (error) {
        console.error("Failed to load account page:", error);
        setAccountUser(null);
        setCurrentUser(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [accountKey]);

  const isOwnAccount = !!(
    accountUser &&
    currentUser &&
    accountUser.email.toLowerCase() === currentUser.email.toLowerCase()
  );

  const saveDescription = () => {
    if (!accountUser) return;

    const nextDescription = descriptionDraft.trim() || DEFAULT_DESCRIPTION;
    const descriptionStorageKey = `account-description:${accountUser.email.toLowerCase()}`;

    localStorage.setItem(descriptionStorageKey, nextDescription);
    setDescription(nextDescription);
    setDescriptionDraft(nextDescription);
    setIsEditingDescription(false);
  };

  return (
    <div className="account-page">
      <Header />

      <main className="account-main">
        {loading && <p className="account-loading">Loading account...</p>}

        {!loading && !accountUser && (
          <section className="account-card">
            <h1>Account not found</h1>
            <p className="account-subtitle">No user matched: {email}</p>
            <Link to="/store" className="account-back-link">
              Back to marketplace
            </Link>
          </section>
        )}

        {!loading && accountUser && (
          <>
            <section className="account-card">
              <div className="account-header-row">
                <div>
                  <h1>{accountUser.username || accountUser.name || accountUser.email}</h1>
                  <p className="account-subtitle">User account</p>
                </div>

                <div className="account-avatar" aria-hidden="true">
                  {(accountUser.username || accountUser.email).charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="account-info-grid">
                <div className="account-info-item">
                  <span className="account-info-label">Display Name</span>
                  <span className="account-info-value">
                    {accountUser.username || accountUser.name || "Not set"}
                  </span>
                </div>

                <div className="account-info-item">
                  <span className="account-info-label">Contact Info</span>
                  <span className="account-info-value">{accountUser.email}</span>
                </div>
              </div>

              <div className="account-description-section">
                <div className="account-description-header">
                  <h2>Description</h2>

                  {isOwnAccount && !isEditingDescription && (
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
              <h2>Products by this user</h2>

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
                        <p className="account-product-price">${product.price.toFixed(2)}</p>
                        <p className="account-product-description">{product.description}</p>
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