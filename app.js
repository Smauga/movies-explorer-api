const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const { handleError } = require('./errors/handleError');
const { login, logout, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');
require('dotenv').config();

const { PORT = 3000 } = process.env;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/moviesdb');

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signout', logout);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));
app.use((req, res, next) => next(new NotFoundError('Адрес не существует')));

app.use(errors());

app.use((err, req, res, next) => {
  handleError(err, req, res, next);
});

app.listen(PORT);