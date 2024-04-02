import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { celebrate, errors, Joi } from 'celebrate';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import error from './middlewares/error';
import { validateUrl } from './constants/validation';
import NotFoundError from './utils/notFoundError';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);

app.post('/signin', login, celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}));

app.post('/signup', createUser, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(validateUrl),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}));

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Такой страницы не существует'));
});

app.use(errorLogger);

app.use(errors());
app.use(error);

app.listen(PORT);
