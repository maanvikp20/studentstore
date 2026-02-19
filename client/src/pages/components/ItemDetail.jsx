import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaCheck, FaTimes, FaArrowLeft, FaShoppingCart, FaCube, FaPalette, FaLayerGroup, FaTag } from "react-icons/fa";
import { inventoryAPI } from "../../utils/api";

function ItemDetail({ addToCart, user }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [product, setProduct]   = useState(location.state?.product || null);
  const [loading, setLoading]   = useState(!product);
  const [error, setError]       = useState("");
  const [added, setAdded]       = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  useEffect(() => { if (!product) fetchProduct(); }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await inventoryAPI.getById(id);
      setProduct(data);
    } catch {
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user)   { navigate("/login"); return; }
    if (isAdmin) return;
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  if (loading) return (
    <div className="item-detail-page">
      <div className="detail-skeleton">
        <div className="skeleton-img" />
        <div className="skeleton-info">
          {[80, 50, 100, 60, 40, 90].map((w, i) => (
            <div key={i} className="skeleton-line" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );

  if (error)    return <div className="item-detail-page"><div className="error-message">{error}</div></div>;
  if (!product) return <div className="item-detail-page"><div className="error-message">Product not found.</div></div>;

  const isAdmin  = user?.role === "admin";
  const inStock  = product.amountInStock > 0;
  const maxQty   = Math.min(product.amountInStock, 10);
  const hasImage = (product.imageUrl || product.imageURL) && !imgError;

  const META = [
    product.filament && { icon: <FaCube />,       label: "Material", value: product.filament },
    product.color    && { icon: <FaPalette />,    label: "Color",    value: product.color },
    product.category && { icon: <FaTag />,        label: "Category", value: product.category },
    inStock          && { icon: <FaLayerGroup />, label: "Stock",    value: `${product.amountInStock} units` },
  ].filter(Boolean);

  return (
    <div className="item-detail-page">
      <nav className="detail-breadcrumb">
        <button className="breadcrumb-back" onClick={() => navigate("/inventory")}>
          <FaArrowLeft /> Shop
        </button>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{product.itemName}</span>
      </nav>

      <div className="item-detail-container">
        <div className="item-detail-image">
          {hasImage ? (
            <img
              src={product.imageUrl || product.imageURL}
              alt={product.itemName}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="image-placeholder">
              <span>{product.itemName?.charAt(0)}</span>
              <small>No image</small>
            </div>
          )}
          {!inStock && <div className="detail-out-overlay">Out of Stock</div>}
        </div>

        <div className="item-detail-info">
          <div className="detail-header">
            {product.filament && <span className="badge badge-material">{product.filament}</span>}
            <h1 className="item-detail-name">{product.itemName}</h1>
            <div className="item-detail-price">${parseFloat(product.itemPrice).toFixed(2)}</div>
          </div>

          <div className="item-detail-stock">
            {inStock
              ? <span className="in-stock"><FaCheck /> In Stock — {product.amountInStock} available</span>
              : <span className="out-of-stock"><FaTimes /> Out of Stock</span>
            }
          </div>

          {product.description && (
            <p className="item-detail-description">{product.description}</p>
          )}

          {META.length > 0 && (
            <div className="detail-meta-grid">
              {META.map(({ icon, label, value }) => (
                <div key={label} className="detail-meta-item">
                  <span className="meta-icon">{icon}</span>
                  <div>
                    <div className="meta-label">{label}</div>
                    <div className="meta-value">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {inStock && !isAdmin && (
            <div className="detail-quantity">
              <span className="qty-label">Quantity</span>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
                <span className="qty-value">{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(q => Math.min(maxQty, q + 1))} disabled={quantity >= maxQty}>+</button>
              </div>
            </div>
          )}

          {!isAdmin ? (
            <div className="detail-actions">
              <button
                className={`add-to-cart-btn ${added ? "added" : ""}`}
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                {added
                  ? <><FaCheck /> Added to Cart!</>
                  : inStock
                    ? <><FaShoppingCart /> Add to Cart{quantity > 1 ? ` (${quantity})` : ""}</>
                    : <><FaTimes /> Out of Stock</>
                }
              </button>
            </div>
          ) : (
            <div className="detail-admin-note">
              <FaTag className="detail-admin-note-icon" />
              Viewing as admin — cart actions are disabled.
            </div>
          )}

          <div className="detail-assurance">
            <div className="assurance-item">
              <FaCheck className="assurance-icon" />
              <span>Quality guaranteed</span>
            </div>
            <div className="assurance-item">
              <FaCheck className="assurance-icon" />
              <span>Custom options available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;