import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaTrash, FaPlus, FaTimes, FaUpload, FaFile, FaCheck,
  FaCog, FaDownload, FaExternalLinkAlt, FaDollarSign, FaInfoCircle
} from "react-icons/fa";
import { customOrdersAPI } from "../utils/api";

const ACCEPTED_TYPES = [".stl", ".obj", ".3mf", ".step", ".stp"];
const MAX_MB = 10;

/* ── Client-side price preview ───────────────────────────────────────
   Mirrors the server algorithm (utils/printPricing.js) so users see
   an estimate the moment they pick a file — before submitting.
   The server recalculates after upload, potentially with real gcode data.
──────────────────────────────────────────────────────────────────── */
const MAT_COST = { PLA:0.025, PETG:0.030, ABS:0.028, TPU:0.045, ASA:0.035, NYLON:0.060, RESIN:0.080 };
const TIERS    = [
  { maxBytes: 500_000,    label:"Simple",         fee:2.00,  factor:1.0 },
  { maxBytes: 2_000_000,  label:"Moderate",       fee:5.00,  factor:1.3 },
  { maxBytes: 10_000_000, label:"Complex",        fee:12.00, factor:1.6 },
  { maxBytes: Infinity,   label:"Highly Complex", fee:22.00, factor:2.0 },
];

function clientEstimate(fileSizeBytes, material, quantity) {
  if (!fileSizeBytes) return null;
  const mat  = MAT_COST[material] ?? 0.025;
  const tier = TIERS.find(t => fileSizeBytes <= t.maxBytes);
  const qty  = Math.max(1, parseInt(quantity, 10) || 1);
  const grams = Math.max((fileSizeBytes / 1_000_000) * 25 * tier.factor, 5);
  const disc  = qty >= 20 ? 0.20 : qty >= 10 ? 0.12 : qty >= 5 ? 0.06 : 0;
  const total = (grams * mat + 1.50) * qty * (1 - disc) + tier.fee + 4.00;
  return {
    low:   Math.max(total * 0.82, 8).toFixed(2),
    high:  (total * 1.22).toFixed(2),
    tier:  tier.label,
    grams: grams.toFixed(0),
    disc:  disc,
  };
}

/* ── PriceEstimate display ───────────────────────────────────────── */
function PriceEstimate({ estimate, confirmed, material }) {
  if (!estimate && !confirmed) return null;
  return (
    <div className="price-estimate-card">
      <div className="price-estimate-header">
        <FaDollarSign className="price-icon" />
        <span>{confirmed ? "Confirmed Price" : "Estimated Cost"}</span>
        {!confirmed && (
          <FaInfoCircle className="price-info" title="Estimate — admin confirms after reviewing your file" />
        )}
      </div>

      {confirmed ? (
        <div className="price-confirmed">${parseFloat(confirmed).toFixed(2)}</div>
      ) : (
        <>
          <div className="price-range">
            <span className="price-low">${estimate.low}</span>
            <span className="price-dash">–</span>
            <span className="price-high">${estimate.high}</span>
          </div>
          <div className="price-meta">
            {estimate.tier  && <span className="price-chip">{estimate.tier} geometry</span>}
            {estimate.grams && <span className="price-chip">~{estimate.grams}g {material || ""}</span>}
            {estimate.printTimeMins != null && (
              <span className="price-chip">
                ~{Math.floor(estimate.printTimeMins / 60)}h {estimate.printTimeMins % 60}m print
              </span>
            )}
            {estimate.disc > 0 && (
              <span className="price-chip price-chip-green">{(estimate.disc * 100).toFixed(0)}% bulk discount</span>
            )}
            {estimate.breakdown?.discountPct > 0 && !estimate.disc && (
              <span className="price-chip price-chip-green">{estimate.breakdown.discountPct}% bulk discount</span>
            )}
          </div>
          {estimate.disclaimer && (
            <p className="price-disclaimer">{estimate.disclaimer}</p>
          )}
          <p className="price-disclaimer">Admin confirms final price after reviewing your file.</p>
        </>
      )}
    </div>
  );
}

