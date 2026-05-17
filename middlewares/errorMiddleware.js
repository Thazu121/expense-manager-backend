const errorMiddleware = (
  error,
  req,
  res,
  next
) => {

  console.log(error);


  let statusCode =
    error.statusCode || 500;

  let message =
    error.message ||
    "Internal Server Error";



  if (error.name === "CastError") {
    statusCode = 400;

    message =
      "Invalid resource ID";
  }



  if (error.code === 11000) {
    statusCode = 400;

    const field =
      Object.keys(
        error.keyValue
      )[0];

    message =
      `${field} already exists`;
  }



  if (
    error.name ===
    "ValidationError"
  ) {
    statusCode = 400;

    message = Object.values(
      error.errors
    )
      .map((val) => val.message)
      .join(", ");
  }



  if (
    error.name ===
    "JsonWebTokenError"
  ) {
    statusCode = 401;

    message = "Invalid token";
  }



  if (
    error.name ===
    "TokenExpiredError"
  ) {
    statusCode = 401;

    message = "Token expired";
  }



  return res.status(statusCode).json({
    success: false,

    message,

    stack:
      process.env.NODE_ENV ===
      "development"
        ? error.stack
        : undefined,
  })
}

export default errorMiddleware;