import { FORBIDDEN_ERROR } from '../constants/error';

export default class ForbiddenError extends Error {
  public statusCode;

  constructor(message: string) {
    super(message);
    this.statusCode = FORBIDDEN_ERROR;
  }
}
