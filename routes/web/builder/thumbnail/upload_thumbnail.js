var formidable = require('formidable');
var imagePath = 'resources/images/builder/thumbnail/'; //********** 이미지 저장 경로를 바꾸고 싶으면 이쪽 path를 변경해주면 된다.
var fs =require('fs');
var base64_decode = require('base-64').decode;
var mysql = require('mysql');
var client = mysql.createConnection({
    host: '14.63.163.96',
    port: '3306',
    user: 'np_6',
    password: 'neopadDb',
    database: 'ido'
});
exports.upload_thumbnail = function(req,res){
	var form = new formidable.IncomingForm();
	var files = [];
	var fields = [];
	form.keepExtensions = true;
	//If you want the files written to form.uploadDir to include the extensions of the original files, set this property to true. (확장자 이름 써줄거냐 말거냐)
    form.uploadDir = imagePath; //업로드할 위치 지정
    form.maxFieldsSize = 10 * 1024*1024; //최대 업로드 크기
    form.multiples = true; //다중업로드 여부
    form.encoding = 'utf-8'; //인코딩
    
    form.parse(req,function(err, fields, files){
    	var title = fields.title;
    	console.log('title::::'+title);
    	var thumbnailContents = fields.thumbnailContents;
    	console.log('thumbnailContents::::'+thumbnailContents);
    	var category = fields.category;
    	var imageType = fields.imageType;
    	console.log('imageType::::'+imageType);
    	var partnerId = fields.partnerId;
    	var contentsChk = fields.contentsChk;
    	console.log('contentsChk::::'+contentsChk);
    	
    	if(contentsChk == 1){//설문만
    		client.query('SET foreign_key_checks = 0');
			client.query('INSERT INTO IDO_CONTENTS_TB(PARTNER_ID, CONTENTS_TYPE, TITLE, THUMBNAIL_CONTENTS, REG_DATE, CATEGORY, IMAGE_TYPE, CONTENTS_CHK, CLICK_COUNT) VALUES(?, 1, NULL, NULL, now(), ?, "N", ?, 1)',[partnerId, category, contentsChk], function(e,r){ //썸네일과 제목입력하는 query부분
				console.log('error : '+e);
				client.query('SELECT LAST_INSERT_ID()',function(e,r){
					if(e == null){
						for(i in r[0]){
							console.log('only survey!!');
							console.log(r[0][i])
							/*컨텐츠 이미지 테이블에 빈값 넣음*/
							client.query('INSERT INTO CONTENTS_IMAGE_TB(CONTENTS_ID) VALUES(?)', r[0][i], function(e2, r2){
								console.log('e2222222222::'+e2);
							});
                            client.query('INSERT INTO SURVEY_TB values(null, ?, ?, null)', [r[0][i], title], function(error, rst){
                                client.query('SELECT MAX(survey_id) as surveyId FROM SURVEY_TB', function(error, rst){
                					//console.log(rst[0].surveyId);
                					console.log(rst);
                					var json = {'contentsId':r[0][i], 'surveyId':rst};
                					res.json(json);
                				});//end select query
                            });
						}
					}else{
						res.json('fail');
					}   
				})
			});
    	}else if(contentsChk == 2){ //컨텐츠+설문
    		if(typeof fields.thumbnail != 'undefined'){
    			var sImage = base64_decode(fields.thumbnail);
    			fs.mkdir(imagePath + '/'+partnerId, 0666, function(err){
    				fs.writeFile(imagePath + partnerId +'/'+ partnerId+'_'+title+'.png', fields.thumbnail, 'base64', function(err) { //out1.png 컨텐츠 번호로 바꿔줘야함.
    					var thumbnailPath = imagePath + partnerId +'/'+ partnerId+'_'+title+'.png';
    					var insertPath = thumbnailPath.split('resources/'); //view단에서 이미지를 받아올때는 resources폴더가 기준이기 때문에 내부 폴더부터 경로가 시작되어야한다. 그래서 경로 resources부분을 잘라야함.
    					console.log(insertPath[1]);
    					client.query('SET foreign_key_checks = 0');
    					client.query('INSERT INTO IDO_CONTENTS_TB VALUES(null, ?, ?, ?, ?, ?, now(), ?, ?, ?, 1)',[partnerId, '1', title, thumbnailContents, insertPath[1], category, imageType, contentsChk], function(e,r){ //썸네일과 제목입력하는 query부분
    						console.log('upload_thumbnail error : '+e);
    						client.query('SELECT LAST_INSERT_ID()',function(e,r){
    							if(e == null){
    								for(i in r[0]){
    									console.log('컨텐츠+설문?? crop');
    									console.log(r[0][i])
    									/*컨텐츠 이미지 테이블에 빈값 넣음*/
    									client.query('INSERT INTO CONTENTS_IMAGE_TB(CONTENTS_ID) VALUES(?)', r[0][i], function(e2, r2){
    										console.log('e2222222222::'+e2);
    										res.json(r[0][i]);
    									});
    								}
    							}else{
    								res.json('fail');
    							}   
    						})
    					});
    					console.log(err);
    				});
    			}) 
    		}else{
    			var outputPath = files.gif.path.split('resources/')[1];
    			fs.rename(files.gif.path, outputPath, function(err){ //파일명 변경부분
    				client.query('SET foreign_key_checks = 0');
    				client.query('INSERT INTO IDO_CONTENTS_TB VALUES(null, ?, ?, ?, ?, ?, now(), ?, ?, ?, 1)',[partnerId, '1', title, thumbnailContents, outputPath, category, imageType, contentsChk], function(e,r){ //썸네일과 제목입력하는 query부
    					console.log('upload_thumbnail error : '+e);
    					client.query('SELECT LAST_INSERT_ID()',function(e,r){
    						if(e == null){
    							for(i in r[0]){
    								console.log('컨텐츠+설문?? gif');
    								console.log(r[0][i])
    								/*컨텐츠 이미지 테이블에 빈값 넣음*/
    								client.query('INSERT INTO CONTENTS_IMAGE_TB(CONTENTS_ID) VALUES(?)', r[0][i], function(e2, r2){
    									console.log('e2222222222::'+e2);
    									res.json(r[0][i]);
    								});
    							}
    						}else{
    							res.json('fail');
    						}   
    					})
    				});
    			});
    		}//end if
    	}//end if

    });

}

