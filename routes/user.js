// ✅ Full code for update-profile backend route
const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const userdb = require("../module/userSchema");
const authenticate = require("../middleware/authenticate");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, cpassword } = req.body;

  if (!name || !email || !password || !cpassword)
    return res.status(400).json({ error: "Please fill all fields" });

  if (password !== cpassword)
    return res.status(422).json({ error: "Passwords do not match" });

  try {
    const existingUser = await userdb.findOne({ email });
    if (existingUser)
      return res.status(409).json({ error: "User already exists" });

    const newUser = new userdb({ name, email, password });
    const savedUser = await newUser.save();

    res.status(201).json({ message: "User registered", user: savedUser });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Please fill all fields" });

  try {
    const user = await userdb.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = await user.generateAuthtoken();

    res.cookie("usercookie", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 15),
    });

    res.status(200).json({
      message: "Login successful",
      user: { _id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Validate
router.get("/valid_user/me", authenticate, async (req, res) => {
  try {
    const user = await userdb.findById(req.userId).select("-password -tokens");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Validate User Error:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
});

// Logout
router.get("/logout", authenticate, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter(
      (el) => el.token !== req.token
    );
    await req.rootUser.save();

    res.clearCookie("usercookie", { path: "/" });
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ error: "Logout failed" });
  }
});

// Update Profile
router.put(
  "/update-profile",
  authenticate,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "aadharImage", maxCount: 1 },
    { name: "panImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const user = await userdb.findById(req.userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      const {
        name,
        phone,
        whatsapp,
        batch,
        aadhar,
        pan,
        permanentAddress,
        currentAddress,
      } = req.body;

      user.name = name;
      user.phone = phone;
      user.whatsapp = whatsapp;
      user.batch = batch;
      user.aadhar = aadhar;
      user.pan = pan;
      user.permanentAddress = permanentAddress;
      user.currentAddress = currentAddress;

      if (req.files.image) user.image = req.files.image[0].filename;
      if (req.files.aadharImage) user.aadharImage = req.files.aadharImage[0].filename;
      if (req.files.panImage) user.panImage = req.files.panImage[0].filename;

      await user.save();
      res.status(200).json({ message: "Profile updated", user });
    } catch (err) {
      console.error("Profile Update Error:", err);
      res.status(500).json({ error: "Failed to update profile" });
    }
  }
);

module.exports = router;
