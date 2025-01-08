const express = require("express");
const {
  validators,
  registerUser,
  login
} = require("../controllers/users.controller");
const {
  validateRequestMiddleware
} = require("../middlewares/validator.middleware");

const router = express.Router();

router.post(
  "/register",
  validators._registerUser,
  validateRequestMiddleware,
  registerUser
);

router.post("/login", validators._login, validateRequestMiddleware, login);

module.exports = router;
