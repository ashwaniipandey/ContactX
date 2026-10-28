const express = require("express");
const router = express.Router();
const {
  handleAuth,
  loginUser,
  registerUser,
} = require("../controllers/authController");

// Frontend Unified Route: POST /api/auth (with { action: 'login' | 'signup' | 'demo' })
router.post("/", handleAuth);

// Standard RESTful endpoints
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/signup", registerUser);

module.exports = router;

