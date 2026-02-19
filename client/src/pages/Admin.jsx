import React, { useState, useEffect, useRef } from "react";
import {
  FaTrash, FaEdit, FaCheck, FaTimes, FaPlus,
  FaUsers, FaShoppingBag, FaBox, FaCubes, FaChartBar,
  FaSave, FaSearch, FaImage
} from "react-icons/fa";
import { usersAPI, ordersAPI, customOrdersAPI, inventoryAPI } from "../utils/api";

const ORDER_STATUSES = ["Pending", "Processing", "Completed", "Cancelled"];
const SLICE_STATUSES = ["pending", "slicing", "done", "error", "unsupported"];
const MATERIALS      = ["PLA", "PETG", "ABS", "TPU", "ASA", "NYLON", "RESIN"];

const STATUS_COLORS = {
  Pending: "badge-warning", Processing: "badge-processing",
  Completed: "badge-success", Cancelled: "badge-danger",
};

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-body">
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
        {sub && <div className="stat-card-sub">{sub}</div>}
      </div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger"    onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// Reusable image file picker that shows a preview
function ImagePicker({ value, onChange, label = "Product Image" }) {
  const inputRef = useRef();
  const [preview, setPreview] = useState(value || "");

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    onChange(f);
    setPreview(URL.createObjectURL(f));
  };

  return (
    <div className="image-picker">
      <label>{label}</label>
      <div className="image-picker-inner" onClick={() => inputRef.current?.click()}>
        {preview
          ? <img src={preview} alt="preview" className="image-preview" />
          : <div className="image-preview-empty"><FaImage /><span>Click to upload</span></div>
        }
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      <p className="image-picker-hint">JPG, PNG, WebP · Max 10MB · Stored on Cloudinary</p>
    </div>
  );
}

