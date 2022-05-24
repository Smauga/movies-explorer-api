const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { handleError } = require('./errors/handleError');
const limiter = require('./utils/rateLimiter');
const cors = require('./middlewares/cors');
const routes = require('./routes/index');

const app = express();
require('dotenv').config();

const { PORT = 3000, NODE_ENV, DATABASE } = process.env;
const dataBase = NODE_ENV === 'production' ? DATABASE : 'dev-secret';

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);

mongoose.connect(dataBase);

app.use(requestLogger);
app.use(cors);

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  handleError(err, req, res, next);
});

app.listen(PORT);
