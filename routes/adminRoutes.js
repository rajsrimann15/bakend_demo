const express = require("express");
const router = express.Router();

const getPackingAndMovingOrders=require("../controllers/adminController");

router.route("/orders").get(getPackingAndMovingOrders.adminGetAllOrders);
router.route("/orders/packingAndMoving/:id").get(getPackingAndMovingOrders.adminGetPackingAndMovingOrder).put(getPackingAndMovingOrders.adminUpdatePackingAndMovingOrder).delete(getPackingAndMovingOrders.adminDeletePackingAndMovingOrder);
router.route("/orders/longDistanceMoving/:id").get(getPackingAndMovingOrders.adminGetLongDistanceMovingOrder).put(getPackingAndMovingOrders.adminUpdateLongDistanceMovingOrder).delete(getPackingAndMovingOrders.adminDeleteLongDistanceMovingOrder);

module.exports=router;
