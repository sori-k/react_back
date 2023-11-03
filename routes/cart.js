var express = require('express');
var router = express.Router();
var db = require('../db');

//카트 등록
router.post('/insert', function(req, res){
    const uid=req.body.uid;
    const bid=req.body.bid;

    let sql='select * from cart where uid=? and bid=?';
    db.get().query(sql, [uid, bid], function(err, rows){
        if(rows.length == 0){
            sql='insert into cart(uid, bid) values(?, ?)';
            db.get().query(sql, [uid, bid], function(err){
                res.send('0'); //장바구니에 등록
            })
        }else{
            sql='update cart set qnt=qnt+1 where uid=? and bid=?';
            db.get().query(sql, [uid, bid], function(err){
                res.send('1'); //이미 있어서 수량만 증가
            })
        }
    });
});

//카트 목록
router.get('/list.json', function(req, res){ //localhost:5000/cart/list.json?uid=blue
    const uid=req.query.uid;

    const sql='call cart_list(?)';
    db.get().query(sql, [uid], function(err, rows){
        res.send({list: rows[0]});
    });
});

//총 합계 구하기
router.get('/sum', function(req, res){ //localhost:5000/cart/sum?uid=blue
    const uid=req.query.uid;
    const sql='call cart_sum(?)';

    db.get().query(sql, [uid], function(err, rows){
        res.send(rows[0][0]);
    });
});

//장바구니 삭제
router.post('/delete', function(req, res){
    const cid=req.body.cid;
    const sql='delete from cart where cid=?';
    db.get().query(sql, [cid], function(err){
        if(err){
            res.send('0');
        }else{
            res.send('1');
        }
    });
});

//장바구니 수량 변경
router.post('/update', function(req, res){
    const cid=req.body.cid;
    const qnt=req.body.qnt;

    const sql='update cart set qnt=? where cid=?';
    db.get().query(sql, [qnt, cid], function(err){
        if(err){
            res.send('0');
        }else{
            res.send('1');
        }
    });
});


module.exports = router;