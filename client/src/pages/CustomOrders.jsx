import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaTrash, FaPlus, FaTimes, FaUpload, FaFile, FaCheck, FaCog, FaDownload, FaExternalLinkAlt } from "react-icons/fa";
import { customOrdersAPI } from "../utils/api";

const ACCEPTED_TYPES = [".stl", ".obj", ".3mf", ".step", ".stp"];
const MAX_MB = 50;

function FileDropZone({ onFile, file, uploading, uploadProgress }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const validate = (f) => {
    const ext = "." + f.name.split(".").pop().toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) return `Unsupported type. Accepted: ${ACCEPTED_TYPES.join(", ")}`;
    if (f.size > MAX_MB * 1024 * 1024) return `File too large. Max ${MAX_MB}MB.`;
    return null;
  };

  const handle = (f) => {
    const err = validate(f);
    if (err) { alert(err); return; }
    onFile(f);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handle(f);
  }, []);

  if (file) return (
    <div className="file-attached">
      <div className="file-attached-icon"><FaFile /></div>
      <div className="file-attached-info">
        <span className="file-attached-name">{file.name}</span>
        <span className="file-attached-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
        {uploading && (
          <>
            <div className="upload-bar-wrap">
              <div className="upload-bar" style={{ width: `${uploadProgress}%` }} />
            </div>
            <span className="upload-pct">{uploadProgress}% uploading…</span>
          </>
        )}
      </div>
      {!uploading && (
        <button type="button" className="file-remove" onClick={() => onFile(null)}><FaTimes /></button>
      )}
    </div>
  );

  return (
    <div
      className={`dropzone ${dragging ? "dragging" : ""}`}
      onDrop={onDrop}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onClick={() => inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" accept={ACCEPTED_TYPES.join(",")} style={{ display: "none" }}
        onChange={e => { if (e.target.files[0]) handle(e.target.files[0]); }} />
      <FaUpload className="dropzone-icon" />
      <p className="dropzone-primary">Drop your 3D file here or <span>browse</span></p>
      <p className="dropzone-sub">{ACCEPTED_TYPES.join(" · ")} · Max {MAX_MB}MB</p>
    </div>
  );
}

function SliceStatus({ status }) {
  if (!status) return null;
  const map = {
    pending:     { cls: "slice-pending",     icon: <FaCog className="spin" />, text: "Awaiting slicing…" },
    slicing:     { cls: "slice-slicing",     icon: <FaCog className="spin" />, text: "Slicing for Prusa…" },
    done:        { cls: "slice-done",        icon: <FaCheck />,               text: "G-code ready" },
    error:       { cls: "slice-error",       icon: <FaTimes />,               text: "Slicing failed" },
    unsupported: { cls: "slice-unsupported", icon: <FaFile />,                text: "Manual slice required (OBJ/STEP)" },
  };
  const s = map[status] || map.pending;
  return <span className={`slice-badge ${s.cls}`}>{s.icon} {s.text}</span>;
}

