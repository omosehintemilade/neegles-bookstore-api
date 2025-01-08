const { body, check, param } = require("express-validator");

//
const { Book } = require("../store/helper");
const { sendData, sendError } = require("../utils/responseHelpers");
const { Roles } = require("../constants");

const getAllBooks = async (req, res) => {
  const { id, role } = req.user;
  const query = {};
  if (role === Roles.user) {
    query.userId = id;
  }

  const books = await Book.find(query);

  // IN REALITY, WE OUGHT TO IMPLEMENT PAGINATION
  return sendData(res, {
    message: "Fetched All Books Successfully",
    data: books
  });
};

const getBookById = async (req, res) => {
  const { id, role } = req.user;
  const query = { id: req.params.id };
  if (role === Roles.user) {
    query.userId = id;
  }

  const book = await Book.findOne(query);

  if (!book) {
    return sendError(res, { message: "Book Not Found" }, 404);
  }

  return sendData(res, {
    message: "Book Fetched Successfully",
    data: book
  });
};

const createBook = async (req, res) => {
  const { id } = req.user;
  const { title, ...restOfValue } = req.body;
  console.log({ id });
  const existingBookWithTitle = await Book.findOne({ title });

  if (existingBookWithTitle) {
    return sendError(res, {
      message: "Book with matching title already exists"
    });
  }

  const newBook = await Book.create({ title, ...restOfValue, userId: id });

  return sendData(res, {
    message: "Book Created Successfully",
    newBook
  });
};

const updateBookById = async (req, res) => {
  const { id, role } = req.user;
  const query = { id: req.params.id };
  if (role === Roles.user) {
    query.userId = id;
  }

  const book = await Book.findOne(query);

  if (!book) {
    return sendError(res, { message: "Book Not Found" }, 404);
  }

  // REPLACE ENTIRE DOC SINCE THE REQUIREMENT IS PUT
  const updatedBook = await Book.updateOne(query, {
    id: req.params.id,
    userId: id,
    ...req.body
  });

  return sendData(res, {
    message: "Book Updated Successfully",
    data: updatedBook
  });
};

const deleteBookById = async (req, res) => {
  // ONLY ADMINS CAN DELETE BOOKS SO THIS QUERY IS SAFE
  const count = await Book.delete({ d: req.params.id });

  return sendData(res, {
    message: "Books Deleted Successfully",
    count
  });
};

const validators = {
  _getBookById: [param("id").isUUID().withMessage("id must be a valid UUID")],
  _createBook: [
    body("title").isString().notEmpty(),
    body("author").isString().notEmpty(),
    body("year")
      .isInt({ max: new Date().getFullYear() })
      .withMessage("year must be an Integer and not greater than current year")
  ]
};

module.exports = {
  validators,
  getAllBooks,
  createBook,
  getBookById,
  updateBookById,
  deleteBookById
};
