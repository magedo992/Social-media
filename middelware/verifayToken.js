const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../utils/ErrorHandler');

const verifyToken = (req, res, next) => {
    const header = req.headers.authorization || req.headers.Authorization;

    if (!header) {
        return next(new ErrorHandler("hello s", 401));
   
    
    }

    const token = header.split(' ')[1];

    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 402));
    }

    try {
        const currentUser = jwt.verify(token, process.env.jwt_secrit); 
        if (!currentUser) { 
            return next(new ErrorHandler("Invalid token", 401)); 
        }

        req.user = currentUser;
        next();

    } catch (err) {
        
        
        if (err instanceof jwt.TokenExpiredError) {
            return next(new ErrorHandler("Token expired. Please log in again.", 400));
        } else if (err instanceof jwt.JsonWebTokenError) {
            return next(new ErrorHandler("Invalid token...", 401));
        } else { 
           
           
            return next(new ErrorHandler("Internal server error", 500)); 
        }
    }
};

module.exports = verifyToken;