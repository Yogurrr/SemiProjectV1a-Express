const express = require('express');
const router = express.Router();
const path = require('path');
const Member = require("../models/Members");

const html = 'text/html; charset=utf-8';

/*router.get('/join', (req, res) => {
    res.render('join', {title : '회원가입'});
});*/

router.get('/join',(req, res) => {
    res.render('join', {title: '회원가입'});
});

router.post('/join',(req, res, next) => {
    // 폼으로 전송된 데이터들은 req.body, req.body.폼이름 등으로 확인 가능
    // console.log(req.body);
    // console.log(req.body.name, req.body.kor, req.body.eng, req.body.mat);

    let {userid, passwd, name, email} = req.body;
    console.log(userid, passwd, name, email);

    // 데이터베이스 처리 - sungjuk 테이블에 insert
    // 한 번 만든 다음에 다시 실행하면 이미 존재하고 있어서 오류 뜸
    new Member(userid, passwd, name, email).insert();

    res.redirect(304, '/');
});

router.get('/login', (req, res) => {
    res.render('login', {title : '회원로그인'});
});

router.post('/login', async (req, res) => {
    let { uid, pwd } = req.body;
    let viewName = '/member/loginfail';

    let isLogin = new Member().login(uid, pwd).then(result => result);

    // console.log(await isLogin);
    if (await isLogin > 0) {
        viewName = '/member/myinfo';
        req.session.userid = uid;   // 아이디를 세션변수로 등록
    }

    res.redirect(303, viewName);
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => req.session );

    res.redirect(303, '/');
});

router.get('/myinfo', (req, res) => {
    res.render('myinfo', {title : '회원정보'});
});

module.exports = router;