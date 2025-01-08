const { validationResult } = require("express-validator");
const { sendError } = require("../utils/responseHelpers");

const validateRequestMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { errors: errors.array() }, 400);
  }
  next();
};

module.exports = { validateRequestMiddleware };
