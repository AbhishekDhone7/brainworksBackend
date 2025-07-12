const express = require("express");
const app = express();
require("./db/conn");
require("dotenv").config();

const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(
  cors({
  origin: "https://brainworks.onrender.com", // ✅ your frontend
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
})
);

app.use(express.json());

// ✅ Serve images statically from /uploads
app.use("/uploads", express.static("uploads"));

// Routes
const Router = require("./routes/user");
app.use("/users", Router);

const AdminRoute = require("./routes/adminRout");
app.use("/admin", AdminRoute);

const paymentRoute = require("./routes/paymentRoutes");
app.use("/payments", paymentRoute);

const batchRoutes = require("./routes/batchRoutes");
app.use("/batches", batchRoutes);


// Start server
const PORT = process.env.PORT || 8009;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
