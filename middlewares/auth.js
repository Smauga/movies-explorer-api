const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  try {
    const jwtSecret = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
    const token = req.cookies.jwt;

    if(!token) throw new UnauthorizedError('Необходима авторизация');

    let payload;

    try {
      payload = jwt.verify(token, jwtSecret);
    } catch (err) {
      throw new UnauthorizedError('Необходима авторизация');
    }

    req.user = payload;
    return next();
  } catch (err) {
    return next(err);
  }
};
