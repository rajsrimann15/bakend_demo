const express = require("express");
const router = express.Router();

const getPackingAndMovingOrders=require("../controllers/adminController");

router.route("/orders").get(getPackingAndMovingOrders.adminGetPackingAndMovingOrders);
router.route("/orders/:id").get(getPackingAndMovingOrders.adminGetPackingAndMovingOrder).put(getPackingAndMovingOrders.adminUpdatePackingAndMovingOrder).delete(getPackingAndMovingOrders.adminDeletePackingAndMovingOrder)

module.exports=router;

