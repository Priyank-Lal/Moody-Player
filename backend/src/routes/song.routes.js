const express = require("express");
const multer = require("multer");
const uploadFile = require("../service/storage.service");
const songModel = require("../models/song.models");

const router = express.Router();

// 🔐 Audio file type filter
const audioFilter = (req, file, cb) => {
  const allowedTypes = ["audio/mpeg", "audio/wav", "audio/mp3"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only audio files are allowed!"), false);
  }
};

// 📦 Multer setup with memory storage, filter & 10MB size limit
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: audioFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// 🎵 POST route for uploading a song
router.post("/songs", upload.single("audio"), async (req, res) => {
  try {
    // 🛑 No file = no party
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided." });
    }

    // ⬆️ Upload to ImageKit or other storage
    const fileData = await uploadFile(req.file);

    // 💾 Store song metadata in DB
    const createdSong = await songModel.create({
      title: req.body.title,
      artist: req.body.artist,
      audio: fileData.url,
      mood: req.body.mood,
    });

    res.status(201).json({
      message: "Song added successfully!",
      song: createdSong,
    });
  } catch (err) {
    console.error("Error uploading song:", err.message);
    res.status(500).json({ error: "Something went wrong during upload." });
  }
});

// 🎶 GET route for mood-based song fetching
router.get("/songs", async (req, res) => {
  try {
    const { mood } = req.query;

    if (!mood) {
      return res.status(400).json({ error: "Mood query param is required." });
    }

    const songs = await songModel.find({ mood });

    res.status(200).json({
      message: "Successfully fetched all songs.",
      songs,
    });
  } catch (err) {
    console.error("Error fetching songs:", err.message);
    res.status(500).json({ error: "Failed to fetch songs." });
  }
});

module.exports = router;
