const { isURL } = require('validator');
const BadRequestError = require('../errors/BadRequestError');

const validateURL = (value) => {
  if (!isURL(value, { require_protocol: true })) {
    throw new BadRequestError('Неправильный формат ссылки');
  }
  return value;
};

module.exports = { validateURL };
