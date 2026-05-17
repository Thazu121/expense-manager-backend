import jwt from "jsonwebtoken";

const authMiddleware = (
  req,
  res,
  next
) => {
  try {

    const authHeader =
      req.headers.authorization;


    if (
      !authHeader ||
      !authHeader.startsWith(
        "Bearer "
      )
    ) {
      return res.status(401).json({
        success: false,

        message:
          "Unauthorized. No token provided",
      });
    }


    const token =
      authHeader.split(" ")[1];


    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,

        message:
          "JWT secret missing",
      })
    }


    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    req.user = decoded;

    next()

  } catch (error) {


    if (
      error.name ===
      "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,

        message:
          "Token expired",
      })
    }


    return res.status(401).json({
      success: false,

      message:
        "Invalid token",
    })
  }
}

export default authMiddleware