const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

/* ===== ENSURE UPLOADS FOLDER ===== */
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/* ===== MIDDLEWARE ===== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir));

/* ===== ROUTES ===== */
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));
app.use("/api/bansos", require("./src/routes/bansosRoutes"));

/* ===== ROOT TEST ===== */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Bansos API running",
  });
});

/* ===== 404 ===== */
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

/* ===== START ===== */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

app.use("/api/admin", require("./src/routes/adminRoutes"));
