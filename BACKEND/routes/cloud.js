const express = require("express");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    try {
         // Verify the token
        req.user = jwt.verify(token, process.env.JWT_SECRET); // Attach user info to the request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

const router = express.Router();

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Directory to store files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique name
    },
});
const upload = multer({
    storage,
    limits: { fileSize: 250 * 1024 * 1024 }, // 5 MB
});

// File upload route
router.post("/upload",authenticateUser, upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(200).json({
        message: "File uploaded successfully",
        filePath: `/uploads/${req.file.filename}`
    });
});

module.exports = router;
