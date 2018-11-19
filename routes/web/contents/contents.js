var mysql = require('mysql');
var base64_encode = require('base-64').encode;
var Buffer = require('buffer').Buffer;
var fs = require('fs');
/*var client = mysql.createConnection({ //'14.63.163.96',
    host: '14.63.163.96',
    port: '3306',
    user: 'np_6',
    password: 'neopadDb',
    database: 'ido'
});*/

var client = mysql.createConnection({
    host: '14.63.163.96',
    port: '3306',
    user: 'np_6',
    password: 'neopadDb',
    database: 'ido'
});

exports.contents = function(req, res){
	console.log(req.param('contentsId'));
	var contentsId = req.param('contentsId');
	console.log(req.user);
	if(req.user!==undefined){//세션 정보가 있으면
		var user_id = req.user.userId;
	}else {
		var user_id = '';
	}
	//clickCount를 증가시킴.

	client.query('update IDO_CONTENTS_TB set click_count=click_count+1 where contents_id=?', [contentsId], function(e,r){});
	
	if(typeof req.user != 'undefined'){
		var buf = new Buffer(req.user.emails); //이메일값을 buffer로 바꿈
		var encEmail = base64_encode(buf); //이메일값이 인코딩 되어서 들어감
		client.query('select category from IDO_CONTENTS_TB where contents_id =?',[contentsId],function(e,r){
			client.query('select user_id from IDO_USER_TB where user_email =?',[encEmail],function(e,r2){
				var category = r[0].category.split('_')[0]
				client.query('insert into USER_CATEGORY values(null, ?,?)',[r2[0].user_id, category],function(e,result){
					console.log(e);
				})
			})
		})
		
	}
	/*connection.release();*/
	//컨텐츠의 파트너 유저정보 및 이미지 등을 뽑아냄. 
	client.query('select userTb.NIKNAME, userTb.PROFILE_PICTURE_PATH, IDO_CONTENTS_TB.CONTENTS_ID, IDO_CONTENTS_TB.CLICK_COUNT, IDO_CONTENTS_TB.TITLE, DATE_FORMAT(REG_DATE, "%Y/%m/%d") REG_DATE, CONTENTS_IMAGE_PATH, CONTENTS_IMAGE_ORIGIN, CONTENTS from CONTENTS_IMAGE_TB  join IDO_CONTENTS_TB on IDO_CONTENTS_TB.contents_id = CONTENTS_IMAGE_TB.contents_id left join IDO_USER_TB as userTb on userTb.PARTNER_ID = IDO_CONTENTS_TB.PARTNER_ID where CONTENTS_IMAGE_TB.CONTENTS_ID=? ORDER BY CONTENTS_IMAGE_TB.ORDER_NUM',[contentsId], function(e,r){
		console.log(r);
		
		client.query('SELECT * FROM IDO_USER_TB WHERE USER_ID=?', [user_id], function(e1, r1){
			//res.render('main/contents/test.ejs', {data : r});	
			client.query('(SELECT TB1.CONTENTS_REPLY_ID, TB1.CONTENTS_ID, TB1.USER_ID, TB1.REPLY, TB1.REG_DATE, TB1.RECOMMENDATION, TB2.NIKNAME, TB2.PROFILE_PICTURE_PATH FROM CONTENTS_REPLY_TB TB1 JOIN IDO_USER_TB TB2 ON TB1.USER_ID = TB2.USER_ID WHERE CONTENTS_ID=? ORDER BY  TB1.RECOMMENDATION DESC LIMIT 0,2) UNION (SELECT TB1.CONTENTS_REPLY_ID, TB1.CONTENTS_ID, TB1.USER_ID, TB1.REPLY, TB1.REG_DATE, TB1.RECOMMENDATION, TB2.NIKNAME, TB2.PROFILE_PICTURE_PATH  FROM CONTENTS_REPLY_TB TB1  JOIN IDO_USER_TB TB2 ON TB1.USER_ID = TB2.USER_ID WHERE CONTENTS_ID=? ORDER BY TB1.REG_DATE DESC LIMIT 0, 1000)', [contentsId, contentsId], function(e2, r2){
				client.query('SELECT REPLY_LIKE_ID, USER_ID, CONTENTS_REPLY_ID, LIKE_FLAG FROM REPLY_LIKE_TB WHERE USER_ID=?', [ user_id ], function(e3, r3){
					client.query('SELECT SURVEY_ID, CONTENTS_ID, SURVEY_TITLE, SURVEY_THUMBNAIL FROM SURVEY_TB WHERE contents_id=?', [contentsId], function(error, rst){
						//결과 출력
						console.log('파트너 유저 정보 및 컨텐츠-------------');
						console.log(r);
						console.log('로그인 계정 유저 정보-------------');
						console.log(r1);
						console.log('댓글 정보-------------');
						console.log(r2);
						console.log('세션 유저 댓글 좋아요 정보-------------');
						console.log(r3);
						console.log('설문 정보-------------');
						console.log(rst);
						res.render('main/contents/test.ejs', {data:r, data1:rst, session:r1, data2:r2, likeInfo:r3});
					});
				});
			});
		});
	})
}


