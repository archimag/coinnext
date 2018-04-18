(function() {
  var User;

  var Auth0Strategy = require('passport-auth0');

  User = GLOBAL.db.User;

  passport.use("auth0", new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL:
        process.env.AUTH0_CALLBACK_URL || `http://localhost:${process.env.PORT || 5000}/callback`
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
      // accessToken is the token to call Auth0 API (not needed in the most cases)
      // extraParams.id_token has the JSON Web Token
      // profile has all the information from the user

        let email = profile.emails[0].value,
            username = User.generateUsername(email),
            user;

        User.findByUsername(username).then(function(account) {
            if (!account) {
                return User.create({
                    username: username,
                    email: profile.emails[0].value,
                    email_verified: true,
                    password: 'password111111111'
                }).then(function(account) {
                    user = account;
                });
            }
            else {
                user = account;
                return user;
            }
        })
        .then(function() {
            done(null, user);
        })
        .catch(function(err) {
            done(err);
        });
    }
  ));


  passport.serializeUser(function(user, done) {
      return done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
      return User.findById(id).then(function(user) {
          done(null, user);
      });
  });

}).call(this);
