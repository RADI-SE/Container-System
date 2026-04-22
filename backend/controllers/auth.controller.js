const bcrypt = require("bcryptjs");
const User = require("../models/user.model.js");
const generatTokenAndSetCookies = require("../utils/generatTokenAndSetCookies.js");
const  sendEmail  = require("../nodemailer/send.email.js"); 

const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try { 
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
 
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
 
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: (role || "staff").toLowerCase() === "admin" ? "admin" : "staff",
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, 
    });

    await user.save();

    // 2. Handle Email & Cookies
    try {
      await sendEmail({
        email: email,
        subject: "Verify your email",
        message: `Your verification code is ${verificationToken}`,
      });

      generatTokenAndSetCookies(res, user._id);
      
      res.status(201).json({
        success: true,
        message: "User created successfully. Check your email.",
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        }
      });
    } catch (emailError) {
      res.status(201).json({
        success: true,
        message: "User created, but verification email failed to send.",
        user: { id: user._id, email: user.email }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try { 
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
 
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
 
    generatTokenAndSetCookies(res, user._id);
 
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token"); 
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

const checkAuth = async (req, res) => {
  try { 
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

 const getAllUsers = async (req, res) => {
  try {
   
    const users = await User.find({ _id: { $ne: req.userId } })
                            .select("_id name email role"); 
    
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};

// Exporting using CommonJS
module.exports = {
  signup,
  signin,
  logout,
  getAllUsers,
  checkAuth
  
};