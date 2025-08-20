const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");
  // console.log("authMiddleware: Received Authorization header", { authHeader });

  if (!authHeader) {
    // console.log("authMiddleware: No Authorization header provided");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    // console.log("authMiddleware: Invalid token format");
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("authMiddleware: Token decoded", { userId: decoded.userId });
    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    // console.error("authMiddleware: Token verification failed", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
