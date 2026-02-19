const CustomOrders = require("../models/CustomOrders");
const { streamToCloudinary } = require("../middleware/upload");
const { exec } = require("child_process");
const fs   = require("fs");
const os   = require("os");
const path = require("path");

/**
 * Slice an STL/3MF file with PrusaSlicer CLI.
 * Requires PRUSA_SLICER_PATH in .env, e.g.:
 *   Linux: /usr/bin/prusa-slicer
 *   Mac:   /Applications/PrusaSlicer.app/Contents/MacOS/PrusaSlicer
 *
 * The file is written temporarily to disk (os.tmpdir()) only for slicing,
 * then immediately cleaned up. The resulting .gcode is uploaded to Cloudinary
 * and also cleaned up.
 */
const sliceWithPrusa = (buffer, originalName) =>
  new Promise((resolve, reject) => {
    const prusaPath = process.env.PRUSA_SLICER_PATH;
    if (!prusaPath) { reject(new Error("PRUSA_SLICER_PATH not set")); return; }

    const tmpIn  = path.join(os.tmpdir(), `${Date.now()}-${originalName}`);
    const tmpOut = tmpIn.replace(/\.[^.]+$/, ".gcode");

    fs.writeFileSync(tmpIn, buffer);

    // Optional: point --load at a custom Prusa config .ini for print settings
    const configFlag = process.env.PRUSA_CONFIG_PATH
      ? `--load "${process.env.PRUSA_CONFIG_PATH}"`
      : "";

    const cmd = `"${prusaPath}" --export-gcode ${configFlag} --output "${tmpOut}" "${tmpIn}"`;

    exec(cmd, { timeout: 120_000 }, async (err, _stdout, stderr) => {
      fs.existsSync(tmpIn) && fs.unlinkSync(tmpIn);

      if (err) {
        fs.existsSync(tmpOut) && fs.unlinkSync(tmpOut);
        reject(new Error("Slicing failed: " + (stderr || err.message)));
        return;
      }

      try {
        const gcodeBuffer = fs.readFileSync(tmpOut);
        fs.unlinkSync(tmpOut);
        resolve(gcodeBuffer);
      } catch (readErr) {
        reject(readErr);
      }
    });
  });

async function getAllCustomOrders(req, res, next) {
  try {
    const query = req.user.role === "admin"
      ? {}
      : { customer: req.user.id };
    const customOrders = await CustomOrders.find(query).sort({ createdAt: -1 });
    res.json({ data: customOrders });
  } catch (err) {
    next(err);
  }
}

async function getSpecificCustomOrder(req, res, next) {
  try {
    const query = req.user.role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, customer: req.user.id };
    const customOrder = await CustomOrders.findOne(query);
    if (!customOrder) return res.status(404).json({ message: "Custom order not found" });
    res.json({ data: customOrder });
  } catch (err) {
    next(err);
  }
}

async function createCustomOrder(req, res, next) {
  try {
    const {
      customerName, customerEmail,
      orderDetails, material, color,
      quantity, notes, sliceForPrusa,
    } = req.body;

    const parsedDetails = (() => {
      try { return JSON.parse(orderDetails); }
      catch { return String(orderDetails || "").split("\n").map(s => s.trim()).filter(Boolean); }
    })();

    let orderFileURL = "";
    let gcodeURL     = null;
    let sliceStatus  = "unsupported";
    let fileName     = "";
    let fileType     = "";

    if (req.file) {
      fileName = req.file.originalname;
      fileType = fileName.split(".").pop().toLowerCase();

      // Upload 3D model file to Cloudinary as raw resource
      orderFileURL = await streamToCloudinary(req.file.buffer, {
        folder:        "3d-files",
        resource_type: "raw",
        public_id:     `${Date.now()}-${fileName}`,
      });

      // Attempt Prusa slicing for STL and 3MF
      const canSlice   = ["stl", "3mf"].includes(fileType);
      const wantsSlice = sliceForPrusa === "true" || sliceForPrusa === true;

      if (canSlice && wantsSlice) {
        if (process.env.PRUSA_SLICER_PATH) {
          sliceStatus = "slicing";
          try {
            const gcodeBuffer = await sliceWithPrusa(req.file.buffer, fileName);
            gcodeURL = await streamToCloudinary(gcodeBuffer, {
              folder:        "gcode-files",
              resource_type: "raw",
              public_id:     `${Date.now()}-${fileName.replace(/\.[^.]+$/, ".gcode")}`,
            });
            sliceStatus = "done";
          } catch (sliceErr) {
            console.error("PrusaSlicer error:", sliceErr.message);
            sliceStatus = "error";
          }
        } else {
          // Slicer not installed on server — mark pending for manual processing
          sliceStatus = "pending";
        }
      }
    }

    const customOrder = new CustomOrders({
      customer:      req.user.id,
      customerName,
      customerEmail,
      orderDetails:  parsedDetails,
      orderFileURL,
      gcodeURL,
      sliceStatus,
      fileName,
      fileType,
      material:  material  || "PLA",
      color:     color     || "",
      quantity:  parseInt(quantity, 10) || 1,
      notes:     notes     || "",
    });

    await customOrder.save();
    res.status(201).json({ data: customOrder });
  } catch (err) {
    next(err);
  }
}

async function updateCustomOrder(req, res, next) {
  try {
    const query = req.user.role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, customer: req.user.id };

    const fields = {
      customerName:  req.body.customerName,
      customerEmail: req.body.customerEmail,
      orderDetails:  req.body.orderDetails,
      sliceStatus:   req.body.sliceStatus,
      material:      req.body.material,
      color:         req.body.color,
      quantity:      req.body.quantity,
      notes:         req.body.notes,
    };

    // Remove undefined keys so we don't accidentally null out fields
    Object.keys(fields).forEach(k => fields[k] === undefined && delete fields[k]);

    const updated = await CustomOrders.findOneAndUpdate(query, fields, { new: true });
    if (!updated) return res.status(404).json({ message: "Custom order not found" });
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

async function deleteCustomOrder(req, res, next) {
  try {
    const query = req.user.role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, customer: req.user.id };
    const deleted = await CustomOrders.findOneAndDelete(query);
    if (!deleted) return res.status(404).json({ message: "Custom order not found" });
    res.json({ data: deleted });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllCustomOrders, getSpecificCustomOrder, createCustomOrder, updateCustomOrder, deleteCustomOrder };