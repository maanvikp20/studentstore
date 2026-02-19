const express = require("express");
const router  = express.Router();

const { requireAuth }  = require("../middleware/auth");
const { uploadImage }  = require("../middleware/upload");
const {
  getInventory, getInventoryByProduct,
  createInventory, updateInventory, deleteInventory
} = require("../controllers/inventoryController");

// Public
router.get("/",    getInventory);
router.get("/:id", getInventoryByProduct);

// Protected — uploadImage.single("image") runs before the controller.
// If no file is attached the field is simply undefined; the controller
// falls back to req.body.imageURL (the plain URL text field).
router.post("/",    requireAuth, uploadImage.single("image"), createInventory);
router.put("/:id",  requireAuth, uploadImage.single("image"), updateInventory);
router.delete("/:id", requireAuth, deleteInventory);

module.exports = router;