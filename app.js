const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { handleError } = require('./errors/handleError');
const cors = require('./middlewares/cors');
const routes = require('./routes/index');

require('dotenv').config();

const { PORT = 3000, NODE_ENV, DATABASE } = process.env;
const dataBase = NODE_ENV === 'production' ? DATABASE : 'dev-secret';

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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