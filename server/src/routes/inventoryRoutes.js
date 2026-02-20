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

router.post("/",    requireAuth, uploadImage.single("image"), createInventory);
router.put("/:id",  requireAuth, uploadImage.single("image"), updateInventory);
router.delete("/:id", requireAuth, deleteInventory);

module.exports = router;