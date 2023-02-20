const oracledb = require('../models/Oracle');

let boardsql = {
    isnert: 'insert into board2 (bno2, title, userid, contents) values (bno2.nextval, :1, :2, :3)',
    select: `select bno2, title, userid, views, to_char(regdate, 'YYYY-MM-DD') regdate from board2 order by bno2 desc`,
    selectOne: 'select * from board2 where bno2 = :1',
    update: 'update board2 set title = :1, contents = :2 where bno2 = :3',
    delete: 'delete from board2 where bno2 = :1'
}

class Board {
    constructor(bno2, title, userid, regdate, contents, views) {
        this.bno2 = bno2;
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
    async select() {   // 게시판 목록 출력
        let conn = null;
        let params = [];
        let bds = [];   // 결과 저장용

        try {
            conn = await oracledb.makeConn();
            let result = await conn.execute(boardsql.select, params, oracledb.options);
            let rs = result.resultSet;

            let row = null;
            while((row = await rs.getRow())) {
                let bd = new Board(row.BNO2, row.TITLE, row.USERID, row.REGDATE, null, row.VIEWS);
                bds.push(bd);
            }
        } catch (e) {
            console.log(e);
        } finally {
            await oracledb.closeConn();
        }

        return bds;
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