/* ── File drop zone ──────────────────────────────────────────────── */
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
            <span className="upload-pct">{uploadProgress}% uploading to Cloudinary…</span>
          </>
        )}
      </div>
      {!uploading && (
        <button type="button" className="file-remove" onClick={() => onFile(null)}><FaTimes /></button>
      )}
    </div>
  );

  return (
    <div className={`dropzone ${dragging ? "dragging" : ""}`}
      onDrop={onDrop}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onClick={() => inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" accept={ACCEPTED_TYPES.join(",")} style={{ display:"none" }}
        onChange={e => { if (e.target.files[0]) handle(e.target.files[0]); }} />
      <FaUpload className="dropzone-icon" />
      <p className="dropzone-primary">Drop your 3D file here or <span>browse</span></p>
      <p className="dropzone-sub">{ACCEPTED_TYPES.join(" · ")} · Max {MAX_MB}MB</p>
    </div>
  );
}

/* ── Slice status badge ──────────────────────────────────────────── */
function SliceStatus({ status }) {
  if (!status) return null;
  const map = {
    pending:     { cls:"slice-pending",     icon:<FaCog className="spin" />, text:"Awaiting slicing…" },
    slicing:     { cls:"slice-slicing",     icon:<FaCog className="spin" />, text:"Slicing for Prusa…" },
    done:        { cls:"slice-done",        icon:<FaCheck />,               text:"G-code ready" },
    error:       { cls:"slice-error",       icon:<FaTimes />,               text:"Slicing failed" },
    unsupported: { cls:"slice-unsupported", icon:<FaFile />,                text:"Manual slice required" },
  };
  const s = map[status] || map.pending;
  return <span className={`slice-badge ${s.cls}`}>{s.icon} {s.text}</span>;
}

