const express = require("express");
const router = express.Router();

const {requireAuth} = require("../middleware/authMiddleware");
const {getTestimonials, getTestimonialsByProduct, createTestimonials, updateTestimonials, deleteTestimonials} = require("../controllers/testimonialController.js")
/**
 * We are going to apply the requireAuth to all course routes:
 * --> Every request must include a valuable JWT token
 */
router.use(requireAuth);

router.get("/", getTestimonials);
router.get("/:id", getTestimonialsByProduct);
router.post("/", createTestimonials);
router.put("/:id", updateTestimonials);
router.delete("/:id", deleteTestimonials);

module.exports = router;