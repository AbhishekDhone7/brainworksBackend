const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  paymentType: {
    type: String,
    required: true,
    enum: ["Before Placement", "At Placement", "Post Placement"],
  },
  month: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMode: {
    type: String,
    required: true,
    enum: ["Cash", "Online"],
  },
  screenshot: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "success", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("payments", paymentSchema);
