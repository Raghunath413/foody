const express = require("express");
const multer = require("multer");
const foodController = require("../controllers/food.controller");
const { authFoodPartnerMiddleware, authUserMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

// File memory me rahegi, wahan se seedha ImageKit par upload hogi
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("video/")) return cb(null, true);
        const err = new Error("Only video files are allowed");
        err.status = 400;
        cb(err);
    },
});

/* POST /api/food — food partner naya reel upload kare */
router.post("/", authFoodPartnerMiddleware, upload.single("video"), foodController.createFood);

/* GET /api/food — user ka reels feed */
router.get("/", authUserMiddleware, foodController.getFoodItems);

/* Like / Save (toggle) */
router.post("/like", authUserMiddleware, foodController.likeFood);
router.post("/save", authUserMiddleware, foodController.saveFood);
router.get("/save", authUserMiddleware, foodController.getSavedFood);

/* DELETE /api/food/:id — food partner apna reel delete kare */
router.delete("/:id", authFoodPartnerMiddleware, foodController.deleteFood);

module.exports = router;
