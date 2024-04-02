import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUsers, getUserById, updateUser, updateUserAvatar, getCurrentUser,
} from '../controllers/users';
import { validateUrl } from '../constants/validation';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/me', getCurrentUser);

userRouter.get('/:userId', getUserById, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
}));

userRouter.patch('/me', updateUser, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }),
}));

userRouter.patch('/me/avatar', updateUserAvatar, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(validateUrl),
  }),
}));

export default userRouter;
