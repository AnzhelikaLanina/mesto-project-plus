import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import user from '../models/user';
import BadRequestError from '../utils/badRequestError';
import NotFoundError from '../utils/notFoundError';
import ConflictError from '../utils/conflictError';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await user.find({});
    return res.send(users);
  } catch (error) {
    return next(error);
  }
};

const findUser = async (req: Request, res: Response, next: NextFunction, id: string) => {
  const userFind = await user.findById(id);
  if (!userFind) {
    throw new NotFoundError('Пользователь по указанному _id не найден');
  }
  return res.status(200).send(userFind);
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return findUser(req, res, next, req.params.userId);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Передан некорректный _id для поиска пользователя'));
    }
    return next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newUser = await user.create({
      name, about, avatar, email, password: hash,
    });
    return res.status(201).send(newUser);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('E11000')) {
      return next(new ConflictError('Пользователь с такими данными уже существует'));
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные для создания карточки'));
    }
    return next(error);
  }
};

const updateInfo = async (req: any, res: Response, next: NextFunction, info: any) => {
  const newInfoUser = await user.findByIdAndUpdate(
    req.user._id,
    info,
    { new: true, runValidators: true },
  );
  return res.status(200).send(newInfoUser);
};

export const updateUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    return updateInfo(req, res, next, { name, about });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные для изменения профиля пользователя'));
    }
    return next(error);
  }
};

export const updateUserAvatar = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    return updateInfo(req, res, next, { avatar });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные для изменения аватара пользователя'));
    }
    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const userLogin = await user.findUserByCredentials(email, password);
    const token = Jwt.sign({ _id: userLogin._id }, 'some-secret-key', { expiresIn: '7d' });
    return res.status(200).send(token);
  } catch (error) {
    return next(error);
  }
};

export const getCurrentUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    return findUser(req, res, next, req.user._id);
  } catch (error) {
    return next(error);
  }
};
