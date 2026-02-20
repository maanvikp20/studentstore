const CustomOrders  = require("../models/CustomOrders");
const { streamToCloudinary } = require("../middleware/upload");
const { calculatePrintCost } = require("../utils/printPricing");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Generate a signed upload signature for direct browser → Cloudinary upload
async function signUpload(req, res, next) {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const folder    = "3d-files";
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET
    );
    res.json({
      signature,
      timestamp,
      folder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey:    process.env.CLOUDINARY_API_KEY,
    });
  } catch (err) { next(err); }
}

async function getAllCustomOrders(req, res, next) {
  try {
    const query = req.user.role === "admin" ? {} : { customer: req.user.id };
    const orders = await CustomOrders.find(query).sort({ createdAt: -1 });
    res.json({ data: orders });
  } catch (err) { next(err); }
}

async function getSpecificCustomOrder(req, res, next) {
  try {
    const query = req.user.role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, customer: req.user.id };
    const order = await CustomOrders.findOne(query);
    if (!order) return res.status(404).json({ message: "Custom order not found" });
    res.json({ data: order });
  } catch (err) { next(err); }
}

// ── Create order — receives Cloudinary URL from client (no file goes through server)
async function createCustomOrder(req, res, next) {
  try {
    const {
      customerName, customerEmail, orderDetails,
      material, color, quantity, notes,
      orderFileURL, fileName, fileType, fileSizeBytes,
    } = req.body;

    const parsedDetails = (() => {
      try { return JSON.parse(orderDetails); }
      catch { return String(orderDetails || "").split("\n").map(s => s.trim()).filter(Boolean); }
    })();

    const qty = parseInt(quantity, 10) || 1;
    const mat = material || "PLA";

    const estimatedCost = calculatePrintCost({
      fileSizeBytes: parseInt(fileSizeBytes, 10) || 0,
      material: mat,
      quantity: qty,
      fileType: fileType || "",
    });

    const customOrder = new CustomOrders({
      customer: req.user.id,
      customerName, customerEmail,
      orderDetails: parsedDetails,
      orderFileURL:  orderFileURL  || "",
      fileName:      fileName      || "",
      fileType:      fileType      || "",
      gcodeURL:      null,
      sliceStatus:   "pending",
      material: mat,
      color:    color    || "",
      quantity: qty,
      notes:    notes    || "",
      estimatedCost,
      gcodeStats: {},
    });

    await customOrder.save();
    res.status(201).json({ data: customOrder });
  } catch (err) { next(err); }
}

async function updateCustomOrder(req, res, next) {
  try {
    const query = req.user.role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, customer: req.user.id };

    const allowed = [
      "customerName", "customerEmail", "orderDetails", "sliceStatus",
      "material", "color", "quantity", "notes", "confirmedPrice", "status",
      "gcodeURL", "gcodeStats",
    ];
    const fields = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) fields[k] = req.body[k]; });

    const updated = await CustomOrders.findOneAndUpdate(query, fields, { new: true });
    if (!updated) return res.status(404).json({ message: "Custom order not found" });
    res.json({ data: updated });
  } catch (err) { next(err); }
}

async function deleteCustomOrder(req, res, next) {
  try {
    const query = req.user.role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, customer: req.user.id };
    const deleted = await CustomOrders.findOneAndDelete(query);
    if (!deleted) return res.status(404).json({ message: "Custom order not found" });
    res.json({ data: deleted });
  } catch (err) { next(err); }
}

// ── Admin manually uploads a sliced .gcode file
async function uploadGcode(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: "No gcode file provided" });

    const order = await CustomOrders.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Custom order not found" });

    const gcodeURL = await streamToCloudinary(req.file.buffer, {
      folder:        "gcode-files",
      resource_type: "raw",
      public_id:     `${Date.now()}-${req.file.originalname}`,
    });

    order.gcodeURL    = gcodeURL;
    order.sliceStatus = "done";
    await order.save();

    res.json({ data: order });
  } catch (err) { next(err); }
}

module.exports = {
  signUpload,
  getAllCustomOrders, getSpecificCustomOrder,
  createCustomOrder, updateCustomOrder,
  deleteCustomOrder, uploadGcode,
};