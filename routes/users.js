const express = require('express');
const router = express.Router();
const {query} = require('../db');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', (req, res, next) => {
  let {username, password, email} = req.body;
  const saltRounds = 10; //REVIEW: Should we move this to a config?
  bcrypt.hash(password, saltRounds, (err, hash) => {
      query("select username from public.user where username = $1;", [username], (err, dbRes) => {
          if (err) throw next(err);
          if (dbRes.rows.length) return res.status(409).send("Username is unavailable.");

          query('insert into public.user (username, password, email) values ($1, $2, $3)',
          [username, hash, email],
          (err, dbRes) => {
              if (err) throw next(err); //REVIEW: How should we be handling errors in express? Anything specific for database errors?
              
              // res.status(200).send("User Created.") //REVIEW: Should we redirect? Should we somehow automatically authenticate?

            query("select id, username from public.user where username = $1;", [username], (err, dbRes) => {
              if (err) throw next(err);
              const user = dbRes.rows[0];
              req.login(user, function(err) {
                if (err) { return next(err); }
                return res.json({user})
              });
            });
          });
      });
  });
});

module.exports = router;
