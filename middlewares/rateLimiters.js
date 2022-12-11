const rateLimit = require('express-rate-limit');

exports.logInLimiter = rateLimit({
    windowMs : 60*1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler : (req, res, next) => {
        let err = new Error('Too many Login requests. Try again later');
        err.status = 429; 
        return next(err);
    }
});
