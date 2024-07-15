const express = require("express");
const router = express.Router();
const {
  getLocalMovingOrders,
  createLocaleMovingOrder,
  getLocalMovingOrder
} = require("../controllers/localMovingController");


const ensureAuthenticated=require("../middleware/authMiddleware");

router.route("/").get(ensureAuthenticated, getLocalMovingOrders).post(ensureAuthenticated, createLocaleMovingOrder);
router.route("/:id").get(ensureAuthenticated, getLocalMovingOrder);

module.exports = router;
