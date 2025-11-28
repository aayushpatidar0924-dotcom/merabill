import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import path from "path";
import contactRoutes from "./routes/contact.js";
import { fileURLToPath } from "url";

dotenv.config({ path: path.resolve("./backend/.env") });

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// File paths setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Error:", err));

/* ======================================================
   USER SCHEMA
====================================================== */
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  role: String,
  organization: String,
  billImage: String,
  profileImage: String,
});

const User = mongoose.model("User", userSchema);

/* ======================================================
   BILL SCHEMA
====================================================== */
const billSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String,
  amount: Number,
  billNumber: String,
  date: String,
  billImage: String,
  createdAt: { type: Date, default: Date.now },
});

const Bill = mongoose.model("Bill", billSchema);

/* ======================================================
   MULTER STORAGE
====================================================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

/* ======================================================
   SIGNUP
====================================================== */
app.post("/signup", upload.single("billImage"), async (req, res) => {
  try {
    const { name, email, phone, password, role, organization } = req.body;

    const newUser = new User({
      name,
      email,
      phone,
      password,
      role,
      organization,
      billImage: req.file ? req.file.filename : null,
    });

    await newUser.save();
    res.json({ success: true, message: "Signup successful!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error in signup" });
  }
});

/* ======================================================
   LOGIN
====================================================== */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    res.json({ success: true, message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error in login" });
  }
});

/* ======================================================
   GET WORKERS OF ORGANIZATION
====================================================== */
app.get("/workers/:organization", async (req, res) => {
  try {
    const workers = await User.find({
      organization: req.params.organization,
      role: "worker",
    });

    res.json({ success: true, workers });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ======================================================
   PROFILE (GET)
====================================================== */
app.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ======================================================
   PROFILE (UPDATE)
====================================================== */
app.put("/profile/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "Profile updated", user: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
});

/* ======================================================
   PROFILE PHOTO UPLOAD
====================================================== */
app.put(
  "/profile/:id/photo",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: "No image uploaded" });

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { profileImage: req.file.filename },
        { new: true }
      );

      res.json({
        success: true,
        message: "Profile photo updated",
        user: updatedUser,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error uploading photo" });
    }
  }
);

/* ======================================================
   ADD BILL
====================================================== */
app.post("/add-bill", upload.single("billImage"), async (req, res) => {
  try {
    const { userId, type, date, amount, billNumber } = req.body;

    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "Bill image required" });

    const newBill = new Bill({
      userId,
      type,
      date,
      amount,
      billNumber,
      billImage: req.file.filename,
    });

    await newBill.save();

    res.json({ success: true, message: "Bill added successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding bill" });
  }
});

/* ======================================================
   GET ALL BILLS OF USER
====================================================== */
app.get("/bills/:userId", async (req, res) => {
  try {
    const bills = await Bill.find({ userId: req.params.userId });
    res.json({ success: true, bills });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching bills" });
  }
});

/* ======================================================
   GET ALL BILLS OF ORGANIZATION (ADMIN)
====================================================== */
app.get("/bills/org/:organization", async (req, res) => {
  try {
    const workers = await User.find({
      organization: req.params.organization,
    });

    const workerIds = workers.map((w) => w._id);

    const bills = await Bill.find({ userId: { $in: workerIds } }).populate(
      "userId",
      "name email phone"
    );

    res.json({ success: true, bills });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching organization bills",
    });
  }
});

/* ======================================================
   DELETE BILL
====================================================== */
app.delete("/bill/:id", async (req, res) => {
  try {
    const deleted = await Bill.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ success: false, message: "Bill not found" });

    res.json({ success: true, message: "Bill deleted successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting bill" });
  }
});

/* ======================================================
   UPDATE BILL
====================================================== */
app.put("/bill/:id", async (req, res) => {
  try {
    const updated = await Bill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated)
      return res.status(404).json({ success: false, message: "Bill not found" });

    res.json({
      success: true,
      message: "Bill updated successfully!",
      bill: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating bill" });
  }
});

// Contact Routes
app.use("/contact", contactRoutes);

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
