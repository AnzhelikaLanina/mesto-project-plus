import { Router } from 'express';
import {
  getCards, createCard, deleteCard, addLikeCard, delLikeCard,
} from '../controllers/cards';

const cardRouter = Router();

cardRouter.get('/', getCards);

cardRouter.post('/', createCard);

cardRouter.delete('/:cardId', deleteCard);

cardRouter.put('/:cardId/likes', addLikeCard);

cardRouter.delete('/:cardId/likes', delLikeCard);

export default cardRouter;
