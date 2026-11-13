const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        video: { type: String, required: true }, // ImageKit URL
        videoFileId: { type: String }, // ImageKit fileId (delete karne ke kaam aata hai)
        description: { type: String, trim: true, default: "" },
        foodPartner: { type: mongoose.Schema.Types.ObjectId, ref: "foodpartner", required: true },
        likeCount: { type: Number, default: 0 },
        savesCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("food", foodSchema);
