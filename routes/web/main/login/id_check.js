var mysql = require('mysql');
var fs =require('fs');
var base64_encode = require('base-64').encode;
var base64_decode = require('base-64').decode;
var Buffer = require('buffer').Buffer;
var formidable = require('formidable');
var imagePath = 'resources/images/';
//client = Sql의 정보들을 지정하는 모듈이다.
var client = mysql.createConnection({
    host: '14.63.163.96',
    port: '3306',
    user: 'np_6',
    password: 'neopadDb',
    database: 'ido'
});

exports.html=function(req,res){
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
    form.parse(req,function(err, fields, files){
    	console.log('err : '+err);
    	var name = [];
    	var path = [];
    	var type = [];
    	
    	console.log(fields.li); //fileds로 값들을 받음.
    	 
    	//파일 업로드시
    	for(i in files){
    		console.log(files[i].length);
    		if(typeof files[i].length == 'undefined'){ //파일이 한개일 경우 이쪽 if를 돈다.
    			console.log('파일이 하나일 경우');
    			var one_file = files.file;
    			console.log('oneFile : '+one_file.type);
    			if(one_file.type.indexOf('image') != -1 || one_file.type.indexOf('multipart') != -1){
    				var outputPath = imagePath + one_file.name; // 파일명을 바꾸고 싶으면 one_file.name 앞에 바꾸자.
    				fs.rename(one_file.path, outputPath, function(err){ //파일명 변경부분  	
    				});
    			}else{ //이미지 파일이 아닐경우.
    				fs.unlink(one_file.path, function(err){
    					res.send(400);
    				}); 
    			}
    		}else{ //파일이 여러개일 경우 이쪽을 돈다.
    			console.log('파일이 여러개일 경우');
	    		for(var j=0; j<files[i].length; j++){
	    			
	    			console.log('?? : '+files[i].length);
	    			console.log('value : ' + files[i][j].name); 
	    			name.push(files[i][j].name);
	    			path.push(files[i][j].path);
	    			type.push(files[i][j].type);
	    			if(type[j].indexOf('image') != -1){
	    				var outputPath = imagePath + name[j];
	    				fs.rename(path[j], outputPath, function(err){ //파일명 변경부분   			
	    				});
	    			}else{ //이미지 파일이 아닐경우.
	    				fs.unlink(path, function(err){
	    					res.send(400);
	    				});
	    			} 
	    		}
    		}
    	}
    });
    
}


//ID 여부 확인 부분
exports.check_id = function(req,res){
	console.log('req.id : '+req.params.id);
	if(req.params.id == 'email'){    // 이메일 검사부분
		console.log(req.query);
		var email = req.query.email;
		var buf = new Buffer(email); //이메일값을 buffer로 바꿈
		var incoding_data = base64_encode(buf); //이메일값이 인코딩 되어서 들어감
		
		client.query('select * from IDO_USER_TB where user_email = ?', incoding_data, function(e,r){
			if(r[0] == undefined){ //값이 없으면 success
				res.json('success');
			}else{ //값이 있으면 fail
				res.json('fail');
			}
		});
	}else if(req.params.id == 'nickName'){ // 닉네임 검사부분 
		var nickName = req.query.nickName;
		client.query('select * from IDO_USER_TB where NIKNAME = ?', nickName, function(e,r){
			console.log(r[0]);
			if(r[0] == undefined){ //값이 없으면 success
				res.json('success');
			}else{ //값이 있으면 fail
				res.json('fail');
			}
		});	
	}else if(req.param.id == 'upload'){
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
	    	var file_size = files.file.name
	       	var name = [];
	    	var path = [];
	    	var type = [];

	    	//파일 업로드시
	    	for(i in files){
	    		console.log(files[i].length);
	    		if(typeof files[i].length == 'undefined'){ //파일이 한개일 경우 이쪽 if를 돈다.
	    			console.log('파일이 하나일 경우');
	    			var one_file = files.file;
	    			console.log('oneFile : '+one_file.type);
	    			if(one_file.type.indexOf('image') != -1 || one_file.type.indexOf('multipart') != -1){
	    				var outputPath = imagePath + one_file.name; // 파일명을 바꾸고 싶으면 one_file.name 앞에 바꾸자.
	    				fs.rename(one_file.path, outputPath, function(err){ //파일명 변경부분  	
	    				});
	    			}else{ //이미지 파일이 아닐경우.
	    				fs.unlink(one_file.path, function(err){
	    					res.send(400);
	    				}); 
	    			}
	    		}else{ //파일이 여러개일 경우 이쪽을 돈다.
	    			console.log('파일이 여러개일 경우');
		    		for(var j=0; j<files[i].length; j++){
		    			
		    			console.log('?? : '+files[i].length);
		    			console.log('value : ' + files[i][j].name); 
		    			name.push(files[i][j].name);
		    			path.push(files[i][j].path);
		    			type.push(files[i][j].type);
		    			if(type[j].indexOf('image') != -1){
		    				var outputPath = imagePath + name[j];
		    				fs.rename(path[j], outputPath, function(err){ //파일명 변경부분   			
		    				});
		    			}else{ //이미지 파일이 아닐경우.
		    				fs.unlink(path, function(err){
		    					res.send(400);
		    				});
		    			} 
		    		}
	    		}
	    	}
	    });
	}else if(req.params.id=='facebook'){ //facebook id check
		console.log(req.session.passport.user)
		if(req.session.passport.user.emails != null){
			var email = base64_encode(req.query.email);
			client.query('select USER_EMAIL from FACEBOOK_USER_TB WHERE USER_EMAIL=?', email, function(e,r){
				if(r[0] == undefined){ //값이 없으면 facebook_user_tb에 저장됨.
					client.query('insert into FACEBOOK_USER_TB values(null, ?)', email, function(e,r){
						res.redirect('/');
					});
				}else{ //값이 있으면 fail
					res.redirect('/');
				}
			});	
		}else{
			res.redirect('/');
		}	
	}else if(req.params.id=='naver'){ //facebook id check
		console.log('NAVER ::::: ')
		console.log(req.session.passport.user)
		if(req.session.passport.user.emails != null){
			res.redirect('/');
		}else{
			res.redirect('/');
		}	
	}
};