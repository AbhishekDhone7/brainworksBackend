const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const authenticate = require("../middleware/authenticate");
const authenticateadmin = require("../middleware/adminAuth");
const Payment = require("../module/paymentSchema");

// Set up multer for optional screenshot
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/payments";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

//  Add Payment Route (Student)
router.post("/add", authenticate, upload.single("screenshot"), async (req, res) => {
  try {
    const { paymentType, month, amount, paymentMode } = req.body;

    if (!paymentType || !month || !amount || !paymentMode) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const payment = new Payment({
      userId: req.userId,
      paymentType,
      month,
      amount,
      paymentMode,
      screenshot: req.file ? req.file.filename : "",
    });

    await payment.save();
    res.status(201).json({ message: "Payment request submitted", payment });
  } catch (error) {
    console.error("Payment Add Error:", error);
    res.status(500).json({ error: "Failed to add payment" });
  }
});

router.get("/my-payments", authenticate, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching user payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// ✅ Get all payments with user info
router.get("/all", authenticateadmin, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "name email phone profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (err) {
    console.error("Admin Fetch Payments Error:", err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

// ✅ Update payment status
router.put("/status/:id", authenticateadmin, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["pending", "success", "rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    res.status(200).json({ message: "Status updated", payment });
  } catch (err) {
    console.error("Update Status Error:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

module.exports = router;
