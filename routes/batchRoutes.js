const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Batch = require("../module/batchSchema.js");

// Multer storage for image & syllabus
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// POST /api/batches
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "syllabus", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        name,
        startDate,
        totalFee,
        prePlacementFee,
        atPlacementFee,
        postPlacementFee,
        keywords,
      } = req.body;

      const newBatch = new Batch({
        name,
        startDate,
        totalFee,
        prePlacementFee,
        atPlacementFee,
        postPlacementFee,
        keywords: keywords.split(",").map(k => k.trim()),
        image: req.files.image?.[0]?.filename,
        syllabus: req.files.syllabus?.[0]?.filename,
      });

      const savedBatch = await newBatch.save();
      res.status(201).json(savedBatch);
    } catch (err) {
      console.error("Batch Create Error:", err);
      res.status(500).json({ error: "Failed to create batch" });
    }
  }
);

// GET /api/batches
router.get("/", async (req, res) => {
  try {
    const batches = await Batch.find();
    res.status(200).json(batches);
  } catch (err) {
    console.error("Fetch Batches Error:", err);
    res.status(500).json({ error: "Failed to fetch batches" });
  }
});

// DELETE /api/batches/:id
router.delete("/:id", async (req, res) => {
  try {
    await Batch.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Batch deleted" });
  } catch (err) {
    console.error("Delete Batch Error:", err);
    res.status(500).json({ error: "Failed to delete batch" });
  }
});

module.exports = router;
