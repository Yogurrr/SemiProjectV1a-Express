const express = require('express');
const router = express.Router();
const path = require('path');
const Member = require('../models/Members')


router.get('/', (req, res) => {
    res.render('index', {title: '첫 화면'});
});

/*router.get('/member',(req, res) => {
    res.render('member', {title: '회원 테이블'});
});

router.post('/member',(req, res, next) => {
    // 폼으로 전송된 데이터들은 req.body, req.body.폼이름 등으로 확인 가능
    // console.log(req.body);
    // console.log(req.body.name, req.body.kor, req.body.eng, req.body.mat);

    let {userid, passwd, name, email} = req.body;
    console.log(userid, passwd, name, email);

    // 데이터베이스 처리 - sungjuk 테이블에 insert
    // 한 번 만든 다음에 다시 실행하면 이미 존재하고 있어서 오류 뜸
    new Member(userid, passwd, name, email).insert();

    res.redirect(304, '/');
});*/

module.exports = router;