const User = require("../models/User");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  try {
    const { email, password, profile_image, username, is_active } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      profile_image,
      username,
      is_active,
    });

    res.status(201).json({
      message: "User created successfully",
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating user", message: error.errors[0].message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving user" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving users" });
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { email, password, confirmPassword, profile_image, username, is_active } = req.body;

    if (password !== undefined && confirmPassword !== undefined) {
      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords don't match" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    
    user.email = email !== undefined ? email : user.email;
    user.profile_image = profile_image !== undefined ? profile_image : user.profile_image;
    user.username = username !== undefined ? username : user.username;
    user.is_active = is_active !== undefined ? is_active : user.is_active;


    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.is_active = req.body.is_active;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error updating user status" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  updateUserStatus,
};
