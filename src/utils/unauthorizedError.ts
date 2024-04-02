import { UNAUTHORIZED_ERROR } from '../constants/error';

export default class UnauthorizedError extends Error {
  public statusCode;

  constructor(message: string) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR;
  }
}
