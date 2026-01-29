const express = require("express");
const router = express.Router();

const {requireAuth} = require("../middleware/authMiddleware");
const {getAllCustomOrders, getSpecificCustomOrder, createCustomOrder, updateCustomOrder, deleteCustomOrder} = require("../controllers/customOrderController");

/**
 * We are going to apply the requireAuth to all course routes:
 * --> Every request must include a valuable JWT token
 */
router.use(requireAuth);

router.get("/", getAllCustomOrders);
router.get("/:id", getSpecificCustomOrder);
router.post("/", createCustomOrder);
router.put("/:id", updateCustomOrder);
router.delete("/:id", deleteCustomOrder);

module.exports = router;