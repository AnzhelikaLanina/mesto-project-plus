import { Request, Response, NextFunction } from 'express';
import { SERVER_ERROR } from '../constants/error';

export default (
  err: { statusCode: number, message: string },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { statusCode = SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === SERVER_ERROR
        ? 'Ошибка на стороне сервера'
        : message,
    });
  next();
};