exports.revise_thumbnail = function(req,res){
	console.log('썸네일 수정 ');
	var form = new formidable.IncomingForm();
	var files = [];
	var fields = [];
	form.keepExtensions = true;
	//If you want the files written to form.uploadDir to include the extensions of the original files, set this property to true. (확장자 이름 써줄거냐 말거냐)
    form.uploadDir = imagePath; //업로드할 위치 지정
    form.maxFieldsSize = 10 * 1024*1024; //최대 업로드 크기
    form.multiples = true; //다중업로드 여부
    form.encoding = 'utf-8'; //인코딩
    
    form.parse(req,function(err, fields, files){
    	var title = fields.title;
    	var thumbnailContents = fields.thumbnailContents;
    	console.log('thumbnailContents::::'+thumbnailContents);
    	var category = fields.category;
    	console.log('category::::'+category);
    	var imageType = fields.imageType;
    	console.log('imageType::::'+imageType);
    	var partnerId = fields.partnerId;
    	var thumbnail = fields.thumbnail;
    	console.log('thumbnail::::'+thumbnail);
		var contents_id =fields.contentsId;
		console.log('contentsId : '+contents_id);
		console.log('Type : '+imageType);
		var contentsChk = fields.contentsChk;
		
		if(contentsChk == 1){ //설문만
			client.query('SET foreign_key_checks = 0');
			client.query('UPDATE IDO_CONTENTS_TB SET TITLE=NULL, THUMBNAIL_CONTENTS=NULL, THUMBNAIL_IMAGE_PATH=NULL,  CATEGORY=?, IMAGE_TYPE="N", CONTENTS_CHK=1 WHERE CONTENTS_ID =?',[category, contents_id], function(e,r){
				console.log('only survey update error : '+e);
				res.send('update_success');
			});
			console.log(err);
		}else if(contentsChk == 2){ //컨텐츠+설문
			if(thumbnail === undefined){//이미지 수정을 하지 않으면
				console.log('thumbnail undefiend!!!!!!!!!!!!!');
				client.query('SET foreign_key_checks = 0');
				
				client.query('UPDATE IDO_CONTENTS_TB SET TITLE=?, THUMBNAIL_CONTENTS=?, CATEGORY=?, IMAGE_TYPE=?, CONTENTS_CHK=? WHERE CONTENTS_ID =?',[title, thumbnailContents, category, imageType, contentsChk, contents_id], function(e,r){
					console.log('upload_thumbnail error : '+e);
					res.send('update_success');
				});
			}else if(thumbnail !== undefined){//이미지 수정을 하면
				var sImage = base64_decode(thumbnail);
				fs.mkdir(imagePath + '/'+partnerId, 0666, function(err){
					fs.writeFile(imagePath + partnerId +'/'+ partnerId+'_'+title+'.png', fields.thumbnail, 'base64', function(err) { //out1.png 컨텐츠 번호로 바꿔줘야함.
						var thumbnailPath = imagePath + partnerId +'/'+ partnerId+'_'+title+'.png';
						var insertPath = thumbnailPath.split('resources/'); //view단에서 이미지를 받아올때는 resources폴더가 기준이기 때문에 내부 폴더부터 경로가 시작되어야한다. 그래서 경로 resources부분을 잘라야함.
						console.log(insertPath[1]);
						client.query('SET foreign_key_checks = 0');
						console.log(imageType);
						client.query('UPDATE IDO_CONTENTS_TB SET TITLE=?, THUMBNAIL_CONTENTS=?, THUMBNAIL_IMAGE_PATH=?, CATEGORY=?, IMAGE_TYPE=?, CONTENTS_CHK=? WHERE CONTENTS_ID =?',[title, thumbnailContents, insertPath[1], category, imageType, contentsChk, contents_id], function(e,r){
							console.log('upload_thumbnail error : '+e);
							res.send('update_success');
						});
						console.log(err);
					});
				})
			}
		}
    
    	
	    	
	    		//파일 업로드시
//		if(typeof files.thumbnail == 'undefined'){ //파일 여부 확인
//			client.query('UPDATE IDO_CONTENTS_TB SET TITLE=?, CATEGORY=? WHERE CONTENTS_ID =?',[title, category, contents_id], function(e,r){
//				console.log('upload_thumbnail error : '+e);
//				res.send('update_success')
//			});
//		}else{
//			var one_file = files.thumbnail;
//			if(one_file.type.indexOf('image') != -1 || one_file.type.indexOf('multipart') != -1){
//				var outputPath = imagePath + one_file.name; // 파일명을 바꾸고 싶으면 one_file.name 앞에 바꾸자.
//				fs.rename(one_file.path, outputPath, function(err){ //파일명 변경부분
//					var insertPath = outputPath.split('resources/'); //view단에서 이미지를 받아올때는 resources폴더가 기준이기 때문에 내부 폴더부터 경로가 시작되어야한다. 그래서 경로 resources부분을 잘라야함.
//					client.query('UPDATE IDO_CONTENTS_TB SET TITLE=?, THUMBNAIL_IMAGE_PATH=?, CATEGORY=? WHERE CONTENTS_ID =?',[title, insertPath[1], category, contents_id], function(e,r){
//						console.log('upload_thumbnail error : '+e);
//						res.send('update_success');
//					});
//				});
//			}else{ //이미지 파일이 아닐경우.
//				fs.unlink(one_file.path, function(err){
//					res.send(400);
//				}); 
//	    	}
    });
};