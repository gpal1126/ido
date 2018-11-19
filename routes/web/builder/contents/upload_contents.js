//fs - FileSystem을 구현하기 위한 모듈
var fs =require('fs');
//mysql - 모듈을 사용하기 위해 require함.
var mysql = require('mysql');
//이미지 저장 경로
var imagePath = 'resources/images/builder/contents/'; //********** 이미지 저장 경로를 바꾸고 싶으면 이쪽 path를 변경해주면 된다.
var realPath = '/images/builder/contents/';
var url = require('url');
var formidable = require('formidable');
//client = Sql의 정보들을 지정하는 모듈이다.
var client = mysql.createConnection({
    host: '14.63.163.96',
    port: '3306',
    user: 'np_6',
    password: 'neopadDb',
    database: 'ido'
});


exports.upload_contents = function(req,res){
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
    	
    	var name_value = parseInt(fields.name_value);
    	var build_image_origin = fields.build_image_origin;
    	var build_contents = fields.build_contents;
    	var contents_id = fields.contents_id;
    	var order_num = parseInt(fields.order);
    	var li_value = parseInt(fields.li_value);
    	//파일 업로드시
    	for(i in files){
    		if(typeof files[i].length == 'undefined'){ //파일이 한개일 경우 이쪽 if를 돈다.
    			console.log('파일이 하나일 경우');
    			var one_file = files.file;
    			var contents_type= 0; //컨텐츠 타입 default = 0으로 설정해둔다
    			console.log('oneFile : '+one_file.type);
    			
    			console.log('contents : '+build_contents);
    			// type별 저장 추가할 것.
    			
    			if(build_contents == '' && one_file.type=='image/png'){
    				contents_type = 0; // 이미지
    			}else if(build_contents != '' && one_file.type=='image/png'){
    				contents_type = 1; // 이미지/텍스트
    				console.log('이미지/텍스트')
    			}else if(one_file.type == 'image/gif'){
    				contents_type = 2; //이미지/GIF
    				console.log('gif')
    			}
    			
    			if(one_file.type.indexOf('image') != -1 || one_file.type.indexOf('multipart') != -1){
    				var outputPath = imagePath + one_file.name; // 파일명을 바꾸고 싶으면 one_file.name 앞에 바꾸자.
    				var db_realPath = realPath + one_file.name; //디비에 들어가는 경로값(파일)
    				fs.rename(one_file.path, outputPath, function(err){ //파일명 변경부분
    					console.log('nameValue : '+name_value);
    					console.log('contents_id : '+contents_id);
    					console.log('outputPath : '+outputPath);
    					console.log('build_image_origin : '+build_image_origin);
    					console.log('build_contents : '+build_contents);
    					console.log('order_num : '+order_num);
    					console.log('contents_type : '+contents_type);
    					client.query('INSERT INTO CONTENTS_IMAGE_TB VALUES(null, ?, ?, ?, ?, ?, ?, ?)',[contents_id, li_value, contents_type, db_realPath, build_image_origin, build_contents, order_num], function(e,r){
    						console.log(e);
    					});
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


exports.revise_contents = function(req,res){
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
    	var build_image_origin = fields.build_image_origin;
    	var build_contents = fields.build_contents;
    	var contents_id = parseInt(fields.contents_id);
    	var order_num = parseInt(fields.order);
    	var li_value = parseInt(fields.li_value);
    	if(files.file == undefined){ //이미지 변경이 없을때
    		client.query('UPDATE CONTENTS_IMAGE_TB SET CONTENTS_IMAGE_ORIGIN=?, CONTENTS=?, ORDER_NUM=? WHERE CONTENTS_ID=? AND LI_VALUE=?',[build_image_origin, build_contents, order_num, contents_id, li_value], function(e,r){
				console.log(e);
			});
    	}else{ //파일변경을 했을때
    		console.log('파일변경을 했을 때')
	    	//파일 업로드시
	    	for(i in files){
	    		if(typeof files[i].length == 'undefined'){ //파일이 한개일 경우 이쪽 if를 돈다.
	    			console.log('파일이 하나일 경우');
	    			var one_file = files.file;
	    			console.log('oneFile : '+one_file.type);
	    			if(one_file.type.indexOf('image') != -1 || one_file.type.indexOf('multipart') != -1){
	    				var outputPath = imagePath + one_file.name; // 파일명을 바꾸고 싶으면 one_file.name 앞에 바꾸자.
	    				var db_realPath = realPath + one_file.name; //디비에 들어가는 경로값(파일)
	    				
	    				console.log('origin : '+build_image_origin);
	    				console.log('build_contents : '+build_contents);
	    				console.log('contents_id : '+contents_id);
	    				console.log('order_num : '+order_num);
	    				console.log('li_value : '+li_value);
	    				console.log('db_realPath : '+db_realPath);
	    				
	    				fs.rename(one_file.path, outputPath, function(err){ //파일명 변경부분
	    					client.query('UPDATE CONTENTS_IMAGE_TB SET CONTENTS_IMAGE_PATH=?, CONTENTS_IMAGE_ORIGIN=?, CONTENTS=?, ORDER_NUM=? WHERE CONTENTS_ID=? AND LI_VALUE=?',[db_realPath, build_image_origin, build_contents, order_num, contents_id, li_value], function(e,r){
	    						console.log(e);
	    					});
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
    	}
    });
}
