const { Router } = require("express");

const router = Router();
const bcrypt = require("bcrypt");
const { User, Account } = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

// /api/v1/user/signup

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email already taken" });
    }

    const newUser = await User.create({
      name,
      email,
      password,
    });

    const userId = newUser._id;

    //   ------ Create an account ------
    await Account.create({
      userId,
      balance: 1 + Math.random() * 10000,
    });

    const token = jwt.sign({ userId }, "secret");

    res.status(200).json({ message: "User created successfully", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser || !bcrypt.compare(password, existingUser.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: existingUser._id }, "secret");

    res.json({ message: "Logged in", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.put("/", authMiddleware, async (req, res) => {
  try {
    await User.updateOne({ _id: req.userId }, req.body);

    res.json({ message: "Updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.get("/bulk", authMiddleware, async (req, res) => {
  try {
    const filter = req.query.filter || "";
    const users = await User.find({
      _id: { $ne: req.userId },
      $or: [
        { name: { $regex: filter, $options: "i" } },
        { email: { $regex: filter, $options: "i" } },
      ],
    });

    res.json({
      users: users.map((user) => ({
        email: user.email,
        name: user.name,
        id: user.id,
      })),
    });
  } catch (error) {}
});

module.exports = router;
