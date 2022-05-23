const express = require('express');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/moviesdb');



app.use((req, res, next) => next(new NotFoundError('Адрес не существует')));

app.listen(PORT);