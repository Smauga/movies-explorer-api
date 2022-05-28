const { isURL } = require('validator');
const { celebrate, Joi } = require('celebrate');
const BadRequestError = require('../errors/BadRequestError');
const { badUrlMessage } = require('./constants');

const validateURL = (value) => {
  if (!isURL(value, { require_protocol: true })) {
    throw new BadRequestError(badUrlMessage);
  }
  return value;
};

const validateSignin = () => celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateSignup = () => celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const validateCreateMovie = () => celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(validateURL, 'validation url'),
    trailerLink: Joi.string().custom(validateURL, 'validation url'),
    thumbnail: Joi.string().custom(validateURL, 'validation url'),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateDeleteMovie = () => celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
})

const validateUpdateMe = () => celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
});

module.exports = { validateURL, validateSignin, validateSignup, validateCreateMovie, validateDeleteMovie, validateUpdateMe };
