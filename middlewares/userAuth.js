const jwt = require("jsonwebtoken");
require("dotenv").config();

function userAuth(req, res, next) {
  const token = req.headers.token;
  if (!token) {
    return res.status(400).json({
      message: "Token not found!",
    });
  }
  const decodeData = jwt.verify(token, process.env.JWT_USER_SECRET);
  if (!decodeData) {
    return res.status(403).json({
      message: "Unauthorised Access!",
    });
  } else {
    req.userId = decodeData.id;
    next();
  }
}

module.exports = {
  userAuth,
};
