const oracledb = require('../models/Oracle');

let boardsql = {
    isnert: 'insert into board2 (bno2, title, userid, contents) values (bno2.nextval, :1, :2, :3)',
    select: 'select bno2, title, userid, views, regdate from board2 order by bno2 desc',
    selectOne: 'select * from board2 where bno2 = :1',
    update: 'update board2 set title = :1, contents = :2 where bno = :3',
    delete: 'delete from board2 where bno2 = :1'
}

class Board {
    constructor(bno, title, userid, regdate, contents, views) {
        this.bno = bno;
        this.title = title;
        this.userid = userid;
        this.regdate = regdate;
        this.contents = contents;
        this.views = views;
    }

    async insert() {   // 새글쓰기
        let conn = null;
        let params = [this.title, this.userid, this.contents];
        let insertcnt = 0;

        try {
            conn = await oracledb.makeConn();   // 연결
            let result = await conn.execute(boardsql.insert, params);   // 실행
            await conn.commit();   // 확인
            if (result.rowsAffected > 0) insertcnt = result.rowsAffected;
        } catch (e) {
            console.log(e);
        } finally {
            await oracledb.closeConn();   // 종료
        }

        return insertcnt;
    }
    async select() {
        let conn = null;
        let params = [];
        let insertcnt = 0;

        try {
            conn = await oracledb.makeConn();
        } catch (e) {
            console.log(e);
        } finally {
            await oracledb.closeConn();
        }

        return insertcnt;
    }
    async selectOne() {
        let conn = null;
        let params = [];
        let insertcnt = 0;

        try {
            conn = await oracledb.makeConn();
        } catch (e) {
            console.log(e);
        } finally {
            await oracledb.closeConn();
        }

        return insertcnt;
    }
    async update() {
        let conn = null;
        let params = [];
        let insertcnt = 0;

        try {
            conn = await oracledb.makeConn();
        } catch (e) {
            console.log(e);
        } finally {
            await oracledb.closeConn();
        }

        return insertcnt;
    }
    async delete() {
        let conn = null;
        let params = [];
        let insertcnt = 0;

        try {
            conn = await oracledb.makeConn();
        } catch (e) {
            console.log(e);
        } finally {
            await oracledb.closeConn();
        }

        return insertcnt;
    }
}

module.exports = Board;