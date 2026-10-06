import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["resident", "manager"], default: "resident" },
    property: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
