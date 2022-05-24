const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, logout, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { notFoundAddressMessage } = require('../utils/constants');
const userRouter = require('./users');
const movieRouter = require('./movies');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

router.use(auth);

router.post('/signout', logout);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use((req, res, next) => next(new NotFoundError(notFoundAddressMessage)));

module.exports = router;