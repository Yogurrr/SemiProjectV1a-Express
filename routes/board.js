const express = require('express');
const router = express.Router();
const path = require('path');
const Board = require('../models/Board');

router.get('/list', async (req, res) => {
    let bds = new Board().select().then((bds) => bds);
    // console.log(await bds);

    res.render('board/list', {title: '게시판 목록', bds: await bds});
});

router.get('/write', (req, res) => {
    if (req.session.userid) {   // 세션 변수 userid가 존재한다면
        res.render('board/write', {title: '게시판 새글쓰기'});
    } else {
        res.redirect(303, '/member/login');
    }
    // res.render('board/write', {title: '게시판 새글쓰기'});
});

router.post('/write', async (req, res) => {
    let viewName = '/board/failWrite';
    let { title, uid, contents } = req.body;

    let rowcnt = new Board(null, title, uid, null, contents, null).insert()
        .then((result) => result);

    if (await rowcnt > 0) viewName = '/board/list';

    res.redirect(303, viewName);
});

router.get('/view', async (req, res) => {
    let bno2 = req.query.bno2;

    let bds = new Board().selectOne(bno2).then((bds) => bds);

    res.render('board/view', {title: '게시판 본문 보기', bds: await bds});
});

router.get('/delete', async (req, res) => {
    let { bno2, uid } = req.query;
    let suid = req.session.userid;

    if(suid && uid && (suid === uid)) {   // 글 작성자와 삭제자가 일치하는 경우
        new Board().delete(bno2).then(cnt => cnt);
    }

    res.redirect(303, '/board/list');
});

router.get('/update', (req, res) => {
    // res.sendFile(path.join(__dirname, '../public', 'update.html'));
    res.render('update', {title: 'update'});
});

module.exports = router;