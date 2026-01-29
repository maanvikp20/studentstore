const express = require("express");
const router = express.Router();

const {requireAuth} = require("../middleware/authMiddleware");
const {getUsers, getUserById, createUser, updateUser, deleteUser} = require("../controllers/userController")
/**
 * We are going to apply the requireAuth to all course routes:
 * --> Every request must include a valuable JWT token
 */
router.use(requireAuth);

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;