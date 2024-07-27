import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  role: { type: String, enum: ["user", "admin"] },
  isConfirmed: { type: Boolean, default: false },
  isLoggedIn: { type: Boolean, default: false },
  phoneNumbers: [String],
  otp: String,
  passChengedAt: Date,
});

const User = model("User", userSchema);

export default User;
