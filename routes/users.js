const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMe, updateMe } = require('../controllers/users');

router.get('/me', getMe);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), updateMe);

module.exports = router;
