const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const Error401 = require('../errors/error_Auth');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
    minlength: 8,
  },
  email: {
    type: String,
    validate: {
      validator: (valid) => isEmail(valid),
      message: 'Неверный формат почты',
    },
    required: true,
    unique: true,
  },
});

userSchema.statics.findUserByCredentials = function check(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error401('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error401('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

userSchema.methods.omitPrivate = function omitPrivate() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('user', userSchema);
