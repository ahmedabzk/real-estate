import jwt from 'jsonwebtoken';

import { errorHandler } from "../utils/error.js";

const verifyToken = (req, res, next) => {
    
    const token = req.cookies.access_token;
    
    if (!token) return next(errorHandler(401, 'nooo token'));
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) return next(403, 'Forbidden');

        req.user = user;
        next();
    })
}

export default verifyToken;