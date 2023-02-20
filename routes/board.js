const express = require('express');
const router = express.Router();
const path = require('path');
const Board = require('../models/Board');

router.get('/list', (req, res) => {
    res.render('board/list', {title: '게시판 목록'});
});

router.get('/write', (req, res) => {
    res.render('board/write', {title: '게시판 새글쓰기'});
});

router.post('/write', async (req, res) => {
    let viewName = '/board/failWrite';
    let { title, userid, contents } = req.body;

    let rowcnt = new Board(null, title, userid, null, contents, null).insert()
        .then((result) => result);

    if (await rowcnt > 0) viewName = '/board/list';

    res.redirect(303, viewName);
});

router.get('/view', (req, res) => {
    res.render('board/view', {title: '게시판 본문 보기'});
});

router.get('/delete', (req, res) => {
    // res.sendFile(path.join(__dirname, '../public', 'delete.html'));
    res.render('delete', {title: 'delete'});
});

router.get('/update', (req, res) => {
    // res.sendFile(path.join(__dirname, '../public', 'update.html'));
    res.render('update', {title: 'update'});
});

module.exports = router;