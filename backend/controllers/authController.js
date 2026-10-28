const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "default_contactx_secret", {
    expiresIn: "30d",
  });
};

// Unified Auth endpoint supporting { action: 'login' | 'signup' | 'demo' } for frontend compatibility
exports.handleAuth = async (req, res) => {
  try {
    const { action, name, email, password } = req.body;

    // 1. Instant Demo Login
    if (action === "demo") {
      const demoUser = {
        id: "demo-user-101",
        name: "Ashwani Pandey (Demo)",
        email: "demo@contactx.dev",
        role: "Pro Administrator",
        avatar: "AP",
        token: generateToken("demo-user-101"),
      };
      return res.status(200).json({
        success: true,
        user: demoUser,
        message: "Logged in via instant demo mode",
      });
    }

    // 2. Sign Up / Register
    if (action === "signup" || action === "register") {
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          error: "Please provide name, email, and password",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          error: "Password must be at least 6 characters",
        });
      }

      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({
          success: false,
          error: "An account with this email already exists",
        });
      }

      const avatar = name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        avatar,
      });

      return res.status(201).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: "Member",
          avatar: user.avatar || avatar,
          token: generateToken(user._id),
        },
        message: "Account created successfully!",
      });
    }

    // 3. Login
    if (action === "login") {
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Please enter both email and password",
        });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Invalid email or password",
        });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: "Invalid email or password",
        });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: "Administrator",
          avatar: user.avatar,
          token: generateToken(user._id),
        },
        message: "Signed in successfully!",
      });
    }

    return res.status(400).json({
      success: false,
      error: `Unknown action: ${action}`,
    });
  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error during authentication",
    });
  }
};

// Standalone RESTful Register
exports.registerUser = async (req, res) => {
  req.body.action = "signup";
  return exports.handleAuth(req, res);
};

// Standalone RESTful Login
exports.loginUser = async (req, res) => {
  req.body.action = "login";
  return exports.handleAuth(req, res);
};

