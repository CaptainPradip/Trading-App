//check if the route parameter is valid ObjectId type value
const {body,validationResult} = require('express-validator');

exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    if(id.match(/^[0-9a-fA-F]{24}$/)) {
        return next();
    } else {
        let err = new Error('Invalid id');
        err.status = 400;
        return next(err);
    }
};


exports.validateSignUpMiddleware = [body('firstName','First Name Should not be Empty' ).notEmpty().trim().escape(), 
body('lastName','Last name  Should not be Empty').notEmpty().trim().escape(),
body('email','Entered Email is not valid Email Address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 5 characters and at most 30 characters').isLength({min:5, max:30})
];

exports.validateLogInMiddleware = [body('email','Entered Email is not valid Email Address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 5 characters and at most 30 characters').isLength({min:5, max:30})];

exports.validateTrade = [body('title', 'Title  Should not be Empty!!!').notEmpty().trim().escape(),body('details', 'details Should not be Empty').notEmpty().trim().escape(),
body('details', 'details Must be at least 10 character!!!').trim().escape().isLength({min:10}),
body('price', 'price Must be not empty').notEmpty(),
body('price'," Price should not be less than 1").isFloat({ min: 1}),
];

exports.validateResultMiddleware = (req, res, next) =>{
    let errors = validationResult(req);
    if (!errors.isEmpty()){
        errors.array().forEach(error=>{
            req.flash ('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
}