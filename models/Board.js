const oracledb = require('../models/Oracle');

let boardsql = {
    insert: 'insert into board2 (bno2, title, userid, contents) values (bno2.nextval, :1, :2, :3)',
    select: `select bno2, title, userid, views, to_char(regdate, 'YYYY-MM-DD') regdate from board2 order by bno2 desc`,
    selectOne: `select board2.*, to_char(regdate, 'YYYY-MM-DD HH24:MI:SS') regdate2 from board2 where bno2 = :1`,
    selectCount: `select count(bno2) cnt from board2`,
    viewOne: `update board2 set views = views + 1 where bno2 = :1`,
    update: 'update board2 set title = :1, contents = :2, regdate = current_timestamp where bno2 = :3',
    delete: 'delete from board2 where bno2 = :1'
}
// viewOne은 조회수 증가 셀렉트문

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
            let result = await conn.execute(boardsql.selectCount, params, oracledb.options);
            let rs = result.resultSet;
            let idx = -1, row = null;
            if ((row = await rs.getRow())) idx = row.CNT;   // 총 게시글 수

            result = await conn.execute(boardsql.select, params, oracledb.options);
            rs = result.resultSet;
            row = null;
            while((row = await rs.getRow())) {
                let bd = new Board(row.BNO2, row.TITLE, row.USERID, row.REGDATE, null, row.VIEWS);
                bd.idx = idx--;   // 글 번호 컬럼
                bds.push(bd);
            }
        } catch (e) {
            console.log(e);
        } finally {
            await oracledb.closeConn();
        }

        return bds;
    }
    async selectOne(bno2) {   // 본문 조회
        let conn = null;
        let params = [bno2];
        let bds = [];

        try {
            conn = await oracledb.makeConn();
            let result = await conn.execute(boardsql.selectOne, params, oracledb.options);
            let rs = result.resultSet;

            let row = null;
            while(row = await rs.getRow()) {
                let bd = new Board(row.BNO2, row.TITLE, row.USERID, row.REGDATE2, row.CONTENTS, row.VIEWS);
                bds.push(bd);
            }

            // 조회수 증가 코드
            await conn.execute(boardsql.viewOne, params);
            await conn.commit();

        } catch (e) {
            console.log(e);
        } finally {
            await oracledb.closeConn();
        }

        return bds;
    }
    async update() {
        let conn = null;
        let params = [this.title, this.contents, this.bno2];
        let updatecnt = 0;

        try {
            conn = await oracledb.makeConn();
            let result = await conn.execute(boardsql.update, params);
            await conn.commit();
            if (result.rowsAffected > 0) updatecnt = result.rowsAffected;
        } catch (e) {
            console.log(e);
        } finally {
            await oracledb.closeConn();
        }

        return updatecnt;
    }
    async delete(bno2) {
        let conn = null;
        let params = [bno2];
        let deletecnt = 0;

        try {
            conn = await oracledb.makeConn();
            let result = await conn.execute(boardsql.delete, params);
            await conn.commit();
            if (result.rowsAffected > 0) deletecnt = result.rowsAffected;
        } catch (e) {
            console.log(e);
        } finally {
            await oracledb.closeConn();
        }

        return deletecnt;
    }
}

module.exports = Board;