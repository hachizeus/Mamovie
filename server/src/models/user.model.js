import mongoose from "mongoose";
import modelOptions from "./model.options.js";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  displayName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 8
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  salt: {
    type: String,
    required: true,
    select: false
  },
  phoneNumber: {
    type: String,
    required: true
  },
  subscription: {
    status: {
      type: String,
      enum: ['pending', 'active', 'expired'],
      default: 'pending'
    },
    expiresAt: {
      type: Date,
      default: null
    },
    transactionId: {
      type: String,
      default: null
    },
    checkoutRequestId: {
      type: String,
      default: null
    }
  }
}, modelOptions);

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");

  this.password = crypto.pbkdf2Sync(
    password,
    this.salt,
    1000,
    64,
    "sha512"
  ).toString("hex");
};

userSchema.methods.validPassword = function (password) {
  const hash = crypto.pbkdf2Sync(
    password,
    this.salt,
    1000,
    64,
    "sha512"
  ).toString("hex");

  return this.password === hash;
};

const userModel = mongoose.model("User", userSchema);

export default userModel;

