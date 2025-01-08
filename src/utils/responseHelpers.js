const sendData = (res, data, status = 200) => {
  return res.status(status).json({
    status: "success",
    data
  });
};

const sendError = (res, error, status = 400) => {
  return res.status(status).json({
    status: "error",
    error
  });
};

module.exports = { sendData, sendError };
