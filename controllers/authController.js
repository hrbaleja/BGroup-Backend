const User = require('../models/User');
const bcrypt = require('bcryptjs');
const errorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

exports.register = async (req, res) => {

  const { name, email, password, role } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {

  const { email, password } = req.body;
  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: process.env.JWT_REFRESH_TOKEN_EXPIRY_MS,
    });

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const generateTokens = async (user) => {

  const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY, 
  });
  // Save the refresh token in the database or in-memory store
  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
};




exports.getAllUsers = async (req, res) => {
  try {
    const role = req.user.role;
    if (role === 1 || role === 2) {
      const users = await User.find({}, '-password');
      res.json(users);
    } else {
      res.status(403).json({ error: 'Forbidden' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.userId;
    const name = req.body.name;
    const email = req.body.email;
    const role = req.body.role;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const updatedUser = await User.findByIdAndUpdate(id, { name, email, role }, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const userId = req.params.userId;
    const isActive = req.body.isActive;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.isActive = isActive;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { password } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};