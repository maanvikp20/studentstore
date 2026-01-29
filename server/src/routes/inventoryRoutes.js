const express = require("express");
const router = express.Router();

// const {requireAuth} = require("../middleware/authMiddleware");
const {getInventory, getInventoryByProduct, createInventory, updateInventory, deleteInventory} = require("../controllers/customOrders")
/**
 * We are going to apply the requireAuth to all course routes:
 * --> Every request must include a valuable JWT token
 */

router.get("/", getInventory);
router.get("/:id", getInventoryByProduct);
router.post("/", createInventory);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);

module.exports = router;