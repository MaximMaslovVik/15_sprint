const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const { getAllCards, createCard, deleteCard } = require('../controllers/cards');

router.get('/cards', getAllCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2),
    link: Joi.string().required(),
    owner: Joi.string().required(),
    likes: Joi.array().required(),
    createdAt: Joi.string().required(),
  }),
}), createCard);

router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

module.exports = router;
