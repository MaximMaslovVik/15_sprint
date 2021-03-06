const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const Error401 = require('../errors/error_Auth');
const Error409 = require('../errors/error_409');

const validate = /^(https|http)?:\/\/(www.)?[^-_.\s](\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3})?(:\d+)?(.+[#a-zA-Z/:0-9]{1,})?\.(.+[#a-zA-Z/:0-9]{1,})?$/i;

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
    match: validate,
    isUrlValid: true,
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
        return Promise.reject(new Error401('Неправильная почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error401('Неправильная почта или пароль'));
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

function duplicateErrorHandleMiddleware(error, res, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error409('Пользователь с таким email уже есть'));
  } else {
    next();
  }
}

userSchema.post('save', duplicateErrorHandleMiddleware);
userSchema.post('update', duplicateErrorHandleMiddleware);
userSchema.post('findOneAndUpdate', duplicateErrorHandleMiddleware);
userSchema.post('insertMany', duplicateErrorHandleMiddleware);

module.exports = mongoose.model('user', userSchema);