function Admin({ token, user }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [users,        setUsers]        = useState([]);
  const [orders,       setOrders]       = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [inventory,    setInventory]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [search,   setSearch]   = useState("");
  const [confirm,  setConfirm]  = useState(null);
  const [savingId, setSavingId] = useState(null);

  // Inventory add form
  const [showAddItem, setShowAddItem] = useState(false);
  const [addForm,     setAddForm]     = useState({ itemName:"", itemPrice:"", amountInStock:"", filament:"PLA", description:"" });
  const [addImageFile, setAddImageFile] = useState(null);
  const [addLoading,  setAddLoading]  = useState(false);
  const [addError,    setAddError]    = useState("");

  // Inventory inline edit
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm,    setItemForm]    = useState({});
  const [editImageFile, setEditImageFile] = useState(null);

  useEffect(() => { if (token) fetchAll(); }, [token]);

  const fetchAll = async () => {
    setLoading(true); setError("");
    try {
      const [u, o, co, inv] = await Promise.all([
        usersAPI.getAll(token),
        ordersAPI.getAll(token),
        customOrdersAPI.getAll(token),
        inventoryAPI.getAll(),
      ]);
      setUsers(u.data || []);
      setOrders(o.data || []);
      setCustomOrders(co.data || []);
      setInventory(inv.data || inv || []);
    } catch { setError("Failed to load dashboard data."); }
    finally { setLoading(false); }
  };

  const doConfirm   = (message, action) => setConfirm({ message, action });
  const closeConfirm = () => setConfirm(null);
  const runConfirm   = () => { confirm?.action(); closeConfirm(); };

  // Users
  const deleteUser = (id, email) => {
    if (user?.email === email) { alert("You cannot delete your own account."); return; }
    doConfirm(`Delete user ${email}?`, async () => {
      await usersAPI.delete(token, id);
      setUsers(p => p.filter(u => u._id !== id));
    });
  };
  const toggleRole = async (u) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    try {
      await usersAPI.updateRole(token, u._id, newRole);
      setUsers(p => p.map(x => x._id === u._id ? { ...x, role: newRole } : x));
    } catch { alert("Failed to update role."); }
  };

  // Orders
  const updateOrderStatus = async (id, status) => {
    setSavingId(id);
    try {
      await ordersAPI.update(token, id, { status });
      setOrders(p => p.map(o => o._id === id ? { ...o, status } : o));
    } catch { alert("Failed to update status."); }
    finally { setSavingId(null); }
  };
  const deleteOrder = (id) => doConfirm("Delete this order?", async () => {
    await ordersAPI.delete(token, id);
    setOrders(p => p.filter(o => o._id !== id));
  });

  // Custom orders
  const updateCustomStatus = async (id, sliceStatus) => {
    setSavingId(id);
    try {
      await customOrdersAPI.update(token, id, { sliceStatus });
      setCustomOrders(p => p.map(o => o._id === id ? { ...o, sliceStatus } : o));
    } catch { alert("Failed to update status."); }
    finally { setSavingId(null); }
  };
  const deleteCustom = (id) => doConfirm("Delete this custom order?", async () => {
    await customOrdersAPI.delete(token, id);
    setCustomOrders(p => p.filter(o => o._id !== id));
  });

  // Inventory
  const startEditItem = (item) => {
    setEditingItem(item._id);
    setEditImageFile(null);
    setItemForm({
      itemName:      item.itemName,
      itemPrice:     item.itemPrice,
      amountInStock: item.amountInStock,
      filament:      item.filament || "PLA",
      imageURL:      item.imageURL || item.imageUrl || "",
      description:   item.description || "",
    });
  };
  const cancelEditItem = () => { setEditingItem(null); setItemForm({}); setEditImageFile(null); };

  const saveItem = async (id) => {
    setSavingId(id);
    try {
      // Pass editImageFile as 3rd arg — api.js will append it to FormData if present
      const result = await inventoryAPI.update(token, id, itemForm, editImageFile);
      const updated = result.data || result;
      setInventory(p => p.map(i => i._id === id ? { ...i, ...updated } : i));
      setEditingItem(null);
      setEditImageFile(null);
    } catch { alert("Failed to save changes."); }
    finally { setSavingId(null); }
  };

  const deleteItem = (id, name) => doConfirm(`Delete "${name}" from inventory?`, async () => {
    await inventoryAPI.delete(token, id);
    setInventory(p => p.filter(i => i._id !== id));
  });

  const handleAddItem = async (e) => {
    e.preventDefault();
    setAddError("");
    if (!addForm.itemName || !addForm.itemPrice) { setAddError("Name and price are required."); return; }
    setAddLoading(true);
    try {
      const data = {
        ...addForm,
        itemPrice:     parseFloat(addForm.itemPrice),
        amountInStock: parseInt(addForm.amountInStock, 10) || 0,
      };
      // addImageFile passed as 3rd arg — api.js appends it to FormData
      const result  = await inventoryAPI.create(token, data, addImageFile);
      const newItem = result.data || result;
      setInventory(p => [newItem, ...p]);
      setShowAddItem(false);
      setAddImageFile(null);
      setAddForm({ itemName:"", itemPrice:"", amountInStock:"", filament:"PLA", description:"" });
    } catch { setAddError("Failed to add item."); }
    finally { setAddLoading(false); }
  };

  const filterList = (list, keys) => {
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(item => keys.some(k => String(item[k] || "").toLowerCase().includes(q)));
  };

  const TABS = [
    { id: "overview",  icon: <FaChartBar />,    label: "Overview" },
    { id: "users",     icon: <FaUsers />,        label: `Users (${users.length})` },
    { id: "orders",    icon: <FaShoppingBag />,  label: `Orders (${orders.length})` },
    { id: "custom",    icon: <FaBox />,           label: `Custom (${customOrders.length})` },
    { id: "inventory", icon: <FaCubes />,         label: `Inventory (${inventory.length})` },
  ];

  const filteredUsers  = filterList(users,        ["name","email"]);
  const filteredOrders = filterList(orders,       ["customerName","customerEmail","_id"]);
  const filteredCustom = filterList(customOrders, ["customerName","customerEmail","_id"]);
  const filteredInv    = filterList(inventory,    ["itemName","filament"]);

  return (
    <div className="admin-page">
      {confirm && <ConfirmModal message={confirm.message} onConfirm={runConfirm} onCancel={closeConfirm} />}

      <div className="admin-header">
        <div className="admin-header-inner">
          <div>
            <div className="admin-eyebrow">Administrator</div>
            <h1>Dashboard</h1>
          </div>
          <button className="btn btn-secondary btn-small" onClick={fetchAll}>Refresh</button>
        </div>
      </div>

      <div className="admin-body">
        <aside className="admin-sidebar">
          {TABS.map(t => (
            <button key={t.id} className={`sidebar-tab ${activeTab === t.id ? "active" : ""}`}
              onClick={() => { setActiveTab(t.id); setSearch(""); }}>
              {t.icon} <span>{t.label}</span>
            </button>
          ))}
        </aside>

        <main className="admin-main">
          {error   && <div className="error-message">{error}</div>}
          {loading && <div className="loading">Loading dashboard…</div>}

          {!loading && activeTab === "overview" && (
            <div className="admin-overview">
              <h2>Overview</h2>
              <div className="stats-grid">
                <StatCard icon={<FaUsers />}       label="Total Users"     value={users.length} />
                <StatCard icon={<FaShoppingBag />} label="Total Orders"    value={orders.length}
                  sub={`${orders.filter(o=>o.status==="Completed").length} completed`} />
                <StatCard icon={<FaBox />}         label="Custom Orders"   value={customOrders.length}
                  sub={`${customOrders.filter(o=>o.sliceStatus==="done").length} sliced`} />
                <StatCard icon={<FaCubes />}       label="Inventory Items" value={inventory.length}
                  sub={`${inventory.filter(i=>i.amountInStock>0).length} in stock`} />
              </div>
              <div className="overview-tables">
                <div className="overview-section">
                  <div className="overview-section-header">
                    <h3>Recent Orders</h3>
                    <button className="link-btn" onClick={() => setActiveTab("orders")}>View all →</button>
                  </div>
                  <div className="mini-table">
                    {orders.slice(0,5).map(o => (
                      <div key={o._id} className="mini-row">
                        <span className="mini-id">#{o._id.slice(-6).toUpperCase()}</span>
                        <span className="mini-name">{o.customerName}</span>
                        <span className={`badge ${STATUS_COLORS[o.status] || "badge-warning"}`}>{o.status || "Pending"}</span>
                      </div>
                    ))}
                    {orders.length === 0 && <p className="mini-empty">No orders yet.</p>}
                  </div>
                </div>
                <div className="overview-section">
                  <div className="overview-section-header">
                    <h3>Low Stock</h3>
                    <button className="link-btn" onClick={() => setActiveTab("inventory")}>Manage →</button>
                  </div>
                  <div className="mini-table">
                    {inventory.filter(i => i.amountInStock <= 3).slice(0,5).map(i => (
                      <div key={i._id} className="mini-row">
                        <span className="mini-name">{i.itemName}</span>
                        <span className={`mini-stock ${i.amountInStock === 0 ? "stock-zero" : "stock-low"}`}>{i.amountInStock} left</span>
                      </div>
                    ))}
                    {inventory.filter(i => i.amountInStock <= 3).length === 0 && <p className="mini-empty">All items well stocked.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && activeTab === "users" && (
            <div className="admin-section">
              <div className="section-toolbar">
                <h2>All Users</h2>
                <div className="search-wrap">
                  <FaSearch className="search-icon-sm" />
                  <input className="search-input" placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u._id}>
                        <td className="td-name">
                          <div className="user-avatar-sm">{u.name?.charAt(0)}</div>
                          {u.name}
                          {user?.email === u.email && <span className="badge badge-admin you-badge">You</span>}
                        </td>
                        <td className="td-muted">{u.email}</td>
                        <td><span className={`badge ${u.role === "admin" ? "badge-admin" : "badge-user"}`}>{u.role || "user"}</span></td>
                        <td className="td-muted">{new Date(u.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</td>
                        <td>
                          <div className="action-row">
                            {user?.email !== u.email && (
                              <>
                                <button className="btn btn-small btn-secondary" onClick={() => toggleRole(u)}>
                                  {u.role === "admin" ? "Demote" : "Promote"}
                                </button>
                                <button className="btn btn-danger btn-small icon-btn" onClick={() => deleteUser(u._id, u.email)}><FaTrash /></button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && <tr><td colSpan={5} className="no-results">No users found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && activeTab === "orders" && (
            <div className="admin-section">
              <div className="section-toolbar">
                <h2>All Orders</h2>
                <div className="search-wrap">
                  <FaSearch className="search-icon-sm" />
                  <input className="search-input" placeholder="Search orders…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Order ID</th><th>Customer</th><th>Email</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredOrders.map(o => (
                      <tr key={o._id}>
                        <td className="td-id">#{o._id.slice(-6).toUpperCase()}</td>
                        <td>{o.customerName}</td>
                        <td className="td-muted">{o.customerEmail}</td>
                        <td className="td-muted">{new Date(o.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</td>
                        <td>
                          <select className={`status-select status-${(o.status||"Pending").toLowerCase()}`}
                            value={o.status || "Pending"} onChange={e => updateOrderStatus(o._id, e.target.value)} disabled={savingId === o._id}>
                            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td><button className="btn btn-danger btn-small icon-btn" onClick={() => deleteOrder(o._id)}><FaTrash /></button></td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && <tr><td colSpan={6} className="no-results">No orders found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && activeTab === "custom" && (
            <div className="admin-section">
              <div className="section-toolbar">
                <h2>Custom Orders</h2>
                <div className="search-wrap">
                  <FaSearch className="search-icon-sm" />
                  <input className="search-input" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>ID</th><th>Customer</th><th>Material</th><th>File</th><th>Slice Status</th><th>Date</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredCustom.map(o => (
                      <tr key={o._id}>
                        <td className="td-id">#{o._id.slice(-6).toUpperCase()}</td>
                        <td>
                          <div>{o.customerName}</div>
                          <div className="td-muted td-small">{o.customerEmail}</div>
                        </td>
                        <td>
                          {o.material && <span className="chip">{o.material}</span>}
                          {o.color    && <span className="chip chip-muted">{o.color}</span>}
                        </td>
                        <td>
                          {o.orderFileURL
                            ? <a href={o.orderFileURL} target="_blank" rel="noopener noreferrer" className="file-link">{o.fileName || "View ↗"}</a>
                            : <span className="td-muted">—</span>
                          }
                          {o.gcodeURL && <a href={o.gcodeURL} download className="gcode-dl">G-code ↓</a>}
                        </td>
                        <td>
                          <select className={`status-select status-slice-${o.sliceStatus || "pending"}`}
                            value={o.sliceStatus || "pending"} onChange={e => updateCustomStatus(o._id, e.target.value)} disabled={savingId === o._id}>
                            {SLICE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="td-muted">{new Date(o.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</td>
                        <td><button className="btn btn-danger btn-small icon-btn" onClick={() => deleteCustom(o._id)}><FaTrash /></button></td>
                      </tr>
                    ))}
                    {filteredCustom.length === 0 && <tr><td colSpan={7} className="no-results">No custom orders found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && activeTab === "inventory" && (
            <div className="admin-section">
              <div className="section-toolbar">
                <h2>Inventory</h2>
                <div className="toolbar-right">
                  <div className="search-wrap">
                    <FaSearch className="search-icon-sm" />
                    <input className="search-input" placeholder="Search items…" value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <button className="btn btn-primary btn-small" onClick={() => { setShowAddItem(p=>!p); setAddError(""); }}>
                    {showAddItem ? <><FaTimes /> Cancel</> : <><FaPlus /> Add Item</>}
                  </button>
                </div>
              </div>

              {showAddItem && (
                <form className="add-item-form" onSubmit={handleAddItem}>
                  <h3>New Product</h3>
                  {addError && <div className="error-message">{addError}</div>}
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Product Name *</label>
                      <input type="text" value={addForm.itemName} onChange={e=>setAddForm(p=>({...p,itemName:e.target.value}))} placeholder="e.g. Cable Organizer" required />
                    </div>
                    <div className="form-group">
                      <label>Price ($) *</label>
                      <input type="number" value={addForm.itemPrice} onChange={e=>setAddForm(p=>({...p,itemPrice:e.target.value}))} placeholder="9.99" step="0.01" min="0" required />
                    </div>
                    <div className="form-group">
                      <label>Stock Quantity</label>
                      <input type="number" value={addForm.amountInStock} onChange={e=>setAddForm(p=>({...p,amountInStock:e.target.value}))} placeholder="0" min="0" />
                    </div>
                    <div className="form-group">
                      <label>Material</label>
                      <select value={addForm.filament} onChange={e=>setAddForm(p=>({...p,filament:e.target.value}))}>
                        {MATERIALS.map(m=><option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="form-group span-2">
                      <label>Description</label>
                      <textarea value={addForm.description} onChange={e=>setAddForm(p=>({...p,description:e.target.value}))} rows={2} placeholder="Short product description…" />
                    </div>
                    <div className="form-group span-2">
                      <ImagePicker label="Product Image (uploaded to Cloudinary)" onChange={setAddImageFile} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={addLoading}>
                    {addLoading ? "Uploading…" : <><FaPlus /> Add Product</>}
                  </button>
                </form>
              )}

              <div className="admin-table-wrap">
                <table className="admin-table inventory-table">
                  <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Material</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredInv.map(item => (
                      <tr key={item._id} className={editingItem === item._id ? "row-editing" : ""}>
                        <td className="td-img">
                          {(item.imageURL || item.imageUrl)
                            ? <img src={item.imageURL || item.imageUrl} alt={item.itemName} />
                            : <div className="img-placeholder-sm">{item.itemName?.charAt(0)}</div>
                          }
                        </td>
                        {editingItem === item._id ? (
                          <>
                            <td>
                              <input className="inline-input" value={itemForm.itemName} onChange={e=>setItemForm(p=>({...p,itemName:e.target.value}))} />
                              <div className="edit-image-upload">
                                <ImagePicker label="Replace image" value={itemForm.imageURL} onChange={setEditImageFile} />
                              </div>
                            </td>
                            <td><input className="inline-input inline-price" type="number" step="0.01" min="0" value={itemForm.itemPrice} onChange={e=>setItemForm(p=>({...p,itemPrice:e.target.value}))} /></td>
                            <td><input className="inline-input inline-stock" type="number" min="0" value={itemForm.amountInStock} onChange={e=>setItemForm(p=>({...p,amountInStock:e.target.value}))} /></td>
                            <td>
                              <select className="inline-select" value={itemForm.filament} onChange={e=>setItemForm(p=>({...p,filament:e.target.value}))}>
                                {MATERIALS.map(m=><option key={m} value={m}>{m}</option>)}
                              </select>
                            </td>
                            <td>
                              <div className="action-row">
                                <button className="btn btn-small btn-save-inline" onClick={() => saveItem(item._id)} disabled={savingId===item._id}>
                                  {savingId===item._id ? "…" : <><FaSave /> Save</>}
                                </button>
                                <button className="btn btn-small btn-secondary" onClick={cancelEditItem}><FaTimes /></button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="td-itemname">{item.itemName}</td>
                            <td className="td-price">${parseFloat(item.itemPrice).toFixed(2)}</td>
                            <td>
                              <span className={`stock-pill ${item.amountInStock === 0 ? "stock-zero" : item.amountInStock <= 3 ? "stock-low" : "stock-ok"}`}>
                                {item.amountInStock}
                              </span>
                            </td>
                            <td>{item.filament && <span className="chip">{item.filament}</span>}</td>
                            <td>
                              <div className="action-row">
                                <button className="btn btn-small btn-secondary icon-btn" onClick={() => startEditItem(item)}><FaEdit /></button>
                                <button className="btn btn-danger btn-small icon-btn"    onClick={() => deleteItem(item._id, item.itemName)}><FaTrash /></button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                    {filteredInv.length === 0 && <tr><td colSpan={6} className="no-results">No inventory items found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Admin;