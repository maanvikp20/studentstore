const express = require("express");
const router = express.Router();

const {requireAuth} = require("../middleware/auth");
const {getAllOrders, getOrdersByProduct, createOrder, updateOrder, deleteOrder} = require("../controllers/orderController")

/**
 * Apply requireAuth to all order routes:
 * --> Every request must include a valid JWT token
 */
router.use(requireAuth);

router.get("/", getAllOrders);
router.get("/:id", getOrdersByProduct);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;