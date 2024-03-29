import express, { Request, Response } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { NOT_FOUND_ERROR } from './constants/error';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req: any, res: Response, next) => {
  req.user = {
    _id: '6603143465fa6c7ad0a8b31f',
  };
  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req: Request, res: Response) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Такой страницы не существует' });
});

app.listen(PORT);
