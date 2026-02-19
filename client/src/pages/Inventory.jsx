import React, { useState, useEffect, useMemo } from "react";
import { FaCheck, FaTimes, FaSearch, FaFilter, FaSortAmountDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { inventoryAPI } from "../utils/api";

const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc',   label: 'Name: A–Z' },
  { value: 'stock',      label: 'In Stock First' },
];

function Inventory({ addToCart, user }) {
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [search, setSearch]           = useState("");
  const [filterStock, setFilterStock] = useState("all");
  const [filterFilament, setFilterFilament] = useState("all");
  const [sort, setSort]               = useState("default");
  const [addedIds, setAddedIds]       = useState({});
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const data = await inventoryAPI.getAll();
      setProducts(data || []);
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filaments = useMemo(() => {
    const set = new Set(products.map(p => p.filament).filter(Boolean));
    return ['all', ...set];
  }, [products]);

  const displayed = useMemo(() => {
    let list = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.itemName?.toLowerCase().includes(q) || p.filament?.toLowerCase().includes(q)
      );
    }
    if (filterStock === 'in')  list = list.filter(p => p.amountInStock > 0);
    if (filterStock === 'out') list = list.filter(p => p.amountInStock === 0);
    if (filterFilament !== 'all') list = list.filter(p => p.filament === filterFilament);
    switch (sort) {
      case 'price-asc':  list.sort((a, b) => parseFloat(a.itemPrice) - parseFloat(b.itemPrice)); break;
      case 'price-desc': list.sort((a, b) => parseFloat(b.itemPrice) - parseFloat(a.itemPrice)); break;
      case 'name-asc':   list.sort((a, b) => a.itemName?.localeCompare(b.itemName)); break;
      case 'stock':      list.sort((a, b) => b.amountInStock - a.amountInStock); break;
    }
    return list;
  }, [products, search, filterStock, filterFilament, sort]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (!user)    { navigate("/login"); return; }
    if (isAdmin)  return;
    addToCart(product);
    setAddedIds(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => setAddedIds(prev => ({ ...prev, [product._id]: false })), 1800);
  };

  const viewDetail = (product) => navigate(`/item/${product._id}`, { state: { product } });

  if (loading) return (
    <div className="inventory-page">
      <div className="inv-loading">
        <div className="inv-loading-grid">
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}
        </div>
      </div>
    </div>
  );

  if (error) return <div className="error-message" style={{ margin: '2rem' }}>{error}</div>;

  return (
    <div className="inventory-page">
      <div className="inventory-hero">
        <div className="inventory-hero-content">
          <div className="inv-eyebrow">3D Print Store</div>
          <h1>Shop Our Products</h1>
          <p>
            {products.length} items available
            {isAdmin && <span className="admin-view-note"> — viewing as admin (cart disabled)</span>}
            {!isAdmin && " — browse, filter, and find yours."}
          </p>
        </div>
      </div>

      <div className="inventory-body">
        <aside className="inv-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-label"><FaFilter /> Availability</div>
            <div className="sidebar-options">
              {[['all', 'All Items'], ['in', 'In Stock'], ['out', 'Out of Stock']].map(([v, l]) => (
                <button
                  key={v}
                  className={`sidebar-opt ${filterStock === v ? 'active' : ''}`}
                  onClick={() => setFilterStock(v)}
                >{l}</button>
              ))}
            </div>
          </div>

          {filaments.length > 1 && (
            <div className="sidebar-section">
              <div className="sidebar-label">Material</div>
              <div className="sidebar-options">
                {filaments.map(f => (
                  <button
                    key={f}
                    className={`sidebar-opt ${filterFilament === f ? 'active' : ''}`}
                    onClick={() => setFilterFilament(f)}
                  >{f === 'all' ? 'All Materials' : f}</button>
                ))}
              </div>
            </div>
          )}
        </aside>

        <div className="inv-main">
          <div className="inv-toolbar">
            <div className="inv-search-wrap">
              <FaSearch className="search-icon" />
              <input
                className="inv-search"
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="search-clear" onClick={() => setSearch('')}>
                  <FaTimes />
                </button>
              )}
            </div>
            <div className="inv-sort-wrap">
              <FaSortAmountDown className="sort-icon" />
              <select className="inv-sort" value={sort} onChange={e => setSort(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {displayed.length === 0 ? (
            <div className="inv-empty">
              <div className="inv-empty-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters.</p>
              <button className="btn btn-secondary" onClick={() => { setSearch(''); setFilterStock('all'); setFilterFilament('all'); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <p className="inv-count">{displayed.length} product{displayed.length !== 1 ? 's' : ''}</p>
              <div className="product-grid">
                {displayed.map((product) => (
                  <div
                    key={product._id}
                    className="product-card"
                    onClick={() => viewDetail(product)}
                  >
                    <div className="product-card-image">
                      {product.imageURL
                        ? <img className="img" src={product.imageURL} alt={product.itemName} />
                        : <div className="img-placeholder">{product.itemName?.charAt(0)}</div>
                      }
                      {product.amountInStock === 0 && (
                        <div className="out-of-stock-overlay">Out of Stock</div>
                      )}
                    </div>

                    <div className="product-card-content">
                      <div className="product-card-top">
                        <h3>{product.itemName}</h3>
                        {product.filament && <span className="badge">{product.filament}</span>}
                      </div>

                      <p className="product-card-stock">
                        {product.amountInStock > 0
                          ? <span className="in-stock"><FaCheck /> {product.amountInStock} in stock</span>
                          : <span className="out-of-stock"><FaTimes /> Out of Stock</span>
                        }
                      </p>

                      <div className="product-card-footer">
                        <span className="product-card-price">
                          ${parseFloat(product.itemPrice).toFixed(2)}
                        </span>
                        {!isAdmin && (
                          <button
                            className={`btn btn-small ${addedIds[product._id] ? 'btn-success' : 'btn-primary'}`}
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={product.amountInStock === 0}
                          >
                            {addedIds[product._id] ? <><FaCheck /> Added</> : '+ Cart'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Inventory;