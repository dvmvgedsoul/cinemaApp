const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user'),
    {check, validationResult} = require('express-validator');

function notLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next();
}

function loggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

router.get('/register', notLoggedIn, (req, res) => {
    res.render('register', {message: undefined});
});

router.post('/register', notLoggedIn, [
        check('username').not().isEmpty().isLength({max: 32}),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('register', {message: 'username must be less then 32 characters'});
        }
        let user = new User({username: req.body.username});
        User.register(user, req.body.password, function (err, result) {
            if (err) {
                if (err.name === 'MongoError' && err.code === 11000) {
                    return res.render("register", {message: 'Username is already taken'});
                }
                req.flash("error", err.message);
                return res.render("register", {
                    message: req.flash('error')
                });
            }
            passport.authenticate("local")(req, res, function () {
                res.redirect("/personalPage");
            });
        });
    });

router.get('/login', notLoggedIn, (req, res) => {
    res.render('login', {message: req.flash('error')});
});

router.post('/login', notLoggedIn, passport.authenticate('local', {
    successRedirect: '/personalPage',
    failureRedirect: 'login',
    failureFlash: true
}), (req, res, next) => {
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;