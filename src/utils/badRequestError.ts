import { BAD_REQUEST_ERROR } from '../constants/error';

export default class BadRequestError extends Error {
  public statusCode;

  constructor(message: string) {
    super(message);
    this.statusCode = BAD_REQUEST_ERROR;
  }
}
