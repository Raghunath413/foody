const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");

function readToken(req) {
    const token = req.cookies?.token;
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
}

// Sirf food partner (video upload, apni dashboard)
async function authFoodPartnerMiddleware(req, res, next) {
    const decoded = readToken(req);
    if (!decoded || decoded.role !== "foodPartner") {
        return res.status(401).json({ message: "Please login as a food partner first" });
    }
    const foodPartner = await foodPartnerModel.findById(decoded.id);
    if (!foodPartner) return res.status(401).json({ message: "Food partner not found" });

    req.foodPartner = foodPartner;
    next();
}

// Sirf normal user (feed, like, save)
async function authUserMiddleware(req, res, next) {
    const decoded = readToken(req);
    if (!decoded || decoded.role !== "user") {
        return res.status(401).json({ message: "Please login first" });
    }
    const user = await userModel.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
}

// User ya food partner dono chalega (partner profile page)
async function authAnyMiddleware(req, res, next) {
    const decoded = readToken(req);
    if (!decoded) return res.status(401).json({ message: "Please login first" });

    if (decoded.role === "user") {
        req.user = await userModel.findById(decoded.id);
    } else if (decoded.role === "foodPartner") {
        req.foodPartner = await foodPartnerModel.findById(decoded.id);
    }
    if (!req.user && !req.foodPartner) {
        return res.status(401).json({ message: "Account not found" });
    }
    next();
}

module.exports = { authFoodPartnerMiddleware, authUserMiddleware, authAnyMiddleware };
