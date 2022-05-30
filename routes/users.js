const router = require('express').Router();
const { validateUpdateMe } = require('../utils/validators');
const { getMe, updateMe } = require('../controllers/users');

router.get('/me', getMe);
router.patch('/me', validateUpdateMe(), updateMe);

module.exports = router;
