const User = require('../../models/users/User');
const bcrypt = require('bcryptjs');
const ErrorHandler = require('../../utils/errorHandler');
const jwt = require('jsonwebtoken');
const { STATUS, MESSAGES } = require('../../constants/auth');


exports.register = async (req, res, next) => {
  const { name, email, password } = req.body.userData;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(STATUS.BAD_REQUEST).json({ message: MESSAGES.ALREADY_EXISTS })
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(STATUS.CREATED).json({ message: MESSAGES.REGISTER_SUCCESS })
  } catch (err) {
    next(new ErrorHandler(MESSAGES.REGISTER_ERR, STATUS.SERVER_ERROR));
  }
};

exports.login = async (req, res, next) => {
  const userAgent = req.headers['user-agent'];
  console.log(userAgent)
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(STATUS.BAD_REQUEST).json({ message: MESSAGES.INVALID_CREDENTIALS })
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(STATUS.BAD_REQUEST).json({ message: MESSAGES.INVALID_CREDENTIALS })
    }

    if (!user.isVerified) {
      return res.status(STATUS.BAD_REQUEST).json({ message: MESSAGES.ACCOUNT_NOTVERIFIED })
    }

    if (!user.isActive) {
      return res.status(STATUS.BAD_REQUEST).json({ message: MESSAGES.ACCOUNT_NOTACTIVE })
    }
    const { accessToken, refreshToken } = await generateTokens(user);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: process.env.JWT_REFRESH_TOKEN_EXPIRY_MS,
    });
    user.lastLoginTime = new Date();
    await user.save();
    res.json({ accessToken, refreshToken, message: MESSAGES.LOGIN_SUCCESS });
  } catch (err) {
    next(new ErrorHandler(MESSAGES.LOGIN_ERR, STATUS.SERVER_ERROR));
  }
};

exports.refreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(STATUS.UNAUTHORIZED).json({ message: MESSAGES.TOKEN_MISSING })
  }
  try {

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(STATUS.UNAUTHORIZED).json({ message: MESSAGES.TOKEN_MISSING })
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(STATUS.FORBIDDEN).json({ message: MESSAGES.FORBIDDEN })
    }
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user);
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: process.env.JWT_REFRESH_TOKEN_EXPIRY_MS,
    });

    res.json({ accessToken, newRefreshToken });
  } catch (err) {
    next(new ErrorHandler(MESSAGES.TOKEN_ERR, STATUS.UNAUTHORIZED));
  }
};

const generateTokens = async (user) => {

  const payload = {
    userId: user._id,
    username: user.name,
    role: user.role,
    email: user.email,
    lastLoginTime: user.lastLoginTime
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY,
  });

  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
};


// // const crypto = require('crypto');

// // Encrypt function
// const encryptPassword = (password, encryptionKey) => {
//     const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
//     let encryptedPassword = cipher.update(password, 'utf8', 'hex');
//     encryptedPassword += cipher.final('hex');
//     return encryptedPassword;
// };

// // Decrypt function
// const decryptPassword = (encryptedPassword, encryptionKey) => {
//     const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
//     let decryptedPassword = decipher.update(encryptedPassword, 'hex', 'utf8');
//     decryptedPassword += decipher.final('utf8');
//     return decryptedPassword;
// };

// // Example usage
// const originalPassword = 'myPassword123';
// const encryptionKey = 'yourEncryptionKey';

// const encryptedPassword = encryptPassword(originalPassword, encryptionKey);
// console.log('Encrypted Password:', encryptedPassword);

// const decryptedPassword = decryptPassword(encryptedPassword, encryptionKey);
// console.log('Decrypted Password:', decryptedPassword);