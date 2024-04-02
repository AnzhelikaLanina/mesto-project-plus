import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import card from '../models/card';
import BadRequestError from '../utils/badRequestError';
import NotFoundError from '../utils/notFoundError';
import ForbiddenError from '../utils/forbiddenError';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await card.find({});
    return res.status(200).send(cards);
  } catch (error) {
    return next(error);
  }
};

export const createCard = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const newCard = card.create({ name, link, owner });
    return res.status(201).send(newCard);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные для создания карточки'));
    }
    return next(error);
  }
};

export const deleteCard = async (req: any, res: Response, next: NextFunction) => {
  try {
    const cardDel = await card.findById(req.params.cardId);
    if (!cardDel) {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    }
    if (req.user._id !== cardDel.owner.toString()) {
      throw new ForbiddenError('Можно удалять только свои карточки');
    }
    await cardDel.deleteOne();
    return res.status(200).send(cardDel);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Переданы некорректные данные для удаления карточки'));
    }
    return next(error);
  }
};

export const addLikeCard = async (req: any, res: Response, next: NextFunction) => {
  try {
    const cardLike = await card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!cardLike) {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    }
    return res.status(200).send(cardLike);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
    }
    return next(error);
  }
};

export const delLikeCard = async (req: any, res: Response, next: NextFunction) => {
  try {
    const cardDelLike = await card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!cardDelLike) {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    }
    return res.status(200).send(cardDelLike);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
    }
    return next(error);
  }
};
