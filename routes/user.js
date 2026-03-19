const { Router } = require("express");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
const bcrypt = require("bcrypt");
require("dotenv").config();
const userRouter = Router();
const { z } = require("zod");
const mongoose = require("mongoose");
const { userModel, purchaseModel } = require("../db.js");
const { userAuth } = require("../middlewares/userAuth.js");

userRouter.post("/signup", async function (req, res) {
  try {
    const requiredBody = z.object({
      email: z.string().min(5).max(30).email(),
      password: z.string().min(5).max(30),
      firstName: z.string().min(3).max(30),
      lastName: z.string().min(5).max(30),
    });

    const parsedataWithSuccess = requiredBody.safeParse(req.body);
    if (!parsedataWithSuccess.success) {
      return res.status(400).json({
        message: "Incorrect format",
        error: parsedataWithSuccess.error.issues,
      });
    }

    const { email, password, firstName, lastName } = parsedataWithSuccess.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });

    res.status(201).json({
      massage: "You are Signup!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      Error: error,
    });
  }
});

userRouter.post("/login", async function (req, res) {
  try {
    const requiredBody = z.object({
      email: z.string().min(5).max(30).email(),
      password: z.string().min(5).max(30),
    });

    const parsedataWithSuccess = requiredBody.safeParse(req.body);
    if (!parsedataWithSuccess.success) {
      return res.status(400).json({
        message: "Incorrect format",
        error: parsedataWithSuccess.error.issues,
      });
    }

    const { email, password } = parsedataWithSuccess.data;

    const findUser = await userModel.findOne({
      email: email,
    });

    if (!findUser) {
      return res.status(403).json({
        meassage: "User not found! Please login!",
      });
    }
    const isMatched = await bcrypt.compare(password, findUser.password);
    if (!isMatched) {
      return res.status(403).json({
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      {
        id: findUser._id,
      },
      process.env.JWT_USER_SECRET,
    );
    res.status(200).json({
      message: "You are loged in",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      Error: error,
    });
  }
});

userRouter.get("/purchases", userAuth, async function (req, res) {
  try {
    const userId = req.userId;
    const findPurchases = await purchaseModel.find({ userId });
    if (findPurchases.length === 0) {
      return res.status(404).json({
        message: "User does not has any courses",
      });
    } else {
      res.status(200).json({
        message: "Here are your courses : ",
        findPurchases,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      Error: error,
    });
  }
});

module.exports = {
  userRouter: userRouter,
};
