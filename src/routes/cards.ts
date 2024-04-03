import { Router } from 'express';
import {
  getCards, createCard, deleteCard, addLikeCard, delLikeCard,
} from '../controllers/cards';
import { cardIdValidation, cardValidation } from '../constants/validation';

const cardRouter = Router();

cardRouter.get('/', getCards);

cardRouter.post('/', createCard, cardValidation);

cardRouter.delete('/:cardId', deleteCard, cardIdValidation);

cardRouter.put('/:cardId/likes', addLikeCard, cardIdValidation);

cardRouter.delete('/:cardId/likes', delLikeCard, cardIdValidation);

export default cardRouter;
