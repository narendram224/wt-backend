import { NODE_ENV } from '../config';
// import consoleLogger from '../config/consoleLogger';
// const logger = consoleLogger(module);

import { ErrorHandler } from '../Utills';

// eslint-disable-next-line no-unused-vars
export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 200;
    err.message = err.message || 'Internal server error';
    if (NODE_ENV === 'development') {
        console.error(
            `Status code:${err.statusCode} messgae: ${err.message} path: ${req.originalUrl}`
        );

        res.status(err.statusCode).json({
            success: false,
            error: err,
            stack: err.stack,
            message: err.message,
        });
    }
    if (NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message || 'Internal server error';
        // handle mongodb  Object id error
        if (err.name === 'CastError') {
            const message = `Resource not found .Invalid ${err.path}`;
            error = new ErrorHandler(message, 400);
        }
        // handling mongodb validation error

        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(
                (value) => value.message
            );
            error = new ErrorHandler(message, 400);
        }
        // handling mongoose duplicate key errors
        if (err.code === 11000) {
            const message = `Duplicate key '${Object.keys(
                err.keyValue
            )}' entered`;
            error = new ErrorHandler(message, 400);
        }
        // Handling wrong JWT errors
        if (err.name === 'JsonWebTokenError') {
            const message = 'Json web token is invalid Try again!!!';
            error = new ErrorHandler(message, 400);
        }
        // Handling wrong JWT errors
        if (err.name === 'TokenExpiredError') {
            const message = 'Json web token is expired!!!';
            error = new ErrorHandler(message, 400);
        }
        console.error(
            `Status code:${error.statusCode} messgae: ${error.message} path: ${req.originalUrl}`
        );

        res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }
};
