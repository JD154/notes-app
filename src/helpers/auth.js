const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()){
    return next();
  } else {
    req.flash('error_msg', 'Please, log in to continue');
    res.redirect('/users/login');
  }
};

module.exports = helpers;