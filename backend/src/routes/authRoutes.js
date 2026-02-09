const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// LOGIN (ADMIN)
router.post("/login", authController.login);

module.exports = router;
