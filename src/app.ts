import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import { requestLogger, errorLogger } from './middlewares/logger';
import error from './middlewares/error';
import NotFoundError from './utils/notFoundError';
import appRouter from './routes';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);

app.use(appRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Такой страницы не существует'));
});

app.use(errorLogger);

app.use(errors());
app.use(error);

app.listen(PORT);
