const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  try {
    //  Get token from "Authorization: Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
   

    if (!token) {
      console.log("No token found");
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }
    //  Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Attach user to req.user
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};



module.exports = { protect };
