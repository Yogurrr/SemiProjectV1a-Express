const oracledb = require('../models/Oracle');

let membersql = {
    insertsql : 'insert into member (mno, userid, passwd, name, email) values (mno.nextval, :1, :2, :3, :4)',
    loginsql : `select count(userid) cnt from member where userid = :1 and passwd = :2`,
    selectOne : `select member.*, to_char(regdate, 'YYYY-MM-DD HH24:MI:SS') regdate2 from member where userid = :1`,
}

class Members {
    // 생성자 정의 - 변수 초기화
    // 즉, 매개변수로 전달된 값을 클래스 멤버 변수에 대입함
    constructor(userid, passwd, name, email) {
        this.userid = userid;
        this.passwd = passwd;
        this.name = name;
        this.email = email;
    }

    // 회원 정보 저장
    async insert() {
        let conn = null;
        let params = [this.userid, this.passwd, this.name, this.email];
        let insertcnt = 0;

        try {
            conn = await oracledb.makeConn();
            let result = await conn.execute(membersql.insertsql, params);
            await conn.commit();
            if (result.rowsAffected > 0) insertcnt = result.rowsAffected;
            console.log(result);
        } catch (e) {
            console.log(e);
        } finally {
            await oracledb.closeConn(conn);
        }

        return insertcnt;
    }

    async login(uid, pwd) {   // 로그인 처리
        let conn = null;
        let params = [uid, pwd];
        let isLogin = 0;

        try {
            conn = await oracledb.makeConn();
            let result = await conn.execute(membersql.loginsql, params, oracledb.options);
            let rs = result.resultSet;

            let row = null;
            while(row = await rs.getRow()) {
                isLogin = row.CNT;
            }

        } catch (e) {
            console.log(e);
        } finally {
            await oracledb.closeConn();
        }

        return isLogin;
    }

    async selectOne(uid) {   // 아이디로 검색된 회원의 모든 정보 조회
        let conn = null;
        let params = [uid];
        let members = [];

        try {
            conn = await oracledb.makeConn();
            let result = await conn.execute(membersql.selectOne, params, oracledb.options);
            let rs = result.resultSet;

            let row = null;
            while(row = await rs.getRow()) {
                let m = new Members(row.USERID, '', row.NAME, row.EMAIL);
                m.regdate = row.REGDATE2;
                members.push(m);
            }

        } catch (e) {
            console.log(e);
        } finally {
            await oracledb.closeConn();
        }

        return members;
    }
}

module.exports = Members;