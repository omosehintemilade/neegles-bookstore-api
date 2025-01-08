const fs = require("fs").promises;
const path = require("path");
const { v4 } = require("uuid");

class JsonStore {
  constructor(filename) {
    this.filename = path.join(__dirname, "data", filename);
    this.data = null;
  }

  async init() {
    try {
      const fileContent = await fs.readFile(this.filename, "utf8");
      this.data = JSON.parse(fileContent);
    } catch (error) {
      if (error.code === "ENOENT") {
        this.data = [];
        await this.save();
      } else {
        throw error;
      }
    }
  }
  // SAVE DATA TO FILE
  async save() {
    await fs.writeFile(
      this.filename,
      JSON.stringify(this.data, null, 2),
      "utf8"
    );
  }

  // FIND ONE DOCUMENT BY QUERY
  async findOne(query) {
    await this.init();
    return this.data.find((item) =>
      Object.keys(query).every((key) => item[key] === query[key])
    );
  }

  // FIND ALL DOCUMENTS MATCHING QUERY
  async find(query = {}) {
    await this.init();
    if (Object.keys(query).length === 0) {
      return this.data;
    }
    return this.data.filter((item) => {
      return Object.keys(query).every((key) => item[key] === query[key]);
    });
  }

  // CREATE NEW DOCUMENT
  async create(document) {
    await this.init();
    const newDocument = { id: v4(), ...document };
    this.data.push(newDocument);
    await this.save();
    return newDocument;
  }

  async updateOne(query, update) {
    await this.init();

    // FLAG
    let updatedItem;

    this.data = this.data.map((doc) => {
      if (Object.keys(query).every((key) => doc[key] === query[key])) {
        updatedItem = { ...doc, ...update };
        return updatedItem;
      } else {
        return doc;
      }
    });

    if (updatedItem) {
      await this.save();
      return updatedItem;
    } else {
      throw Error("Document Not Found");
    }
  }

  async delete(query) {
    await this.init();
    const initialLength = this.data.length;
    this.data = this.data.filter((item) => {
      return !Object.keys(query).every((key) => item[key] === query[key]);
    });
    await this.save();
    return initialLength - this.data.length;
  }
}

const User = new JsonStore("users.json");
const Book = new JsonStore("books.json");

module.exports = { User, Book };
