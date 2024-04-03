import { Router } from 'express';
import { createUser, login } from '../controllers/users';
import { userLoginValidation, userValidation } from '../constants/validation';
import auth from '../middlewares/auth';
import userRouter from './users';
import cardRouter from './cards';

const appRouter = Router();

appRouter.post('/signin', login, userLoginValidation);

appRouter.post('/signup', createUser, userValidation);

appRouter.use(auth);

appRouter.use('/users', userRouter);
appRouter.use('/cards', cardRouter);

export default appRouter;
