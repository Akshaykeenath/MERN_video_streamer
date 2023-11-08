const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

// Define a storage configuration for multer to specify where to store uploaded files.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "This is a private area",
  });
});

router.post(
  "/video/upload",
  upload.fields([{ name: "videoFile" }, { name: "poster" }]),
  (req, res, next) => {
    const videoData = JSON.parse(req.body.videoData);
    const videoFile = req.files.videoFile[0];
    const poster = req.files.poster[0];

    if (videoData && videoFile && poster) {
      // Handle the videoData, videoFile, and poster here
      console.log("Video Data:", videoData);
      console.log("Video File:", videoFile);
      console.log("Poster File:", poster);

      const uploadDir = "./uploads"; // Change this to your desired directory
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Save the files to the directory
      fs.writeFileSync(`${uploadDir}/videoFile.mp4`, videoFile.buffer);
      fs.writeFileSync(`${uploadDir}/poster.jpg`, poster.buffer);

      res.status(200).json({
        message: "Data received",
      });
    } else {
      res.status(500).json({
        message: "Error occurred",
      });
    }
  }
);

module.exports = router;
