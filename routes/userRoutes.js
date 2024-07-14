const express = require("express");
const {
  registerUser,
  currentUser,
  loginUser,
  editProfile
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);

router.put("/editprofile", validateToken, editProfile);

module.exports = router;
