const mongoose = require('mongoose');
const Card = require('../models/card');

const { ObjectId } = mongoose.Types;

const NotFoundError = require('../errors/error_not_found');
const Error500 = require('../errors/500');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((card) => {
      if (card.length === 0) {
        throw new NotFoundError('База данных карточек пуста!');
      }
      return res.send({ data: card });
    })
    .catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Не удается создать карточку' }));
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  if (!ObjectId.isValid(cardId)) {
    return res.status(404).send({ message: 'not found' });
  }
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card) {
        if (card.owner.toString() === req.user._id) {
          Card.findByIdAndRemove(req.params.cardId)
            .then((cardRemove) => res.send({ remove: cardRemove }))
            .catch(next);
        } else {
          next(new NotFoundError('Это не ваша карта, не может быть удалена'));
        }
      } else {
        next(new NotFoundError('Карта не найдена'));
      }
    })
    .catch(next(new Error500('На сервере произошла ошибка')));
};
