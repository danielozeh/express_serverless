var createError = require('http-errors');
  routes = require('./routes/api')
  express = require('express'),
  path = require('path'),
  dotenv = require('dotenv').config(),
  exphbs = require('express-handlebars'),
module.exports = function (app) {
  app.engine('.hbs', exphbs.create({
    defaultlayout: 'main',
    layoutsDir: path.join(__dirname, './views/layouts'),
    partialsDir: path.join(__dirname, './views/partials'),
    helpers: { timeago: () => dayjs(new Date().toString()).fromNow()},
    extname: '.hbs',
  }).engine);
  app.set('view engine', 'hbs');
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  app.use(function(req,res,next){
    app.locals.isLoggedIn = req.session.user ? true : false
    next();
})
  app.use(routes)
  app.use('/public/', express.static(path.join(__dirname, './public')));
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });
  // error handler
  app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
    });
    return app;
};