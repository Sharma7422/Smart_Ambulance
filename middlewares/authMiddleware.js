require("dotenv").config();
const jwt = require("jsonwebtoken");

// If you have a separate Admin model, import it
const Admin = require("../models/Admin");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Fallback if env variable is missing

// ✅ Middleware for API requests (checks token in headers)
exports.authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // ✅ Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await Admin.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

// ✅ Middleware for web-based authentication (checks token in cookies)
exports.requireAuth = (req, res, next) => {
    console.log("Cookies: ", req.cookies); // Debugging Line

    const token = req.cookies.token;

    if (!token) {
        console.log("No token found! Redirecting...");
        return res.redirect("/admin/login"); // Redirect if no token
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next(); // Continue to the next middleware/route
    } catch (err) {
        res.clearCookie("token");
        return res.redirect("/admin/login"); // Redirect if token is invalid
    }
};
