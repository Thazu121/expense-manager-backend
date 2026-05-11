const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500

    const isDev = process.env.NODE_ENV === "development"

    console.error(err.stack)

    res.status(statusCode).json({
        success: false,
        message: isDev ? err.message : "Server Error",
        stack: isDev ? err.stack : undefined
    })
};

export default errorHandler
