const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

/**
 * @name authUserMiddleware
 * @description Middleware to authenticate a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
async function authUserMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Token not found Unauthorized access" });
  }
  const isBlacklisted = await tokenBlacklistModel.findOne({ token });
  if (isBlacklisted) {
    return res
      .status(401)
      .json({ message: "Token is Invalid Unauthorized access" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid token Unauthorized access" });
  }
}

module.exports = authUserMiddleware;
