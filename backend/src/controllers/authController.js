const userService = require('../services/userService');
const { sendSuccess } = require('../utils/responseHandler');

async function register(req, res, next) {
  try {
    const result = await userService.registerUser(req.body);
    return sendSuccess(res, 'User registered successfully', result, 201);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await userService.loginUser(req.body);
    return sendSuccess(res, 'User authenticated successfully', result, 200);
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    return sendSuccess(res, 'Current user profile retrieved', { user: req.user }, 200);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getMe
};
