const express = require("express");
const router = express.Router();

const {requireAuth} = require("../middleware/auth");
const {getInventory, getInventoryByProduct, createInventory, updateInventory, deleteInventory} = require("../controllers/inventoryController");

/**
 * Mixed authentication for inventory:
 * - GET routes are public (anyone can view inventory)
 * - POST/PUT/DELETE routes require authentication (only authenticated users can manage inventory)
 */

// Public routes - no auth required
router.get("/", getInventory);
router.get("/:id", getInventoryByProduct);

// Protected routes - auth required
router.post("/", requireAuth, createInventory);
router.put("/:id", requireAuth, updateInventory);
router.delete("/:id", requireAuth, deleteInventory);

module.exports = router;