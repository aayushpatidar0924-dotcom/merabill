import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import contactRoutes from "./routes/contact.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ---------------- PATH FIX ---------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ---------------- DATABASE ---------------- */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

/* ---------------- SCHEMAS ---------------- */
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  role: String,
  organization: String,
  profileImage: String,
});

const User = mongoose.model("User", userSchema);

const billSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String,
  amount: { type: Number, required: true },
  billNumber: String,
  date: { type: Date, required: true },
  billImage: String,
  createdAt: { type: Date, default: Date.now },
});

const Bill = mongoose.model("Bill", billSchema);

/* ---------------- MULTER ---------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

/* ---------------- AUTH ---------------- */
app.post("/signup", upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email, phone, password, role, organization } = req.body;

    const user = new User({
      name,
      email,
      phone,
      password,
      role,
      organization,
      profileImage: req.file ? req.file.filename : null,
    });

    await user.save();
    res.json({ success: true, message: "Signup successful!" });
  } catch (err) {
    console.log("Signup Error:", err);
    res.status(500).json({ success: false, message: "Error in signup" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user)
      return res.status(400).json({ success: false, message: "Invalid Login!" });

    res.json({ success: true, user });
  } catch (err) {
    console.log("Login Error:", err);
    res.status(500).json({ success: false, message: "Error in login" });
  }
});

/* ---------------- WORKERS ---------------- */
app.get("/workers/:organization", async (req, res) => {
  try {
    const workers = await User.find({
      organization: req.params.organization,
      role: { $regex: /^worker$/i },
    });

    res.json({ success: true, workers });
  } catch (err) {
    console.log("Workers Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ---------------- PROFILE ---------------- */
app.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.log("Profile Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put("/profile/:id/photo", upload.single("profileImage"), async (req, res) => {
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
    console.log("Photo Upload Error:", err);
    res.status(500).json({ success: false, message: "Error uploading photo" });
  }
});

/* ---------------- ADD BILL ---------------- */
app.post("/add-bill", upload.single("billImage"), async (req, res) => {
  try {
    const { userId, type, date, amount, billNumber } = req.body;

    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "Bill image is required" });

    if (!date || isNaN(new Date(date).getTime()))
      return res
        .status(400)
        .json({ success: false, message: "Invalid date format" });

    const newBill = new Bill({
      userId,
      type,
      amount: Number(amount),
      billNumber,
      date: new Date(date),
      billImage: req.file.filename,
    });

    await newBill.save();

    res.json({ success: true, message: "Bill added successfully!" });
  } catch (err) {
    console.log("Bill Error:", err);
    res.status(500).json({ success: false, message: "Error adding bill" });
  }
});

/* ---------------- GET USER BILLS ---------------- */
app.get("/bills/:userId", async (req, res) => {
  try {
    const bills = await Bill.find({ userId: req.params.userId }).sort({
      date: -1,
    });

    res.json({ success: true, bills });
  } catch (err) {
    console.log("User Bills Error:", err);
    res.status(500).json({ success: false, message: "Error fetching bills" });
  }
});

/* ---------------- GET ORG BILLS ---------------- */
app.get("/bills/org/:organization", async (req, res) => {
  try {
    const workers = await User.find({
      organization: req.params.organization,
    }).select("_id");

    const workerIds = workers.map((u) => u._id);

    const bills = await Bill.find({ userId: { $in: workerIds } })
      .populate("userId", "name email phone organization")
      .sort({ date: -1 });

    res.json({ success: true, bills });
  } catch (err) {
    console.log("Org Bills Error:", err);
    res.status(500).json({ success: false, message: "Error fetching bills" });
  }
});

/* ---------------- UPDATE BILL ---------------- */
app.put("/bill/:id", async (req, res) => {
  try {
    const { type, date, amount, billNumber } = req.body;

    const updated = await Bill.findByIdAndUpdate(
      req.params.id,
      {
        type,
        amount: Number(amount),
        billNumber,
        date: new Date(date),
      },
      { new: true }
    );

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Bill not found" });

    res.json({
      success: true,
      message: "Bill updated successfully!",
      bill: updated,
    });
  } catch (err) {
    console.log("Bill Update Error:", err);
    res.status(500).json({ success: false, message: "Error updating bill" });
  }
});

/* ---------------- DELETE BILL ---------------- */
app.delete("/bill/:id", async (req, res) => {
  try {
    const deleted = await Bill.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Bill not found" });

    res.json({ success: true, message: "Bill deleted!" });
  } catch (err) {
    console.log("Delete Error:", err);
    res.status(500).json({ success: false, message: "Error deleting bill" });
  }
});

/* ---------------- CONTACT FORM ---------------- */
app.use("/contact", contactRoutes);

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
