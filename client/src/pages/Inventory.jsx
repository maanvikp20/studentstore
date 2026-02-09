import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { inventoryAPI } from '../utils/api';

function Inventory({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await inventoryAPI.getAll();
      setProducts(data || []);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.itemName} added to cart!`);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="inventory-page">
      <div className="container">
        <h1>Shop Our Products</h1>
        
        {products.length === 0 ? (
          <p className="no-data">No products available at the moment.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-card-image">
                  <img src={product.imageURL} alt={product.itemName} />
                </div>
                <div className="product-card-content">
                  <h3>{product.itemName}</h3>
                  <p className="product-card-filament">
                    <span className="badge">{product.filament}</span>
                  </p>
                  <p className="product-card-stock">
                    {product.amountInStock > 0 ? (
                      <span className="in-stock"><FaCheck /> In Stock ({product.amountInStock})</span>
                    ) : (
                      <span className="out-of-stock"><FaTimes /> Out of Stock</span>
                    )}
                  </p>
                  <div className="product-card-footer">
                    <span className="product-card-price">${product.itemPrice}</span>
                    <button 
                      className="btn btn-primary btn-small"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.amountInStock === 0}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Inventory;