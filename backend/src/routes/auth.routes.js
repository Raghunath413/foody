const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

// User auth
router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);
router.get("/user/logout", authController.logoutUser);

// Food partner auth
router.post("/food-partner/register", authController.registerFoodPartner);
router.post("/food-partner/login", authController.loginFoodPartner);
router.get("/food-partner/logout", authController.logoutFoodPartner);

// Current session
router.get("/me", authController.me);

module.exports = router;
