import { Router } from 'express';
import {
  getUsers, getUserById, updateUser, updateUserAvatar, getCurrentUser,
} from '../controllers/users';
import { userAvatarValidation, userIdValidation, userUpdateValidation } from '../constants/validation';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/me', getCurrentUser);

userRouter.get('/:userId', getUserById, userIdValidation);

userRouter.patch('/me', updateUser, userUpdateValidation);

userRouter.patch('/me/avatar', updateUserAvatar, userAvatarValidation);

export default userRouter;
