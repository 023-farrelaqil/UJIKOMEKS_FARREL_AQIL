const express = require("express");
const router = express.Router();
const adminAuthController = require("../controllers/adminAuthController");
const bansosController = require("../controllers/bansosController");

// LOGIN ADMIN
router.post("/login", adminAuthController.login);

// DATA PENGAJUAN
router.get("/pengajuan", bansosController.getPengajuan);

// APPROVE + KATEGORI
router.put("/approve/:id", bansosController.approveBansos);

// REJECT
router.put("/reject/:id", bansosController.rejectBansos);

module.exports = router;
