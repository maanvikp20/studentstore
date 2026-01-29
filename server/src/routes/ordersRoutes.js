const express = require("express");
const router = express.Router();

const {requireAuth} = require("../middleware/authMiddleware");
const {getAllOrders, getOrdersByProduct, createOrders, updateOrders, deleteOrders} = require("../controllers/orderController")
/**
 * We are going to apply the requireAuth to all course routes:
 * --> Every request must include a valuable JWT token
 */
router.use(requireAuth);

router.get("/", getAllOrders);
router.get("/:id", getOrdersByProduct);
router.post("/", createOrders);
router.put("/:id", updateOrders);
router.delete("/:id", deleteOrders);

module.exports = router;