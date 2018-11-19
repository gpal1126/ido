var fs =require('fs');
var mysql = require('mysql');
//인증
var sys = require('sys');
var base64_encode = require('base-64').encode;
var Buffer = require('buffer').Buffer;
var formidable = require('formidable');
var FormData = require('form-data');
var imagePath = 'resources/images/user_profile/';

//db.client = Sql의 정보들을 지정하는 모듈이다.
var db = require('../../../../db/db_base.js');

/*var client = mysql.createConnection({
    host: '14.63.163.96',
    port: '3306',
    user: 'np_6',
    password: 'neopadDb',
    database: 'ido'
});
*/

//회원가입
exports.sign_in = function(req,res){
	console.log('/sign_in');
	var form = new formidable.IncomingForm();
	var files = [];
	var fields = [];
	form.keepExtensions = true;
	//If you want the files written to form.uploadDir to include the extensions of the original files, set this property to true. (확장자 이름 써줄거냐 말거냐)
    form.uploadDir = imagePath; //업로드할 위치 지정
    form.maxFieldsSize = 10 * 1024*1024; //최대 업로드 크기
    form.multiples = true; //다중업로드 여부
    form.encoding = 'utf-8'; //인코딩
    
    form.on('fileBegin',function(name, file){ // 업로드 될때 관찰된다.
    	console.log('fileBegin-' + name + ':' + JSON.stringify(file));
    }).on('progress',function(bytesReceived,bytesExpected){ // 업로드 될때 상태바를 표시할 수 있다.
        console.log('progress-' + bytesReceived +'/' + bytesExpected);
    }).on('aborted', function(){ // 유저 요청이 중단되었을때, timeout, close 이벤트가 발생한다.
        console.log('aborted');
    }).on('error', function(){
        console.log('error');
    }).on('end', function(){
        console.log('end');
    });
    
    form.parse(req, function(err, fields, files){
    	console.log('--------------query------------');
    	console.log(req.query);
    	
    	console.log('-----------fields------------');
    	console.log(req.query.email);
    	if(typeof req.query.email != 'undefined'){ //안드로이드
    		var query = req.query;
    		var email = query.email;
        	var password = query.password;
        	var sex = query.sex;
        	if(sex =='남자'){
        		sex = 'm';
        	}else if(sex == '여자'){
        		sex='w';
        	}
        	var nickName = query.nickName;
        	var openChk = query.openChk;
        	var buf = new Buffer(email); //이메일값을 buffer로 바꿈
    		var incoding_data = base64_encode(buf); //이메일값이 인코딩 되어서 들어감
    	}else{ //웹
    	   	var name = [];
        	var path = [];
        	var type = [];
        	var email = fields.email;
        	var password = fields.password;
        	var sex = fields.sex;
        	if(sex =='남자'){
        		sex = 'm';
        	}else if(sex == '여자'){
        		sex='w';
        	}
        	var nickName = fields.nickName;
        	var openChk = fields.openChk;
        	var buf = new Buffer(email); //이메일값을 buffer로 바꿈
    		var incoding_data = base64_encode(buf); //이메일값이 인코딩 되어서 들어감
        	//파일 업로드시
        	
    	}
    
    	if(typeof files[0] =='undefined'){
    		console.log('이미지 없음')
    		var outputPath = 'resources/images/common/main/noprofile.png'
    		db.client.query('insert into IDO_USER_TB values(null, null, "1", ?, ?, ?, ?, ?, null, null, 1, ?)', [incoding_data, password, sex, outputPath, nickName, openChk], function(e,r){
				console.log(e);
				res.json("success"); //회원가입 완료 후 
			}); 
    	}else{
    		for(i in files){
        		console.log(files[i].length);
        		console.log('파일들어옴')
        		if(typeof files[i].length == 'undefined'){ //파일이 한개일 경우 이쪽 if를 돈다.
        			console.log('파일이 하나일 경우');
        			var one_file = files.file;
        			if(one_file.type.indexOf('image') != -1 || one_file.type.indexOf('multipart') != -1){
        				var outputPath = imagePath + email+'.png'; // 파일명을 바꾸고 싶으면 one_file.name을 바꾸자.
        				fs.rename(one_file.path, outputPath, function(err){ //파일명 변경부분
        					// one_file.path : 이상한 키값으로 들어간다.
        					// outputpath : 유저 이메일값으로 png파일을 만든 후 넣음.(최종 이미지 경로)
    						
        					//프로필 사진 저장완료 후 회원가입 완료
        					db.client.query('insert into IDO_USER_TB values(null, null, "1", ?, ?, ?, ?, ?, null, null, 1, ?)', [incoding_data, password, sex, outputPath, nickName, openChk], function(e,r){
        						console.log(e);
    							res.json("success"); //회원가입 완료 후 
    						}); 
        				});
        			}else{ //이미지 파일이 아닐경우.
        				fs.unlink(one_file.path, function(err){
        					res.send(400);
        				}); 
        			}
        		}
        	}
    	}
    	
    
    });
}

