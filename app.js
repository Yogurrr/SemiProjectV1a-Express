// express 모듈과 기타 미들웨어 모듈 사용 선언
const express = require('express');
const path = require('path');
const logger = require('morgan');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const oracledb = require('./models/Oracle');

// 라우팅 모듈 설정
const indexRouter = require('./routes/index')
const memberRouter = require('./routes/member')
const boardRouter = require('./routes/board')
// const {static} = require("express");

// express 객체 생성 및 포트 변수 선언
const app = express();
const port = process.env.PORT || 3000;

// 템플릿 엔진 등록 및 설정
app.engine('hbs', engine({
    extname: '.hbs', defaultLayout: 'layout',
    helpers: {
        section: function(name, options) {
            if(!this._sections) this._sections = {}
            this._sections[name] = options.fn(this)
            return null
        },
    },
}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// 라우팅 없이 바로 호출 가능하도록 static 폴더 설정
app.use(express.static(path.join(__dirname, 'static')));

// 서버 작동 현황 표시 - 로그 출력
app.use(logger('dev'));

// 미들웨어 관련 설정
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

oracledb.initConn();

// 라우팅 모듈 등록 - 클라이언트 요청 처리 핵심 파트
// 정상 처리일 때
app.use('/', indexRouter);
app.use('/member', memberRouter);
app.use('/board', boardRouter);

// 404, 500 응답코드에 대한 라우팅 처리 정의
// 비정상 처리일 때(오류 발생)
app.use((req, res) => {
    res.status(404);
    // res.send('404 - 페이지가 없습니다!');
    res.sendFile(path.join(__dirname, 'public', '404.html'));
});
app.use((err, req, res, next) => {
    console.log(err);   // 오류 메시지 출력
    res.status(500);
    // res.send('500 - 서버 내부 오류가 발생했습니다!')
    res.sendFile(path.join(__dirname, 'public', '500.html'));
});

// 위에서 설정한 사항들을 토대로 express 서버 실행
app.listen(port, () => {
    console.log('SemiProjectV1 서버 실행 중...');
});