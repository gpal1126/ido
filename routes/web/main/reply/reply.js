var mysql = require('mysql');
var formidable = require('formidable');	//파일 업로드
var db = require('../../../../db/db_base.js');

var client = mysql.createConnection({
    host: '14.63.163.96',
    port: '3306',
    user: 'np_6',
    password: 'neopadDb',
    database: 'ido'
});
exports.get_reply = function(req, res){
	if(req.params.id == 'm_view_reply'){	//모바일 reply view
		res.render('main/reply/m_reply.ejs');
	}else if(req.params.id == 'view_reply'){	// web reply view
		res.render('main/reply/reply.ejs');
	}else if(req.params.id == 'new_list'){
		console.log('최신순정렬');
		
		var contentsId = req.param('contentsId');
		
		console.log(req.user);
		if(req.user!==undefined){//세션 정보가 있으면
			var user_id = req.user.userId;
		}else {
			var user_id = '';
		}
		
		db.client.query('SELECT TB1.CONTENTS_REPLY_ID, TB1.CONTENTS_ID, TB1.USER_ID, TB1.REPLY, DATE_FORMAT(TB1.REG_DATE, "%Y.%m.%d %H:%i") AS REG_DATE, TB1.RECOMMENDATION, TB2.NIKNAME, TB2.PROFILE_PICTURE_PATH'+  
					 ' FROM CONTENTS_REPLY_TB TB1'+  
					 ' JOIN IDO_USER_TB TB2'+ 
					 ' ON TB1.USER_ID = TB2.USER_ID'+ 
					 ' WHERE TB1.CONTENTS_ID=?'+ 
					 ' ORDER BY TB1.REG_DATE DESC', contentsId, function(err1, rst1){
			db.client.query('SELECT REPLY_LIKE_ID, USER_ID, CONTENTS_REPLY_ID, LIKE_FLAG FROM REPLY_LIKE_TB WHERE USER_ID=?', [ user_id ], function(err2, rst2){
				console.log('댓글 정보-------------');
				//console.log(r2);
				console.log('세션 유저 댓글 좋아요 정보-------------');
				//console.log(r3);
				/*res.render('main/contents/m_test.ejs', {data:r, data1:rst, session:r1, data2:r2, likeInfo:r3});*/
				//var json = {'reply':r2, 'likeInfo':r3 };
				
				var json = {'reply':rst1, 'likeInfo':rst2};
				console.log(json);
				res.json(json);
			});
		});
	}else if(req.params.id == 'best_list'){
		console.log('인기순정렬');
		
		var contentsId = req.param('contentsId');
		
		console.log(req.user);
		if(req.user!==undefined){//세션 정보가 있으면
			var user_id = req.user.userId;
		}else {
			var user_id = '';
		}
		
		db.client.query('SELECT TB1.CONTENTS_REPLY_ID, TB1.CONTENTS_ID, TB1.USER_ID, TB1.REPLY, DATE_FORMAT(TB1.REG_DATE, "%Y.%m.%d %H:%i") AS REG_DATE, TB1.RECOMMENDATION, TB2.NIKNAME, TB2.PROFILE_PICTURE_PATH'+  
					 ' FROM CONTENTS_REPLY_TB TB1'+  
					 ' JOIN IDO_USER_TB TB2'+ 
					 ' ON TB1.USER_ID = TB2.USER_ID'+ 
					 ' WHERE TB1.CONTENTS_ID=?'+ 
					 ' ORDER BY TB1.RECOMMENDATION DESC', contentsId, function(err1, rst1){
			db.client.query('SELECT REPLY_LIKE_ID, USER_ID, CONTENTS_REPLY_ID, LIKE_FLAG FROM REPLY_LIKE_TB WHERE USER_ID=?', [ user_id ], function(err2, rst2){
				console.log('댓글 정보-------------');
				//console.log(r2);
				console.log('세션 유저 댓글 좋아요 정보-------------');
				//console.log(r3);
				/*res.render('main/contents/m_test.ejs', {data:r, data1:rst, session:r1, data2:r2, likeInfo:r3});*/
				//var json = {'reply':r2, 'likeInfo':r3 };
				
				var json = {'reply':rst1, 'likeInfo':rst2};
				console.log(json);
				res.json(json);
			});
		});
	}else if( req.params.id == 'view_replyForm' ){ //세션 정보와 댓글 수
		console.log('세션 정보와 댓글 수');
		
		var contentsId = req.param('contentsId');
		console.log('contentsId::'+contentsId );
		
		console.log(req.user);
		if(req.user!==undefined){//세션 정보가 있으면
			var user_id = req.user.userId;
		}else {
			var user_id = '';
		}
		
		db.client.query('SELECT COUNT(*) AS RCOUNT FROM CONTENTS_REPLY_TB WHERE CONTENTS_ID=?', [contentsId], function(err, rst){
			console.log(err);
			console.log(rst[0].RCOUNT);
			var json = { 'rcount':rst[0].RCOUNT, 'session': user_id };
			res.json(json);
		});
		
		
	}else if( req.params.id == 'view_reply_info' ){ //모바일웹 댓글 가져오기
		
		var contentsId = req.param('contentsId');
		console.log('contentsId::'+contentsId );
		
		console.log(req.user);
		if(req.user!==undefined){//세션 정보가 있으면
			var user_id = req.user.userId;
		}else {
			var user_id = '';
		}
		
		var reqNo = req.param('no');
		reqNo = parseInt(reqNo);
		console.log('reqNo::'+reqNo);
		
		var resNo = reqNo + 6;
		
		//db.client.query('SELECT TB1.CONTENTS_REPLY_ID, TB1.CONTENTS_ID, TB1.USER_ID, TB1.REPLY, DATE_FORMAT(TB1.REG_DATE, "%Y.%m.%d %H:%i") AS REG_DATE, TB1.RECOMMENDATION, TB2.NIKNAME, TB2.PROFILE_PICTURE_PATH FROM CONTENTS_REPLY_TB TB1 JOIN IDO_USER_TB TB2 ON TB1.USER_ID = TB2.USER_ID WHERE TB1.CONTENTS_ID=? ORDER BY TB1.REG_DATE DESC', [contentsId], function(e2, r2){
		db.client.query('SELECT TB1.CONTENTS_REPLY_ID, TB1.CONTENTS_ID, TB1.USER_ID, TB1.REPLY, DATE_FORMAT(TB1.REG_DATE, "%Y.%m.%d %H:%i") AS REG_DATE, TB1.RECOMMENDATION, TB2.NIKNAME, TB2.PROFILE_PICTURE_PATH FROM CONTENTS_REPLY_TB TB1 JOIN IDO_USER_TB TB2 ON TB1.USER_ID = TB2.USER_ID WHERE TB1.CONTENTS_ID=? ORDER BY TB1.REG_DATE DESC LIMIT ?, 6', [contentsId, parseInt(reqNo)], function(e2, r2){
			console.log(e2);
			//console.log(r2);
			db.client.query('SELECT REPLY_LIKE_ID, USER_ID, CONTENTS_REPLY_ID, LIKE_FLAG FROM REPLY_LIKE_TB WHERE USER_ID=?', [ user_id ], function(e3, r3){
				console.log('댓글 정보-------------');
				//console.log(r2);
				console.log('세션 유저 댓글 좋아요 정보-------------');
				//console.log(r3);
				/*res.render('main/contents/m_test.ejs', {data:r, data1:rst, session:r1, data2:r2, likeInfo:r3});*/
				//var json = {'reply':r2, 'likeInfo':r3 };
				var json = {'reply':r2, 'likeInfo':r3, 'no':resNo};
				console.log(json);
				res.json(json);
			});
		});
	}else if( req.params.id == 'a_view_reply' ){ //안드로이드 댓글 가져오기
		console.log('안드로이드 댓글 가져오기');
		
		var contentsId = req.param('contents_id');
		console.log('contentsId::'+contentsId);
		
		console.log(req.param('userId'));
		
		var user_id = req.param('userId');
		
		var replyArr = new Array();
		db.client.query('SELECT TB1.CONTENTS_REPLY_ID, TB1.CONTENTS_ID, TB1.USER_ID, TB1.REPLY, DATE_FORMAT(TB1.REG_DATE, "%Y.%m.%d %H:%i") AS REG_DATE, TB1.RECOMMENDATION, TB2.NIKNAME, SUBSTRING_INDEX(TB2.PROFILE_PICTURE_PATH, "resources", -1) AS PROFILE_PICTURE_PATH'+
						' FROM CONTENTS_REPLY_TB TB1 '+
						' JOIN IDO_USER_TB TB2 '+
						' ON TB1.USER_ID = TB2.USER_ID '+
						' WHERE TB1.CONTENTS_ID=? '+
						' ORDER BY TB1.REG_DATE DESC', [contentsId], function(e1, r1){
			//console.log(e1);
			//console.log(r1);
			
			replyArr.push({'replyValue' : r1});
			//console.log(test)
			
			db.client.query('SELECT'+
							' TB3.CONTENTS_ID'+
							' , TB2.REPLY_LIKE_ID, TB2.USER_ID, TB2.CONTENTS_REPLY_ID, TB2.LIKE_FLAG'+ 
							' FROM CONTENTS_REPLY_TB TB1'+
							' JOIN REPLY_LIKE_TB TB2'+
							' ON TB1.CONTENTS_REPLY_ID = TB2.CONTENTS_REPLY_ID'+
							' JOIN IDO_CONTENTS_TB TB3'+
							' ON TB1.CONTENTS_ID = TB3.CONTENTS_ID'+
							' WHERE TB2.USER_ID=?'+
							' AND TB3.CONTENTS_ID=?'
					, [ user_id, contentsId ], function(e2, r2){
				console.log(e2);
				replyArr.push({ 'replyValue' : r2});
				
			});
		});
		
		db.client.query('SELECT TB1.CONTENTS_REPLY_ID, TB1.CONTENTS_ID, TB1.USER_ID, TB1.REPLY, DATE_FORMAT(TB1.REG_DATE, "%Y.%m.%d %H:%i") AS REG_DATE, TB1.RECOMMENDATION, TB2.NIKNAME, SUBSTRING_INDEX(TB2.PROFILE_PICTURE_PATH, "resources", -1) AS PROFILE_PICTURE_PATH'+
				' FROM CONTENTS_REPLY_TB TB1 '+
				' JOIN IDO_USER_TB TB2 '+
				' ON TB1.USER_ID = TB2.USER_ID '+
				' WHERE TB1.CONTENTS_ID=? '+
				' ORDER BY TB1.RECOMMENDATION DESC', [contentsId], function(e1, r1){
			replyArr.push({'replyValue' : r1});
			//console.log(test)
			
			db.client.query('SELECT'+
							' TB3.CONTENTS_ID'+
							' , TB2.REPLY_LIKE_ID, TB2.USER_ID, TB2.CONTENTS_REPLY_ID, TB2.LIKE_FLAG'+ 
							' FROM CONTENTS_REPLY_TB TB1'+
							' JOIN REPLY_LIKE_TB TB2'+
							' ON TB1.CONTENTS_REPLY_ID = TB2.CONTENTS_REPLY_ID'+
							' JOIN IDO_CONTENTS_TB TB3'+
							' ON TB1.CONTENTS_ID = TB3.CONTENTS_ID'+
							' WHERE TB2.USER_ID=?'+
							' AND TB3.CONTENTS_ID=?'
					, [ user_id, contentsId ], function(e2, r2){
				console.log(e2);
				replyArr.push({ 'replyValue' : r2});
				
				res.json(replyArr);
			});
		});
		
	}else if( req.params.id == 'a_view_best_reply' ){ //안드로이드 인기순 댓글 가져오기
		console.log('안드로이드 인기순 댓글 가져오기');
		
		var contentsId = req.param('contents_id');
		console.log('contentsId::'+contentsId);
		
		console.log(req.user);
		if(req.user!==undefined){//세션 정보가 있으면
			var user_id = req.user.userId;
		}else {
			var user_id = '';
		}
		
		db.client.query('SELECT TB1.CONTENTS_REPLY_ID, TB1.CONTENTS_ID, TB1.USER_ID, TB1.REPLY, DATE_FORMAT(TB1.REG_DATE, "%Y.%m.%d %H:%i") AS REG_DATE, TB1.RECOMMENDATION, TB2.NIKNAME, SUBSTRING_INDEX(TB2.PROFILE_PICTURE_PATH, "resources", -1) AS PROFILE_PICTURE_PATH'+
						' FROM CONTENTS_REPLY_TB TB1 '+
						' JOIN IDO_USER_TB TB2 '+
						' ON TB1.USER_ID = TB2.USER_ID '+
						' WHERE TB1.CONTENTS_ID=? '+
						' ORDER BY TB1.RECOMMENDATION DESC', [contentsId], function(e1, r1){
			//console.log(e1);
			//console.log(r1);
			var replyArr = new Array();
			replyArr.push({'replyValue' : r1});
			//console.log(test)
			
			db.client.query('SELECT'+
							' TB3.CONTENTS_ID'+
							' , TB2.REPLY_LIKE_ID, TB2.USER_ID, TB2.CONTENTS_REPLY_ID, TB2.LIKE_FLAG'+ 
							' FROM CONTENTS_REPLY_TB TB1'+
							' JOIN REPLY_LIKE_TB TB2'+
							' ON TB1.CONTENTS_REPLY_ID = TB2.CONTENTS_REPLY_ID'+
							' JOIN IDO_CONTENTS_TB TB3'+
							' ON TB1.CONTENTS_ID = TB3.CONTENTS_ID'+
							' WHERE TB2.USER_ID=?'+
							' AND TB3.CONTENTS_ID=?'
					, [ user_id, contentsId ], function(e2, r2){
				console.log(e2);
				replyArr.push({ 'replyValue' : r2});
				
				res.json(replyArr);
			});
		});
	}
}

