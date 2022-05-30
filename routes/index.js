const router = require('express').Router();
const { validateSignin, validateSignup } = require('../utils/validators');
const { login, logout, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { notFoundAddressMessage } = require('../utils/constants');
const userRouter = require('./users');
const movieRouter = require('./movies');

router.post('/signin', validateSignin(), login);
router.post('/signup', validateSignup(), createUser);

router.use(auth);

router.post('/signout', logout);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use((req, res, next) => next(new NotFoundError(notFoundAddressMessage)));

module.exports = router;
