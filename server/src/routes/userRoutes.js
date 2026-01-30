const express = require("express");
const router = express.Router();

const {requireAuth} = require("../middleware/auth");
const {getAllUsers, getUserById, createUser, updateUser, deleteUser} = require("../controllers/userController")

/**
 * User routes with authentication:
 * - Use /api/auth/register for new user registration
 * - These routes are for user management
 */

// All user routes require authentication
router.use(requireAuth);

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser); // Consider removing - use /api/auth/register instead
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;