exports.post_reply = function(req, res){
	var form = new formidable.IncomingForm();
	var files = [];	//파일 선언
	var fields = [];	//파일 제외한 필드 선언
	form.keepExtensions = true;
	//If you want the files written to form.uploadDir to include the extensions of the original files, set this property to true. (확장자 이름 써줄거냐 말거냐)
    //form.uploadDir = 'resources/upload_img'; //업로드할 위치 지정
    form.maxFieldsSize = 10 * 1024*1024; //최대 업로드 크기
    form.multiples = true; //다중업로드 여부
    form.encoding = 'utf-8'; //인코딩
    
    form.parse(req,function(err, fields, files){
    	var contents_id = fields.contents_id;
		if (req.params.id == 'insert_reply'){//댓글 달기
			//컨텐츠 id
			console.log('contents_id:::::'+contents_id);
			
			//user id
			if(typeof req.user == 'undefined'){
				
			}else{
				var user_id = req.user.userId;
			}
			
			if(typeof user_id == 'undefined'){
				var user_id = req.param('userId'); //안드로이드				
			}
			console.log('user_id::::'+user_id);
			
			console.log(req);
			
			//댓글
			var reply = fields.reply;
			console.log('reply:::::'+reply);
			console.log(req.query)
			if(typeof req.query.contents_id != 'undefined'){ //안드로이드 이쪽으로 들어옴
				console.log('안드로이드???')
				var contents_id = req.query.contents_id
				console.log(contents_id)
				var reply = req.query.reply
				var user_id = req.query.userId
			}else {//웹
				var contents_id = fields.contents_id
				var reply = fields.reply
				var user_id = req.user.userId
			}
			
			console.log('reply::??????????????????'+reply);
			
			db.client.query('INSERT INTO CONTENTS_REPLY_TB(CONTENTS_ID, USER_ID, REPLY, REG_DATE, RECOMMENDATION) VALUES(?, ?, ?, NOW(), 0)', [contents_id, user_id, reply], function(err, rst){
				console.log(err);
				
				res.end();
			});//end query
		}else if(req.params.id == 'update_like'){//추천하기
			console.log('추천수 서버 js????????????');
			var contents_reply_id = fields.contents_reply_id;
			console.log('contents_reply_id:::::'+contents_reply_id);
			
			var session_user_id = fields.user_id;
			console.log('session_user_id::::::'+session_user_id);
			
			db.client.query('SELECT REPLY_LIKE_ID, USER_ID, CONTENTS_REPLY_ID, LIKE_FLAG FROM REPLY_LIKE_TB WHERE USER_ID=? AND CONTENTS_REPLY_ID=?', [session_user_id, contents_reply_id], function(err1, rst1){
				console.log('댓글 추천 조회');
				console.log(rst1[0]);
				console.log(typeof rst1[0]);
				if(rst1[0] === undefined){
					db.client.query('INSERT INTO REPLY_LIKE_TB(USER_ID, CONTENTS_REPLY_ID, LIKE_FLAG) VALUES(?, ?, 1)', [session_user_id, contents_reply_id], function(err2,rst2){
						console.log(err2);
					});
					db.client.query('UPDATE CONTENTS_REPLY_TB SET RECOMMENDATION=RECOMMENDATION+1 WHERE CONTENTS_REPLY_ID=?', [contents_reply_id], function(err3, rst3){
						console.log(err3);
					});
					
					//res.end();
				}else if(rst1[0] !== undefined){
					var like_flag = rst1[0].LIKE_FLAG;
					console.log('좋아요 플래그:::::'+like_flag);
					
					var reply_like_id = rst1[0].REPLY_LIKE_ID;
					console.log('좋아요 id::::'+reply_like_id);
					
					if(like_flag=='0'){
						db.client.query('UPDATE CONTENTS_REPLY_TB SET RECOMMENDATION=RECOMMENDATION+1 WHERE CONTENTS_REPLY_ID=?', [contents_reply_id], function(err4, rst4){
							console.log(err4);
						});
						db.client.query('UPDATE REPLY_LIKE_TB SET LIKE_FLAG=1 WHERE REPLY_LIKE_ID=?', [reply_like_id], function(err5, rst5){
							console.log(err5);
						});
					}else if(like_flag=='1'){
						db.client.query('UPDATE CONTENTS_REPLY_TB SET RECOMMENDATION=RECOMMENDATION-1 WHERE CONTENTS_REPLY_ID=?', [contents_reply_id], function(err6, rst6){
							console.log(err6);
						});
						db.client.query('UPDATE REPLY_LIKE_TB SET LIKE_FLAG=0 WHERE REPLY_LIKE_ID=?', [reply_like_id], function(err7, rst7){
							console.log(err7);
						});
					}//if
				}//if
				
				res.json(rst1);
			});
			
		}else if(req.params.id == 'delete_reply'){//댓글 삭제하기
			console.log('댓글 삭제하기');
			var contents_reply_id = req.param('contents_reply_id');
			console.log('contents_reply_id:::'+contents_reply_id);
			
			db.client.query('DELETE FROM CONTENTS_REPLY_TB WHERE CONTENTS_REPLY_ID=?', [contents_reply_id], function(err, rst){
				console.log(err);
				
				db.client.query('DELETE FROM REPLY_LIKE_TB WHERE CONTENTS_REPLY_ID=?', [contents_reply_id], function(err2, rst2){
					console.log(err2);
					res.end();
				});
			});
		}
    });
}
