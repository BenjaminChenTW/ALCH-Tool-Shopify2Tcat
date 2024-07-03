export default class TransformError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, TransformError.prototype);
    this.name = "TransformError";
  }
}
