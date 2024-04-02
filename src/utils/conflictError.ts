import { CONFLICT_ERROR } from '../constants/error';

export default class ConflictError extends Error {
  public statusCode;

  constructor(message: string) {
    super(message);
    this.statusCode = CONFLICT_ERROR;
  }
}
