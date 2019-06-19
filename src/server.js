const express = require('express');
const app = express();
const path = require('path');
const handlebards = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

// settings
app.set('port', process.env.PORT || 3000);
require('./database');
require('./config/passport');

app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', handlebards({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}));

app.set('view engine', '.hbs')

// middlewares
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'notesApp',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// global variables
app.use((req, res, next) =>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// routes
app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/notes'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

//server init
app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`);
});