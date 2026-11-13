const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");

const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" || !!process.env.VERCEL,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 din
};

function setToken(res, id, role) {
    const token = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, COOKIE_OPTIONS);
}

function clearToken(res) {
    res.clearCookie("token", { ...COOKIE_OPTIONS, maxAge: undefined });
}

/* ---------------- USER ---------------- */

async function registerUser(req, res) {
    const { fullName, email, password } = req.body || {};
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "fullName, email and password are required" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const exists = await userModel.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await userModel.create({ fullName, email, password: hashed });

    setToken(res, user._id, "user");
    res.status(201).json({
        message: "User registered successfully",
        user: { _id: user._id, fullName: user.fullName, email: user.email },
    });
}

async function loginUser(req, res) {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await userModel.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    setToken(res, user._id, "user");
    res.status(200).json({
        message: "User logged in successfully",
        user: { _id: user._id, fullName: user.fullName, email: user.email },
    });
}

function logoutUser(req, res) {
    clearToken(res);
    res.status(200).json({ message: "User logged out successfully" });
}

/* ---------------- FOOD PARTNER ---------------- */

async function registerFoodPartner(req, res) {
    const { name, contactName, phone, address, email, password } = req.body || {};
    if (!name || !contactName || !phone || !address || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const exists = await foodPartnerModel.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "Food partner account already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const foodPartner = await foodPartnerModel.create({
        name,
        contactName,
        phone,
        address,
        email,
        password: hashed,
    });

    setToken(res, foodPartner._id, "foodPartner");
    res.status(201).json({
        message: "Food partner registered successfully",
        foodPartner: { _id: foodPartner._id, name: foodPartner.name, email: foodPartner.email },
    });
}

async function loginFoodPartner(req, res) {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const foodPartner = await foodPartnerModel.findOne({ email: email.toLowerCase() }).select("+password");
    if (!foodPartner || !(await bcrypt.compare(password, foodPartner.password))) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    setToken(res, foodPartner._id, "foodPartner");
    res.status(200).json({
        message: "Food partner logged in successfully",
        foodPartner: { _id: foodPartner._id, name: foodPartner.name, email: foodPartner.email },
    });
}

function logoutFoodPartner(req, res) {
    clearToken(res);
    res.status(200).json({ message: "Food partner logged out successfully" });
}

/* ---------------- CURRENT SESSION ---------------- */

// Frontend ko pata chale ki kaun logged in hai (user / foodPartner / koi nahi)
async function me(req, res) {
    const token = req.cookies?.token;
    if (!token) return res.status(200).json({ role: null });
    try {
        const { id, role } = jwt.verify(token, process.env.JWT_SECRET);
        if (role === "user") {
            const user = await userModel.findById(id);
            if (user) return res.json({ role, user });
        } else if (role === "foodPartner") {
            const foodPartner = await foodPartnerModel.findById(id);
            if (foodPartner) return res.json({ role, foodPartner });
        }
    } catch {
        /* invalid token */
    }
    res.status(200).json({ role: null });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner,
    me,
};
