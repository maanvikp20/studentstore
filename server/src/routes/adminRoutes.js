const express = require("express");
const router = express.Router();

const {requireAuth} = require("../middleware/auth");
const {requireAdmin} = require("../middleware/adminMiddleware");

const {getAllUsers, getUserById, updateUser, getAllOrders, deleteUser, deleteOrder} = require("../controllers/adminController");

router.use(requireAuth);
router.use(requireAdmin);

router.get("/users", getAllUsers);
router.get("/orders", getAllOrders);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.delete("/orders/:id", deleteOrder);