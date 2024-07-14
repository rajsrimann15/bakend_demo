const express = require("express");
const router = express.Router();
const {
  getPackingAndMovingOrders,
  createPackingAndMovingOrder,
  updatePackingAndMovingOrder,
  deletePackingAndMovingOrder,
  getPackingAndMovingOrder,
} = require("../controllers/PackingAndMovingOrderController");
const validateToken=require("../middleware/validateTokenHandler");

router.use(validateToken);
router.route("/").get(getPackingAndMovingOrders).post(createPackingAndMovingOrder);
router.route("/:id").get(getPackingAndMovingOrder).put(updatePackingAndMovingOrder).delete(deletePackingAndMovingOrder);

module.exports = router;
