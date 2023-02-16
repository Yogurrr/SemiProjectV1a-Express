const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/join', (req, res) => {
    res.render('join', {title : '회원가입'});
});

router.get('/login', (req, res) => {
    res.render('login', {title : '회원로그인'});
});

router.get('/myinfo', (req, res) => {
    res.render('myinfo', {title : '회원정보'});
});

module.exports = router;