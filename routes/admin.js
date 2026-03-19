const { z } = require("zod");
const { Router } = require("express");
const { adminModel, courseModel } = require("../db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
    const hashedPassword =await bcrypt.hash(password, 10);
    await adminModel.create({
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

    const isMatched =await bcrypt.compare(password, findUser.password);
    if(!isMatched){
      return res.status(400).json({
        message : "Incorrect Credentials"
      })
    }
    const token = jwt.sign(
      {
        id: findUser._id,
      },
      process.env.JWT_ADMIN_SECRET,
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
  try {
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      Error: error,
    });
  }
});

adminRouter.put("/course/:_id", adminAuth, async function (req, res) {
  try {
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
    const courseId = req.params._id;
    const { title, discription, price, imageURL } = parsedataWithSuccess.data;

    const findCourse = await courseModel.findOneAndUpdate(
      {
        _id: courseId,
        creatorId: creatorId,
      },
      {
        title,
        discription,
        price,
        imageURL,
      },
      {
        new: true,
      },
    );
    if (!findCourse) {
      return res.status(400).json({
        massage: "Course not found!",
      });
    }

    res.status(201).json({
      message: "Updated Course details",
      findCourse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      Error: error,
    });
  }
});

adminRouter.delete("/course/:_id", adminAuth, async function (req, res) {
  try {
    const courseId = req.params._id;
    const creatorId = req.userId;
    const deletedCourse = await courseModel.findOneAndDelete({
      _id: courseId,
      creatorId: creatorId,
    });

    if (!deletedCourse) {
      return res.status(404).json({
        message: "Course not found or unauthorized",
      });
    }

    res.status(200).json({
      message: "Deleted the course!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      Error: error,
    });
  }
});

module.exports = {
  adminRouter,
};
