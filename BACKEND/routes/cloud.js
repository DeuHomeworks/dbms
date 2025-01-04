const express = require("express");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const fs = require("fs-extra");
const { google } = require("googleapis");

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

const auth = new google.auth.GoogleAuth({
    keyFile: "config/dbms-444210-26af5353d835.json", // Replace with the path to your credentials file
    scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

// Function to upload file to Google Drive
const uploadToGoogleDrive = async (filePath, fileName) => {
    const fileMetadata = {
        name: fileName,
        parents: ["1n7c7m3aj2zkj0uxQHiaCY028FdVAvhmL"],
    };
    const media = {
        body: fs.createReadStream(filePath),
    };

    const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: "id",
    });
    console.log('Uploaded File ID:', response.data.id);
    console.log('Google Drive Response:', response.data);

    return response.data.id; // Return the file ID from Google Drive
};

router.post("/upload", authenticateUser, upload.single("file"), async (req, res) => {

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        const filePath = req.file.path; // Path to the uploaded file on the server
        const fileName = req.file.originalname; // Original file name

        // Upload file to Google Drive
        const fileId = await uploadToGoogleDrive(filePath, fileName);

        // Remove the temporary file from the server
        await fs.remove(filePath);

        // Return success response
        res.status(200).json({
            message: "File uploaded successfully",
            googleDriveFileId: fileId,
        });
    } catch (error) {
        console.error("Error uploading to Google Drive:", error);
        res.status(500).json({ message: "Failed to upload file to Google Drive" });
    }
});

module.exports = router;
