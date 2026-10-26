const userModel = require("../models/user.model");
const tokenBlacklistModel = require("../models/blacklist.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @name registerUserController
 * @description Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
async function registerUserController(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const isUserExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExists) {
    return res
      .status(400)
      .json({
        message: `User already exists with this username ${username} or email ${email}`,
      });
    }
    
    const hash = await bcrypt.hash(password, 10);
    
    const user = await userModel.create({
      username,
      email,
      password: hash,
    });

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    });

}

/**
 * @name loginUserController
 * @description Login a register user
 * @route POST /api/auth/login
 * @access Public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body;
    
    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    });
}

/**
 * @name logoutUserController
 * @description Logout a logged-in user
 * @route POST /api/auth/logout
 * @access Public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(400).json({ message: "No token found" });
    }

    if (token) {
        await tokenBlacklistModel.create({ token });
    }

    res.clearCookie("token");

    res.status(200).json({ message: "User logged out successfully" });
}

module.exports = { registerUserController, loginUserController, logoutUserController };
