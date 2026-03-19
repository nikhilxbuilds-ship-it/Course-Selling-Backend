const { Router } = require("express");
const { userAuth } = require("../middlewares/userAuth.js");
const { purchaseModel } = require("../db.js");

const courseRouter = Router();

courseRouter.post("/purchase/:_id", userAuth,async  function (req, res) {
  try {
    const userId = req.userId;
    const courseId = req.params._id

  const purchasedCourse = await purchaseModel.create({
    userId,
    courseId,
  })
  if(!purchasedCourse){
    return res.status(400).json({
      message : "Can't purchase this course"
    })
  }
  res.status(201).json({
    message : "Purchased the course!"
  })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message : "Internal server error",
      Error : error
    })
  }
});

courseRouter.get("/preview", function (req, res) {
  
});

module.exports = {
  courseRouter: courseRouter,
};
