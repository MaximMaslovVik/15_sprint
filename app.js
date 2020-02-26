const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const { PORT } = require('./secret');

const users = require('./routes/users');
const cards = require('./routes/cards');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cookieParser());

app.use(requestLogger);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2),
  }),
}), createUser);

app.post('/signin', login);

app.use(auth);
app.use('/', users);
app.use('/', cards);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Что то пошло не так, загрузка сервера  прервана');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.all('/*', (req, res) => res.status(404).send({ message: 'Запрашиваемый ресурс не найден' }));

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({ message: err.message });
  next();
});

app.use(errorLogger);
app.use(errors());

app.listen(PORT, () => {});
