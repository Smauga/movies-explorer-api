const { serverErrorMessage } = require('../utils/constants');

const handleError = (err, req, res) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? serverErrorMessage
        : message,
    });
};

module.exports = { handleError };
