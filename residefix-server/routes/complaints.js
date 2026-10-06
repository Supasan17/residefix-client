import express from "express";
import Complaint from "../models/Complaint.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// All complaint routes require a logged-in user
router.use(authMiddleware);

// POST /api/complaints — create a new complaint
router.post("/", async (req, res) => {
  try {
    const { title, description, category, priority, property } = req.body;

    if (!title || !description || !property) {
      return res.status(400).json({ message: "Title, description, and property are required" });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      property,
      createdBy: req.user.id,
    });

    res.status(201).json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating complaint" });
  }
});

// GET /api/complaints — list complaints (own complaints for residents)
router.get("/", async (req, res) => {
  try {
    const filter = req.user.role === "manager" ? {} : { createdBy: req.user.id };
    const complaints = await Complaint.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching complaints" });
  }
});

// PATCH /api/complaints/:id — update status (manager only)
router.patch("/:id", async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Only managers can update complaint status" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating complaint" });
  }
});

export default router;
