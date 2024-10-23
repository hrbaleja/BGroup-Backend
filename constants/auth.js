module.exports = {
  STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    SERVER_ERROR: 500
  },
  
  MESSAGES: {
    ALREADY_EXISTS: 'User already exists please login',
    INVALID_CREDENTIALS: 'Invalid Email Address or Password',
    ACCOUNT_NOTVERIFIED: 'Account is not verified',
    ACCOUNT_NOTACTIVE: 'Account is not active',
    UNAUTHORIZED: 'Unauthorized Request',
    FORBIDDEN: 'Request Forbidden',
    SERVER_ERROR: 'Server error',
    TOKEN_MISSING: 'Unauthorized: Auth token missing or invalid',
    TOKEN_ERR: 'Failed to generate token. Please try again.',
    LOGIN_SUCCESS: 'Loggin successfully',
    LOGIN_ERR: 'Failed to login. Please try again.',
    REGISTER_SUCCESS: 'Registration successful. Please log in.',
    REGISTER_ERR: 'Failed to register. Please try again.',
  }
};