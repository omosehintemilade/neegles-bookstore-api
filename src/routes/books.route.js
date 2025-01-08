const express = require("express");
const {
  validateRequestMiddleware
} = require("../middlewares/validator.middleware");
const {
  authenticateToken,
  authorizeRole
} = require("../middlewares/auth.middleware");
const {
  validators,
  getAllBooks,
  createBook,
  getBookById,
  updateBookById,
  deleteBookById
} = require("../controllers/books.controller");
const { Roles } = require("../constants");

const router = express.Router();

router.get("/", authenticateToken, getAllBooks);

router.get(
  "/:id",
  authenticateToken,
  validators._getBookById,
  validateRequestMiddleware,
  getBookById
);

router.post(
  "/",
  authenticateToken,
  validators._createBook,
  validateRequestMiddleware,
  createBook
);

router.put(
  "/:id",
  authenticateToken,
  validators._getBookById,
  validators._createBook,
  validateRequestMiddleware,
  updateBookById
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRole(Roles.admin),
  validators._getBookById,
  validateRequestMiddleware,
  deleteBookById
);

module.exports = router;
