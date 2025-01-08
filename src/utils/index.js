const fs = require("fs");
const path = require("path");

function getFilePath(directory, filename) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  return path.join(directory, filename);
}

module.exports = { getFilePath };
