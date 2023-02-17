const oracledb = require('../models/Oracle');

class Member {
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
        let sql = 'insert into member (mno, userid, passwd, name, email) values (mno.nextval, :1, :2, :3, :4)';
        let params = [this.userid, this.passwd, this.name, this.email];

        //
        try {
            conn = await oracledb.makeConn();
            let result = await conn.execute(sql, params);
            await conn.commit();
            console.log(result);
        } catch (e) {
            console.log(e);
        } finally {
            oracledb.closeConn(conn);
        }
    }
}

module.exports = Member;