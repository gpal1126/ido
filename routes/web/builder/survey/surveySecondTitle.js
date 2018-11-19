

var fs = require('fs');	//File System 모듈 추출
var formidable = require('formidable');	//파일 업로드
var moment = require('moment');	//형식변환
var mysql = require('mysql');	//mysql 모듈 추출

//db.client = Sql의 정보들을 지정하는 모듈이다.
var db = require('../../../../db/db_base.js');

/*var client = mysql.createConnection({
    host: '14.63.163.96',
    port: '3306',
    user: 'np_6',
    password: 'neopadDb',
    database: 'ido'
});*/

var qs = require('querystring');	//쿼리스트링 

//중질문 저장하기
exports.insertSurveySecondTitle = function(req, res){
	
	var form = new formidable.IncomingForm();
	var files = [];	//파일 선언
	var fields = [];	//파일 제외한 필드 선언
	form.keepExtensions = true;
	//If you want the files written to form.uploadDir to include the extensions of the original files, set this property to true. (확장자 이름 써줄거냐 말거냐)
    //form.uploadDir = 'resources/upload_img'; //업로드할 위치 지정
    form.maxFieldsSize = 10 * 1024*1024; //최대 업로드 크기
    form.multiples = true; //다중업로드 여부
    form.encoding = 'utf-8'; //인코딩
    
    console.log(files);
    
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
		var secondSurveyTitle = fields.secondSurveyTitle;
		var surveyType = fields.surveyType;
		var crop_image = fields.crop_image;
		var surveyId = fields.surveyId;
		var data = fields.data;
		var partnerId = fields.partnerId;
		console.log('secondSurveyTitle::'+secondSurveyTitle);
		console.log('surveyType::'+surveyType);
		console.log('surveyId::'+surveyId);
		console.log('data::'+data);
		console.log('partnerId::'+partnerId);
		console.log('cropI')
		console.log(crop_image)
		
		db.client.query('SELECT SURVEY_TITLE FROM SURVEY_TB WHERE SURVEY_ID=? ', surveyId, function(err, rst){
			console.log(rst);
			console.log('설문 타이틀 셀렉트');
			if( rst[0].SURVEY_TITLE == '' ){
				db.client.query('UPDATE SURVEY_TB SET SURVEY_TITLE=? WHERE SURVEY_ID=? ', [ secondSurveyTitle, surveyId ], function(err, rst){
					console.log('업데이트 타이틀');
					console.log(err)
				});
			}
		});
		
		var imagePath = 'resources/images/builder/survey'; //********** 이미지 저장 경로를 바꾸고 싶으면 이쪽 path를 변경해주면 된다.
		
		fs.mkdir(imagePath + '/'+partnerId, 0666, function(err){
			
		
		//쿼리를 object로 변환
		var qsObj = qs.parse(fields.data);
		console.log('secondSurveyTitle::'+secondSurveyTitle);
		
		//답변 타입 1:텍스트, 2:이미지
		var surveyAnswerType='';
		
		//중질문 답변 이미지 파일 선언
		var file = files.file;

		
		//중질문 이미지 파일 선언
		var titleFile = files.titleFile;
		
		if(file===undefined) {//텍스트 타입
			
		}else {//이미지 타입
			//답변 타입 이미지:2
			surveyAnswerType='2';
			
			if( surveyType == '5'){ //별점형
				console.log('별점형!!');
				
				var imagePath = 'resources/images/builder/survey';
				
				fs.mkdir(imagePath + '/'+partnerId + '/second_star_origin', 0666, function(err){//origin 경로
					
					fs.mkdir(imagePath + '/'+partnerId + '/second_star', 0666, function(err){//CROP 경로
						for(var i in files.file){
							i = parseInt(i);
							
							////////////////////////////////////////////
							//이미지 파일명 
							var surveyImagePath = files.file[i].name;
							
							// 파일path에서 슬래시 idx
							var pathIdx = surveyImagePath.lastIndexOf('/');
							// 파일 path에서 dot idx
							var extIdx = surveyImagePath.lastIndexOf('.');
							// 순수 파일명
							var fileName = surveyImagePath.substring(pathIdx+1, extIdx);
							
							// 확장자
							var ext = surveyImagePath.substring(extIdx+1);
							console.log('확장자:::::'+ext);
							
							// 날짜 선언
							var date = new Date().toISOString();
							console.log('날짜',date);
							
							// 날짜 형식 변환
							date = moment(date).format('YYYYMMDDHHmmss');
							console.log('날짜 형식변환 :::'+date);
							
							// 변경된 파일명                             //파일명 공백제거
							var renameFile = fileName.replace(/\s/gi, '')+'_'+(i+1)+'_'+date+'.'+ext;
							console.log('renameFile:::::::'+renameFile);
							
							//db file컬럼 정보
							var imagePath = '/images/builder/survey';
							var fileDir = imagePath + '/'+partnerId + '/second_star_origin/'+renameFile;
							
							//실제 file path 정보
							var oldPath = files.file[i].path;
							console.log('oldPath:::::'+files.file[i].path);
							console.log('::::::::::::::::::::'+typeof filePath);
							
							//변경된 path 정보
							var renamePath = 'resources'+fileDir;
							console.log('renameFile:::::'+renamePath);
							
							//기존 파일 변경하기
							fs.rename(oldPath, renamePath, function(err){
								if(err){
									res.end('error');
									return;
								}
								//res.end('seccess');
								console.log('seccess');
							});
							//////////////////////////////////////////////////////////
							
							/*Crop*/ //파일 업로드
							var imagePath2 = 'resources/images/builder/survey'; //********** 이미지 저장 경로를 바꾸고 싶으면 이쪽 path를 변경해주면 된다.
							console.log('fields::::::::::::::::::::::::::::::::::::::::::::::');
							//console.log(fields['crop_image1']);
							
							fs.writeFile(imagePath2+'/'+partnerId+'/second_star/'+fileName.replace(/\s/gi, '')+'_'+(i+1)+'_'+date+'.png', fields['crop_image'+(i+1)], 'base64', function(err) { //out1.png 컨텐츠 번호로 바꿔줘야함.
								console.log('크롭 이미지')
								console.log(err);
							});
							/*Crop*/
							
							//DB 저장 (답변 crop 이미지 패스)
							var answerCropImg = imagePath+'/'+partnerId+'/second_star/'+fileName.replace(/\s/gi, '')+'_'+(i+1)+'_'+date+'.png';
							
							//설문 컨텐츠 tb insert 쿼리
							db.client.query('INSERT INTO SURVEY_TYPE_TB(SURVEY_ID, SURVEY_TYPE, SURVEY_ANSWER_TYPE, SECOND_SURVEY_TITLE, SECOND_SURVEY_IMAGE_PATH, SECOND_SURVEY_CROP_IMAGE, IMAGE_NAME, IMAGE_ORIGIN, IMAGE_LINK_ADDR)'+
									' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
									[ surveyId, surveyType, surveyAnswerType, secondSurveyTitle, fileDir, answerCropImg, qsObj.surveyContents[i], qsObj.surveyOrigin[i], qsObj.surveyLinkAddr[i] ] , function(error, rst){
								//res.json(rst);
								console.log('설문컨텐츠 tb insert success222!');
								console.log(rst);
								console.log(error);
							});//end contents query
							
							var evaluationItemCnt = fields.evaluationItemCnt;
							var evalItemLen =  qsObj.evaluationItem.length;
							
							if(evaluationItemCnt==1){//평가항목 개수가 1개일 경우
								console.log('evalItem::'+qsObj.evaluationItem);
								db.client.query('INSERT INTO SURVEY_CONTENTS_TB(SURVEY_TYPE_ID, SURVEY_CONTENTS )'+
										' (SELECT (SELECT MAX(SURVEY_TYPE_ID) FROM SURVEY_TYPE_TB), ? )',
										[ qsObj.evaluationItem ], function(error, rst){
									//res.json(rst);
									console.log('설문컨텐츠 tb insert success222!');
									console.log(rst);
									console.log(error);
									res.end();
									//res.json(rst);
								});//end contents query
							}else {
								for(var idx=0; idx<evalItemLen; idx++){
									console.log('evalItemLen::'+evalItemLen);
									console.log('evaluationItem::'+qsObj.evaluationItem[idx]);
									idx = parseInt(idx);
									//설문 컨텐츠 tb insert 쿼리
									db.client.query('INSERT INTO SURVEY_CONTENTS_TB(SURVEY_TYPE_ID, SURVEY_CONTENTS )'+
											' (SELECT (SELECT MAX(SURVEY_TYPE_ID) FROM SURVEY_TYPE_TB), ? )',
											[ qsObj.evaluationItem[idx] ], function(error, rst){
										//res.json(rst);
										console.log('설문컨텐츠 tb insert success222!');
										console.log(rst);
										console.log(error);
										res.end();
										//res.json(rst);
									});//end contents query
								}//for
							}//if
							
						}//for
						
					});//end mkdir
					
				});//end mkdir
				
				
			}else { //별점형 제외한 유형
				console.log('별점형 제외한 유형!!');
				
				if( surveyType == '3' ){//복수선택형일 경우
					var answerNum = fields.answerNum;
					surveyType = surveyType+'N'+answerNum;
					console.log('surveyType::'+surveyType);
				}
				
				//설문 유형 tb insert 쿼리
				db.client.query('INSERT INTO SURVEY_TYPE_TB(SURVEY_ID, SURVEY_TYPE, SURVEY_ANSWER_TYPE, SECOND_SURVEY_TITLE) VALUES(?, ?, ?, ?)', 
						[ surveyId, surveyType, surveyAnswerType, secondSurveyTitle], function(error, rst){
					//res.json(rst);
					console.log('설문유형 tb insert success!');
					
					console.log(rst);
					console.log(error);
					
					var imagePath = 'resources/images/builder/survey';
					
					fs.mkdir(imagePath + '/'+partnerId + '/second_answer_origin', 0666, function(err){//origin 경로
						
						fs.mkdir(imagePath + '/'+partnerId + '/second_answer', 0666, function(err){//CROP 경로
							
							for(var i in files.file){
								i = parseInt(i);
								
								////////////////////////////////////////////
								//이미지 파일명 
								var surveyImagePath = files.file[i].name;
								
								// userId 
								var userId = 'userId';
								
								// 파일path에서 슬래시 idx
								var pathIdx = surveyImagePath.lastIndexOf('/');
								// 파일 path에서 dot idx
								var extIdx = surveyImagePath.lastIndexOf('.');
								// 순수 파일명
								var fileName = surveyImagePath.substring(pathIdx+1, extIdx);
								
								// 확장자
								var ext = surveyImagePath.substring(extIdx+1);
								console.log('확장자:::::'+ext);
								
								// 날짜 선언
								var date = new Date().toISOString();
								console.log('날짜',date);
								
								// 날짜 형식 변환
								date = moment(date).format('YYYYMMDDHHmmss');
								console.log('날짜 형식변환 :::'+date);
								
								// 변경된 파일명                             //파일명 공백제거
								var renameFile = fileName.replace(/\s/gi, '')+'_'+(i+1)+'_'+date+'.'+ext;
								console.log('renameFile:::::::'+renameFile);
								
								//db file컬럼 정보
								var imagePath = '/images/builder/survey';
	
								var fileDir = imagePath + '/'+partnerId + '/second_answer_origin/'+renameFile;
								
								//실제 file path 정보
								var oldPath = files.file[i].path;
								console.log('oldPath:::::'+files.file[i].path);
								console.log('::::::::::::::::::::'+typeof filePath);
								
								//변경된 path 정보
								var renamePath = 'resources'+fileDir;
								console.log('renameFile:::::'+renamePath);
								
								//기존 파일 변경하기
								fs.rename(oldPath, renamePath, function(err){
									if(err){
										res.end('error');
										return;
									}
									//res.end('seccess');
									console.log('seccess');
								});
								//////////////////////////////////////////////////////////
								
								/*Crop*/ //파일 업로드
								var imagePath2 = 'resources/images/builder/survey'; //********** 이미지 저장 경로를 바꾸고 싶으면 이쪽 path를 변경해주면 된다.
								console.log('fields::::::::::::::::::::::::::::::::::::::::::::::' + imagePath2+'/'+partnerId+'/second_answer/'+fileName.replace(/\s/gi, '')+'_'+(i+1)+'_'+date+'.png');
									
								//console.log(fields['crop_image1']);
								fs.writeFile(imagePath2+'/'+partnerId+'/second_answer/'+fileName.replace(/\s/gi, '')+'_'+(i+1)+'_'+date+'.png', testUrl.split('64,')[1], {encoding: 'base64'}, function(err) { //out1.png 컨텐츠 번호로 바꿔줘야함.
									console.log(fields['crop_image'+(i+1)])
									
									/*console.log(fields['crop_image'+(i+1)])*/
									console.log(err);
								});
								/*Crop*/
								
								//DB 저장 (답변 crop 이미지 패스)
								var answerCropImg = imagePath+'/'+partnerId+'/second_answer/'+fileName.replace(/\s/gi, '')+'_'+(i+1)+'_'+date+'.png';
								
								/*console.log('surveyContents i : '+qsObj.surveyContents[i]);
						console.log('surveyOrigin i : '+qsObj.surveyOrigin[i]);
						console.log('surveyLinkAddr i : '+qsObj.surveyLinkAddr[i]);*/
								
								//설문 컨텐츠 tb insert 쿼리
								db.client.query('INSERT INTO SURVEY_CONTENTS_TB(SURVEY_TYPE_ID, SURVEY_CONTENTS, SURVEY_ORIGIN, SURVEY_LINK_ADDR, SURVEY_IMAGE_PATH, SURVEY_CROP_IMAGE)'+
										' (SELECT (SELECT MAX(SURVEY_TYPE_ID) FROM SURVEY_TYPE_TB), ?, ?, ?, ?, ?)',
										[ qsObj.surveyContents[i], qsObj.surveyOrigin[i], qsObj.surveyLinkAddr[i], fileDir, answerCropImg ] , function(error, rst){
									//res.json(rst);
									console.log('설문컨텐츠 tb insert success222!');
									console.log(rst);
									console.log(error);
									
									
									//res.json(rst);
								});//end contents query
							}//for
							
						});//end mkdir
						
					});//end mkdir
					
					res.end();
				});//end title query
				
			}//if 
			
		}//if
		
		});//end mkdir
		
    });//end form.parse 
	
}

