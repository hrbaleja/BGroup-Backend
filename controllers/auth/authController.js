const User = require('../../models/users/User');
const bcrypt = require('bcryptjs');
const ErrorHandler = require('../../utils/errorHandler');
const jwt = require('jsonwebtoken');
const { STATUS, MESSAGES } = require('../../constants/auth');
const crypto = require('crypto');
const { sendEmail } = require('../../services/mailService');
const useragent = require('useragent');


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
  const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgentString = req.headers['user-agent'];
  const userDevice = useragent.parse(userAgentString);

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(STATUS.BAD_REQUEST).json({ message: MESSAGES.INVALID_CREDENTIALS });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(STATUS.BAD_REQUEST).json({ message: MESSAGES.INVALID_CREDENTIALS });
    }

    if (!user.isVerified) {
      return res.status(STATUS.BAD_REQUEST).json({ message: MESSAGES.ACCOUNT_NOTVERIFIED });
    }

    if (!user.isActive) {
      return res.status(STATUS.BAD_REQUEST).json({ message: MESSAGES.ACCOUNT_NOTACTIVE });
    }

  
    const { accessToken, refreshToken } = await generateTokens(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: process.env.JWT_REFRESH_TOKEN_EXPIRY_MS,
    });

    // Update last login time
    user.lastLoginTime = new Date();
    await user.save();

    // Send login alert
    const loginDetails = {
      ipAddress: userIp,
      device: userDevice.toString(),
      timestamp: new Date()
    };
    

    // Send login alert asynchronously - don't wait for it
    sendLoginAlert(user, loginDetails).catch(console.error);

    res.json({ accessToken, refreshToken, message: MESSAGES.LOGIN_SUCCESS });
  } catch (err) {
    console.log(err)
    next(new ErrorHandler(err, STATUS.SERVER_ERROR));
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

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(STATUS.OK).json({ message: MESSAGES.EMAIL_SENT });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const emailSubject = 'Reset Your Password';
    const resetUrl = `${process.env.APPURL}auth/resetpassword/${resetToken}`;
    // Email options with improved HTML template
    const htmlbody = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f0f8ff, #e6f7ff); padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
                      <h3 style="color: #2c3e50; text-align: center; font-size: 26px; margin-bottom: 20px; font-weight: 600;">Reset Your Password</h3>
                      <p style="color: #555; font-size: 16px; text-align: justify; line-height: 1.6;">
                        Hello, <br> We received a request to reset your password. If you didn't make this request, please ignore this email. Otherwise, click the button below to reset your password.
                      </p>
                      <div style="text-align: center; margin: 25px 0;">
                        <a href="${resetUrl}" style="background: linear-gradient(135deg, #6dd5ed, #2193b0); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-size: 16px; font-weight: 600; transition: transform 0.3s, box-shadow 0.3s; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                          Reset Password
                        </a>
                      </div>
                      <p style="color: #555; font-size: 14px; text-align: justify; line-height: 1.6;">
                        If the button above doesn't work, copy and paste the following URL into your browser: <br>
                        <a href="${resetUrl}" style="color: #2193b0; word-break: break-word;">${resetUrl}</a>
                      </p>
                      <div style="text-align: center; margin-top: 25px; font-size: 12px; color: #777;">
                        <p>This link will expire in 1 hour. For security reasons, do not share this email with anyone.</p>
                        <p>If you have any questions, feel free to <a href="#" style="color: #2193b0; text-decoration: none;">contact our support team</a>.</p>
                        <p>&copy; 2025 B Group Pvt. Ltd. All rights reserved.</p>
                      </div>
                    </div>`

    // Send email
    await sendEmail(email, emailSubject, htmlbody);
    res.status(STATUS.OK).json({ message: MESSAGES.EMAIL_SENT });
  } catch (error) {
    next(new ErrorHandler(error, STATUS.SERVER_ERROR));
  }
};

exports.resetPassword = async (req, res, next) => {
  const { authtoken, newPassword } = req.body;
  try {
    // Hash the token and find the user with the matching reset token
    const hashedToken = crypto.createHash('sha256').update(authtoken).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(STATUS.BAD_REQUEST).json({ message: MESSAGES.RESET_LINKEXPIRED });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(STATUS.OK).json({ message: MESSAGES.PASSWORD_RESET_SUCCESS });
  } catch (error) {
    next(new ErrorHandler(error, STATUS.SERVER_ERROR));
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

const sendLoginAlert = async (user, loginDetails) => {
  try {
    const emailSubject = 'New Login Alert';
    const securityUrl = `${process.env.APPURL}/security/activity`;

    // Format login time to user's locale
    const loginTime = new Date().toLocaleString();

    // Get location from IP (you might want to use a geolocation service here)
    const location = loginDetails.ipAddress || 'Unknown Location';

    const htmlBody = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style type="text/css">
    body, p {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
    }
    
    .header {
      background: linear-gradient(135deg, #6dd5ed, #2193b0);
      padding: 40px 20px;
      text-align: center;
    }
    
    .content {
      padding: 30px 20px;
      background: #f8f9fa;
    }
    
    .info-box {
      background: #ffffff;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .button {
      display: inline-block;
      padding: 15px 30px;
      background: linear-gradient(135deg, #6dd5ed, #2193b0);
      color: #ffffff;
      text-decoration: none;
      border-radius: 25px;
      font-weight: 600;
      margin: 20px 0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .footer {
      padding: 20px;
      text-align: center;
      background: #f1f1f1;
    }
    
    @media only screen and (max-width: 480px) {
      .container {
        width: 100% !important;
      }
      .content {
        padding: 20px 15px !important;
      }
      .button {
        display: block;
        margin: 20px auto;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="font-size: 48px; color: #ffffff; margin-bottom: 20px;">🔐</div>
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">New Login Detected</h1>
    </div>
    
    <div class="content">
      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        Hello ${user.name},
      </p>
      
      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        We detected a new login to your account. Here are the details:
      </p>
      
      <div class="info-box">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">
              <strong>Time:</strong>
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">
              ${loginTime}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">
              <strong>Device:</strong>
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">
              ${loginDetails.device}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">
              <strong>Browser:</strong>
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">
              ${loginDetails.browser}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">
              <strong>Location:</strong>
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">
              ${location}
            </td>
          </tr>
        </table>
      </div>
      
      <div style="text-align: center;">
        <a href="${securityUrl}" class="button">
          Review Account Activity
        </a>
      </div>
      
      <p style="color: #d63031; font-size: 14px; line-height: 1.6; margin-top: 20px; background: #ffe5e5; padding: 15px; border-radius: 8px;">
        If you don't recognize this activity, please secure your account immediately by changing your password and enabling two-factor authentication.
      </p>
    </div>
    
    <div class="footer">
      <p style="color: #666666; font-size: 12px; margin-bottom: 10px;">
        This is an automated security alert. If you need assistance, please contact our support team.
      </p>
      <p style="color: #666666; font-size: 12px;">
        © ${new Date().getFullYear()} B Group Pvt. Ltd. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;

    await sendEmail('hiteshbaleja@gmail.com', emailSubject, htmlBody);
    return true;
  } catch (error) {
    console.error('Login alert email error:', error);
    return false;
  }
};



