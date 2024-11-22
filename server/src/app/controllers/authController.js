const { createToken } = require("../utils/jwt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await createToken({ userId: user.id });

    res.cookie("token", token);

    res.status(200).json({
      message: "Logged in successfully",
      id: user.id,
      email: user.email,
      username: user.username,
      profileImage: user.profileImage,
      isActive: user.isActive,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Error during login" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error during logout" });
  }
};

const profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error retrieving user" });
  }
};

const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findByPk(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      userId: user.id,
      email: user.email,
      username: user.username,
      profileImage: user.profileImage,
      isActive: user.isActive,
      message: "Authorized",
      success: true,
    });
  });
};

module.exports = { login, logout, profile, verifyToken };