const express = require('express');
const passport = require('passport');
const router = express.Router();
const session = require('express-session');
require('../controllers/authController');
const bodyParser = require('body-parser');


function isLoggedIn(req,res,next){
    req.user ? next():res.sendStatus(401);
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/auth/google');
  }

//middlewares
router.use(bodyParser.json());
router.use(session({ secret: 'cats'}));
router.use(passport.initialize());
router.use(passport.session());

router.get('/users/login',(req,res)=>{
    res.send('<a href="/auth/google"> login with google </a>');
});

// Google OAuth login route
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google OAuth callback route
router.get('/auth/google/callback', 
    passport.authenticate('google', { 
        successRedirect:'/protected',
        failureRedirect: '/failure'}),
    
);

//successRedirect
router.get('/protected',isLoggedIn,(req,res)=>{
    res.send("Welcome to shiftStream");
});

//failureRedirect
router.get('/auth/failure',(req,res)=>{
    res.send("something went wrong");
});

module.exports = router;