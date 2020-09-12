const express = require('express')
const passport = require('passport')
const router = express.Router()

router.get('/login', (req, res) => {
    res.send("test login")
})

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
        session: true
    })
)

module.exports = router

