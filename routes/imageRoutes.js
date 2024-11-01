const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imageController");

// Route for uploading an image
router.post("/upload", imageController.uploadImage);

// Route for converting an image
router.post("/convert", imageController.convertImage);

// Route for converting a video to GIF
router.post("/convert-video", imageController.convertVideoToGif);

// Route for Selecting an image
router.get("/image-keys", imageController.getImageKeys);

// Route for deleting an image
router.post("/delete", imageController.deleteImage);

// Route for download an image
router.get("/download/:filename", imageController.downloadImage);


module.exports = router;