import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaCheck, FaTimes, FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { inventoryAPI } from "../../utils/api";

function ItemDetail({ addToCart, user }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!product) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await inventoryAPI.getById(id);
      setProduct(data);
    } catch (err) {
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="loading">Loading product...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found.</div>;

  const inStock = product.amountInStock > 0;

  return (
    <div className="item-detail-page">
      <button className="back-btn" onClick={() => navigate("/inventory")}>
        <FaArrowLeft /> Back to Shop
      </button>

      <div className="item-detail-container">
        {/* Image */}
        <div className="item-detail-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.itemName} />
          ) : (
            <div className="image-placeholder">
              <span>{product.itemName?.charAt(0)}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="item-detail-info">
          <h1 className="item-detail-name">{product.itemName}</h1>

          <div className="item-detail-stock">
            {inStock ? (
              <span className="in-stock">
                <FaCheck /> In Stock ({product.amountInStock} available)
              </span>
            ) : (
              <span className="out-of-stock">
                <FaTimes /> Out of Stock
              </span>
            )}
          </div>

          {product.filament && (
            <div className="item-detail-meta">
              <span className="meta-label">Material:</span>
              <span className="meta-value">{product.filament}</span>
            </div>
          )}

          {product.color && (
            <div className="item-detail-meta">
              <span className="meta-label">Color:</span>
              <span className="meta-value">{product.color}</span>
            </div>
          )}

          {product.description && (
            <p className="item-detail-description">{product.description}</p>
          )}

          <div className="item-detail-price">${product.itemPrice}</div>

          <button
            className={`add-to-cart-btn ${added ? "added" : ""}`}
            onClick={handleAddToCart}
            disabled={!inStock}
          >
            <FaShoppingCart />
            {added ? "Added!" : inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;