//check if the route parameter is valid ObjectId type value
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