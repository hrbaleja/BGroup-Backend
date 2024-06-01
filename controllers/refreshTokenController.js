const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.refreshToken = async (req, res) => {

  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log(decoded)
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user);
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: process.env.JWT_REFRESH_TOKEN_EXPIRY_MS,
    });

    res.json({ accessToken });
  } catch (err) {
    res.status(401).json({ msg: 'Unauthorized' });
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