function CustomOrders({ token, user }) {
  const [customOrders, setCustomOrders] = useState([]);
  const [loading,       setLoading]      = useState(true);
  const [error,         setError]        = useState("");
  const [showForm,      setShowForm]     = useState(false);

  const [file,           setFile]           = useState(null);
  const [uploading,      setUploading]      = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitLoading,  setSubmitLoading]  = useState(false);
  const [submitError,    setSubmitError]    = useState("");
  const [submitSuccess,  setSubmitSuccess]  = useState(false);

  const [formData, setFormData] = useState({
    customerName:  user?.name  || "",
    customerEmail: user?.email || "",
    orderDetails:  "",
    material:      "PLA",
    color:         "",
    quantity:      "1",
    notes:         "",
  });

  useEffect(() => { if (token) fetchCustomOrders(); }, [token]);
  useEffect(() => {
    if (user) setFormData(p => ({ ...p, customerName: user.name, customerEmail: user.email }));
  }, [user]);

  const fetchCustomOrders = async () => {
    try {
      const result = await customOrdersAPI.getAll(token);
      setCustomOrders(result.data || []);
    } catch { setError("Failed to load custom orders."); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!file) { setSubmitError("Please attach a 3D file."); return; }

    const details = formData.orderDetails.split("\n").map(s => s.trim()).filter(Boolean);
    if (details.length === 0) { setSubmitError("Please enter at least one order detail."); return; }

    const ext = file.name.split(".").pop().toLowerCase();
    const data = {
      customerName:  formData.customerName,
      customerEmail: formData.customerEmail,
      orderDetails:  details,   // api.js will JSON.stringify arrays in FormData
      fileName:      file.name,
      fileType:      ext,
      material:      formData.material,
      color:         formData.color,
      quantity:      parseInt(formData.quantity, 10) || 1,
      notes:         formData.notes,
      sliceForPrusa: ["stl", "3mf"].includes(ext),
    };

    setUploading(true);
    setUploadProgress(0);
    setSubmitLoading(true);

    try {
      // createWithProgress sends everything (file + fields) to YOUR server in one request.
      // Your server handles the Cloudinary upload — no credentials exposed to the browser.
      const result = await customOrdersAPI.createWithProgress(
        token, data, file,
        (pct) => setUploadProgress(pct)
      );

      setUploading(false);

      if (result.data) {
        setCustomOrders(prev => [result.data, ...prev]);
        setShowForm(false);
        setFile(null);
        setFormData({
          customerName:  user?.name  || "",
          customerEmail: user?.email || "",
          orderDetails:  "",
          material:      "PLA",
          color:         "",
          quantity:      "1",
          notes:         "",
        });
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 4000);
      } else {
        setSubmitError(result.error || result.message || "Failed to create order.");
      }
    } catch (err) {
      setUploading(false);
      setSubmitError(err.message || "Failed to submit order. Please try again.");
    } finally {
      setSubmitLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this custom order?")) return;
    try {
      await customOrdersAPI.delete(token, id);
      setCustomOrders(prev => prev.filter(o => o._id !== id));
    } catch { alert("Failed to delete order."); }
  };

  const field = (key, val) => setFormData(p => ({ ...p, [key]: val }));

  if (loading) return (
    <div className="custom-orders-page">
      <div className="co-loading">
        {[...Array(3)].map((_, i) => <div key={i} className="co-skeleton" />)}
      </div>
    </div>
  );

  return (
    <div className="custom-orders-page">
      <div className="co-hero">
        <div className="co-hero-inner">
          <div className="co-eyebrow">3D Print Store</div>
          <h1>Custom Orders</h1>
          <p>Upload your 3D file — we'll slice it for Prusa and print it for you.</p>
        </div>
      </div>

      <div className="container">
        <div className="page-header">
          <div className="page-header-count">
            {customOrders.length > 0 && (
              <span className="order-count">{customOrders.length} order{customOrders.length !== 1 ? "s" : ""}</span>
            )}
          </div>
          <button className={`btn ${showForm ? "btn-secondary" : "btn-primary"}`}
            onClick={() => { setShowForm(p => !p); setSubmitError(""); }}>
            {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> New Custom Order</>}
          </button>
        </div>

        {error        && <div className="error-message">{error}</div>}
        {submitSuccess && <div className="success-message"><FaCheck /> Order submitted! We'll review and slice your file shortly.</div>}

        {showForm && (
          <div className="custom-order-form">
            <div className="form-title">
              <h2>New Custom Order</h2>
              <p>Fill in the details and attach your 3D file.</p>
            </div>

            {submitError && <div className="error-message">{submitError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-section-label">Contact Info</div>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text"  value={formData.customerName}  onChange={e => field("customerName",  e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={formData.customerEmail} onChange={e => field("customerEmail", e.target.value)} required />
                </div>
              </div>

              <div className="form-section-label">Print Specifications</div>
              <div className="form-row three-col">
                <div className="form-group">
                  <label>Material</label>
                  <select value={formData.material} onChange={e => field("material", e.target.value)}>
                    {["PLA","PETG","ABS","TPU","ASA","NYLON","RESIN"].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Color / Finish</label>
                  <input type="text" value={formData.color} onChange={e => field("color", e.target.value)} placeholder="e.g. Galaxy Black" />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input type="number" value={formData.quantity} min="1" max="50" onChange={e => field("quantity", e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label>Order Details <span className="label-sub">(one item per line)</span></label>
                <textarea value={formData.orderDetails} onChange={e => field("orderDetails", e.target.value)}
                  placeholder={"Phone stand\nBlue PLA\n10cm × 5cm × 3cm"} required rows={4} />
              </div>

              <div className="form-group">
                <label>Additional Notes <span className="label-sub">(optional)</span></label>
                <textarea value={formData.notes} onChange={e => field("notes", e.target.value)}
                  placeholder="Infill %, layer height, special requirements…" rows={2} />
              </div>

              <div className="form-section-label">
                3D File
                <span className="label-badge">STL & 3MF auto-sliced for Prusa on our server</span>
              </div>
              <FileDropZone onFile={setFile} file={file} uploading={uploading} uploadProgress={uploadProgress} />

              <div className="form-actions">
                <button type="submit" className="btn btn-primary submit-btn" disabled={submitLoading || uploading}>
                  {submitLoading ? <><span className="btn-spinner" /> {uploading ? `Uploading ${uploadProgress}%…` : "Submitting…"}</> : <><FaCheck /> Submit Order</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {customOrders.length === 0 && !showForm ? (
          <div className="no-data">
            <div className="no-data-icon-wrap"><FaUpload /></div>
            <h3>No custom orders yet</h3>
            <p>Upload a 3D file and we'll print it for you.</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}><FaPlus /> Create First Order</button>
          </div>
        ) : (
          <div className="orders-list">
            {customOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <h3>Custom #{order._id.slice(-6).toUpperCase()}</h3>
                    <p className="order-card-date">
                      {new Date(order.createdAt).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" })}
                    </p>
                  </div>
                  <div className="order-card-header-right">
                    <span className="badge badge-warning">In Progress</span>
                    <button className="btn btn-danger btn-small" onClick={() => handleDelete(order._id)}><FaTrash /></button>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-meta-row">
                    {order.material && <span className="order-meta-chip">{order.material}</span>}
                    {order.color    && <span className="order-meta-chip">{order.color}</span>}
                    {order.quantity > 1 && <span className="order-meta-chip">Qty: {order.quantity}</span>}
                  </div>

                  {order.orderFileURL && (
                    <div className="order-file-row">
                      <FaFile className="order-file-icon" />
                      <span>{order.fileName || "3D File"}</span>
                      <div className="order-file-actions">
                        <SliceStatus status={order.sliceStatus} />
                        {order.gcodeURL && (
                          <a href={order.gcodeURL} download className="btn btn-small btn-secondary gcode-btn">
                            <FaDownload /> G-code
                          </a>
                        )}
                        <a href={order.orderFileURL} target="_blank" rel="noopener noreferrer" className="file-ext-link">
                          <FaExternalLinkAlt /> View File
                        </a>
                      </div>
                    </div>
                  )}

                  {Array.isArray(order.orderDetails) && order.orderDetails.length > 0 && (
                    <div className="order-card-details">
                      <strong>Details:</strong>
                      <ul>
                        {order.orderDetails.map((d, i) => (
                          <li key={i}>{typeof d === "string" ? d : d.description || JSON.stringify(d)}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {order.notes && <p className="order-notes"><em>Notes: {order.notes}</em></p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomOrders;