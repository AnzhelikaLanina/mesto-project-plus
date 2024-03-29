import { Request, Response } from 'express';
import mongoose from 'mongoose';
import card from '../models/card';
import { BAD_REQUEST_ERROR, NOT_FOUND_ERROR, SERVER_ERROR } from '../constants/error';

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await card.find({});
    return res.status(200).send(cards);
  } catch (error) {
    return res.status(SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

export const createCard = async (req: any, res: Response) => {
  try {
    const { name, link } = req.body;
    if (!name || !link) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для создания карточки' });
    }
    const owner = req.user._id;
    const newCard = card.create({ name, link, owner });
    return res.status(201).send(newCard);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для создания карточки' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const cardDel = card.findByIdAndDelete(req.params.cardId);
    if (!cardDel) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.status(200).send(cardDel);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для удаления карточки' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

export const addLikeCard = async (req: any, res: Response) => {
  try {
    const cardLike = await card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!cardLike) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.status(200).send(cardLike);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для постановки лайка' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

export const delLikeCard = async (req: any, res: Response) => {
  try {
    const cardDelLike = await card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!cardDelLike) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.status(200).send(cardDelLike);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для снятия лайка' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};
