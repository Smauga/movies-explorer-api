const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

const updateMe = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => new NotFoundError('Пользователь не существует'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') next(new BadRequestError('Некорректные данные'));
      next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ name, email, password: hash })
        .then((user) => res.send(
          {
            name: user.name,
            email: user.email
          },
        ))
        .catch((err) => {
          if (err.code === 11000) next(new ConflictError('Пользователь с данным e-mail уже существует'));
          if (err.name === 'ValidationError' || err.name === 'CastError') next(new BadRequestError('Некорректные данные'));
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true
      })
      .send(
        {
          name: user.name,
          email: user.email
        },
      );
    })
    .catch(next);
};

const logout = (req, res, next) => {
  User.findById(req.user._id)
  .orFail(() => new NotFoundError('Пользователь не существует'))
  .then(() => res.clearCookie('jwt').send({ "message": "Выполнен выход из аккаунта" }))
  .catch(next);
};

module.exports = { getMe, updateMe, createUser, login, logout };