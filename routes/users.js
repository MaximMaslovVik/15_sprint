const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getAllUsers, getUser } = require('../controllers/users');

router.get('/users', getAllUsers);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUser);

module.exports = router;