//모바일 컨텐츠 view
exports.m_contents = function(req, res){
	fs.readFile('views/main/contents/m_test.html', function(error,data){
		res.writeHead(200,{'Content-Type':'text/html'});
		res.end(data);
	});
	//res.render('main/contents/m_test.ejs');
}

//모바일 value 값 가져오는 ajax
exports.m_contents_view = function(req, res){
	console.log('m_contents_view!!!!!!');
	var contentsId = req.param('contentsId');
	console.log('contentsId::'+contentsId );
	
	//var reqNo = req.param('no');
	//reqNo = parseInt(reqNo);
	//console.log('reqNo::'+reqNo);
	
	//var resNo = reqNo + 4;
	
	console.log(req.user);
	if(req.user!==undefined){//세션 정보가 있으면
		var user_id = req.user.userId;
	}else {
		var user_id = '';
	}
	if(typeof req.user != 'undefined'){
		var buf = new Buffer(req.user.emails); //이메일값을 buffer로 바꿈
		var encEmail = base64_encode(buf); //이메일값이 인코딩 되어서 들어감
		console.log('----------------------------------------------')
		console.log(typeof req.user.emails)
		if(typeof  req.user.emails == 'object'){ //facebook으로 로그인시
			client.query('select category from IDO_CONTENTS_TB where contents_id =?',[contentsId],function(e,r){
				var category = r[0].category.split('_')[0]
				client.query('insert into USER_CATEGORY values(null, ?,?)',[req.user.id, category],function(e,result){
					console.log(e);
				})
			})
		}else if(typeof  req.user.emails == 'string'){ //local 로그인시
			client.query('select category from IDO_CONTENTS_TB where contents_id =?',[contentsId],function(e,r){
				client.query('select user_id from IDO_USER_TB where user_email =?',[encEmail],function(e,r2){
					var category = r[0].category.split('_')[0]
					client.query('insert into USER_CATEGORY values(null, ?,?)',[r2[0].user_id, category],function(e,result){
						console.log(e);
					})
				})
			})
		}
		
	}
	//clickCount를 증가시킴.
	client.query('update IDO_CONTENTS_TB set click_count=click_count+1 where contents_id=?', [contentsId], function(e,r){});
	
	//컨텐츠의 파트너 유저정보 및 이미지 등을 뽑아냄. 
	client.query('select userTb.NIKNAME, userTb.PROFILE_PICTURE_PATH, IDO_CONTENTS_TB.CLICK_COUNT, IDO_CONTENTS_TB.TITLE, IDO_CONTENTS_TB.THUMBNAIL_CONTENTS, IDO_CONTENTS_TB.THUMBNAIL_IMAGE_PATH, DATE_FORMAT(REG_DATE, "%Y/%m/%d") REG_DATE, CONTENTS_IMAGE_PATH, CONTENTS_IMAGE_ORIGIN, CONTENTS from CONTENTS_IMAGE_TB  join IDO_CONTENTS_TB on IDO_CONTENTS_TB.contents_id = CONTENTS_IMAGE_TB.contents_id left join IDO_USER_TB as userTb on userTb.PARTNER_ID = IDO_CONTENTS_TB.PARTNER_ID where CONTENTS_IMAGE_TB.CONTENTS_ID=? ORDER BY CONTENTS_IMAGE_TB.ORDER_NUM',[contentsId], function(e,r){
		console.log(r);
		client.query('SELECT * FROM IDO_USER_TB WHERE USER_ID=?', [user_id], function(e1, r1){
			//res.render('main/contents/test.ejs', {data : r});	
			client.query('SELECT TB1.CONTENTS_REPLY_ID, TB1.CONTENTS_ID, TB1.USER_ID, TB1.REPLY, DATE_FORMAT(TB1.REG_DATE, "%Y.%m.%d %H:%i") AS REG_DATE, TB1.RECOMMENDATION, TB2.NIKNAME, TB2.PROFILE_PICTURE_PATH FROM CONTENTS_REPLY_TB TB1 JOIN IDO_USER_TB TB2 ON TB1.USER_ID = TB2.USER_ID WHERE TB1.CONTENTS_ID=? ORDER BY TB1.REG_DATE DESC', [contentsId], function(e2, r2){
			//client.query('SELECT TB1.CONTENTS_REPLY_ID, TB1.CONTENTS_ID, TB1.USER_ID, TB1.REPLY, DATE_FORMAT(TB1.REG_DATE, "%Y.%m.%d %H:%i") AS REG_DATE, TB1.RECOMMENDATION, TB2.NIKNAME, TB2.PROFILE_PICTURE_PATH FROM CONTENTS_REPLY_TB TB1 JOIN IDO_USER_TB TB2 ON TB1.USER_ID = TB2.USER_ID WHERE TB1.CONTENTS_ID=? ORDER BY TB1.REG_DATE DESC LIMIT ?, 4', [contentsId, parseInt(reqNo)], function(e2, r2){
				console.log(e2);
				console.log(r2);
				client.query('SELECT REPLY_LIKE_ID, USER_ID, CONTENTS_REPLY_ID, LIKE_FLAG FROM REPLY_LIKE_TB WHERE USER_ID=?', [ user_id ], function(e3, r3){
					//res.render('main/contents/test.ejs', {data : r});	
					client.query('SELECT SURVEY_ID, CONTENTS_ID, SURVEY_TITLE, SURVEY_THUMBNAIL FROM SURVEY_TB WHERE contents_id=?', [contentsId], function(error, rst){
						//결과 출력
						console.log('error : '+ e);
						console.log('파트너 유저 정보 및 컨텐츠-------------');
						console.log(r);
						console.log('로그인 계정 유저 정보-------------');
						console.log(r1);
						console.log('댓글 정보-------------');
						console.log(r2);
						console.log('세션 유저 댓글 좋아요 정보-------------');
						console.log(r3);
						console.log('설문 정보-------------');
						console.log(rst);
						console.log(e);
						/*res.render('main/contents/m_test.ejs', {data:r, data1:rst, session:r1, data2:r2, likeInfo:r3});*/
						var json = {'data':r, 'data1':rst, 'session':r1, 'reply':r2, 'likeInfo':r3 };
						//var json = {'data':r, 'data1':rst, 'session':r1, 'reply':r2, 'likeInfo':r3, 'no':resNo};
						console.log(json);
						res.json(json);
					});
				});
			});
		});	
	})
}


