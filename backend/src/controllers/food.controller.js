const foodModel = require("../models/food.model");
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const storageService = require("../services/storage.service");

// GET /api/food/upload-auth  (food partner)
function getUploadAuth(req, res) {
    res.status(200).json(storageService.getUploadAuth());
}

// POST /api/food  (food partner) — JSON: name, description, video (ImageKit URL), videoFileId
async function createFood(req, res) {
    const { name, description, video, videoFileId } = req.body || {};
    if (!name) return res.status(400).json({ message: "Food name is required" });
    if (!video) return res.status(400).json({ message: "Video is required" });
    if (!storageService.isOwnImageKitUrl(video)) {
        return res.status(400).json({ message: "Invalid video URL" });
    }

    const food = await foodModel.create({
        name,
        description,
        video,
        videoFileId,
        foodPartner: req.foodPartner._id,
    });

    res.status(201).json({ message: "Food created successfully", food });
}

// GET /api/food  (user) — reels feed, har item me isLiked / isSaved bhi
async function getFoodItems(req, res) {
    const foodItems = await foodModel
        .find({})
        .sort({ createdAt: -1 })
        .populate("foodPartner", "name address")
        .lean();

    const ids = foodItems.map((f) => f._id);
    const [likes, saves] = await Promise.all([
        likeModel.find({ user: req.user._id, food: { $in: ids } }).select("food").lean(),
        saveModel.find({ user: req.user._id, food: { $in: ids } }).select("food").lean(),
    ]);
    const liked = new Set(likes.map((l) => String(l.food)));
    const saved = new Set(saves.map((s) => String(s.food)));

    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems: foodItems.map((f) => ({
            ...f,
            isLiked: liked.has(String(f._id)),
            isSaved: saved.has(String(f._id)),
        })),
    });
}

// POST /api/food/like  { foodId } — toggle
async function likeFood(req, res) {
    const { foodId } = req.body || {};
    const food = await foodModel.findById(foodId).catch(() => null);
    if (!food) return res.status(404).json({ message: "Food not found" });

    const existing = await likeModel.findOne({ user: req.user._id, food: foodId });
    if (existing) {
        await likeModel.deleteOne({ _id: existing._id });
        const updated = await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } }, { returnDocument: "after" });
        return res.status(200).json({ message: "Food unliked", liked: false, likeCount: Math.max(0, updated.likeCount) });
    }

    await likeModel.create({ user: req.user._id, food: foodId });
    const updated = await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: 1 } }, { returnDocument: "after" });
    res.status(201).json({ message: "Food liked", liked: true, likeCount: updated.likeCount });
}

// POST /api/food/save  { foodId } — toggle
async function saveFood(req, res) {
    const { foodId } = req.body || {};
    const food = await foodModel.findById(foodId).catch(() => null);
    if (!food) return res.status(404).json({ message: "Food not found" });

    const existing = await saveModel.findOne({ user: req.user._id, food: foodId });
    if (existing) {
        await saveModel.deleteOne({ _id: existing._id });
        const updated = await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: -1 } }, { returnDocument: "after" });
        return res.status(200).json({ message: "Food unsaved", saved: false, savesCount: Math.max(0, updated.savesCount) });
    }

    await saveModel.create({ user: req.user._id, food: foodId });
    const updated = await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: 1 } }, { returnDocument: "after" });
    res.status(201).json({ message: "Food saved", saved: true, savesCount: updated.savesCount });
}

// GET /api/food/save  (user) — saved reels
async function getSavedFood(req, res) {
    const saves = await saveModel
        .find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate({ path: "food", populate: { path: "foodPartner", select: "name address" } })
        .lean();

    const foods = saves.filter((s) => s.food).map((s) => s.food);
    const likes = await likeModel
        .find({ user: req.user._id, food: { $in: foods.map((f) => f._id) } })
        .select("food")
        .lean();
    const liked = new Set(likes.map((l) => String(l.food)));

    res.status(200).json({
        message: "Saved foods fetched successfully",
        savedFoods: foods.map((f) => ({ ...f, isSaved: true, isLiked: liked.has(String(f._id)) })),
    });
}

// DELETE /api/food/:id  (food partner — sirf apna food)
async function deleteFood(req, res) {
    const food = await foodModel.findById(req.params.id).catch(() => null);
    if (!food) return res.status(404).json({ message: "Food not found" });
    if (String(food.foodPartner) !== String(req.foodPartner._id)) {
        return res.status(403).json({ message: "You can delete only your own food" });
    }

    await Promise.all([
        likeModel.deleteMany({ food: food._id }),
        saveModel.deleteMany({ food: food._id }),
        foodModel.deleteOne({ _id: food._id }),
        storageService.deleteFile(food.videoFileId),
    ]);
    res.status(200).json({ message: "Food deleted successfully" });
}

module.exports = { getUploadAuth, createFood, getFoodItems, likeFood, saveFood, getSavedFood, deleteFood };
