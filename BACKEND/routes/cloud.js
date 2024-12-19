const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Directory to store files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique name
    },
});

const upload = multer({ storage });

// File upload route
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(200).json({ message: "File uploaded successfully", filePath: `/uploads/${req.file.filename}` });
});

app.listen(5000, () => {
    console.log("Cloud  is running on http://localhost:5000");
});
module.exports = app();


//// Google OAuth2 Service Account credentials
//const KEY_FILE_PATH = 'dbms-444210-26af5353d835.json';
//const SCOPES = ['https://www.googleapis.com/auth/drive.file']; // Scope for file upload
//
//// Initialize Google Drive API
//const auth = new google.auth.GoogleAuth({
//    keyFile: KEY_FILE_PATH,
//    scopes: SCOPES,
//});
//const drive = google.drive({ version: 'v3', auth });

// Endpoint to handle file upload from frontend
//router.post('/uploadToBackend', upload.single('file'), async (req, res) => {
//    const filePath = req.file.path;
//    const fileName = req.file.originalname;
//    const folderId = '1'; // Replace with your folder ID
//    console.log("Im workin")
//    try {
//        // Create metadata for the file upload
//        const fileMetadata = {
//            name: fileName,
//            parents: [folderId], // Optional: specify a Google Drive folder
//        };
//
//        // Create media object for the file
//        const media = {
//            mimeType: req.file.mimetype,
//            body: fs.createReadStream(filePath),
//        };
//
//        // Upload file to Google Drive
//        const response = await drive.files.create({
//            resource: fileMetadata,
//            media: media,
//            fields: 'id', // Retrieve file ID upon successful upload
//        });
//
//        // Clean up the temporary file
//        fs.unlinkSync(filePath);
//
//        res.status(200).send(`File uploaded successfully to Google Drive. File ID: ${response.data.id}`);
//    } catch (error) {
//        console.error('Error uploading file:', error);
//        res.status(500).send('Error uploading file to Google Drive');
//    }
//});
//