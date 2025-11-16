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

//  basic middlewares
app.use(cors());
app.use(express.json());

//  setup for file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//  mongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected Successfully"))
  .catch((err) => console.error(" MongoDB Error:", err));

//  schema and model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  role: String,
  organization: String,
  billImage: String,
});

const User = mongoose.model("User", userSchema);

//  multer setup (for image uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

//  routes

// signup
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

// login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });
    res.json({ success: true, message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error in login" });
  }
});
// 🧩 Get all workers for a specific organization
app.get("/workers/:organization", async (req, res) => {
  try {
    const { organization } = req.params;

    // Organization ke naam se filter kar ke sirf worker role wale users la rahe hain
    const workers = await User.find({ organization, role: "worker" });

    res.json({ success: true, workers });
  } catch (err) {
    console.error("Error fetching workers:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.use("/contact", contactRoutes);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
