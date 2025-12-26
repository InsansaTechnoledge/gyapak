import user from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registrationController = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(404).json({
        message: "Name, Email and Password are required for registration",
      });

    const findUser = await user.findOne({ email });
    if (findUser)
      return res
        .status(203)
        .json({ message: "user already exists", data: findUser });

    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUND) || 10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new user({ 
      name, 
      email, 
      password: hashedPassword,
      role: role || "data entry" // Default role if not provided
    });
    await newUser.save();
    res.status(201).json({ 
      success: true,
      message: "new user created",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

const loginController = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      return res.status(404).json({
        message: "Email and Password are required ",
      });
    const findUser = await user.findOne({ email }).select("+password");

    if (!findUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, findUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token with user data
    const token = jwt.sign(
      {
        id: findUser._id,
        email: findUser.email,
        role: findUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d", // Default to 7 days if not set
      }
    );

    // Send token in response body only (no cookie)
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: findUser._id,
        name: findUser.name,
        email: findUser.email,
        role: findUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "INTERNAL SERVER ERROR", error: err });
  }
};

export { registrationController, loginController };
