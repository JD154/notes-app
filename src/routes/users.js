const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/users/login', (req, res) => {
  res.render('users/login');
});

router.post('/users/login', passport.authenticate('local', {
  successRedirect: '/notes',
  failureRedirect: '/users/login',
  failureFlash: true
}));

router.get('/users/signup', (req, res) => {
  res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
  const {username, email, password, passwordRepeat} = req.body;
  const errors = [];

  if (password != passwordRepeat){
    errors.push({text: 'Password do not match'});
  }

  if (password.length < 4){
    errors.push({text: 'Password must have 8 characters'});
  }

  if (errors.length > 0){
    res.render('users/signup', {errors, username, email, password, passwordRepeat});
  }else{
    const emailUser = await User.findOne({email: email});

    if (emailUser){
      req.flash('error_msg', 'The email is already registered');
      res.redirect('/users/signup');
    }

    const newUser = new User({username, email, password});
    newUser.password = await newUser.encryptPassword(password);
    await newUser.save();
    req.flash('success_msg', 'Success registration!');
    res.redirect('/users/login');
  }
});

router.get('/users/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;