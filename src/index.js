const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
//
const UserRoutes = require("./routes/users.route");
const BookRoutes = require("./routes/books.route");
const { sendData } = require("./utils/responseHelpers");

//
dotenv.config();
const app = express();

const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/api/users", UserRoutes);
app.use("/api/books", BookRoutes);

app.get("/", async (req, res) => {
  const postmanCollectionLink =
    "https://www.postman.com/olayinka1234/workspace/neegles/collection/13390920-e815bcd5-ed58-40ea-b4e4-fe9a74534543";
  return sendData(res, {
    message: `Welcome to Our Amazing Book Management Store; Explore our API docs at ${postmanCollectionLink}`
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
