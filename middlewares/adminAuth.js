const jwt = require("jsonwebtoken");
require("dotenv").config();

function adminAuth(req, res, next) {
  const token = req.headers.token;
  if (!token) {
    return res.status(400).json({
      message: "Token not found!",
    });
  }
  const decodeData = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
  console.log(decodeData);
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
  adminAuth,
};
