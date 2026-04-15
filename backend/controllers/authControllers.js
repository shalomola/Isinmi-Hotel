const User = require("../models/Users.js");

const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create user - all new users default to isSuperAdmin: false
    const user = await User.create({ name, email, password, isSuperAdmin: false });

    // Optionally return safe user info
    const { password: pwd, ...safeUser } = user.toObject();

    res.status(201).json({ user: safeUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate Fields
    if(!email || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const { password: pwd, ...safeUser } = user.toObject();

        res.status(200).json({
            id: user._id,
            user: safeUser,
            token: generateToken(user._id)
        });
    } catch (error) {
        res
        .status(500)
        .json({
            message: "Server error. Please try again later.",
            error: error.message,
        });
    }
}

// exports.logoutUser = async (req, res) => {
//     res.status(200).json({ message: "User logged out successfully" });
// }