//로그인
exports.login = function(req,res){
	console.log('머징???');
	if(req.user == undefined){ // 로그인 안했을 때 Main화면 그냥 보여줌
//		res.render('index2.ejs', { user: req.user });
		console.log('들어오나???');
		res.render('index.ejs', { user: req.user });
	}else{ //로그인시 session(req.user)값이 있으므로 index.ejs에 user값으로 같이 보냄.
		console.log('req.user.emails::::::::::'+req.user.emails);
		if(typeof req.user.emails =='undefined'){
			console.log('회원가입 필요!!!!!!');
			res.render('index.ejs', { user: "회원가입이 필요합니다." });
		}else{
			console.log(req.user.emails);
			if(req.user.emails == 'admin@neopad.com'){
				console.log('admin')
				res.render('main/admin/admin.ejs');	
			}else{
				var user_id = req.user.userId;
				db.client.query('SELECT USER_TYPE from IDO_USER_TB where USER_ID = ?',[user_id], function(err,rst){
					console.log('유저아이디:::::::::::::');
					var user_type = rst[0].USER_TYPE;
					console.log(user_type);
					if(user_type==1){//일반유저
						res.redirect('/');	
					}else{//파트너 빌더 리스트
						res.redirect('/upload/builder_list');
					}
				});
			}
		}
	}
}

exports.m_login = function(req,res){
    console.log('모바일 m_login');
    if(req.user == undefined){ // 로그인 안했을 때 Main화면 그냥 보여줌
//      res.render('index2.ejs', { user: req.user });
        res.render('index.ejs', { user: req.user });
    }else{ //로그인시 session(req.user)값이 있으므로 index.ejs에 user값으로 같이 보냄.
        console.log('req.user.emails::::::::::'+req.user.emails);
        if(typeof req.user.emails =='undefined'){
            console.log('회원가입 필요!!!!!!');
            res.render('index.ejs', { user: "회원가입이 필요합니다." });
        }else{
            console.log(req.user.emails);
            if(req.user.emails == 'admin@neopad.com'){
                console.log('admin')
                res.render('main/admin/admin.ejs'); 
            }else{
                var user_id = req.user.userId;
                db.client.query('SELECT USER_TYPE from IDO_USER_TB where USER_ID = ?',[user_id], function(err,rst){
                    console.log('유저아이디:::::::::::::');
                    var user_type = rst[0].USER_TYPE;
                    console.log(user_type);
                    if(user_type==1){//일반유저
                        res.redirect('/');  
                    }else{//파트너 빌더 리스트
                    	console.log('로그인에러')
                        res.redirect('/');
                    }
                });
            }
        }
    }
}

//로그아웃
exports.logout = function(req,res){
	 req.logout();
	 res.redirect('/');
};
