const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keySecret = process.env.JWT_SECRET;

const adminSchema = new mongoose.Schema({
  isAdmin: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Invalid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

adminSchema.methods.generateAuthtoken = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, keySecret, { expiresIn: "30d" });
    this.tokens.push({ token });
    await this.save();
    return token;
  } catch (err) {
    throw new Error("Token generation failed");
  }
};

module.exports = mongoose.model("admins", adminSchema);
