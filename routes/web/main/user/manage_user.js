var partner = require('./partner/partner.js');
var mysql = require('mysql');
var base64_encode = require('base-64').encode;
var base64_decode = require('base-64').decode;
var Buffer = require('buffer').Buffer;
var formidable = require('formidable');
var fs = require('fs');
var imagePath = 'resources/images/user_profile/';

//db.client = Sql의 정보들을 지정하는 모듈이다.
var db = require('../../../../db/db_base.js');

/*
var client = mysql.createConnection({
    host: '14.63.163.96',
    port: '3306',
    user: 'np_6',
    password: 'neopadDb',
    database: 'ido'
});
*/

exports.manage_user = function(req,res){
	if(req.params.id == 'register_partner'){
		partner.registerPartner(req, res);
		res.end();
	}else if(req.params.id == 'check_businessNumber'){
		partner.check_businessNumber(req, res);
		res.end();
	}else if(req.params.id == 'partner_detail'){
		res.render('main/user/partner_detail.ejs'); //디테일 정보 입력(View단 Form 작성)
	}else if(req.params.id == 'inqure_app_user'){
		db.client.query('SELECT PARTNER_TB.PARTNER_ID, USER_EMAIL, DOCUMENT, USER_CODE, DATE_FORMAT(REG_DATE, "%Y/%m/%d") REG_DATE FROM IDO_USER_TB JOIN PARTNER_TB ON IDO_USER_TB.PARTNER_ID = PARTNER_TB.PARTNER_ID WHERE IDO_USER_TB.USER_CODE=2', function(error,result){
			res.json(result);
		})
	}else if(req.params.id =='success_application'){
		console.log(req.query.partnerId);
		db.client.query('UPDATE PARTNER_TB SET DOCUMENT="y_y_y" WHERE PARTNER_ID=?',[req.query.partnerId+""], function(e,r){
			db.client.query('UPDATE IDO_USER_TB SET USER_TYPE=2, USER_CODE=3 WHERE PARTNER_ID=?',[req.query.partnerId+""], function(e,r){
				res.end();
			})
		})
	}else if(req.params.id =='manage_partner'){
		db.client.query('SELECT PARTNER_TB.PARTNER_ID, USER_EMAIL, DATE_FORMAT(REG_DATE, "%Y/%m/%d") REG_DATE FROM IDO_USER_TB JOIN PARTNER_TB ON IDO_USER_TB.PARTNER_ID = PARTNER_TB.PARTNER_ID WHERE IDO_USER_TB.USER_CODE=3', function(error,result){
			res.json(result);
		})
	}else if(req.params.id =='myPage'){
		console.log(req.param('userId'));
		console.log('mypage 들어옴')
		res.render('main/user/mypage.ejs', { user: req.user });
	}else if(req.params.id=='join_surveyList'){
		console.log(req.param('userId'))
		db.client.query('SELECT TB1.SURVEY_ID, DATE_FORMAT(TB1.ANSWER_DATE, "%Y.%m.%d %H:%i") ANSWER_DATE,'+
					 ' TB3.SURVEY_TYPE_ID, TB3.SURVEY_TYPE, TB3.SECOND_SURVEY_TITLE, TB3.SECOND_SURVEY_CROP_IMAGE,'+
					 ' TB4.SURVEY_CONTENTS, TB4.SURVEY_CROP_IMAGE'+
					 ' FROM SURVEY_ANSWER_TB TB1'+
					 ' JOIN SURVEY_TB TB2'+ 
					 ' ON TB1.survey_id = TB2.survey_id'+ 
					 ' JOIN SURVEY_TYPE_TB TB3'+
					 ' ON TB2.SURVEY_ID = TB3.SURVEY_ID'+
					 ' JOIN SURVEY_CONTENTS_TB TB4'+
					 ' ON TB3.SURVEY_TYPE_ID = TB4.SURVEY_TYPE_ID'+
					 ' WHERE TB1.USER_ID=?'+
					 ' GROUP BY TB1.survey_id', [req.param('userId')], function(error,result){
			res.json(result)
		})
	}else if(req.params.id=='a_surveyList'){
		console.log(req.param('userId'))
		
		var obj = new Object();
		
		//참여한 서베이
		db.client.query('SELECT TB1.SURVEY_ID, DATE_FORMAT(TB1.ANSWER_DATE, "%Y.%m.%d %H:%i") ANSWER_DATE,'+
					 ' TB3.SURVEY_TYPE_ID, TB3.SURVEY_TYPE, TB3.SECOND_SURVEY_TITLE, TB3.SECOND_SURVEY_CROP_IMAGE,'+
					 ' TB4.SURVEY_CONTENTS, TB4.SURVEY_CROP_IMAGE'+
					 ' FROM SURVEY_ANSWER_TB TB1'+
					 ' JOIN SURVEY_TB TB2'+ 
					 ' ON TB1.survey_id = TB2.survey_id'+ 
					 ' JOIN SURVEY_TYPE_TB TB3'+
					 ' ON TB2.SURVEY_ID = TB3.SURVEY_ID'+
					 ' JOIN SURVEY_CONTENTS_TB TB4'+
					 ' ON TB3.SURVEY_TYPE_ID = TB4.SURVEY_TYPE_ID'+
					 ' WHERE TB1.USER_ID=?'+
					 ' GROUP BY TB1.survey_id', [req.param('userId')], function(error,result){
			obj.join = result;
		})
		
		//작성한 서베이
		db.client.query('SELECT TB1.CONTENTS_ID, TB1.CONTENTS_TYPE, TB2.SURVEY_ID, TB2.SURVEY_THUMBNAIL, TB2.SURVEY_TITLE'+
						', DATE_FORMAT(TB1.REG_DATE, "%Y/%m/%d") REG_DATE'+ 
						' FROM IDO_CONTENTS_TB TB1'+ 
						' LEFT JOIN SURVEY_TB TB2'+ 
						' ON TB1.CONTENTS_ID = TB2.CONTENTS_ID'+ 
						' LEFT JOIN IDO_USER_TB TB3'+
						' ON TB1.PARTNER_ID = TB3.PARTNER_ID'+
						' WHERE TB3.USER_ID = ? AND TB1.CONTENTS_TYPE=3'+
						' ORDER BY TB1.CONTENTS_ID;', [req.param('userId')], function(error,result){
			//res.json(result)
			obj.survey = result;
			console.log(obj);
			res.json(obj);
		})
		
	}else if(req.params.id =='mypageEdit'){
		console.log(req.param('userId'));
		console.log('mypageEdit 들어옴')
		console.log(req.user);
		db.client.query('select*from IDO_USER_TB where user_id=?',[req.param('userId')], function(e,r){
			var email = base64_decode(r[0].USER_EMAIL)
			res.render('main/user/mypage_edit.ejs', { user: r[0], email : email});
		})
		
	}else if(req.params.id =='m_myPage'){
		console.log(req.param('userId'));
		console.log('m_mypage 들어옴')
		console.log(req.user)
		res.render('main/user/m_mypage.ejs', { user: req.user });
	}else if(req.params.id =='m_mypageEdit'){
		console.log(req.param('userId'));
		console.log('m_mypageEdit 들어옴')
		console.log(req.user);
		db.client.query('select*from IDO_USER_TB where user_id=?',[req.param('userId')], function(e,r){
			var email = base64_decode(r[0].USER_EMAIL)
			res.render('main/user/m_mypage_edit.ejs', { user: r[0], email : email});
		})
		
	}else if(req.params.id=='inqure_app_contents'){
		console.log('컨텐츠 관리');
		db.client.query('select*from IDO_CONTENTS_TB where contents_type=2', function(error, result){
			console.log(error);
			res.json(result);
		})
	}else if(req.params.id=='request_contents_confirm'){
		console.log('승인처리');
		var contentsId = req.param('contentsId')
		db.client.query('UPDATE IDO_CONTENTS_TB SET CONTENTS_TYPE=3 WHERE CONTENTS_ID=?',[contentsId], function(e,r){
			res.json('success');
		});
	}else if(req.params.id =='delete_user'){
		var userId =req.param('userId'); 
		console.log(userId)
		console.log('deleteUser 들어옴')
		db.client.query('DELETE FROM IDO_USER_TB where USER_ID=?',[userId], function(e,r){
			if(e == null){ // 삭제완료
				res.json('success');	
			}
		});
		//res.json('success');
	}
};

