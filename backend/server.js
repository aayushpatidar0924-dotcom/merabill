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

// Basic middlewares
app.use(cors());
app.use(express.json());

// File paths setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Error:", err));

/* ===========================================
   USER SCHEMA & MODEL
=========================================== */
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

/* ===========================================
   BILL SCHEMA (NEW)
=========================================== */
const billSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String,          // Light Bill, Petrol Bill etc.
  amount: Number,
  billNumber: String,
  date: String,
  billImage: String,     // Bill Photo
  createdAt: { type: Date, default: Date.now }
});

const Bill = mongoose.model("Bill", billSchema);

/* ===========================================
   MULTER (IMAGE UPLOAD)
=========================================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

/* ===========================================
   SIGNUP
=========================================== */
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
    console.error(err);
    res.status(500).json({ success: false, message: "Error in signup" });
  }
});

/* ===========================================
   LOGIN
=========================================== */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    res.json({ success: true, message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error in login" });
  }A
});

/* ===========================================
   GET ALL WORKERS
=========================================== */
app.get("/workers/:organization", async (req, res) => {
  try {
    const { organization } = req.params;
    const workers = await User.find({ organization, role: "worker" });

    res.json({ success: true, workers });
  } catch (err) {
    console.error("Error fetching workers:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===========================================
   PROFILE — GET
=========================================== */
app.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===========================================
   PROFILE — UPDATE
=========================================== */
app.put("/profile/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "Profile updated", user: updated });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
});

/* ===========================================
   PROFILE PHOTO UPLOAD
=========================================== */
app.put("/profile/:id/photo", upload.single("profileImage"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "No image uploaded" });

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { profileImage: req.file.filename },
      { new: true }
    );

    res.json({ success: true, message: "Profile photo updated", user: updatedUser });
  } catch (err) {
    console.error("Photo upload error:", err);
    res.status(500).json({ success: false, message: "Error uploading photo" });
  }
});

/* ===========================================
   ADD BILL (NEW)
=========================================== */
app.post("/add-bill", upload.single("billImage"), async (req, res) => {
  try {
    const { userId, type, date, amount, billNumber } = req.body;

    if (!req.file)
      return res.status(400).json({ success: false, message: "Bill image required" });

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
    console.error("Add bill error:", err);
    res.status(500).json({ success: false, message: "Error adding bill" });
  }
});

/* ===========================================
   GET ALL BILLS FOR USER
=========================================== */
app.get("/bills/:userId", async (req, res) => {
  try {
    const bills = await Bill.find({ userId: req.params.userId });

    res.json({ success: true, bills });
  } catch (err) {
    console.error("Bills fetch error:", err);
    res.status(500).json({ success: false, message: "Error fetching bills" });
  }
});

app.use("/contact", contactRoutes);

// DELETE BILL
app.delete("/bill/:id", async (req, res) => {
  try {
    const deleted = await Bill.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Bill not found" });
    res.json({ success: true, message: "Bill deleted successfully!" });
  } catch (err) {
    console.error("Delete bill error:", err);
    res.status(500).json({ success: false, message: "Error deleting bill" });
  }
});

// UPDATE BILL
app.put("/bill/:id", async (req, res) => {
  try {
    const updated = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Bill not found" });
    res.json({ success: true, message: "Bill updated successfully!", bill: updated });
  } catch (err) {
    console.error("Update bill error:", err);
    res.status(500).json({ success: false, message: "Error updating bill" });
  }
});


// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
