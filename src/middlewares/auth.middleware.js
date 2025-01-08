const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/responseHelpers");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return sendError(res, { message: "Access Denied" }, 401);

  jwt.verify(token, process.env.JWTSECRETKEY, (err, user) => {
    if (err) return sendError(res, { message: "Invalid Token" }, 403);
    req.user = user;
    next();
  });
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return sendError(
        res,
        { message: `Forbidden: Only ${role} Can Access This Route` },
        403
      );
    }
    next();
  };
}

module.exports = { authorizeRole, authenticateToken };
