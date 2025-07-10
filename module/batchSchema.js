const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  totalFee: { type: Number, required: true },
  prePlacementFee: { type: Number, required: false },
  duringPlacementFee: { type: Number, required: false },
  postPlacementFee: { type: Number, required: false },
  keywords: [{ type: String }],
  description: { type: String },
  image: { type: String },
  syllabus: { type: String },
});

module.exports = mongoose.model("Batch", batchSchema);
