//require app 
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const db = require('./db/db');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const flash = require('connect-flash');
const tradesRoutes = require('./routes/tradesRoutes'); 
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();

let PORT= 4200;
let host='localhost';
app.set('view engine','ejs');

//mount middleware
app.use(
    session({
        secret: "asdasdgfdgdfg545678769ghdfhfdadad",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/Trading_App'}),
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());
app.use((req, res, next) => {
    res.locals.user = req.session.user||null;
    res.locals.firstName = req.session.firstName||null;
    res.locals.lastName = req.session.lastName||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

//General Site navigation's - home page, about, contact , sign In and Signup 
app.use('/', mainRoutes); // home page
app.use('/trades', tradesRoutes); 
app.use('/users',userRoutes);

//404 error handler
app.use((req,res, next) => {
    let err = new Error('The Server Cannot locate' + req.url);
    err.status=404;
    next(err);
});


// 500 error handler
app.use((err, req, res, next)=> {
    console.log(err.stack);
    if (!err.status){
        err.status = 500;
        err.message=("Internal server error");
    }
    res.status(err.status);
    res.render('error', {error:err});
});

//start the server

//Connect db
db().then(() => {

    app.listen(PORT, host, () => {
        console.log('The server is running at port', PORT);
    });

}).catch((err) => {
    console.log("got an error " + err);
});

