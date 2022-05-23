const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    unique: true,
    validate: {
      validator(v) {
        return isEmail(v);
      },
      message: 'Некорректный e-mail',
    },
  },
  password: {
    select: false,
    type: String,
    required: true,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
