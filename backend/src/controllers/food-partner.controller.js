const mongoose = require("mongoose");
const foodPartnerModel = require("../models/foodpartner.model");
const foodModel = require("../models/food.model");

// GET /api/food-partner/:id — partner ki profile + uske saare food reels
async function getFoodPartnerById(req, res) {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: "Food partner not found" });

    const foodPartner = await foodPartnerModel.findById(id).lean();
    if (!foodPartner) return res.status(404).json({ message: "Food partner not found" });

    const foodItems = await foodModel.find({ foodPartner: id }).sort({ createdAt: -1 }).lean();
    const totalLikes = foodItems.reduce((sum, f) => sum + (f.likeCount || 0), 0);

    res.status(200).json({
        message: "Food partner retrieved successfully",
        foodPartner: {
            ...foodPartner,
            foodItems,
            totalMeals: foodItems.length,
            totalLikes,
        },
    });
}

module.exports = { getFoodPartnerById };
