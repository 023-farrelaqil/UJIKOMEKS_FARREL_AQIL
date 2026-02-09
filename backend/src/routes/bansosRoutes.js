const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const bansosController = require("../controllers/bansosController");

// Setup multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file JPG, PNG, atau PDF yang diperbolehkan'));
    }
  }
});

// PUBLIC ROUTES - NO LOGIN REQUIRED
router.get("/cek/:nik", bansosController.cekBansos);
router.post("/pengajuan", upload.single("sktm"), bansosController.ajukanBansos);

module.exports = router;