/* ── Main component ──────────────────────────────────────────────── */
function CustomOrders({ token, user }) {
  const [customOrders,   setCustomOrders]   = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState("");
  const [showForm,       setShowForm]       = useState(false);
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

  // Live estimate — updates instantly when file/material/quantity changes
  const liveEstimate = file
    ? clientEstimate(file.size, formData.material, formData.quantity)
    : null;

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
    e.preventDefault(); setSubmitError("");
    if (!file) { setSubmitError("Please attach a 3D file."); return; }
    const details = formData.orderDetails.split("\n").map(s => s.trim()).filter(Boolean);
    if (!details.length) { setSubmitError("Please enter at least one order detail."); return; }

    const ext = file.name.split(".").pop().toLowerCase();

    setUploading(true); setUploadProgress(0); setSubmitLoading(true);
    try {
      // Step 1 — get upload signature from our server
      const sig = await customOrdersAPI.getUploadSignature(token);
      if (!sig.signature) throw new Error("Could not get upload credentials.");

      // Step 2 — upload file directly to Cloudinary (bypasses Vercel 4.5MB limit)
      const cloudResult = await customOrdersAPI.uploadToCloudinary(
        file,
        sig.signature,
        sig.timestamp,
        sig.folder,
        sig.cloudName,
        sig.apiKey,
        (pct) => setUploadProgress(pct)
      );
      setUploading(false);

      if (!cloudResult.secure_url) throw new Error("File upload to Cloudinary failed.");

      // Step 3 — save order to DB with the Cloudinary URL
      const result = await customOrdersAPI.create(token, {
        customerName:  formData.customerName,
        customerEmail: formData.customerEmail,
        orderDetails:  JSON.stringify(details),
        fileName:      file.name,
        fileType:      ext,
        fileSizeBytes: file.size,
        material:      formData.material,
        color:         formData.color,
        quantity:      parseInt(formData.quantity, 10) || 1,
        notes:         formData.notes,
        orderFileURL:  cloudResult.secure_url,
      });

      if (result.data) {
        setCustomOrders(prev => [result.data, ...prev]);
        setShowForm(false); setFile(null);
        setFormData({ customerName:user?.name||"", customerEmail:user?.email||"", orderDetails:"", material:"PLA", color:"", quantity:"1", notes:"" });
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 4000);
      } else {
        setSubmitError(result.error || result.message || "Failed to create order.");
      }
    } catch (err) {
      setUploading(false);
      setSubmitError(err.message || "Failed to submit. Please try again.");
    } finally { setSubmitLoading(false); setUploadProgress(0); }
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
      <div className="co-loading">{[...Array(3)].map((_,i) => <div key={i} className="co-skeleton" />)}</div>
    </div>
  );

  return (
    <div className="custom-orders-page">
      <div className="co-hero">
        <div className="co-hero-inner">
          <div className="co-eyebrow">3D Print Store</div>
          <h1>Custom Orders</h1>
          <p>Upload your 3D file — we'll slice it for Prusa, estimate the cost, and print it for you.</p>
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
        {submitSuccess && (
          <div className="success-message">
            <FaCheck /> Order submitted! We'll review your file and send a confirmed quote shortly.
          </div>
        )}

        {showForm && (
          <div className="custom-order-form">
            <div className="form-title">
              <h2>New Custom Order</h2>
              <p>Fill in the details, attach your 3D file, and get an instant price estimate.</p>
            </div>
            {submitError && <div className="error-message">{submitError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-section-label">Contact Info</div>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" value={formData.customerName} onChange={e => field("customerName", e.target.value)} required />
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

              {/* Live price estimate — appears as soon as a file is picked */}
              {liveEstimate && (
                <PriceEstimate estimate={liveEstimate} material={formData.material} />
              )}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary submit-btn" disabled={submitLoading || uploading}>
                  {submitLoading
                    ? <><span className="btn-spinner" /> {uploading ? `Uploading ${uploadProgress}%…` : "Submitting…"}</>
                    : <><FaCheck /> Submit Order</>
                  }
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
                    <span className={`badge ${
                      order.status === "Completed" ? "badge-success"
                      : order.status === "Cancelled" ? "badge-danger"
                      : order.status === "Quoted" ? "badge-processing"
                      : "badge-warning"
                    }`}>
                      {order.status || "Pending"}
                    </span>
                    <button className="btn btn-danger btn-small" onClick={() => handleDelete(order._id)}><FaTrash /></button>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-meta-row">
                    {order.material && <span className="order-meta-chip">{order.material}</span>}
                    {order.color    && <span className="order-meta-chip">{order.color}</span>}
                    {order.quantity > 1 && <span className="order-meta-chip">Qty: {order.quantity}</span>}
                  </div>

                  {/* File row */}
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

                  {/* Gcode stats (only shown after successful slice) */}
                  {order.gcodeStats?.printTimeMins != null && (
                    <div className="gcode-stats-row">
                      <span><strong>Print time:</strong> {Math.floor(order.gcodeStats.printTimeMins/60)}h {order.gcodeStats.printTimeMins%60}m</span>
                      {order.gcodeStats.filamentUsedG != null && (
                        <span><strong>Filament:</strong> {order.gcodeStats.filamentUsedG}g</span>
                      )}
                      {order.gcodeStats.layerCount != null && (
                        <span><strong>Layers:</strong> {order.gcodeStats.layerCount.toLocaleString()}</span>
                      )}
                    </div>
                  )}

                  {/* Price — confirmed takes priority, else show estimate */}
                  <PriceEstimate
                    estimate={order.estimatedCost?.low ? {
                      low:        order.estimatedCost.low,
                      high:       order.estimatedCost.high,
                      disclaimer: order.estimatedCost.disclaimer,
                      breakdown:  order.estimatedCost.breakdown,
                      printTimeMins: order.gcodeStats?.printTimeMins,
                    } : null}
                    confirmed={order.confirmedPrice}
                    material={order.material}
                  />

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