// models/userSchema.js
import { required } from "joi";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "user",
      enum: {
        values: ["user", "admin", "superAdmin"],
        message: "{VALUE} is not supported", // You can add more roles as needed
      },
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
