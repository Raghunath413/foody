const express = require("express");
const foodController = require("../controllers/food.controller");
const { authFoodPartnerMiddleware, authUserMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

/* GET /api/food/upload-auth — ImageKit par direct upload ke liye signature */
router.get("/upload-auth", authFoodPartnerMiddleware, foodController.getUploadAuth);

/* POST /api/food — { name, description, video, videoFileId } (video = ImageKit URL) */
router.post("/", authFoodPartnerMiddleware, foodController.createFood);

/* GET /api/food — user ka reels feed */
router.get("/", authUserMiddleware, foodController.getFoodItems);

/* Like / Save (toggle) */
router.post("/like", authUserMiddleware, foodController.likeFood);
router.post("/save", authUserMiddleware, foodController.saveFood);
router.get("/save", authUserMiddleware, foodController.getSavedFood);

/* DELETE /api/food/:id — food partner apna reel delete kare */
router.delete("/:id", authFoodPartnerMiddleware, foodController.deleteFood);

module.exports = router;
