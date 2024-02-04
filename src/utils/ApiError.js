class ApiError extends Error {
  constructor (
    statusCode,
    message = "Something went wrong",
    stack = "",
    errors = []
  ) {
    //overriding the constructor of Error class
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.errors = errors;
    this.message = message;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
