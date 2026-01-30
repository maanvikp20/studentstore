const express = require("express");
const router = express.Router();

const {requireAuth} = require("../middleware/auth");
const {getAllCustomOrders, getSpecificCustomOrder, createCustomOrder, updateCustomOrder, deleteCustomOrder} = require("../controllers/customOrderController");

/**
 * Apply requireAuth to all custom order routes:
 * --> Every request must include a valid JWT token
 */
router.use(requireAuth);

router.get("/", getAllCustomOrders);
router.get("/:id", getSpecificCustomOrder);
router.post("/", createCustomOrder);
router.put("/:id", updateCustomOrder);
router.delete("/:id", deleteCustomOrder);

module.exports = router;