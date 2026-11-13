const express = require("express");
const foodPartnerController = require("../controllers/food-partner.controller");
const { authAnyMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

/* GET /api/food-partner/:id — partner profile + uske reels */
router.get("/:id", authAnyMiddleware, foodPartnerController.getFoodPartnerById);

module.exports = router;
