const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { handleError } = require('./errors/handleError');
const { login, logout, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const cors = require('./middlewares/cors');
const NotFoundError = require('./errors/NotFoundError');
require('dotenv').config();

const { PORT = 3000, NODE_ENV, DATABASE } = process.env;
const dataBase = NODE_ENV === 'production' ? DATABASE : 'dev-secret';

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(dataBase);

app.use(requestLogger);
app.use(cors);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.use(auth);

app.post('/signout', logout);
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));
app.use((req, res, next) => next(new NotFoundError('Адрес не существует')));

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  handleError(err, req, res, next);
});

app.listen(PORT);