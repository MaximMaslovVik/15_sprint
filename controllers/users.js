const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const NotFoundError = require('../errors/error_not_found');
const Error500 = require('../errors/error_500');
const Error401 = require('../errors/error_Auth');
const User = require('../models/user');

const { JWT_SECRET } = require('../secret.js');

// отправим токен, браузер сохранит его в куках

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      if (user.length === 0) {
        return (new NotFoundError({ message: 'База данных user пуста! ' }));
      }
      return res.send({ data: user });
    })
    .catch(next(new Error500('На сервере произошла ошибка')));
};
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (password.length > 11) {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name, about, avatar, email, password: hash,
      }))
      .then((user) => res.send({ data: user.omitPrivate() }))
      .catch(next(new Error500('Не удалось создать пользователя')));
  }
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((userId) => {
      if (!userId) {
        throw new NotFoundError({ message: 'Такого пользователя нет' });
      } else {
        res.send({ userId });
      }
    })
    .catch(next(new Error500('Нет пользователя с таким id')));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 604800000,
          httpOnly: true,
          sameSite: true,
        })
        .send(token)
        .end();
    })
    .catch(next(new Error401('Ошибка ввода')));
};
