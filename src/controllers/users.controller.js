const { body, check } = require("express-validator");
const jwt = require("jsonwebtoken");

//
const { User } = require("../store/helper");
const { sendData, sendError } = require("../utils/responseHelpers");
const { Roles } = require("../constants");

const registerUser = async (req, res) => {
  // WE'RE SUPPOSED TO SEED A SUPER ADMIN THEN CREATE OTHER ADMINS WITH THAT SUPER ADMIN
  // INSTEAD OF JUST ACCEPTION ROLE FORM THE REGISTER API
  const { username, password, role = Roles.user } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return sendError(res, { message: "User already exists" });
  }

  // IN REALITY, WE'RE SUPPOSED TO HASH THE PASSWORD BEFORE SAVING TO DB
  const newUser = await User.create({ username, password, role });

  return sendData(
    res,
    { message: "User registered successfully", user: newUser },
    201
  );
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });

  if (!user) {
    return sendError(res, { message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWTSECRETKEY,
    { expiresIn: "1h" }
  );

  return sendData(res, { message: "Logged In Successfully", token });
};

const validators = {
  _registerUser: [
    body("username").isString().notEmpty(),
    body("password").isString().notEmpty(),
    check("role")
      .optional()
      .isIn(Object.values(Roles))
      .withMessage(`Role must be one of [${Object.values(Roles).join(" | ")}]`)
  ],

  _login: [
    body("username").isString().notEmpty(),
    body("password").isString().notEmpty()
  ]
};

module.exports = { validators, registerUser, login };
