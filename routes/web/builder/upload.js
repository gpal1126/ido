var builder_thumbnail = require('./thumbnail/upload_thumbnail.js');
var builder_contents = require('./contents/upload_contents.js'); //upload_buider_contents 부분
var viewSurveyTitle = require('./survey/surveyTitle.js');	//대질문 등록폼 띄우기
var viewSurveySecondTitle = require('./survey/surveySecondTitle.js');	//중질문

//fs - FileSystem을 구현하기 위한 모듈
var fs =require('fs');
//mysql - 모듈을 사용하기 위해 require함.
var mysql = require('mysql');
//htmlPath 지정   
var base64_encode = require('base-64').encode;
var Buffer = require('buffer').Buffer;
var htmlPath = 'resources/html/';
var imagePath = 'resources/images/';
var url = require('url');
var formidable = require('formidable');
//db.client = Sql의 정보들을 지정하는 모듈이다.
var db = require('../../../db/db_base.js');
    

//upload위한 GET요청시 들어오는 곳
exports.upload_form = function(req,res){ // Upload 부분 (Get 요청시)
	//웹 list부분
	if(req.params.id == 'builder_list'){ 
		if(typeof req.user =='undefined'){
			//partner login 페이지 띄워주기
			console.log('login 요청');
			res.render('main/user/login_partner.ejs');
		}else{
			//인코딩 된 이메일값으로 확인
			var buf = new Buffer(req.user.emails); //이메일값을 buffer로 바꿈
			var encEmail = base64_encode(buf); //이메일값이 인코딩 되어서 들어감
			//session 값 확인
			db.client.query('select PARTNER_ID, PROFILE_PICTURE_PATH, NIKNAME from IDO_USER_TB where USER_EMAIL = ?',[encEmail], function(e,r){
				console.log(r[0].PARTNER_ID);
				if(r[0].PARTNER_ID == null){
					//파트너 유저 전환화면 제공
					console.log('파트너 유저가 아닙니다.');
					res.json('NO_PARTNER')
				}else{
					db.client.query('SELECT TB1.CONTENTS_ID, TB1.CONTENTS_TYPE ,TB2.SURVEY_TITLE, DATE_FORMAT(TB1.REG_DATE, "%Y/%m/%d") REG_DATE FROM IDO_CONTENTS_TB TB1 LEFT JOIN SURVEY_TB TB2 ON TB1.CONTENTS_ID = TB2.CONTENTS_ID WHERE TB1.PARTNER_ID = ? ORDER BY TB1.CONTENTS_ID;',[r[0].PARTNER_ID], function(e,result){
						res.render('builder/list/list.ejs', { list: result , partnerId:r[0].PARTNER_ID});
					});
				}
			});
		}
	}
	
	//모바일웹 m_list 부분
	if(req.params.id == 'm_builder_list'){ 
		console.log('m_builder_list 요청')
		if(typeof req.user =='undefined'){
			//partner login 페이지 띄워주기
			if(typeof req.param('userId') != 'undefined'){ // 안드로이드 에디터 접근
				var buf = new Buffer(req.param('email')); //이메일값을 buffer로 바꿈
				console.log('안드로이드접근');
				var encEmail = base64_encode(buf); //이메일값이 인코딩 되어서 들어감
				//session 값 확인
				db.client.query('select PARTNER_ID, PROFILE_PICTURE_PATH, NIKNAME from IDO_USER_TB where USER_EMAIL = ?',[encEmail], function(e,r){
					//console.log('파트너유저 아이디 : '+r[0].PARTNER_ID);
					console.log(r);
					if(r[0] == null || typeof r[0] =="undefined"){
						//파트너 유저 전환화면 제공
						res.send('<script type="text/javascript">alert("파트너 유저 신청후 이용가능한 서비스입니다"); location.href="/"</script>');
					}else{
						db.client.query('SELECT TB1.CONTENTS_ID, TB1.CONTENTS_TYPE, TB2.SURVEY_ID, TB2.SURVEY_TITLE, DATE_FORMAT(TB1.REG_DATE, "%Y/%m/%d") REG_DATE FROM IDO_CONTENTS_TB TB1 LEFT JOIN SURVEY_TB TB2 ON TB1.CONTENTS_ID = TB2.CONTENTS_ID WHERE TB1.PARTNER_ID = ? ORDER BY TB1.CONTENTS_ID',[r[0].PARTNER_ID], function(e,result){
							var titleArray = new Array();
							if(result[0] == null){
								titleArray.push('');
								res.render('builder/list/mobile_list.ejs', {title:titleArray, list: result , partnerId:r[0].PARTNER_ID});	
							}else{
								for(i in result){
									
									(function(i){
										db.client.query('SELECT SECOND_SURVEY_TITLE FROM SURVEY_TYPE_TB WHERE SURVEY_ID = ?',[result[i].SURVEY_ID],function(err,surveyTypeResult){
											console.log(surveyTypeResult[0])
											console.log('---------------------')
											if(typeof surveyTypeResult[0]=='undefined'){
												titleArray.push('');
												if(parseInt(i)+1 ==result.length){
													console.log('if')
													res.render('builder/list/mobile_list.ejs', {title:titleArray, list: result , partnerId:r[0].PARTNER_ID});	
												}
											}else{
												console.log('else')
												titleArray.push(surveyTypeResult[0].SECOND_SURVEY_TITLE)
												if(parseInt(i)+1 ==result.length){
													console.log('?')
													res.render('builder/list/mobile_list.ejs', {title:titleArray, list: result , partnerId:r[0].PARTNER_ID});	
												}
												
											}
											
										})
									})(i);
								}
							}
							
							/*for(i in result){
								
								
							}*/
							
							
						});
					}
				});
			}else{ //로컬 접근
				console.log('login 요청');
				res.render('main/user/m_login_partner.ejs');	
			}
		}else{
			console.log('페이스북 로그인')
			//인코딩 된 이메일값으로 확인
			var buf = new Buffer(req.user.emails); //이메일값을 buffer로 바꿈
			var encEmail = base64_encode(buf); //이메일값이 인코딩 되어서 들어감
			//session 값 확인
			db.client.query('select PARTNER_ID, PROFILE_PICTURE_PATH, NIKNAME from IDO_USER_TB where USER_EMAIL = ?',[encEmail], function(e,r){
				//console.log('파트너유저 아이디 : '+r[0].PARTNER_ID);
				console.log(r);
				if(r[0] == null || typeof r[0] =="undefined"){
					//파트너 유저 전환화면 제공
					res.send('<script type="text/javascript">alert("파트너 유저 신청후 이용가능한 서비스입니다"); location.href="/"</script>');
				}else{
					db.client.query('SELECT TB1.CONTENTS_ID, TB1.CONTENTS_TYPE, TB2.SURVEY_ID, TB2.SURVEY_TITLE, DATE_FORMAT(TB1.REG_DATE, "%Y/%m/%d") REG_DATE FROM IDO_CONTENTS_TB TB1 LEFT JOIN SURVEY_TB TB2 ON TB1.CONTENTS_ID = TB2.CONTENTS_ID WHERE TB1.PARTNER_ID = ? ORDER BY TB1.CONTENTS_ID',[r[0].PARTNER_ID], function(e,result){
						var titleArray = new Array();
						if(result[0] == null){
							titleArray.push('');
							res.render('builder/list/mobile_list.ejs', {title:titleArray, list: result , partnerId:r[0].PARTNER_ID});	
						}else{
							for(i in result){
								
								(function(i){
									db.client.query('SELECT SECOND_SURVEY_TITLE FROM SURVEY_TYPE_TB WHERE SURVEY_ID = ?',[result[i].SURVEY_ID],function(err,surveyTypeResult){
										console.log(surveyTypeResult[0])
										console.log('---------------------')
										if(typeof surveyTypeResult[0]=='undefined'){
											titleArray.push('');
											if(parseInt(i)+1 ==result.length){
												console.log('if')
												res.render('builder/list/mobile_list.ejs', {title:titleArray, list: result , partnerId:r[0].PARTNER_ID});	
											}
										}else{
											console.log('else')
											titleArray.push(surveyTypeResult[0].SECOND_SURVEY_TITLE)
											if(parseInt(i)+1 ==result.length){
												console.log('?')
												res.render('builder/list/mobile_list.ejs', {title:titleArray, list: result , partnerId:r[0].PARTNER_ID});	
											}
											
										}
										
									})
									})(i);
							}
						}
						
						/*for(i in result){
							
							
						}*/
						
						
					});
				}
			});
		}
	}

	if(req.params.id =='request_contents_confirm'){
		var contentsId = req.param('contentsId');
		db.client.query('UPDATE IDO_CONTENTS_TB SET CONTENTS_TYPE=2 WHERE CONTENTS_ID=?',[contentsId], function(e,r){
			res.json('success');
		});
		
	}
	//builder_thumbnail 작성부분
	if (req.params.id == 'builder_thumbnail'){ 
		var contents_id = req.param('contents_id');
		if(contents_id == 'new'){ //list에서 contents_id 유무를 확인한다. 새로만들기 부분을 클릭시 new라는 값을 받아 비어있는 틀을 제공
			res.render('builder/thumbnail/upload_thumbnail.ejs');
		}else{ //contents_id값이 있으면 그 값으로 쿼리를 확인 후 수정작업을 위한 ejs 제공
			db.client.query('select CATEGORY, TITLE, THUMBNAIL_CONTENTS, CONTENTS_CHK, THUMBNAIL_IMAGE_PATH, IMAGE_TYPE, CONTENTS_ID from IDO_CONTENTS_TB where CONTENTS_ID=?;', contents_id, function(e,r){
				res.render('builder/thumbnail/adjust_thumbnail.ejs',{data : r[0]});
			});
		}
	}
	
	//contents 부분
	if(req.params.id == 'builder_contents'){
		//builder_contents 작성부분
		var contentsId = req.param('contentsId');
		console.log(contentsId)
		db.client.query('SELECT TB1.CONTENTS_ID, TB1.LI_VALUE, TB1.CONTENTS_TYPE, TB1.CONTENTS_IMAGE_PATH, TB1.CONTENTS_IMAGE_ORIGIN, TB1.CONTENTS, TB1.ORDER_NUM, TB2.CONTENTS_CHK FROM CONTENTS_IMAGE_TB TB1 JOIN IDO_CONTENTS_TB TB2 ON TB1.CONTENTS_ID = TB2.CONTENTS_ID WHERE TB1.CONTENTS_ID=? ORDER BY TB1.ORDER_NUM;', contentsId, function(e,r){
			//console.log('error : '+ e);
			//console.log('result : '+ r);
			//res.render('builder/contents/upload_contents.ejs',{data : r});
			db.client.query('SELECT SURVEY_ID, CONTENTS_ID, SURVEY_TITLE, SURVEY_THUMBNAIL FROM SURVEY_TB WHERE CONTENTS_ID=?', [contentsId], function(error, rst){
				//결과 출력
				console.log('error : '+ e);
				console.log(r);
				console.log('-------------');
				console.log(rst);
				if(typeof rst == "undefined"){
					console.log('ff')
					res.render('builder/contents/upload_contents.ejs', {data:r, data1:"none"});	
				}else{
					res.render('builder/contents/upload_contents.ejs', {data:r, data1:rst});
				}
				
			});
		});
	}else if(req.params.id == 'update_builder_contents'){ //기존에 작성중이던 builder_contents에서 update를 위한 부분
		var contentsId = req.param('contentsId');
		db.client.query('SELECT TB1.CONTENTS_ID, TB1.LI_VALUE, TB1.CONTENTS_TYPE, TB1.CONTENTS_IMAGE_PATH, TB1.CONTENTS_IMAGE_ORIGIN, TB1.CONTENTS, TB1.ORDER_NUM, TB2.CONTENTS_CHK FROM CONTENTS_IMAGE_TB TB1 JOIN IDO_CONTENTS_TB TB2 ON TB1.CONTENTS_ID = TB2.CONTENTS_ID WHERE TB1.CONTENTS_ID=? ORDER BY TB1.ORDER_NUM;', contentsId, function(e,r){
			
			db.client.query('SELECT SURVEY_ID, CONTENTS_ID, SURVEY_TITLE, SURVEY_THUMBNAIL FROM SURVEY_TB WHERE contents_id=?', [contentsId], function(error, rst){
				//결과 출력
				console.log('error : '+ e);
				console.log(r);
				console.log('-------------');
				console.log(rst);
				res.render('builder/contents/adjust_contents.ejs', {data:r, data1:rst});
			});
		});
	}else if(req.params.id == 'check_contents_image_id'){ //빌더부분에서 name값들을 지정하기 위해 가장 최근에 작성된 컨텐츠의 id값을 받아서 보내줌.
		var contentsId = 1;
		db.client.query('select ORDER_NUM, LI_VALUE from CONTENTS_IMAGE_TB where CONTENTS_ID=? ORDER BY LI_VALUE DESC LIMIT 1', contentsId, function(e,r){
			console.log('liValue : '+r[0])
			if(r[0] == undefined){
				res.json('1')
			}else{
				
				res.json(r[0]);	
			}
		})
	}else if(req.params.id == 'delete_contents'){ 
		console.log(req.query.contents_id);
		var contents_id = req.query.contents_id.split('check_')[1];
		console.log(contents_id);
		db.client.query('SET foreign_key_checks = 0');
		db.client.query('DELETE t2, t1, t3 from IDO_CONTENTS_TB AS t1 LEFT JOIN CONTENTS_IMAGE_TB AS t2 on t1.CONTENTS_ID = t2.CONTENTS_ID LEFT JOIN SURVEY_TB AS t3 on t1.CONTENTS_ID = t3.CONTENTS_ID where t1.CONTENTS_ID =?', [contents_id], function(e,r){
			db.client.query('SET foreign_key_checks = 1');
			console.log(e);
			res.end();
		});
	}else if(req.params.id == 'm_update_builder_contents'){ //모바일 화면(지워도됨)
		var contentsId = req.param('contentsId');
		db.client.query('select CONTENTS_ID, LI_VALUE, CONTENTS_TYPE, CONTENTS_IMAGE_PATH, CONTENTS_IMAGE_ORIGIN, CONTENTS, ORDER_NUM from CONTENTS_IMAGE_TB where CONTENTS_ID=?', contentsId, function(e,r){
			console.log('error : '+ e);
			console.log('result : '+ r);
			res.json(r);
		});
	}else if(req.params.id == 'change_order'){ //컨텐츠 순서 바꿀 때
		var li_value = req.query.li_value.split('image_preview')[1];
		var order_num = req.query.order_num;
		var contents_id = req.query.contents_id;
		
		console.log('li_value : ' + li_value)
		console.log('order_num : '+order_num);
		db.client.query('UPDATE CONTENTS_IMAGE_TB SET ORDER_NUM=? WHERE LI_VALUE=? AND CONTENTS_ID =?',[order_num, li_value, contents_id], function(e,r){
			console.log(e);
		});
		res.end();
	}else if(req.params.id == 'delete_contents_image'){
		console.log('contents_image 삭제 부분');
		var contents_id = req.query.contents_id; //삭제할 컨텐츠 아이디
		var li_value = req.query.li_value; //삭제할 컨텐츠의 li_value 값
		console.log(contents_id);
		console.log(li_value);
		db.client.query('delete from CONTENTS_IMAGE_TB where contents_id=? and li_value=?', [contents_id, li_value], function(e,r){
			console.log(e);
		});
	}else if(req.params.id == 'latest_value'){
		console.log('li_value값 조회');
		console.log(req.param('contentsId'));
		var contents_id = req.param('contentsId');
		db.client.query('SELECT LI_VALUE FROM CONTENTS_IMAGE_TB WHERE CONTENTS_ID=? ORDER BY LI_VALUE DESC LIMIT 1',[contents_id], function(error, result){
			console.log(result[0]);
			if(typeof result[0]=='undefined'){
				console.log('ff');
				res.send('0');
			}else{
				res.send(result[0]);
			}
			
		});
	}
	
	//대질문 리스트 view
	if(req.params.id == 'listSurveyTitle'){
		console.log('대질문 리스트 조회');
		db.client.query('SELECT SURVEY_ID, CONTENTS_ID, SURVEY_TITLE, SURVEY_THUMBNAIL FROM SURVEY_TB', function(error, rst){
			console.log(rst);
			//결과 출력
			res.render('builder/survey/listSurveyTitle.ejs', { data : rst });
		});
	}
	
	//대질문 수정 조회
	if(req.params.id == 'selectSurveyTitle'){
		console.log('대질문 수정 조회');
		var surveyId = req.param('surveyId');
		console.log('surveyId::'+surveyId);
		console.log('surveyId 타입::'+typeof surveyId);
		
		//int로 변환
		surveyId = parseInt(surveyId);
		console.log('surveyId::'+req.param('surveyId'));
		
		//임시저장 조회 쿼리 실행
		db.client.query('SELECT SURVEY_ID, SURVEY_TITLE, SURVEY_THUMBNAIL FROM SURVEY_TB where SURVEY_ID=?',[surveyId], function(error, rst){
			res.json(rst);
		});
	}
	
	//카테고리 값 가져오기
	if(req.params.id == 'select_content'){
		console.log('카테고리값 가져오기');
		var contentsId = req.param('contentsId');
		console.log('contentsId::'+contentsId);
		
		db.client.query('SELECT CONTENTS_ID, PARTNER_ID, CATEGORY FROM IDO_CONTENTS_TB WHERE CONTENTS_ID=?', [contentsId], function(err, rst){
			console.log('rst::'+rst);
			res.json(rst);
		});
	}
	
	//중질문 리스트 조회
	if(req.params.id == 'listSurveySecondTitle'){
		console.log('중질문 리스트 조회');
		var surveyId = req.param('surveyId');
		console.log('surveyId::'+surveyId);
		console.log('surveyId 타입::'+typeof surveyId);
		
		//int로 변환
		surveyId = parseInt(surveyId);
		console.log('surveyId::'+surveyId);
		
		var title = {};
		
		//임시저장 조회 쿼리 실행
		db.client.query('SELECT SURVEY_TYPE_ID, SUBSTRING_INDEX(SURVEY_TYPE, "N", 1) AS SURVEY_TYPE, IF( INSTR(SURVEY_TYPE,"N")!=0, SUBSTRING( SURVEY_TYPE, INSTR(SURVEY_TYPE,"N")+1, 1), NULL) AS ANSWER_NUM, SURVEY_ANSWER_TYPE, SECOND_SURVEY_TITLE, SECOND_SURVEY_IMAGE_PATH, SECOND_SURVEY_CROP_IMAGE, IMAGE_NAME, IMAGE_ORIGIN, IMAGE_LINK_ADDR FROM SURVEY_TYPE_TB WHERE SURVEY_ID=? ORDER BY SURVEY_TYPE_ID', [surveyId], function(error, rst){
			//질문 tb 값
			title = {"title":rst};
			//배열 선언
			var arr= new Array();
			//console.log(rst[1]);
			for(var i in rst){
				db.client.query('SELECT SURVEY_CONTENTS_ID, SURVEY_CONTENTS, SURVEY_IMAGE_PATH, SURVEY_CROP_IMAGE FROM SURVEY_CONTENTS_TB WHERE SURVEY_TYPE_ID=?', [rst[i].SURVEY_TYPE_ID], function(error,rst1){
					//arr 배열에 contents 결과값 담음
					arr.push(rst1);
					console.log('rst.length title의 값 개수 : '+rst.length);
					console.log('arr.length contents 배열의 개수:'+arr.length);
					console.log('i = title idx: '+ (parseInt(i)));
					console.log('rst1.length 해당 title에 대한 contents의 개수: '+rst1.length);
					//title의 값 개수 == contents 배열의 개수  
					if(rst.length==arr.length){
						//질문의 키 값 reply에 contents 결과값이 있는 배열을 담음
						title.reply = arr;
						console.log(title);
						//console.log(title.reply);
						//(질문 값+content 값)을 view로 보냄
						res.json(title);
					}//if
				});	
			}
		});
	}
	
	//안드로이드 리스트 조회
	if(req.params.id == 'a_listSurveySecondTitle'){
		var surveyId = req.param('surveyId');
		var userId = req.param('userId');
		console.log('surveyId::'+surveyId);
		console.log('surveyId 타입::'+typeof surveyId);
		console.log('userId : '+userId)
		//int로 변환
		surveyId = parseInt(surveyId);
		console.log('surveyId::'+surveyId);
		
		var title = {};
		var arr = new Array();
		//10/10일 작업
			db.client.query('SELECT SURVEY_TYPE_ID, SURVEY_ID, SUBSTRING_INDEX(SURVEY_TYPE, "N", 1) AS SURVEY_TYPE, IF( INSTR(SURVEY_TYPE,"N")!=0, SUBSTRING( SURVEY_TYPE, INSTR(SURVEY_TYPE,"N")+1, 1), NULL) AS ANSWER_NUM, SURVEY_ANSWER_TYPE, SECOND_SURVEY_TITLE, SECOND_SURVEY_IMAGE_PATH, SECOND_SURVEY_CROP_IMAGE, IMAGE_NAME, IMAGE_ORIGIN, IMAGE_LINK_ADDR FROM SURVEY_TYPE_TB WHERE SURVEY_ID=? ORDER BY SURVEY_TYPE_ID', [surveyId], function(error, rst){
				//질문 tb 값
				var arr= new Array();
				for(var i in rst){
					(function(i){
						db.client.query('SELECT TB1.SURVEY_TYPE_ID'+
								', TB2.SURVEY_CONTENTS_ID, TB2.SURVEY_CONTENTS, TB2.SURVEY_IMAGE_PATH, TB2.SURVEY_CROP_IMAGE, TB2.SURVEY_ORIGIN, TB2.SURVEY_LINK_ADDR, SUBSTRING_INDEX(TB1.SURVEY_TYPE, "N", 1) AS SURVEY_TYPE, IF( INSTR(TB1.SURVEY_TYPE,"N")!=0, SUBSTRING(TB1.SURVEY_TYPE, INSTR(TB1.SURVEY_TYPE,"N")+1, 1), NULL) AS ANSWER_NUM, SURVEY_ANSWER_TYPE, SECOND_SURVEY_TITLE, SECOND_SURVEY_IMAGE_PATH, SECOND_SURVEY_CROP_IMAGE, IMAGE_NAME, IMAGE_ORIGIN, IMAGE_LINK_ADDR'+
								', TB3.SURVEY_ID'+ 
								', TB4.CONTENTS_ID '+
								'FROM SURVEY_TYPE_TB TB1 '+ 
								'JOIN SURVEY_CONTENTS_TB TB2 '+ 
								'ON TB1.SURVEY_TYPE_ID = TB2.SURVEY_TYPE_ID '+ 
								'JOIN SURVEY_TB TB3 '+ 
								'ON TB1.SURVEY_ID = TB3.SURVEY_ID '+ 
								'JOIN IDO_CONTENTS_TB TB4 '+ 
								'ON TB3.CONTENTS_ID = TB4.CONTENTS_ID '+  
								'WHERE TB1.SURVEY_TYPE_ID=?', [rst[i].SURVEY_TYPE_ID], function(error,rst1){
							//arr 배열에 contents 결과값 담음
							console.log(error)
							arr.push({"ContentInfo":rst1})
							//title의 값 개수 == contents 배열의 개수  
								
							if(rst.length==parseInt(i)+1){
								
								db.client.query('SELECT ANSWER FROM SURVEY_ANSWER_TB WHERE USER_ID=? AND SURVEY_ID =?',[userId, surveyId], function(error,result){
									var p = new Array();
									if(typeof result[0] == 'undefined'){
										//arr[i].ContentInfo[0]['joinCheck']='join_ok'
										p.push({'JOIN_CHECK':0})
										arr.push({"ContentInfo":p}) //비참여
									}else{
										p.push({'JOIN_CHECK':1})
										arr.push({"ContentInfo":p}) //참여
									}
									var acc = JSON.stringify(arr);
									res.end(acc);
									
								})
								
							}//if
						});
					})(i)
				}
			});
	}
	
	
	//설문하기(모바일(웹앱))
	if(req.params.id == 'viewSurveySecondTitle'){
		console.log('중질문 리스트 조회');
		var survey = req.param('survey');
		console.log('surveyId::'+survey);
		for(i in survey){
			console.log(survey[i])
		}
		
	}
};





