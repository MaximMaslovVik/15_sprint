const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const express = require('express');

const { JWT_SECRET } = require('../secret.js');

const app = express();
app.use(cookieParser());

function errorStatus(res) {
  return res
    .status(401)
    .send({ message: 'Доступ запрещен. Необходима авторизация' });
}

module.exports = (req, res, next) => {
  const cookie = req.cookies.jwt;

  if (!cookie) {
    errorStatus(res);
  }

  let payload;

  try {
    payload = jwt.verify(cookie, JWT_SECRET);
    req.user = payload;
  } catch (err) {
    errorStatus(res);
  }

  next();
};