exports.p_manager_user = function(req,res){
	if(req.params.id == 'applicationPartner'){
		var userId = req.body.userId;
		var buf = new Buffer(userId); //이메일값을 buffer로 바꿈
		var incoding_data = base64_encode(buf); //이메일값이 인코딩 되어서 들어감
		db.client.query('SELECT USER_ID FROM IDO_USER_TB WHERE USER_EMAIL=?', [incoding_data], function(e,userId){
			console.log(userId[0].USER_ID);
			db.client.query('INSERT INTO PARTNER_TB VALUES(NULL, "n_n_n", now())', function(e,r){
				db.client.query('SELECT @last :=LAST_INSERT_ID()');
				db.client.query('UPDATE IDO_USER_TB SET PARTNER_ID=@last, USER_CODE=2 WHERE USER_EMAIL=?',[incoding_data], function(e,r){
					console.log(e);
				});
			});	
		})
	}else if(req.params.id == 'checkPw'){
		var body = req.body;
		var query = req.query;
		
		if(req.query != null){
			var pw = query.pw;
			var userId = query.userId;
		}else{
			var pw = body.pw;
			var userId = body.userId;	
		}
		db.client.query('select * from IDO_USER_TB where user_id =? and password=?', [userId, pw], function(e,r){
			console.log(r);
			if(r[0] == null){
				res.json('fail');
			}else{
				res.json(pw);
			}
		})
	}else if(req.params.id == 'updateMyProfile'){
		var form = new formidable.IncomingForm();
		var files = [];
		var fields = [];
		form.keepExtensions = true;
		//If you want the files written to form.uploadDir to include the extensions of the original files, set this property to true. (확장자 이름 써줄거냐 말거냐)
	    form.uploadDir = imagePath; //업로드할 위치 지정
	    form.maxFieldsSize = 10 * 1024*1024; //최대 업로드 크기
	    form.multiples = true; //다중업로드 여부
	    form.encoding = 'utf-8'; //인코딩
	    
	    var userId = '';
	    var newPw = '';
	    var newNickName = '';
	    form.parse(req,function(err, fields, files){
	    	if(req.query.userId != null){
	    		userId = req.query.userId;
	    		newPw = req.query.newPw;
	    		newNick = req.query.newNick;
	    	}else{
	    		userId = fields.userId;
	    		newPw = fields.newPw;
	    		newNick = fields.newNick;
	    	}
	    	if(fields.newNick == 'undefined'){
				db.client.query('update IDO_USER_TB set password=? where user_id =?',[newPw, userId], function(e,r){
					console.log(e);
					if(e==null){
						res.json('success')
					}
				})
			}else if(fields.newPw == 'undefined'){
				db.client.query('update IDO_USER_TB set nikname=? where user_id =?',[newNick, userId], function(e,r){
					console.log('패스워드')
					console.log(e);
					if(e==null){
						res.json('success')
					}
				})
			}else{
				db.client.query('update IDO_USER_TB set nikname=?, password=? where user_id =?',[newNick, newPw, userId], function(e,r){
					console.log(e);
					if(e==null){
						res.json('success')
					}
					
				})
			}
    			
	    	for(i in files){
	    		if(typeof files[i].length == 'undefined'){ //파일이 한개일 경우 이쪽 if를 돈다.
	    			console.log('파일이 하나일 경우');
	    			var one_file = files[i];
	    			console.log('userId')
	    			console.log(userId)
	    			db.client.query('select user_email from IDO_USER_TB where user_id =?',[userId] , function(e,r){
	    				
	    				var outputPath = imagePath + base64_decode(r[0].user_email)+'.png'; // 파일명을 바꾸고 싶으면 one_file.name 앞에 바꾸자
	    				fs.rename(one_file.path, outputPath, function(err){ //파일명 변경부분
		    				
		    			});	
	    			})
	    		}
	    	}
	    });
	}else if(req.params.id=='test'){
		var form = new formidable.IncomingForm();
		var files = [];
		var fields = [];
		form.keepExtensions = true;
		//If you want the files written to form.uploadDir to include the extensions of the original files, set this property to true. (확장자 이름 써줄거냐 말거냐)
	    form.uploadDir = imagePath; //업로드할 위치 지정
	    form.maxFieldsSize = 10 * 2048*2048; //최대 업로드 크기
	    form.multiples = true; //다중업로드 여부
	    form.encoding = 'utf-8'; //인코딩
	    
	    form.parse(req,function(err, fields, files){

	    	console.log(files);
	    });
	}
}



exports.admin = function(req, res){
	res.render('main/admin/admin2.ejs'); //디테일 정보 변경
}