//upload위한 POST요청시 들어오는 곳
//파일 입력 받는 곳
exports.post_upload = function(req,res){ // Upload 부분 (Post 요청시)
	if (req.params.id == 'builder_thumbnail'){ //builder_thumbnail 작성부분
		builder_thumbnail.upload_thumbnail(req, res); //위쪽에 선언한 [var builder_thumbnail 확인할 것] 
	}else if(req.params.id == 'builder_contents'){ //builder_contents 작성부분
		builder_contents.upload_contents(req, res); //최상단에 선언한 [var builder_contents 확인할 것]
		res.end();
	}else if(req.params.id == 'revise_builder_contents'){
		console.log('revise')
		builder_contents.revise_contents(req, res); //최상단에 선언한 [var builder_contents 확인할 것]
	}else if(req.params.id == 'update_builder_thumbnail'){ // update_thumbnail 부분
		builder_thumbnail.revise_thumbnail(req, res);
	}else if(req.params.id == 'insertSurveyTitle'){ //대질문 저장
		viewSurveyTitle.insertSurveyTitle(req, res);
	}else if(req.params.id == 'deleteSurveyTitle'){	//대질문 삭제
		viewSurveyTitle.deleteSurveyTitle(req, res)
	}else if(req.params.id == 'updateSurveyTitle'){	//대질문 수정
		viewSurveyTitle.updateSurveyTitle(req, res);
	}else if(req.params.id == 'insertSurveySecondTitle'){	//중질문 저장하기
		viewSurveySecondTitle.insertSurveySecondTitle(req, res);	
	}else if(req.params.id == 'tempStoreSvySecTitle'){	//중질문 임시저장
		viewSurveySecondTitle.tempStoreSvySecTitle(req, res);
	}else if(req.params.id == 'deleteSurveyType'){	//중질문 삭제
		viewSurveySecondTitle.deleteSurveyType(req, res);
	}else if(req.params.id == 'deleteConts'){	//중질문에 대한 해당 답변 삭제
		viewSurveySecondTitle.deleteConts(req, res);
	}
}