//중질문 임시저장
exports.tempStoreSvySecTitle = function(req, res){
	
	console.log('들어옴');
	var form = new formidable.IncomingForm();
	var files = [];	//파일 선언
	var fields = [];	//파일 제외한 필드 선언
	form.keepExtensions = true;
	//If you want the files written to form.uploadDir to include the extensions of the original files, set this property to true. (확장자 이름 써줄거냐 말거냐)
    //form.uploadDir = 'resources/upload_img'; //업로드할 위치 지정
    form.maxFieldsSize = 10 * 1024*1024; //최대 업로드 크기
    form.multiples = true; //다중업로드 여부
    form.encoding = 'utf-8'; //인코딩
    
    console.log(files);
    
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
    
    //설문조사 유형 id
    var surveyTypeId = req.param('surveyTypeId');
	
	form.parse(req, function(err, fields, files){
		//질문 값
		var secondSurveyTitle = fields.secondSurveyTitle;
		console.log('secondSurveyTitle::'+secondSurveyTitle);
		
		var surveyType = fields.surveyType;
		console.log('surveyType::'+surveyType);
		
		var surveyTypeId = fields.surveyTypeId;
		console.log('surveyTypeId::'+surveyTypeId);
		
		var surveyContentsId = fields.surveyContentsId;
		contsIdObj = qs.parse(surveyContentsId);
		console.log('::::');
		console.log(contsIdObj);
		console.log(contsIdObj.surveyContentsId[0]);
		console.log(contsIdObj.surveyContentsId[1]);
		
		//쿼리를 object로 변환
		var qsObj = qs.parse(fields.data);
		var data = fields.data;
		console.log('data::::');
		console.log(data);
		
		//응답수
		var answerNum = fields.answerNum;
		console.log('answerNum::'+answerNum);
		
		var partnerId = fields.partnerId;
		console.log('partnerId::'+partnerId);
		
		//console.log('files.file');
		//console.log(files.file);
		
		var crop_image = fields.crop_image;
		console.log('crop_image::'+crop_image);
		
		//컨텐츠 전체(이미지, id, 컨텐츠 txt)
		/*var contsJson = fields.contsJson;
		contsJson = JSON.parse(contsJson);
		console.log(files.file);*/
		
		/*var titleFile = files.titleFile;
		console.log('titleFile');
		console.log(titleFile);*/
		
		if(surveyType == '5'){	//별점채점형일 경우
			console.log('별점채점형!');
		}else {//별점채점형을 제외한 유형
			console.log('별점채점형 제외한 유형!');
			
			if( surveyType == '3' ){//복수선택형일 경우
				surveyType = surveyType+'N'+answerNum;
				console.log('surveyType::'+surveyType);
			}
			
			//survey_type_tb 수정
			db.client.query('UPDATE SURVEY_TYPE_TB SET SURVEY_TYPE=?, SECOND_SURVEY_TITLE=? WHERE SURVEY_TYPE_ID=?', [ surveyType, secondSurveyTitle, surveyTypeId], function(err, rst){
				console.log('err');
				console.log(err);
				//console.log(rst);
			});
			
			if(files.file === undefined){ //텍스트만 수정
				console.log('텍스트만 수정');
				
				for(var i=0; i<answerNum; i++){
					i = parseInt(i);
					console.log('i::'+i);
					
					db.client.query('UPDATE SURVEY_CONTENTS_TB SET SURVEY_ORIGIN=?, SURVEY_CONTENTS=?, SURVEY_LINK_ADDR=? WHERE SURVEY_TYPE_ID=? AND SURVEY_CONTENTS_ID=? '
							, [ qsObj.surveyOrigin[i], qsObj.surveyContents[i], qsObj.surveyLinkAddr[i], surveyTypeId, contsIdObj.surveyContentsId[i]  ], function(){
						
					});
					
				}//for
				
			}else if(files.file !== undefined){ //텍스트+이미지 수정
				console.log('텍스트+이미지 수정');
				
				for(var i in files){
					//i = parseInt(i);
					
					console.log('files[i].length');
					console.log(files[i].length);
					
					if( files[i].length == undefined ){//이미지 1개만 수정
						console.log('이미지 한개 수정');
						
						console.log(files[i]);
						console.log(files[i].name);
						
						////////////////////////////////////////////
						//이미지 파일명 
						var surveyImagePath = files[i].name;
						console.log('surveyImagePath ::');
						console.log(surveyImagePath);
						// 파일path에서 슬래시 idx
						var pathIdx = surveyImagePath.lastIndexOf('/');
						// 파일 path에서 dot idx
						var extIdx = surveyImagePath.lastIndexOf('.');
						// 순수 파일명
						var fileName = surveyImagePath.substring(pathIdx+1, extIdx);
						
						// 확장자
						var ext = surveyImagePath.substring(extIdx+1);
						console.log('확장자:::::'+ext);
						
						// 날짜 선언
						var date = new Date().toISOString();
						console.log('날짜',date);
						
						// 날짜 형식 변환
						date = moment(date).format('YYYYMMDDHHmmss');
						console.log('날짜 형식변환 :::'+date);
						
						// 변경된 파일명                             //파일명 공백제거
						var renameFile = fileName.replace(/\s/gi, '')+'_'+1+'_'+date+'.'+ext;
						console.log('renameFile:::::::'+renameFile);
						
						//db file컬럼 정보
						var imagePath = '/images/builder/survey';
						var fileDir = imagePath + '/'+partnerId + '/second_answer_origin/'+renameFile;
						
						//실제 file path 정보
						var oldPath = files[i].path;
						console.log('oldPath:::::'+files[i].path);
						console.log('::::::::::::::::::::'+typeof filePath);
						
						//변경된 path 정보
						var renamePath = 'resources'+fileDir;
						console.log('renameFile:::::'+renamePath);
						
						//기존 파일 변경하기
						fs.rename(oldPath, renamePath, function(err){
							if(err){
								res.end('error');
								return;
							}
							//res.end('seccess');
							console.log('seccess');
						});
						//////////////////////////////////////////////////////////
						
						for(var j=0; j<answerNum; j++){
							j = parseInt(j);
							console.log('j::'+j);	
							var imagePath2 = 'resources/images/builder/survey'; //********** 이미지 저장 경로를 바꾸고 싶으면 이쪽 path를 변경해주면 된다.
							console.log('fields::::::::::::::::::::::::::::::::::::::::::::::');
							//console.log(fields['crop_image'+(j+1)]);
							if(fields['crop_image'+(j+1)] !== undefined){ //이미지가 있는 응답
								
								/*Crop*/ 
								//파일 업로드
								fs.writeFile(imagePath2+'/'+partnerId+'/second_answer/'+fileName.replace(/\s/gi, '')+'_'+(j+1)+'_'+date+'.png', fields['crop_image'+(j+1)], 'base64', function(err) { //out1.png 컨텐츠 번호로 바꿔줘야함.
									console.log('크롭 이미지')
									console.log(err);
								});
								//DB 저장 (답변 crop 이미지 패스)
								var answerCropImg = imagePath+'/'+partnerId+'/second_answer/'+fileName.replace(/\s/gi, '')+'_'+(j+1)+'_'+date+'.png';
								/*Crop*/
								
								db.client.query('UPDATE SURVEY_CONTENTS_TB SET SURVEY_ORIGIN=?, SURVEY_CONTENTS=?, SURVEY_LINK_ADDR=?, SURVEY_IMAGE_PATH=?, SURVEY_CROP_IMAGE=? WHERE SURVEY_TYPE_ID=? AND SURVEY_CONTENTS_ID=? '
										, [ qsObj.surveyOrigin[j], qsObj.surveyContents[j], qsObj.surveyLinkAddr[j], fileDir, answerCropImg, surveyTypeId, contsIdObj.surveyContentsId[j]  ], function(){
											
								});
								
							}else { //이미지가 없는 응답
								db.client.query('UPDATE SURVEY_CONTENTS_TB SET SURVEY_ORIGIN=?, SURVEY_CONTENTS=?, SURVEY_LINK_ADDR=? WHERE SURVEY_TYPE_ID=? AND SURVEY_CONTENTS_ID=? '
										, [ qsObj.surveyOrigin[j], qsObj.surveyContents[j], qsObj.surveyLinkAddr[j], surveyTypeId, contsIdObj.surveyContentsId[j]  ], function(){
											
								});
							}
							
						
						}
					}else { //이미지 여러개 수정
						console.log('이미지 여러개 수정');
						
						for(var j in files.file){
							j = parseInt(j);
							
							////////////////////////////////////////////
							console.log(files.file[j]);
							//이미지 파일명 
							var surveyImagePath = files.file[j].name;
							console.log('surveyImagePath ::');
							console.log(surveyImagePath);
							// 파일path에서 슬래시 idx
							var pathIdx = surveyImagePath.lastIndexOf('/');
							// 파일 path에서 dot idx
							var extIdx = surveyImagePath.lastIndexOf('.');
							// 순수 파일명
							var fileName = surveyImagePath.substring(pathIdx+1, extIdx);
							
							// 확장자
							var ext = surveyImagePath.substring(extIdx+1);
							console.log('확장자:::::'+ext);
							
							// 날짜 선언
							var date = new Date().toISOString();
							console.log('날짜',date);
							
							// 날짜 형식 변환
							date = moment(date).format('YYYYMMDDHHmmss');
							console.log('날짜 형식변환 :::'+date);
							
							// 변경된 파일명                             //파일명 공백제거
							var renameFile = fileName.replace(/\s/gi, '')+'_'+(j+1)+'_'+date+'.'+ext;
							console.log('renameFile:::::::'+renameFile);
							
							//db file컬럼 정보
							var imagePath = '/images/builder/survey';
							var fileDir = imagePath + '/'+partnerId + '/second_answer_origin/'+renameFile;
							
							//실제 file path 정보
							var oldPath = files.file[j].path;
							console.log('oldPath:::::'+files.file[j].path);
							console.log('::::::::::::::::::::'+typeof filePath);
							
							//변경된 path 정보
							var renamePath = 'resources'+fileDir;
							console.log('renameFile:::::'+renamePath);
							
							//기존 파일 변경하기
							fs.rename(oldPath, renamePath, function(err){
								if(err){
									res.end('error');
									return;
								}
								//res.end('seccess');
								console.log('seccess');
							});
							//////////////////////////////////////////////////////////
							
							/*Crop*/ 
							//파일 업로드
							var imagePath2 = 'resources/images/builder/survey'; //********** 이미지 저장 경로를 바꾸고 싶으면 이쪽 path를 변경해주면 된다.
							console.log('fields::::::::::::::::::::::::::::::::::::::::::::::');
							//console.log(fields['crop_image1']);
							fs.writeFile(imagePath2+'/'+partnerId+'/second_answer/'+fileName.replace(/\s/gi, '')+'_'+(j+1)+'_'+date+'.png', fields['crop_image'+(j+1)], 'base64', function(err) { //out1.png 컨텐츠 번호로 바꿔줘야함.
								console.log('크롭 이미지')
								console.log(err);
							});
							
							//DB 저장 (답변 crop 이미지 패스)
							var answerCropImg = imagePath+'/'+partnerId+'/second_answer/'+fileName.replace(/\s/gi, '')+'_'+(j+1)+'_'+date+'.png';
							/*Crop*/
							
							
							db.client.query('UPDATE SURVEY_CONTENTS_TB SET SURVEY_ORIGIN=?, SURVEY_CONTENTS=?, SURVEY_LINK_ADDR=?, SURVEY_IMAGE_PATH=?, SURVEY_CROP_IMAGE=? WHERE SURVEY_TYPE_ID=? AND SURVEY_CONTENTS_ID=? '
									, [ qsObj.surveyOrigin[j], qsObj.surveyContents[j], qsObj.surveyLinkAddr[j], fileDir, answerCropImg, surveyTypeId, contsIdObj.surveyContentsId[j]  ], function(){
								
							});
						}
						
					}//if
				}//for
				
			}//if
			
			
		}//if
		
		
		
		
		
		res.end();
	});//end form parse
};

