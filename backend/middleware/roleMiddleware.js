const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    const userRole = req.user.role.toLowerCase(); // normalize role

    // Optional: give "admin" full access everywhere
    if (userRole === "admin") {
      return next();
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Access denied: ${userRole} cannot perform this action`,
      });
    }

    next();
  };
};

module.exports = { authorize };
