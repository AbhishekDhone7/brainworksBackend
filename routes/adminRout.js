const express = require("express");
const bcrypt = require("bcryptjs");
const router = new express.Router();
const admindb = require("../module/adminSchema");
const authenticateadmin = require("../middleware/adminAuth");

// ✅ Register Admin
router.post("/admin_register", async (req, res) => {
  const { name, email, password, cpassword } = req.body;

  if (!name || !email || !password || !cpassword) {
    return res.status(400).json({ error: "Please fill all fields." });
  }

  if (password !== cpassword) {
    return res.status(422).json({ error: "Passwords do not match." });
  }

  try {
    const existingAdmin = await admindb.findOne({ email });

    if (existingAdmin) {
      return res.status(409).json({ error: "Admin already exists." });
    }

    const newAdmin = new admindb({ name, email, password });
    const savedAdmin = await newAdmin.save();

    res.status(201).json({ status: 201, message: "Admin registered", admin: savedAdmin });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// ✅ Login Admin
router.post("/admin_login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please fill all fields." });
  }

  try {
    const admin = await admindb.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = await admin.generateAuthtoken();

    res.cookie("admincookie", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 15),
    });

    res.status(200).json({
      status: 200,
      message: "Login successful",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin: true
      },
      token
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// ✅ Get Authenticated Admin
router.get("/valid_admin/me", authenticateadmin, async (req, res) => {
  try {
    const admin = await admindb.findOne({ _id: req.userId }).select("-password -tokens");

    if (!admin) {
      return res.status(404).json({ error: "Admin not found." });
    }

    res.status(200).json({ status: 200, admin });
  } catch (err) {
    console.error("Auth Check Error:", err);
    res.status(401).json({ status: 401, error: "Unauthorized" });
  }
});

// ✅ Logout Admin
router.get("/logout", authenticateadmin, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter(
      (el) => el.token !== req.token
    );

    await req.rootUser.save();

    res.clearCookie("admincookie", { path: "/" });

    res.status(200).json({ status: 200, message: "Logout successful" });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ status: 500, error: "Logout failed" });
  }
});

module.exports = router;
