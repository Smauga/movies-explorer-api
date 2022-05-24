const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const EmailError = require('../errors/EmailError');
const DataError = require('../errors/DataError');

const { NODE_ENV, JWT_SECRET } = process.env;

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

const updateMe = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => new NotFoundError('Пользователь не существует'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') next(new DataError('Некорректные данные'));
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
          if (err.code === 11000) next(new EmailError('Некорректный e-mail'));
          if (err.name === 'ValidationError' || err.name === 'CastError') next(new DataError('Некорректные данные'));
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
        httpOnly: true
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
  .then(() => res.clearCookie('jwt').end())
  .catch(next);
};

module.exports = { getMe, updateMe, createUser, login, logout };