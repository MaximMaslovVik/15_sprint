const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const NotFoundError = require('../errors/error_not_found');
const Error500 = require('../errors/500');

const User = require('../models/user');

const { JWT_SECRET } = require('../secret.js');

// отправим токен, браузер сохранит его в куках

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((user) => {
      if (user.length === 0) {
        return res.status(404).send({ message: 'База данных user пуста! ' });
      }
      return res.send({ data: user });
    })
    .catch((new Error500('На сервере произошла ошибка')));
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (password.length > 11) {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name, about, avatar, email, password: hash,
      }))
      .then((user) => res.send({ data: user.omitPrivate() }))
      .catch((new Error500('Не удалось создать пользователя')));
  } else {
    throw new Error500({ message: 'Слишком короткий пароль!' });
  }
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((userId) => {
      if (!userId) {
        throw new NotFoundError({ message: 'Такого пользователя нет' });
      } else {
        res.send({ userId });
      }
    })
    .catch((new Error500('Нет пользователя с таким id')));
};

module.exports.login = (req, res) => {
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
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
