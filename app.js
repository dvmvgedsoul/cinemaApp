const express = require('express'),
    mongoose = require('mongoose'),
    User = require('./models/user'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    cookieParser = require('cookie-parser'),
    connectFlash = require('connect-flash'),
    path = require('path');


mongoose.connect("mongodb://localhost:27017/cinema", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(() => console.log('connection to DB successful'))
    .catch(err => console.log(err));

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(require('express-session')({
    secret: 'victoria',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 400000}
}));

passport.use(User.createStrategy());
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(connectFlash());

app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.isauth = req.isAuthenticated();
    next();
})

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/cinema'));
app.use('/movie', require('./routes/movie'));

app.listen(3000, () => {
    console.log('Server starting on port 3000');
})