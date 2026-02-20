const CustomOrders = require("../models/CustomOrders");
const { streamToCloudinary } = require("../middleware/upload");
const { calculatePrintCost } = require("../utils/printPricing");

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

async function createCustomOrder(req, res, next) {
  try {
    const { customerName, customerEmail, orderDetails, material, color, quantity, notes } = req.body;

    const parsedDetails = (() => {
      try { return JSON.parse(orderDetails); }
      catch { return String(orderDetails || "").split("\n").map(s => s.trim()).filter(Boolean); }
    })();

    const qty = parseInt(quantity, 10) || 1;
    const mat = material || "PLA";

    let orderFileURL = "";
    let fileName     = "";
    let fileType     = "";

    let estimatedCost = calculatePrintCost({
      fileSizeBytes: req.file?.size || 0,
      material: mat,
      quantity: qty,
      fileType: "",
    });

    if (req.file) {
      fileName = req.file.originalname;
      fileType = fileName.split(".").pop().toLowerCase();

      // Upload 3D model to Cloudinary
      orderFileURL = await streamToCloudinary(req.file.buffer, {
        folder: "3d-files",
        resource_type: "raw",
        public_id: `${Date.now()}-${fileName}`,
      });

      estimatedCost = calculatePrintCost({
        fileSizeBytes: req.file.size,
        material: mat,
        quantity: qty,
        fileType,
      });
    }

    const customOrder = new CustomOrders({
      customer: req.user.id,
      customerName, customerEmail,
      orderDetails: parsedDetails,
      orderFileURL,
      gcodeURL: null,
      sliceStatus: "pending",
      fileName, fileType,
      material: mat,
      color: color || "",
      quantity: qty,
      notes: notes || "",
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

// Admin only — upload a gcode file for an existing custom order
async function uploadGcode(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: "No gcode file provided" });

    const order = await CustomOrders.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Custom order not found" });

    const gcodeURL = await streamToCloudinary(req.file.buffer, {
      folder: "gcode-files",
      resource_type: "raw",
      public_id: `${Date.now()}-${req.file.originalname}`,
    });

    order.gcodeURL     = gcodeURL;
    order.sliceStatus  = "done";
    await order.save();

    res.json({ data: order });
  } catch (err) { next(err); }
}

module.exports = {
  getAllCustomOrders,
  getSpecificCustomOrder,
  createCustomOrder,
  updateCustomOrder,
  deleteCustomOrder,
  uploadGcode,
};