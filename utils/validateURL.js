const { isURL } = require('validator');
const BadRequestError = require('../errors/BadRequestError');
const { badUrlMessage } = require('./constants');

const validateURL = (value) => {
  if (!isURL(value, { require_protocol: true })) {
    throw new BadRequestError(badUrlMessage);
  }
  return value;
};

module.exports = { validateURL };
