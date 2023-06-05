const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// @Route    : POST /api/users/register
// @Desc     : Register user
// @Access   : Public
const registerUser = async (req, res) => {
  const {username, password} = req.body;

  try {
    // check if user already exists
    const user = await User.find({username});
    if (user.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      })
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const newUser = await User.create({
      username,
      password: hashedPassword,
    })
    if (!newUser) {
      return res.status(400).json({
        success: false,
        message: "Unable to create user",
      })
    }

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    })
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages[0]
      })
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
};

// @Route    : POST /api/users/login
// @Desc     : Login user
// @Access   : Public
const loginUser = async (req, res) => {
  const {username, password} = req.body;

  try {
    // check if user exists
    const user = await User.find({username});
    if (user.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // check if password is correct
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // create token
    const token = jwt.sign(
      {_id: user[0]._id},
      process.env.JWT_SECRET
    );

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        token,
        user: {
          _id: user[0]._id,
          username: user[0].username,
        }
      },
    })
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages[0]
      })
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
    })

  }
}

// @Route    : GET /api/users/profile
// @Desc     : Get user profile
// @Access   : Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: user,
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    })
  }
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
