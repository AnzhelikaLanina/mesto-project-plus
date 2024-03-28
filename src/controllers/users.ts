import { Request, Response } from 'express';
import mongoose from 'mongoose';
import user from '../models/user';
import { BAD_REQUEST_ERROR, NOT_FOUND_ERROR, SERVER_ERROR } from '../constants/error';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await user.find({});
    return res.status(200).send(users);
  } catch (error) {
    return res.status(SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const userFind = await user.findById(req.params.userId);
    if (!userFind) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.status(200).send(userFind);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Передан некорректный _id для поиска пользователя' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;
    if (!name || !about || !avatar) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для создания пользователя' });
    }
    const newUser = await user.create({ name, about, avatar });
    return res.status(200).send(newUser);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для создания карточки' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

export const updateUser = async (req: any, res: Response) => {
  try {
    const { name, about } = req.body;
    if (!name || !about) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для изменения профиля пользователя' });
    }
    const newInfoUser = await user.findByIdAndUpdate(req.user._id, { name, about });
    return res.status(200).send(newInfoUser);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для изменения профиля пользователя' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

export const updateUserAvatar = async (req: any, res: Response) => {
  try {
    const { avatar } = req.body;
    if (!avatar) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для изменения аватара пользователя' });
    }
    const newAvatarUser = await user.findByIdAndUpdate(req.user._id, { avatar });
    return res.status(200).send(newAvatarUser);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные для изменения аватара пользователя' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};
