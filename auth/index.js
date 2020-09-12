var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var db = require('../db')
var bcrypt = require('bcrypt')

passport.use(new LocalStrategy(
  function(username, password, done) {
    // User.findOne({ username: username }, function (err, user) {
    //   if (err) { return done(err); }
    //   if (!user) {
    //     return done(null, false, { message: 'Incorrect username.' });
    //   }
    //   if (!user.validPassword(password)) {
    //     return done(null, false, { message: 'Incorrect password.' });
    //   }
    //   return done(null, user);
    // });
    db.query("select id, username, password from public.user where username = $1",
      [username],
      (err, dbRes) => {
        if (err) return done(err);
        
        if (dbRes.rows.length === 0) {
          return done(null, false, {message: 'Username not found.'});
        }

        //compare plaintext password to hashed password
        let user = dbRes.rows[0];
        bcrypt.compare(password, user.password, (err, same) => {
          if (!same) return done(null, false, {message:'Invalid Password.'});

          delete user.password
          return done(null, user); 
        })
    });
  }
));

//TODO: Determine the purpose of passport.serializeUser
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//TODO: Determine the purpose of passport.serializeUser
passport.deserializeUser(function(id, done) {
  db.query("select id, username from public.user where id = $1", [id], (err, dbRes) => {
    if (err) return done(err);
    let user = dbRes.rows[0];
    done(err, user);
  })

  // User.findById(id, function(err, user) {
  //   done(err, user);
  // });
});


module.exports = passport