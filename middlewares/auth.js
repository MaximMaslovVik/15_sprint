const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const express = require('express');
/*
const { JWT_SECRET } = require('../secret.js');
const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
*/
const app = express();
app.use(cookieParser());

function errorStatus(res) {
  return res
    .status(401)
    .send({ message: 'Доступ запрещен. Необходима авторизация' });
}

module.exports = (req, res, next) => {
  const cookie = req.cookies.jwt;
  const JWT_SECRET = 'b24076852c7c534c77ce7b233022026ffc663393b557432496f2a70fa3756b33';
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