//안드로이드 value 값 가져오는 ajax
exports.a_contents_view = function(req, res){
	console.log('Android contents_View !!!!!!');
	var contentsId = req.param('contentsId');
	console.log('contentsId::'+contentsId );
	console.log(req.user);
	if(req.user!==undefined){//세션 정보가 있으면
		var user_id = req.user.userId;
	}else {
		var user_id = '';
	}
	if(typeof req.user != 'undefined'){
		var buf = new Buffer(req.user.emails); //이메일값을 buffer로 바꿈
		var encEmail = base64_encode(buf); //이메일값이 인코딩 되어서 들어감
		client.query('select category from IDO_CONTENTS_TB where contents_id =?',[contentsId],function(e,r){
			client.query('select user_id from IDO_USER_TB where user_email =?',[encEmail],function(e,r2){
				var category = r[0].category.split('_')[0]
				client.query('insert into USER_CATEGORY values(null, ?,?)',[r2[0].user_id, category],function(e,result){
					console.log(e);
				})
			})
		})
	}
	//clickCount를 증가시킴.
	client.query('update IDO_CONTENTS_TB set click_count=click_count+1 where contents_id=?', [contentsId], function(e,r){});
	
	//컨텐츠의 파트너 유저정보 및 이미지 등을 뽑아냄. 
	client.query('select userTb.NIKNAME, userTb.PROFILE_PICTURE_PATH, IDO_CONTENTS_TB.CLICK_COUNT, IDO_CONTENTS_TB.TITLE, IDO_CONTENTS_TB.THUMBNAIL_CONTENTS, IDO_CONTENTS_TB.THUMBNAIL_IMAGE_PATH, DATE_FORMAT(REG_DATE, "%Y/%m/%d") REG_DATE, CONTENTS_IMAGE_PATH, CONTENTS_IMAGE_ORIGIN, CONTENTS from CONTENTS_IMAGE_TB  join IDO_CONTENTS_TB on IDO_CONTENTS_TB.contents_id = CONTENTS_IMAGE_TB.contents_id left join IDO_USER_TB as userTb on userTb.PARTNER_ID = IDO_CONTENTS_TB.PARTNER_ID where CONTENTS_IMAGE_TB.CONTENTS_ID=? ORDER BY CONTENTS_IMAGE_TB.ORDER_NUM',[contentsId], function(e,r){
		console.log(r);
		client.query('SELECT * FROM IDO_USER_TB WHERE USER_ID=?', [user_id], function(e1, r1){
			//res.render('main/contents/test.ejs', {data : r});	
			client.query('SELECT TB1.CONTENTS_REPLY_ID, TB1.CONTENTS_ID, TB1.USER_ID, TB1.REPLY, DATE_FORMAT(TB1.REG_DATE, "%Y.%m.%d %H:%i") AS REG_DATE, TB1.RECOMMENDATION, TB2.NIKNAME, TB2.PROFILE_PICTURE_PATH FROM CONTENTS_REPLY_TB TB1 JOIN IDO_USER_TB TB2 ON TB1.USER_ID = TB2.USER_ID WHERE TB1.CONTENTS_ID=? ORDER BY TB1.REG_DATE DESC', [contentsId, contentsId], function(e2, r2){
				console.log(e2);
				console.log(r2);
				client.query('SELECT REPLY_LIKE_ID, USER_ID, CONTENTS_REPLY_ID, LIKE_FLAG FROM REPLY_LIKE_TB WHERE USER_ID=?', [ user_id ], function(e3, r3){
					//res.render('main/contents/test.ejs', {data : r});	
					client.query('SELECT SURVEY_ID, CONTENTS_ID, SURVEY_TITLE, SURVEY_THUMBNAIL FROM SURVEY_TB WHERE contents_id=?', [contentsId], function(error, rst){
						//결과 출력
						console.log('error : '+ e);
						console.log('파트너 유저 정보 및 컨텐츠-------------');
						console.log(r);
						console.log('로그인 계정 유저 정보-------------');
						console.log(r1);
						console.log('댓글 정보-------------');
						console.log(r2);
						console.log('세션 유저 댓글 좋아요 정보-------------');
						console.log(r3);
						console.log('설문 정보-------------');
						console.log(rst);
						console.log(e);
						/*res.render('main/contents/m_test.ejs', {data:r, data1:rst, session:r1, data2:r2, likeInfo:r3});*/
						var json = {'data':r, 'data1':rst, 'session':r1, 'reply':r2, 'likeInfo':r3};
						//res.json(json);
						
						var acc = JSON.stringify(rst);
						
						res.end(acc);
					});
				});
			});
		});	
	})
}


