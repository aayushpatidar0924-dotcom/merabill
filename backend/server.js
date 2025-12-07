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

// PATH FIX
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo Error:", err));

/* ===========================
   USER SCHEMA 
===========================*/
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  role: String,
  organization: String,
  profileImage: String,
  requestSentTo: { type: [String], default: [] }, // adminIds
  acceptedAdmins: { type: [String], default: [] }, // adminIds
});

const User = mongoose.model("User", userSchema);

/* ===========================
   BILL SCHEMA  
===========================*/
const billSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String,
  amount: Number,
  billNumber: String,
  date: Date,
  billImage: String,
  createdAt: { type: Date, default: Date.now },
});

const Bill = mongoose.model("Bill", billSchema);

/* ===========================
   MULTER UPLOAD
===========================*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

/* ===========================
   SIGNUP
===========================*/
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

/* ===========================
   LOGIN
===========================*/
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Login!" });

    res.json({ success: true, user });
  } catch (err) {
    console.log("Login Error:", err);
    res.status(500).json({ success: false, message: "Error in login" });
  }
});

/* ===========================
   WORKERS LIST API
===========================*/
app.get("/workers/:organization", async (req, res) => {
  try {
    const { filter = "your", search = "", adminId } = req.query;

    let query = { role: { $in: ["worker", "admin"] } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { organization: { $regex: search, $options: "i" } },
      ];
    }

    let users = await User.find(query);

    if (filter === "your") {
      users = users.filter((u) => u.acceptedAdmins.includes(adminId));
    }

    if (filter === "new") {
      users = users.filter(
        (u) =>
          !u.acceptedAdmins.includes(adminId) &&
          !u.requestSentTo.includes(adminId) &&
          u._id.toString() !== adminId
      );
    }

    if (filter === "pending") {
      users = users.filter(
        (u) =>
          u.requestSentTo.includes(adminId) &&
          !u.acceptedAdmins.includes(adminId)
      );
    }

    res.json({ success: true, workers: users });
  } catch (err) {
    console.log("Workers Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===========================
   SEND REQUEST
===========================*/
app.post("/send-request", async (req, res) => {
  try {
    const { workerId, adminId } = req.body;
    const worker = await User.findById(workerId);
    const admin = await User.findById(adminId);

    if (!worker || !admin)
      return res.status(404).json({ success: false, message: "Worker/Admin not found" });

    if (!worker.requestSentTo.includes(adminId)) {
      worker.requestSentTo.push(adminId);
      await worker.save();
    }

    res.json({ success: true, message: "Request sent", worker, admin });
  } catch (err) {
    console.log("Send Request Error:", err);
    res.status(500).json({ success: false, message: "Error sending request" });
  }
});

/* ===========================
   REMOVE REQUEST
===========================*/
app.post("/remove-request", async (req, res) => {
  try {
    const { workerId, adminId } = req.body;
    const worker = await User.findById(workerId);
    if (!worker)
      return res.status(404).json({ success: false, message: "Worker not found" });

    worker.requestSentTo = worker.requestSentTo.filter((id) => id !== adminId);
    await worker.save();

    res.json({ success: true, message: "Request removed", worker });
  } catch (err) {
    console.log("Remove Request Error:", err);
    res.status(500).json({ success: false, message: "Error removing request" });
  }
});

/* ===========================
   REMOVE ADMIN (Worker side)
===========================*/
app.post("/remove-admin", async (req, res) => {
  try {
    const { workerId, adminId } = req.body;
    const worker = await User.findById(workerId);
    if (!worker)
      return res.status(404).json({ success: false, message: "Worker not found" });

    worker.acceptedAdmins = worker.acceptedAdmins.filter((id) => id !== adminId);
    await worker.save();

    res.json({ success: true, message: "Admin removed", worker });
  } catch (err) {
    console.log("Remove Admin Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===========================
   ACCEPT REQUEST  
===========================*/
app.post("/accept-request", async (req, res) => {
  try {
    const { workerId, adminId } = req.body;
    const worker = await User.findById(workerId);
    if (!worker)
      return res.status(404).json({ success: false, message: "Worker not found" });

    worker.requestSentTo = worker.requestSentTo.filter((id) => id !== adminId);

    if (!worker.acceptedAdmins.includes(adminId)) {
      worker.acceptedAdmins.push(adminId);
    }

    await worker.save();
    res.json({ success: true, message: "Request accepted", worker });
  } catch (err) {
    console.log("Accept Request Error:", err);
    res.status(500).json({ success: false, message: "Error accepting request" });
  }
});

/* ===========================
   PROFILE
===========================*/
app.get("/profile/:id", async (req, res) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user: u });
  } catch (err) {
    console.log("Profile Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===========================
   PROFILE PHOTO UPDATE
===========================*/
app.put("/profile/:id/photo", upload.single("profileImage"), async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { profileImage: req.file.filename },
      { new: true }
    );

    res.json({ success: true, user: updated });
  } catch (err) {
    console.log("Photo Upload Error:", err);
    res.status(500).json({ success: false, message: "Error uploading photo" });
  }
});

/* ===========================
   GET ADMIN DETAILS BY IDS
===========================*/
app.post("/get-admin-details", async (req, res) => {
  const { ids } = req.body;

  try {
    // Convert all ids to ObjectId correctly
    const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));

    const admins = await User.find({ _id: { $in: objectIds } })
      .select("_id name email organization");

    res.json({ success: true, admins });
  } catch (err) {
    console.log("Get Admin Details Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===========================
   ADD BILL  
===========================*/
app.post("/add-bill", upload.single("billImage"), async (req, res) => {
  try {
    const { userId, type, date, amount, billNumber } = req.body;

    const newBill = new Bill({
      userId,
      type,
      amount: Number(amount),
      billNumber,
      date: new Date(date),
      billImage: req.file.filename,
    });

    await newBill.save();
    res.json({ success: true, message: "Bill added!" });
  } catch (err) {
    console.log("Bill Error:", err);
    res.status(500).json({ success: false, message: "Error adding bill" });
  }
});

/* ===========================
   GET USER BILLS  
===========================*/
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
// GET BILLS FOR MANAGER - ANY ORG, ONLY ACCEPTED WORKERS
app.get("/bills/org/:adminId", async (req, res) => {
  try {
    const { adminId } = req.params;

    // Sirf wo workers jinhone request accept ki hai
    const workers = await User.find({
      acceptedAdmins: { $in: [adminId] },
      role: "worker",
    }).select("_id");

    const ids = workers.map((u) => u._id);

    const bills = await Bill.find({ userId: { $in: ids } })
      .populate("userId", "name email phone organization")
      .sort({ date: -1 });

    res.json({ success: true, bills });
  } catch (err) {
    console.log("Org Bills Error:", err);
    res.status(500).json({ success: false, message: "Error fetching bills" });
  }
});


/* ===========================
   GET ACCEPTED WORKERS
===========================*/
app.get("/workers/accepted/:adminId", async (req, res) => {
  try {
    const { adminId } = req.params;

    const workers = await User.find({
      acceptedAdmins: { $in: [adminId] },
      role: "worker",
    }).select("_id name email phone organization");

    res.json({ success: true, workers });
  } catch (err) {
    console.log("Accepted Workers Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===========================
   UPDATE BILL
===========================*/
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
      return res.status(404).json({ success: false, message: "Bill not found" });

    res.json({ success: true, message: "Bill updated!", bill: updated });
  } catch (err) {
    console.log("Bill Update Error:", err);
    res.status(500).json({ success: false, message: "Error updating bill" });
  }
});

/* ===========================
   DELETE BILL
===========================*/
app.delete("/bill/:id", async (req, res) => {
  try {
    const deleted = await Bill.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ success: false, message: "Bill not found" });

    res.json({ success: true, message: "Bill deleted!" });
  } catch (err) {
    console.log("Delete Error:", err);
    res.status(500).json({ success: false, message: "Error deleting bill" });
  }
});

/* ===========================
   CONTACT ROUTES
===========================*/
app.use("/contact", contactRoutes);

/* ===========================
   SERVER START
===========================*/
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
