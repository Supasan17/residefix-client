import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["electrical", "plumbing", "internet", "security", "other"],
      default: "other",
    },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"],
      default: "open",
    },
    property: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