exports.search_contents_view = function(req, res){
	console.log('컨텐츠 검색 view');
	fs.readFile('views/main/contents/search_contents.html', function(error,data){
		res.writeHead(200,{'Content-Type':'text/html'});
		res.end(data);
	});
}

exports.search_contents = function(req, res){
	console.log('컨텐츠 검색');
	var search = req.query.search;
	var reqNo = req.query.no;
	console.log('search::::::::'+search);
	console.log('reqNo::::::::::'+reqNo);
	
	reqNo = parseInt(reqNo);
	
	//다시 view단으로 응답할 no - 요청받은 no값에 +6씩 ex) 0, 3, 6
	var resNo = reqNo + 4;
	
	client.query('SELECT TB1.CONTENTS_ID, TB1.PARTNER_ID, TB1.CONTENTS_TYPE, TB1.TITLE, TB1.THUMBNAIL_CONTENTS, TB1.THUMBNAIL_IMAGE_PATH, DATE_FORMAT(TB1.REG_DATE, "%Y.%m.%d") AS REG_DATE, TB1.CATEGORY, TB1.IMAGE_TYPE, TB1.CLICK_COUNT, TB2.NIKNAME, TB2.PROFILE_PICTURE_PATH, COUNT(TB3.CONTENTS_REPLY_ID) AS REPLY_CNT FROM IDO_CONTENTS_TB TB1 LEFT JOIN IDO_USER_TB TB2 ON TB1.PARTNER_ID = TB2.PARTNER_ID LEFT JOIN CONTENTS_REPLY_TB TB3 ON TB1.CONTENTS_ID = TB3.CONTENTS_ID WHERE CONTENTS_TYPE=3 AND TITLE LIKE "%"?"%" GROUP BY TB1.CONTENTS_ID ORDER BY TB1.CONTENTS_ID DESC LIMIT ?, 4', [ search, reqNo ], function(err, rst){
		console.log(err);
		//console.log(rst);
		var result = {"no":resNo, "contents":rst};
		console.log (result);
		
		if(rst[0] !== undefined){
			res.json(result);
		}else {
			res.json('noSearch');
		}
	});
	
}