//중질문 삭제
exports.deleteSurveyType = function(req, res){
	var surveyTypeId = req.param('surveyTypeId');
	//console.log('surveyTypeId::'+surveyTypeId);
	//설문 삭제시 컨텐츠 이미지들 삭제
	db.client.query('SELECT survey_image_path FROM SURVEY_CONTENTS_TB WHERE SURVEY_TYPE_ID=?', [surveyTypeId], function(error, rst){
		for(var i in rst){
			//console.log('survey_image_path'+rst[i].survey_image_path);
			if(rst[i].survey_image_path!=null){
				fs.unlinkSync('resources'+rst[i].survey_image_path);
			}
		}//for
	});
	
	//return false;
	db.client.query('DELETE FROM SURVEY_TYPE_TB WHERE SURVEY_TYPE_ID=?', [surveyTypeId], function(error, rst){
		console.log('딜리트!!!!');
		console.log('surveyTypeId::'+surveyTypeId);
		console.log(error);
	});
}

//이미지일 때 중질문에 대한 해당 답변 삭제
exports.deleteConts = function(req, res){
	var contsId = req.param('contsId');
	console.log('contsId::'+contsId);
	//설문 컨텐츠 이미지 삭제
	if(contsId != null){
		db.client.query('SELECT survey_image_path FROM SURVEY_CONTENTS_TB WHERE SURVEY_CONTENTS_ID=?', [contsId], function(error, rst){
			//console.log(rst[0].survey_image_path);
			if(rst[0].survey_image_path!=null){
				fs.unlinkSync('resources'+rst[0].survey_image_path);
			}
		});
	}
	
	db.client.query('DELETE FROM SURVEY_CONTENTS_TB WHERE SURVEY_CONTENTS_ID=?', [contsId], function(error, rst){
		console.log('contsId::'+contsId);
	});
}

