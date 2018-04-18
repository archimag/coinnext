(function() {
  var AuthStats, JsonRenderer, User, UserToken, reCaptcha;

  reCaptcha = require("recaptcha-async");

  User = GLOBAL.db.User;

  UserToken = GLOBAL.db.UserToken;

  AuthStats = GLOBAL.db.AuthStats;

  JsonRenderer = require("../lib/json_renderer");

  var env = {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CALLBACK_URL:
      process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
  };


  module.exports = function(app) {

    app.get('/login', passport.authenticate('auth0', {
      clientID: env.AUTH0_CLIENT_ID,
      domain: env.AUTH0_DOMAIN,
      redirectUri: env.AUTH0_CALLBACK_URL,
      responseType: 'code',
      audience: 'https://' + env.AUTH0_DOMAIN + '/userinfo',
      scope: 'openid profile email'}),
      function(req, res) {
          res.redirect("/");
    });

    app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    });

    app.get( '/callback', passport.authenticate('auth0', {failureRedirect: '/failure'}), function(req, res, next) {
        res.redirect(req.session.returnTo || '/');
    });

    app.get('/failure', function(req, res) {
      var error = req.flash("error");
      var error_description = req.flash("error_description");
      req.logout();
      res.render('failure', {
        error: error[0],
        error_description: error_description[0],
      });
    });
  };

}).call(this);
