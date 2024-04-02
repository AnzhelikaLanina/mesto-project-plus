import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getCards, createCard, deleteCard, addLikeCard, delLikeCard,
} from '../controllers/cards';
import { validateUrl } from '../constants/validation';

const cardRouter = Router();

cardRouter.get('/', getCards);

cardRouter.post('/', createCard, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(validateUrl).required(),
  }),
}));

cardRouter.delete('/:cardId', deleteCard, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}));

cardRouter.put('/:cardId/likes', addLikeCard, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}));

cardRouter.delete('/:cardId/likes', delLikeCard, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}));

export default cardRouter;
