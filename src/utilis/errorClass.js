export default class AppError extends Error {
  constructor(massage, statusCode) {
    super(massage);
    this.statusCode = statusCode;
  }
}
