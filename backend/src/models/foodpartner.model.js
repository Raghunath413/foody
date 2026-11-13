const mongoose = require("mongoose");

const foodPartnerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true }, // business / restaurant name
        contactName: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, select: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("foodpartner", foodPartnerSchema);
