const express = require("express");
const router  = express.Router();

const { requireAuth, requireAdmin }         = require("../middleware/auth");
const { uploadGcode: uploadGcodeMiddleware } = require("../middleware/upload");
const {
  signUpload,
  getAllCustomOrders, getSpecificCustomOrder,
  createCustomOrder, updateCustomOrder,
  deleteCustomOrder, uploadGcode,
} = require("../controllers/customOrderController");

router.use(requireAuth);

// Generate a Cloudinary signed upload URL — called by client before uploading file
router.get("/sign-upload", signUpload);

router.get("/",    getAllCustomOrders);
router.get("/:id", getSpecificCustomOrder);

// No multer needed — file goes directly to Cloudinary from the browser
router.post("/",      createCustomOrder);
router.put("/:id",    updateCustomOrder);
router.delete("/:id", deleteCustomOrder);

// Admin manually uploads a .gcode file
router.post("/:id/gcode", requireAdmin, uploadGcodeMiddleware.single("gcode"), uploadGcode);

module.exports = router;