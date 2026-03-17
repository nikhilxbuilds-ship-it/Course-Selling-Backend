const { z } = require("zod");
const { Router } = require("express");
const { adminModel, courseModel } = require("../db.js");
const jwt = require("jsonwebtoken");
const { adminAuth } = require("../middlewares/adminAuth.js");
require("dotenv").config();

const adminRouter = Router();

adminRouter.post("/signup", async function (req, res) {
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

    await adminModel.create({
      email: email,
      password: password,
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

adminRouter.post("/login", async function (req, res) {
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

    const findUser = await adminModel.findOne({
      email: email,
    });
    console.log(findUser._id);

    if (!findUser) {
      return res.status(403).json({
        meassage: "User not found! Please login!",
      });
    }
    const token = jwt.sign(
      {
        id: findUser._id,
      },
      process.env.JWT_SECRET,
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

adminRouter.post("/course", adminAuth, async function (req, res) {
  const requiredBody = z.object({
    title: z.string().min(5).max(30),
    discription: z.string().min(5).max(100),
    price: z.string().min(3).max(30),
    imageURL: z.string().min(3).max(300),
  });

  const parsedataWithSuccess = requiredBody.safeParse(req.body);
  if (!parsedataWithSuccess.success) {
    return res.status(400).json({
      message: "Incorrect format",
      error: parsedataWithSuccess.error.issues,
    });
  }
  const creatorId = req.userId;
  const { title, discription, price, imageURL } = parsedataWithSuccess.data;

  const newCourse = await courseModel.create({
    title: title,
    discription: discription,
    price: price,
    imageURL: imageURL,
    creatorId: creatorId,
  });

  res.status(201).json({
    message: "New Course is added",
    newCourse,
  });
});

adminRouter.put("/course", function (req, res) {});

adminRouter.delete("/course", function (req, res) {});

module.exports = {
  adminRouter,
};
