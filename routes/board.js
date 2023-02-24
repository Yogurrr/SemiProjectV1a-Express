const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
const ppg = 15;


// 페이징 기능 지원
// 현재 페이지를 의미하는 변수는 : cpg
// 현재 페이지에 해당하는 게시물들을 조회하려면 해당범위의 시작값과 종료값 계산
// cpg : 1 => 1 ~ 5
// cpg : 2 => 6 ~ 10
// cpg : 3 => 11 ~ 15
// 페이지당 게시물 수 ppg : 5
// stnum : (cpg - 1) * ppg + 1
// ednum : stnum + ppg
router.get('/list', async (req, res) => {
    let { cpg } = req.query;
    cpg = cpg ? parseInt(cpg) : 1;
    let stnum = (cpg - 1) * ppg + 1;   // 지정한 페이지 범위의 시작값

    let result = new Board().select(stnum).then((result) => result);
    let bds = result.then(r => r.bds);
    let allcnt = result.then(r => r.allcnt);   // 총 게시물 수
    let alpg = Math.ceil( await allcnt / ppg);   // 총 페이지 수

    // 페이지네이션 블록 생성
    // 1 페이지의 페이지네이션 : 1 2 3 4 5 6 7 8 9 10
    // 2 페이지의 페이지네이션 : 1 2 3 4 5 6 7 8 9 10
    // ...
    // 10 페이지의 페이지네이션 : 1 2 3 4 5 6 7 8 9 10

    // 11 페이지의 페이지네이션 : 11 12 13 14 15 16 17 18 19 20
    // ...
    // 15 페이지의 페이지네이션 : 11 12 13 14 15 16 17 18 19 20
    // ...
    // 21 페이지의 페이지네이션 : 21 22 23 24 25 26 27 28 29 30
    let stpgn = parseInt((cpg - 1) / 10) * 10 + 1   // 페이지네이션 시작값
    let stpgns = [];
    for (let i = stpgn; i < stpgn + 10; ++i) {
        if (i <= alpg) {
            let iscpg = (i === cpg);   // 현재 페이지 표시
            let pgn = {'num': i, 'iscpg': iscpg}
            stpgns.push(pgn);
        }
    }

    let isprev = (cpg - 1 > 0);   // 이전 버튼 표시 여부 지정
    let isnext = (cpg < alpg);   // 다음 버튼 표시 여부 지정
    let isprev10 = (cpg - 1 >= 10);   // (cpg - 10 > 0)
    let isnext10 = (cpg <= alpg - 10);   // (cpg + 10 < alpg)
    let pgn = {'prev': cpg - 1, 'next': cpg + 1,   // 이전 : 현재 페이지 - 1, 다음 : 현재 페이지 + 1
        'isprev': isprev, 'isnext': isnext,
        'prev10': cpg - 10, 'next10': cpg + 10,
        'isprev10': isprev10, 'isnext10': isnext10};
    // 10 해서 안 되면 '9 + 1' 하기

    console.log(cpg, stnum, stpgn, alpg, isnext);

    res.render('board/list', {title: '게시판 목록', bds: await bds, stpgns: stpgns, pgn: pgn});
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

router.get('/update', async (req, res) => {
    let { bno2, uid } = req.query;
    let suid = req.session.userid;

    if (uid && suid && (uid === suid)) {
        let bds = new Board().selectOne(bno2).then(bds => bds);
        res.render('board/update', {title: '게시판 수정하기', bds: await bds});
    } else {
        res.redirect(303, '/board/list');
    }
});

router.post('/update', async (req, res) => {
    let { title, uid, contents } = req.body;
    let bno2 = req.query.bno2;
    let suid = req.session.userid;

    if (uid && suid && (uid === suid)) {
        new Board(bno2, title, uid, 0, contents, 0).update().then(cnt => cnt);
        res.redirect(303, `/board/view?bno2=${bno2}`)
    } else {
        res.redirect(303, '/board/list');
    }
});

module.exports = router;