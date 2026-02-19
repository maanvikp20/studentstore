const CustomOrders = require("../models/CustomOrders");
const { streamToCloudinary } = require("../middleware/upload");
const { calculatePrintCost } = require("../utils/printPricing");
const { exec } = require("child_process");
const fs   = require("fs");
const os   = require("os");
const path = require("path");

function parseGcodeStats(gcodeText) {
  const stats = { printTimeMins: null, filamentUsedMm: null, filamentUsedG: null, layerCount: null };

  const mmMatch    = gcodeText.match(/;\s*filament used \[mm\]\s*=\s*([\d.]+)/i);
  const gMatch     = gcodeText.match(/;\s*filament used \[g\]\s*=\s*([\d.]+)/i);
  const timeMatch  = gcodeText.match(/;\s*estimated printing time.*?=\s*(.*)/i);
  const layerMatch = gcodeText.match(/;\s*total layer count\s*=\s*(\d+)/i);

  if (mmMatch)    stats.filamentUsedMm = parseFloat(mmMatch[1]);
  if (gMatch)     stats.filamentUsedG  = parseFloat(gMatch[1]);
  if (layerMatch) stats.layerCount     = parseInt(layerMatch[1], 10);

  if (timeMatch) {
    const t = timeMatch[1].trim();
    let mins = 0;
    const h = t.match(/(\d+)h/); const m = t.match(/(\d+)m/); const s = t.match(/(\d+)s/);
    if (h) mins += parseInt(h[1], 10) * 60;
    if (m) mins += parseInt(m[1], 10);
    if (s) mins += Math.round(parseInt(s[1], 10) / 60);
    stats.printTimeMins = mins;
  }
  return stats;
}

const sliceWithPrusa = (buffer, originalName) =>
  new Promise((resolve, reject) => {
    const prusaPath = process.env.PRUSA_SLICER_PATH;
    if (!prusaPath) { reject(new Error("PRUSA_SLICER_PATH not set in .env")); return; }

    const tmpIn  = path.join(os.tmpdir(), `${Date.now()}-${originalName}`);
    const tmpOut = tmpIn.replace(/\.[^.]+$/, ".gcode");
    fs.writeFileSync(tmpIn, buffer);

    const configFlag = process.env.PRUSA_CONFIG_PATH ? `--load "${process.env.PRUSA_CONFIG_PATH}"` : "";
    const cmd = `"${prusaPath}" --export-gcode ${configFlag} --output "${tmpOut}" "${tmpIn}"`;

    exec(cmd, { timeout: 120_000 }, (err, _stdout, stderr) => {
      fs.existsSync(tmpIn) && fs.unlinkSync(tmpIn);
      if (err) {
        fs.existsSync(tmpOut) && fs.unlinkSync(tmpOut);
        reject(new Error("Slicing failed: " + (stderr || err.message)));
        return;
      }
      try {
        const gcodeBuffer = fs.readFileSync(tmpOut);
        const gcodeHeader = gcodeBuffer.slice(0, 8000).toString("utf8");
        fs.unlinkSync(tmpOut);
        resolve({ gcodeBuffer, gcodeHeader });
      } catch (readErr) { reject(readErr); }
    });
  });

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
    const { customerName, customerEmail, orderDetails, material, color, quantity, notes, sliceForPrusa } = req.body;

    const parsedDetails = (() => {
      try { return JSON.parse(orderDetails); }
      catch { return String(orderDetails || "").split("\n").map(s => s.trim()).filter(Boolean); }
    })();

    const qty      = parseInt(quantity, 10) || 1;
    const mat      = material || "PLA";
    let orderFileURL = "";
    let gcodeURL     = null;
    let sliceStatus  = "unsupported";
    let fileName     = "";
    let fileType     = "";
    let gcodeStats   = {};

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

      // Recalculate with correct fileType now
      estimatedCost = calculatePrintCost({ fileSizeBytes: req.file.size, material: mat, quantity: qty, fileType });

      const canSlice   = ["stl", "3mf"].includes(fileType);
      const wantsSlice = sliceForPrusa === "true" || sliceForPrusa === true;

      if (canSlice && wantsSlice) {
        if (process.env.PRUSA_SLICER_PATH) {
          sliceStatus = "slicing";
          try {
            const { gcodeBuffer, gcodeHeader } = await sliceWithPrusa(req.file.buffer, fileName);
            gcodeStats = parseGcodeStats(gcodeHeader);

            // Upgrade estimate with real sliced filament weight if available
            if (gcodeStats.filamentUsedG) {
              const matCostPerG = { PLA:0.025,PETG:0.030,ABS:0.028,TPU:0.045,ASA:0.035,NYLON:0.060,RESIN:0.080 }[mat] ?? 0.025;
              const realMatCost = gcodeStats.filamentUsedG * matCostPerG * qty;
              estimatedCost.low  = parseFloat(Math.max(realMatCost * 1.6 + 5, 8).toFixed(2));
              estimatedCost.high = parseFloat((realMatCost * 2.0 + 8).toFixed(2));
              estimatedCost.breakdown.materialCost   = parseFloat(realMatCost.toFixed(2));
              estimatedCost.breakdown.estimatedGrams = gcodeStats.filamentUsedG;
              estimatedCost.disclaimer = [
                `Based on actual slicer data: ${gcodeStats.filamentUsedG}g of ${mat}.`,
                gcodeStats.printTimeMins ? `Estimated print time: ${Math.floor(gcodeStats.printTimeMins/60)}h ${gcodeStats.printTimeMins%60}m.` : null,
                "Final price confirmed by admin after review.",
              ].filter(Boolean).join(" ");
            }

            gcodeURL = await streamToCloudinary(gcodeBuffer, {
              folder: "gcode-files",
              resource_type: "raw",
              public_id: `${Date.now()}-${fileName.replace(/\.[^.]+$/, ".gcode")}`,
            });
            sliceStatus = "done";
          } catch (sliceErr) {
            console.error("PrusaSlicer error:", sliceErr.message);
            sliceStatus = "error";
          }
        } else {
          sliceStatus = "pending"; // Slicer not installed — admin will process manually
        }
      }
    }

    const customOrder = new CustomOrders({
      customer: req.user.id,
      customerName, customerEmail,
      orderDetails: parsedDetails,
      orderFileURL, gcodeURL, sliceStatus, fileName, fileType,
      material: mat, color: color || "", quantity: qty, notes: notes || "",
      estimatedCost, gcodeStats,
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

    const allowed = ["customerName","customerEmail","orderDetails","sliceStatus",
                     "material","color","quantity","notes","confirmedPrice","status"];
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

module.exports = { getAllCustomOrders, getSpecificCustomOrder, createCustomOrder, updateCustomOrder, deleteCustomOrder };