class ApiError extends Error {
  constructor (
    statusCode,
    message = "Something went wrong",
    stack = "",
    errors = []
  ) {
    //The error.stack property is a string describing the point in the code at which the Error was instantiated.
    //overriding the constructor of Error class
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.errors = errors;
    this.message = message;
    this.success = false;

    if(stack){
        this.stack = stack;
    }
    else{
        Error.captureStackTrace(this, this.constructor);
    }
  }
}


export {ApiError}