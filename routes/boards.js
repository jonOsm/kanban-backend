var express = require('express');
var { query } = require('../db');
var router = express.Router();


/* GET users listing. */
//do we need to be adding next here? why are we passing "err"?

router.get('/', function (req, res, next) {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized"); //can we just return here? or should we be using "next"?
   
    query("select * from board;", null, (err, dbRes) => {
        if (err) return next(err)
        res.send({boards: dbRes.rows})
    });

});

router.get('/u/:user_id', function(req, res) {
    res.send("todo")
})

module.exports = router;