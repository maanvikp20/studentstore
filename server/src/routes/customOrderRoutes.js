const express = require("express");
const router  = express.Router();

const { requireAuth, requireAdmin } = require("../middleware/auth");
const { uploadModel, uploadGcode }  = require("../middleware/upload");
const {
  getAllCustomOrders, getSpecificCustomOrder,
  createCustomOrder, updateCustomOrder,
  deleteCustomOrder, uploadGcode: uploadGcodeHandler,
} = require("../controllers/customOrderController");

router.use(requireAuth);

router.get("/",    getAllCustomOrders);
router.get("/:id", getSpecificCustomOrder);

router.post("/",    uploadModel.single("file"), createCustomOrder);
router.put("/:id",  updateCustomOrder);
router.delete("/:id", deleteCustomOrder);

router.post("/:id/gcode", requireAdmin, uploadGcode.single("gcode"), uploadGcodeHandler);

module.exports = router;