const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keySecret = process.env.JWT_SECRET;

const userSchema = new mongoose.Schema({
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
  phone: {
    type: String,
    default: "",
  },
  whatsapp: {
    type: String,
    default: "",
  },
  batch: {
    type: String,
    default: "",
  },
  aadhar: {
    type: String,
    default: "",
  },
  pan: {
    type: String,
    default: "",
  },
  permanentAddress: {
    type: String,
    default: "",
  },
  currentAddress: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  aadharImage: {
    type: String,
    default: "",
  },
  panImage: {
    type: String,
    default: "",
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

// Hash password before save
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// JWT generation method
userSchema.methods.generateAuthtoken = async function () {
  const token = jwt.sign({ _id: this._id }, keySecret, {
    expiresIn: "30d",
  });
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

module.exports = mongoose.model("users", userSchema);
