var mysql = require('mysql');
var formidable = require('formidable');
var base64_decode = require('base-64').decode;
var fs =require('fs');
var client = mysql.createConnection({
    host: '14.63.163.96',
    port: '3306',
    user: 'np_6',
    password: 'neopadDb',
    database: 'ido'
});

//모바일 컨텐츠 서베이 view
exports.survey_form = function(req, res){
	fs.readFile('views/main/contents/m_survey.html', function(error,data){
		res.writeHead(200,{'Content-Type':'text/html'});
		res.end(data);
	});
	//res.render('main/contents/m_test.ejs');
}

//파트너 리스트 화면
exports.p_survey = function(req, res){
	var surveyId = req.param('surveyId');
	console.log('p_survey')
	var answer = req.body.answer;
	var surveyType = req.body.surveyType;

	if(req.params.id == 'input_survey_answer_finish'){
		console.log('/input_survey_answer_finish 접속됨');
		if(typeof req.user == 'undefined'){
			var userId = '0'
		}else{
			if(typeof req.user.userId =='undefined'){ //facebook 유저로 로그인시
				var userId = req.user.id	
			}else{
				var userId = req.user.userId
			}
			
			console.log('유저아이디')
			console.log(userId);
		}
	
		console.log(req.body.surveyTypeId);
		if(typeof req.body.surveyTypeId == 'undefined'){
			var surveyTypeId = answer[0].split('STID')[1].split('ST')[0];
			client.query('select SURVEY_CONTENTS_ID from SURVEY_CONTENTS_TB  where SURVEY_TYPE_ID = ?;',[surveyTypeId], function(e,r){ //삭제예정
				client.query('select t1.SURVEY_TYPE_ID, t2.SURVEY_ID from SURVEY_TYPE_TB AS t1 LEFT JOIN SURVEY_TB AS t2 on t1.SURVEY_ID = t2.SURVEY_ID where SURVEY_TYPE_ID = ?',[surveyTypeId], function(e,result){
						var combineAnswer ='';  
						for(i in answer){
							if(parseInt(i)+1 == answer.length){
								combineAnswer += answer[i];
							}else{
								combineAnswer += answer[i]+',';	
							}
						}
						
						var count = 0;
					
						client.query('INSERT INTO SURVEY_ANSWER_TB(SURVEY_ANSWER_ID, SURVEY_ID, SURVEY_TYPE_ID, SURVEY_CONTENTS_ID, SURVEY_TYPE, USER_ID, ANSWER) VALUES(null,?, ?, 1, 2, ?, ?)',[result[0].SURVEY_ID, surveyTypeId, userId, combineAnswer], function(e,r){
							console.log(e);
						});
						
						// 결과값 뽑아내기
						var valueArray = new Array();
						client.query('select ANSWER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ?',[surveyTypeId],function(e,r){
							console.log('surveyTypeId : '+surveyTypeId)
							for(i in answer){
								
								var surveyType1 = r[0].ANSWER.split(',')[i].split('STID')[1].split('ST')[1].split('A')[0];
								if(surveyType1 == 1){
									(function(i){
										console.log('surveyType----------------')
										client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?),",",-1), "ST", -1),"A",1) as STID, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1) AS PER, TB2.SECOND_SURVEY_TITLE FROM SURVEY_ANSWER_TB TB1 LEFT JOIN SURVEY_TYPE_TB TB2 ON TB1.SURVEY_TYPE_ID = TB2.SURVEY_TYPE_ID WHERE TB1.SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
												valueArray.push(r);
												
												if(parseInt(i)+1 == answer.length){
													console.log('양자');
													console.log(valueArray);
													res.json(valueArray);	
												}
										})	
									})(i)
								}else if(surveyType1 ==2){ //단수선택형
										(function(i){
											client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1) AS PER, TB2.SECOND_SURVEY_TITLE FROM SURVEY_ANSWER_TB TB1 LEFT JOIN SURVEY_TYPE_TB TB2 ON TB1.SURVEY_TYPE_ID = TB2.SURVEY_TYPE_ID WHERE TB1.SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
												valueArray.push(r);
												if(parseInt(i)+1 == answer.length){
													console.log('단수선택형');
													res.json(valueArray);	
												}
											})
										})(i)
								}else if(surveyType1 ==3){ //복수선택형
									var tArray = new Array();
									var countArray = new Array();
									(function(i){
										var length = r[0].ANSWER.split(',')[i].split('_').length;
										for(j=0; j<length; j++){
											(function(j){
												client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1), "_", ?),"_", -1) AS PER, TB2.SECOND_SURVEY_TITLE FROM SURVEY_ANSWER_TB TB1 LEFT JOIN SURVEY_TYPE_TB TB2 ON TB1.SURVEY_TYPE_ID = TB2.SURVEY_TYPE_ID WHERE TB1.SURVEY_TYPE_ID = ? group by PER ORDER BY COUNT DESC',[parseInt(i)+1, parseInt(i)+1, parseInt(j)+1, surveyTypeId],function(e,r){
													
													if(j == 0){
														for(k in r){
															countArray.push({"PER":r[k].PER,"COUNT":r[k].COUNT,"SECOND_SURVEY_TITLE":r[k].SECOND_SURVEY_TITLE});
														}	
													}else{
														for(k in countArray){
															if(countArray[k].PER == r[j].PER){
																countArray[k].COUNT += r[j].COUNT;
															}
														}
														 
													}
													if((parseInt(j)+1) == length){
														var max = 0;
														
														for(p in countArray){
															max+=countArray[p].COUNT;
														}
														
														for(y in countArray){
															countArray[y].STID = '3';
															countArray[y].PERCENT = Math.round(countArray[y].COUNT / max * 100); //백분율 계산	
														}
														valueArray.push(countArray);
														if(parseInt(i)+1 == answer.length){
															console.log('복수선택형');
															
															res.json(valueArray);	
														}
													}
												})
											})(j)
										}
									})(i)
								}else if(surveyType1 ==4){ //순위형
									(function(i){
										console.log('순위형')
										console.log(parseInt(i)+1);
										client.query('select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1), "_", 1) AS PER, TB2.SECOND_SURVEY_TITLE FROM SURVEY_ANSWER_TB TB1 LEFT JOIN SURVEY_TYPE_TB TB2 ON TB1.SURVEY_TYPE_ID = TB2.SURVEY_TYPE_ID WHERE TB1.SURVEY_TYPE_ID = ? group by PER ORDER BY COUNT DESC',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
											
											valueArray.push(r);
											if(parseInt(i)+1 == answer.length){
												res.json(valueArray);	
											}
										});
									})(i)
								}else if(surveyType1 ==5){ //별점형
									console.log('별 들어옴')
									
									var group = new Array();
									(function(i){
										var length = r[0].ANSWER.split(',')[i].split('_').length
										console.log('length : ' + length)
										//select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "A", -1), "_", 1), ":", 1) AS PER, SUM(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "A", -1), "_", 1), ":", -1)) AS VAL FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = 574 (참여 인원수 / 전체값 보냄)
										/*select SURVEY_ANSWER_ID, answer, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), ",", -1) AS survey_type,
											 SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), ",", -1), 'A', -1) , '_', 3), '_', -1),":",-1)
											FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = 580 order by SURVEY_ANSWER_ID desc; */
										for(j=0; j<length; j++){
											(function(j){	
											client.query('select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1), "_", 1) AS PER , SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), ",", -1), "A", -1) , "_", ?), "_", -1),":",1) as PER, AVG(SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), ",", -1), "A", -1) , "_", ?), "_", -1),":",-1)) as value, TB2.SECOND_SURVEY_TITLE FROM SURVEY_ANSWER_TB TB1 LEFT JOIN SURVEY_TYPE_TB TB2 ON TB1.SURVEY_TYPE_ID = TB2.SURVEY_TYPE_ID WHERE TB1.SURVEY_TYPE_ID = ? order by SURVEY_ANSWER_ID desc;',[parseInt(i)+1, parseInt(i)+1, parseInt(i)+1, parseInt(j)+1, parseInt(i)+1, parseInt(j)+1, surveyTypeId],function(e,result){
											
												
												if((parseInt(j)+1) == length){
													group.push(result);
													valueArray.push(group);
													group = new Array();
													console.log(valueArray)
												}else{
													group.push(result);
												}
												
												if((parseInt(i)+1) == answer.length){
													if((parseInt(j)+1) == length){
														console.log(valueArray);
														res.json(valueArray)
													}
												}
											});
											})(j)
										}
									})(i)
								}
							}	
						})
				});
			});	
		}else{ //통계보기
			console.log('***** 통계보기 *****')
			var surveyTypeId = req.body.surveyTypeId;
			client.query('select SURVEY_CONTENTS_ID from SURVEY_CONTENTS_TB  where SURVEY_TYPE_ID = ?;',[surveyTypeId], function(e,r){ //삭제예정
				client.query('select t1.SURVEY_TYPE_ID, t2.SURVEY_ID from SURVEY_TYPE_TB AS t1 LEFT JOIN SURVEY_TB AS t2 on t1.SURVEY_ID = t2.SURVEY_ID where SURVEY_TYPE_ID = ?',[surveyTypeId], function(e,result){
						console.log('sTypeId : '+surveyTypeId)
						// 결과값 뽑아내기
						var valueArray = new Array();
						client.query('select ANSWER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ?',[surveyTypeId],function(e,r){
							console.log('surveyTypeId : '+surveyTypeId)
							var rLength = r[0].ANSWER.split(',').length;
							console.log('rLength : '+rLength)
							for(var i=0; i < rLength; i++){
								
								var surveyType1 = r[0].ANSWER.split(',')[i].split('STID')[1].split('ST')[1].split('A')[0];
								console.log('type : '+surveyType1)
								if(surveyType1 == 1){
									(function(i){
										console.log('surveyType----------------')
										client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?),",",-1), "ST", -1),"A",1) as STID, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
												valueArray.push(r);
												
												for(j in r){
													(function(j){
														client.query('SELECT C_TB.SURVEY_CONTENTS, S_TB.SECOND_SURVEY_TITLE FROM SURVEY_CONTENTS_TB C_TB LEFT JOIN SURVEY_TYPE_TB S_TB ON C_TB.SURVEY_TYPE_ID = S_TB.SURVEY_TYPE_ID WHERE C_TB.SURVEY_CONTENTS_ID=?',[r[j].PER],function(e,result){
															console.log('***************************')
															valueArray[i][j].SECOND_SURVEY_TITLE = result[0].SECOND_SURVEY_TITLE
															//console.log(valueArray[i][j])
															//console.log(valueArray[i])
															if(parseInt(j)+1 == result.length){
																if(parseInt(i)+1 == rLength){
																	console.log('단수선택형');
																	console.log(valueArray[i])
																	res.json(valueArray);	
																}	
															}
															
														});
													})(j)
												}
										})	
									})(i)
								}else if(surveyType1 ==2){ //단수선택형
									(function(i){
										client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
											valueArray.push(r);
											for(j in r){
												(function(j){
													client.query('SELECT C_TB.SURVEY_CONTENTS, S_TB.SECOND_SURVEY_TITLE FROM SURVEY_CONTENTS_TB C_TB LEFT JOIN SURVEY_TYPE_TB S_TB ON C_TB.SURVEY_TYPE_ID = S_TB.SURVEY_TYPE_ID WHERE C_TB.SURVEY_CONTENTS_ID=?',[r[j].PER],function(e,result){
														console.log('***************************')
														valueArray[i][j].SECOND_SURVEY_TITLE = result[0].SECOND_SURVEY_TITLE
														//console.log(valueArray[i][j])
														//console.log(valueArray[i])
														if(parseInt(j)+1 == result.length){
															if(parseInt(i)+1 == rLength){
																console.log('단수선택형');
																console.log(valueArray[i])
																res.json(valueArray);	
															}	
														}
														
													});
												})(j)
											}
											
										})
									})(i)
								}else if(surveyType1 ==3){ //복수선택형
									console.log(r)
									/*(function(i){
										console.log(parseInt(i)+1);
										client.query('select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "A", -1), "_", 3),"_", -1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = 691 group by PER ORDER BY COUNT DESC',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
											console.log(r)
											valueArray.push(r);
											if(parseInt(i)+1 == answer.length){
												console.log('복수선택형');
												res.json(valueArray);	
											}
										console.log('----------------------')		
										})
									})(i)*/
									
								}else if(surveyType1 ==4){ //순위형
									(function(i){
										console.log('순위형')
										console.log(parseInt(i)+1);
										client.query('select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1), "_", 1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? group by PER ORDER BY COUNT DESC',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
											valueArray.push(r);
											for(j in r){
												(function(j){
													client.query('SELECT C_TB.SURVEY_CONTENTS, S_TB.SECOND_SURVEY_TITLE FROM SURVEY_CONTENTS_TB C_TB LEFT JOIN SURVEY_TYPE_TB S_TB ON C_TB.SURVEY_TYPE_ID = S_TB.SURVEY_TYPE_ID WHERE C_TB.SURVEY_CONTENTS_ID=?',[r[j].PER],function(e,result){
														console.log('***************************')
														valueArray[i][j].SECOND_SURVEY_TITLE = result[0].SECOND_SURVEY_TITLE
														//console.log(valueArray[i][j])
														//console.log(valueArray[i])
														if(parseInt(j)+1 == result.length){
															if(parseInt(i)+1 == rLength){
																console.log('단수선택형');
																console.log(valueArray[i])
																res.json(valueArray);	
															}	
														}
														
													});
												})(j)
											}
										});
									})(i)
								}else if(surveyType1 ==5){ //별점형
									console.log('별 들어옴')
									var length = req.body.length;
									console.log(length)
									var group = new Array();
									(function(i){
										//select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "A", -1), "_", 1), ":", 1) AS PER, SUM(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "A", -1), "_", 1), ":", -1)) AS VAL FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = 574 (참여 인원수 / 전체값 보냄)
										/*select SURVEY_ANSWER_ID, answer, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), ",", -1) AS survey_type,
											 SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), ",", -1), 'A', -1) , '_', 3), '_', -1),":",-1)
											FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = 580 order by SURVEY_ANSWER_ID desc; */
										console.log('length : '+length)
										for(j=0; j<length; j++){
											(function(j){	
											client.query('select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1), "_", 1) AS PER , SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), ",", -1), "A", -1) , "_", ?), "_", -1),":",1) as PER, ROUND(AVG(SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), ",", -1), "A", -1) , "_", ?), "_", -1),":",-1))) as value FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? order by SURVEY_ANSWER_ID desc;',[parseInt(i)+1, parseInt(i)+1, parseInt(i)+1, parseInt(j)+1, parseInt(i)+1, parseInt(j)+1, surveyTypeId],function(e,result){
												if(parseInt(j)+1 == length){
													group.push(result);
													valueArray.push(group);
													group = new Array();
												}else{
													group.push(result);
												}

												client.query('SELECT C_TB.SURVEY_CONTENTS, S_TB.SECOND_SURVEY_TITLE FROM SURVEY_CONTENTS_TB C_TB LEFT JOIN SURVEY_TYPE_TB S_TB ON C_TB.SURVEY_TYPE_ID = S_TB.SURVEY_TYPE_ID WHERE C_TB.SURVEY_CONTENTS_ID=?',[result[0].PER],function(e,result1){
	
													valueArray[i][j].SECOND_SURVEY_TITLE = result1[0].SECOND_SURVEY_TITLE
													
													if(parseInt(j)+1 == result1.length){
														console.log(valueArray[i])
														if(parseInt(i)+1 == rLength){
															console.log('별점');
															console.log(valueArray[i])
															res.json(valueArray);	
														}	
													}
													
												});
													
												
											});
											})(j)
										}
									})(i)
								}
							}	
						})
				});
			});	
		}
		
	
		/*switch(surveyType){
			case 'choose':
				console.log('양자택')
				var surveyTypeId = answer[0].split('STID')[1].split('ST')[0];
				client.query('select SURVEY_CONTENTS_ID from SURVEY_CONTENTS_TB  where SURVEY_TYPE_ID = ?;',[surveyTypeId], function(e,r){ //삭제예정
					client.query('select t1.SURVEY_TYPE_ID, t2.SURVEY_ID from SURVEY_TYPE_TB AS t1 LEFT JOIN SURVEY_TB AS t2 on t1.SURVEY_ID = t2.SURVEY_ID where SURVEY_TYPE_ID = ?',[surveyTypeId], function(e,result){
							var combineAnswer ='';  
							for(i in answer){
								if(parseInt(i)+1 == answer.length){
									combineAnswer += answer[i];
								}else{
									combineAnswer += answer[i]+',';	
								}
							}
							
							var count = 0;
						
							client.query('INSERT INTO SURVEY_ANSWER_TB(SURVEY_ANSWER_ID, SURVEY_ID, SURVEY_TYPE_ID, SURVEY_CONTENTS_ID, SURVEY_TYPE, USER_ID, ANSWER) VALUES(null,?, ?, 1, 2, ?, ?)',[result[0].SURVEY_ID, surveyTypeId, userId, combineAnswer], function(e,r){
								console.log(e);
							});
							
							// 결과값 뽑아내기
							var valueArray = new Array();
							client.query('select ANSWER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ?',[surveyTypeId],function(e,r){
								for(i in answer){
									
									var surveyType1 = r[0].ANSWER.split(',')[i].split('STID')[1].split('ST')[1].split('A')[0];
									if(surveyType1 == 1){
										(function(i){
											console.log('surveyType----------------')
											console.log(parseInt(i)+1);
											client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?),",",-1), "ST", -1),"A",1) as STID, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
												console.log(r)	
													valueArray.push(r);
													if(parseInt(i)+1 == answer.length){
														console.log('양자');
														res.json(valueArray);	
													}
											})	
										})(i)
									}else if(surveyType1 ==2){ //단수선택형

											(function(i){
												console.log(parseInt(i)+1);
												client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
													console.log(r)
													valueArray.push(r);
													if(parseInt(i)+1 == answer.length){
														console.log('단수선택형');
														res.json(valueArray);	
													}
												})
											})(i)
									}else if(surveyType1 ==3){ //복수선택형
										console.log(surveyTypeId);
										console.log(surveyType1);
											(function(i){
												console.log(parseInt(i)+1);
												client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
													console.log(r)
													valueArray.push(r);
													if(parseInt(i)+1 == answer.length){
														console.log('단수선택형');
														res.json(valueArray);	
													}
												console.log('----------------------')		
												})
											})(i)
									}else if(surveyType1 ==4){ //순위형
										(function(i){
											console.log('순위형')
											console.log(parseInt(i)+1);
											client.query('select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1), "_", 1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? group by PER ORDER BY COUNT DESC',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
												console.log(r)
												valueArray.push(r);
												if(parseInt(i)+1 == answer.length){
													res.json(valueArray);	
												}
											});
										})(i)
									}else if(surveyType1 ==5){ //별점형
										console.log('별 들어옴')
										var length = req.body.length;
										var group = new Array();
										(function(i){
											//select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "A", -1), "_", 1), ":", 1) AS PER, SUM(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "A", -1), "_", 1), ":", -1)) AS VAL FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = 574 (참여 인원수 / 전체값 보냄)
											select SURVEY_ANSWER_ID, answer, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), ",", -1) AS survey_type,
												 SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), ",", -1), 'A', -1) , '_', 3), '_', -1),":",-1)
												FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = 580 order by SURVEY_ANSWER_ID desc; 
											console.log('length : '+length)
											for(j=0; j<length; j++){
												(function(j){	
												client.query('select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1), "_", 1) AS PER , SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), ",", -1), "A", -1) , "_", ?), "_", -1),":",1) as PER, SUM(SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), ",", -1), "A", -1) , "_", ?), "_", -1),":",-1)) as value FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? order by SURVEY_ANSWER_ID desc;',[parseInt(i)+1, parseInt(i)+1, parseInt(i)+1, parseInt(j)+1, parseInt(i)+1, parseInt(j)+1, surveyTypeId],function(e,result){
													
													
													if(parseInt(j)+1 == length){
														group.push(result);
														valueArray.push(group);
														group = new Array();
													}else{
														group.push(result);
													}
													
													if(parseInt(i)+1 == answer.length){
														if(parseInt(j)+1 == length){
															console.log(valueArray);
															res.json(valueArray)
														}
													}
												});
												})(j)
											}
										})(i)
									}
								}	
							})
					});
				});
			break;
			case 'single':
				var surveyTypeId = answer[0].split('STID')[1].split('ST')[0];
				client.query('select SURVEY_CONTENTS_ID from SURVEY_CONTENTS_TB  where SURVEY_TYPE_ID = ?;',[surveyTypeId], function(e,r){ //삭제예정
					client.query('select t1.SURVEY_TYPE_ID, t2.SURVEY_ID from SURVEY_TYPE_TB AS t1 LEFT JOIN SURVEY_TB AS t2 on t1.SURVEY_ID = t2.SURVEY_ID where SURVEY_TYPE_ID = ?',[surveyTypeId], function(e,result){
							var combineAnswer ='';  
							for(i in answer){
								if(parseInt(i)+1 == answer.length){
									combineAnswer += answer[i];
								}else{
									combineAnswer += answer[i]+',';	
								}
							}
							var count = 0;
							console.log(combineAnswer)
							client.query('INSERT INTO SURVEY_ANSWER_TB(SURVEY_ANSWER_ID, SURVEY_ID, SURVEY_TYPE_ID, SURVEY_CONTENTS_ID, SURVEY_TYPE, USER_ID, ANSWER) VALUES(null,?, ?, 1, 2, ?, ?)',[result[0].SURVEY_ID, surveyTypeId, userId, combineAnswer], function(e,r){
								console.log(e);
							});
							
							// 결과값 뽑아내기
							var valueArray = new Array();
							client.query('select ANSWER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ?',[surveyTypeId],function(e,r){
								for(i in answer){
									var surveyType1 = r[0].ANSWER.split(',')[i].split('STID')[1].split('ST')[1].split('A')[0];
									if(surveyType1 == 1){
										(function(i){
											console.log('surveyType----------------')
											console.log(parseInt(i)+1);
											client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?),",",-1), "ST", -1),"A",1) as STID, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
												console.log(r)	
													valueArray.push(r);
													if(parseInt(i)+1 == answer.length){
														console.log('양자');
														res.json(valueArray);	
													}
											})	
										})(i)
									}else if(surveyType1 ==2){ //단수선택형

											(function(i){
												console.log(parseInt(i)+1);
												client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
													console.log(r)
													valueArray.push(r);
													if(parseInt(i)+1 == answer.length){
														console.log('단수선택형');
														res.json(valueArray);	
													}
												})
											})(i)
									}else if(surveyType1 ==3){ //복수선택형
										console.log(surveyTypeId);
										console.log(surveyType1);
											(function(i){
												console.log(parseInt(i)+1);
												client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
													console.log(r)
													valueArray.push(r);
													if(parseInt(i)+1 == answer.length){
														console.log('단수선택형');
														res.json(valueArray);	
													}
												console.log('----------------------')		
												})
											})(i)
									}else if(surveyType1 ==4){ //순위형
										(function(i){
											console.log('순위형')
											console.log(parseInt(i)+1);
											client.query('select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1), "_", 1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? group by PER ORDER BY COUNT DESC',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
												console.log(r)
												valueArray.push(r);
												if(parseInt(i)+1 == answer.length){
													res.json(valueArray);	
												}
											});
										})(i)
									}else if(surveyType1 ==5){ //별점형
										console.log('별 들어옴')
										var length = req.body.length;
										var group = new Array();
										(function(i){
											//select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "A", -1), "_", 1), ":", 1) AS PER, SUM(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "A", -1), "_", 1), ":", -1)) AS VAL FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = 574 (참여 인원수 / 전체값 보냄)
											select SURVEY_ANSWER_ID, answer, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), ",", -1) AS survey_type,
												 SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), ",", -1), 'A', -1) , '_', 3), '_', -1),":",-1)
												FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = 580 order by SURVEY_ANSWER_ID desc; 
											console.log('length : '+length)
											for(j=0; j<length; j++){
												(function(j){	
												client.query('select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1), "_", 1) AS PER , SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), ",", -1), "A", -1) , "_", ?), "_", -1),":",1) as PER, SUM(SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), ",", -1), "A", -1) , "_", ?), "_", -1),":",-1)) as value FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? order by SURVEY_ANSWER_ID desc;',[parseInt(i)+1, parseInt(i)+1, parseInt(i)+1, parseInt(j)+1, parseInt(i)+1, parseInt(j)+1, surveyTypeId],function(e,result){
													
													
													if(parseInt(j)+1 == length){
														group.push(result);
														valueArray.push(group);
														group = new Array();
													}else{
														group.push(result);
													}
													
													if(parseInt(i)+1 == answer.length){
														if(parseInt(j)+1 == length){
															console.log(valueArray);
															res.json(valueArray)
														}
													}
												});
												})(j)
											}
										})(i)
									}
								}	
							})
					});
				});
			break;
			case 'select':
				var surveyTypeId = answer[0].split('STID')[1].split('ST')[0];
				client.query('select SURVEY_CONTENTS_ID from SURVEY_CONTENTS_TB  where SURVEY_TYPE_ID = ?;',[surveyTypeId], function(e,r){ //삭제예정
					client.query('select t1.SURVEY_TYPE_ID, t2.SURVEY_ID from SURVEY_TYPE_TB AS t1 LEFT JOIN SURVEY_TB AS t2 on t1.SURVEY_ID = t2.SURVEY_ID where SURVEY_TYPE_ID = ?',[surveyTypeId], function(e,result){
							var combineAnswer ='';  
							for(i in answer){
								if(parseInt(i)+1 == answer.length){
									combineAnswer += answer[i];
								}else{
									combineAnswer += answer[i]+',';	
								}
							}
							var count = 0;
							console.log(combineAnswer)
							client.query('INSERT INTO SURVEY_ANSWER_TB(SURVEY_ANSWER_ID, SURVEY_ID, SURVEY_TYPE_ID, SURVEY_CONTENTS_ID, SURVEY_TYPE, USER_ID, ANSWER) VALUES(null,?, ?, 1, 2, ?, ?)',[result[0].SURVEY_ID, surveyTypeId, userId, combineAnswer], function(e,r){
								console.log(e);
							});
							
							// 결과값 뽑아내기
							var valueArray = new Array();
							client.query('select ANSWER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ?',[surveyTypeId],function(e,r){
								for(i in answer){
									var surveyType1 = r[0].ANSWER.split(',')[i].split('STID')[1].split('ST')[1].split('A')[0];
									if(surveyType1 == 1){
										(function(i){
											console.log('surveyType----------------')
											console.log(parseInt(i)+1);
											client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?),",",-1), "ST", -1),"A",1) as STID, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
												console.log(r)	
													valueArray.push(r);
													if(parseInt(i)+1 == answer.length){
														console.log('양자');
														res.json(valueArray);	
													}
											})	
										})(i)
									}else if(surveyType1 ==2){ //단수선택형

											(function(i){
												console.log(parseInt(i)+1);
												client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
													console.log(r)
													valueArray.push(r);
													if(parseInt(i)+1 == answer.length){
														console.log('단수선택형');
														res.json(valueArray);	
													}
												})
											})(i)
									}else if(surveyType1 ==3){ //복수선택형
										console.log(surveyTypeId);
										console.log(surveyType1);
											(function(i){
												console.log(parseInt(i)+1);
												client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
													console.log(r)
													valueArray.push(r);
													if(parseInt(i)+1 == answer.length){
														console.log('단수선택형');
														res.json(valueArray);	
													}
												console.log('----------------------')		
												})
											})(i)
									}else if(surveyType1 ==4){ //순위형
										(function(i){
											console.log('순위형')
											console.log(parseInt(i)+1);
											client.query('select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1), "_", 1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? group by PER ORDER BY COUNT DESC',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
												console.log(r)
												valueArray.push(r);
												if(parseInt(i)+1 == answer.length){
													res.json(valueArray);	
												}
											});
										})(i)
									}else if(surveyType1 ==5){ //별점형
										var length = req.body.length;
										console.log(length);
										var group = new Array();
										(function(i){
											//select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "A", -1), "_", 1), ":", 1) AS PER, SUM(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "A", -1), "_", 1), ":", -1)) AS VAL FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = 574 (참여 인원수 / 전체값 보냄)
											select SURVEY_ANSWER_ID, answer, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), ",", -1) AS survey_type,
												 SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), ",", -1), 'A', -1) , '_', 3), '_', -1),":",-1)
												FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = 580 order by SURVEY_ANSWER_ID desc; 
											for(j=0; j<length; j++){
												(function(j){	
												client.query('select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1), "_", 1) AS PER , SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), ",", -1), "A", -1) , "_", ?), "_", -1),":",1) as PER, SUM(SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), ",", -1), "A", -1) , "_", ?), "_", -1),":",-1)) as value FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? order by SURVEY_ANSWER_ID desc;',[parseInt(i)+1, parseInt(i)+1, parseInt(i)+1, parseInt(j)+1, parseInt(i)+1, parseInt(j)+1, surveyTypeId],function(e,result){
													if(parseInt(j)+1 == length){
														valueArray.push(result);
														group.push(valueArray);
														valueArray = new Array();
													}else{
														valueArray.push(result);
													}
													
													if(parseInt(i)+1 == answer.length){
														if(parseInt(j)+1 == length){
															console.log(group)
															console.log('**************************************')
															res.json(group)
														}
													}
												});
												})(j)
											}
										})(i)
									}
								}	
							})
					});
				});
			break;
			
			case 'rank':
				console.log('순위')
				var surveyTypeId = answer[0].split('STID')[1].split('ST')[0];
				client.query('select SURVEY_CONTENTS_ID from SURVEY_CONTENTS_TB  where SURVEY_TYPE_ID = ?;',[surveyTypeId], function(e,r){ //삭제예정
					client.query('select t1.SURVEY_TYPE_ID, t2.SURVEY_ID from SURVEY_TYPE_TB AS t1 LEFT JOIN SURVEY_TB AS t2 on t1.SURVEY_ID = t2.SURVEY_ID where SURVEY_TYPE_ID = ?',[surveyTypeId], function(e,result){
							var combineAnswer ='';  
							for(i in answer){
								if(parseInt(i)+1 == answer.length){
									combineAnswer += answer[i];
								}else{
									combineAnswer += answer[i]+',';	
								}
							}
							var count = 0;
							console.log(combineAnswer)
							client.query('INSERT INTO SURVEY_ANSWER_TB(SURVEY_ANSWER_ID, SURVEY_ID, SURVEY_TYPE_ID, SURVEY_CONTENTS_ID, SURVEY_TYPE, USER_ID, ANSWER) VALUES(null,?, ?, 1, 2, ?, ?)',[result[0].SURVEY_ID, surveyTypeId, userId, combineAnswer], function(e,r){
								console.log(e);
							});
							
							// 결과값 뽑아내기
							var valueArray = new Array();
							client.query('select ANSWER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ?',[surveyTypeId],function(e,r){
								console.log('answerLength : '+answer.length)
								for(i in answer){
									
									var surveyType1 = r[0].ANSWER.split(',')[i].split('STID')[1].split('ST')[1].split('A')[0];
									if(surveyType1 == 1){
										(function(i){
											console.log('surveyType----------------')
											console.log(parseInt(i)+1);
											client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?),",",-1), "ST", -1),"A",1) as STID, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
												console.log(r)	
													valueArray.push(r);
													if(parseInt(i)+1 == answer.length){
														console.log('양자');
														res.json(valueArray);	
													}
											})	
										})(i)
									}else if(surveyType1 ==2){ //단수선택형

											(function(i){
												console.log(parseInt(i)+1);
												client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
													console.log(r)
													valueArray.push(r);
													if(parseInt(i)+1 == answer.length){
														console.log('단수선택형');
														res.json(valueArray);	
													}
												})
											})(i)
									}else if(surveyType1 ==3){ //복수선택형
										console.log(surveyTypeId);
										console.log(surveyType1);
											(function(i){
												console.log(parseInt(i)+1);
												client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
													console.log(r)
													valueArray.push(r);
													if(parseInt(i)+1 == answer.length){
														console.log('단수선택형');
														res.json(valueArray);	
													}
												console.log('----------------------')		
												})
											})(i)
									}else if(surveyType1 ==4){ //순위형
										(function(i){
											console.log('순위형')
											console.log(parseInt(i)+1);
											client.query('select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1), "_", 1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? group by PER ORDER BY COUNT DESC',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
												console.log(r)
												valueArray.push(r);
												if(parseInt(i)+1 == answer.length){
													res.json(valueArray);	
												}
											});
										})(i)
									}else if(surveyType1 ==5){ //별점형
										console.log('별 들어옴')
										var length = req.body.length;
										var group = new Array();
										(function(i){
											//select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "A", -1), "_", 1), ":", 1) AS PER, SUM(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "A", -1), "_", 1), ":", -1)) AS VAL FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = 574 (참여 인원수 / 전체값 보냄)
											select SURVEY_ANSWER_ID, answer, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), ",", -1) AS survey_type,
												 SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), ",", -1), 'A', -1) , '_', 3), '_', -1),":",-1)
												FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = 580 order by SURVEY_ANSWER_ID desc; 
											console.log('length : '+length)
											for(j=0; j<length; j++){
												(function(j){	
												client.query('select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1), "_", 1) AS PER , SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), ",", -1), "A", -1) , "_", ?), "_", -1),":",1) as PER, SUM(SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), ",", -1), "A", -1) , "_", ?), "_", -1),":",-1)) as value FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? order by SURVEY_ANSWER_ID desc;',[parseInt(i)+1, parseInt(i)+1, parseInt(i)+1, parseInt(j)+1, parseInt(i)+1, parseInt(j)+1, surveyTypeId],function(e,result){
													
													
													if(parseInt(j)+1 == length){
														group.push(result);
														valueArray.push(group);
														group = new Array();
													}else{
														group.push(result);
													}
													
													if(parseInt(i)+1 == answer.length){
														if(parseInt(j)+1 == length){
															console.log(valueArray);
															res.json(valueArray)
														}
													}
												});
												})(j)
											}
										})(i)
									}
								}	
							})
					});
				});
			break;
			
			case 'star':
				console.log('별점')
				var surveyTypeId = answer[0].split('STID')[1].split('ST')[0];
				client.query('select SURVEY_CONTENTS_ID from SURVEY_CONTENTS_TB  where SURVEY_TYPE_ID = ?;',[surveyTypeId], function(e,r){ //삭제예정
					client.query('select t1.SURVEY_TYPE_ID, t2.SURVEY_ID from SURVEY_TYPE_TB AS t1 LEFT JOIN SURVEY_TB AS t2 on t1.SURVEY_ID = t2.SURVEY_ID where SURVEY_TYPE_ID = ?',[surveyTypeId], function(e,result){
							var combineAnswer ='';  
							for(i in answer){
								if(parseInt(i)+1 == answer.length){
									combineAnswer += answer[i];
								}else{
									combineAnswer += answer[i]+',';	
								}
							}
							var count = 0;
							console.log(combineAnswer)
							client.query('INSERT INTO SURVEY_ANSWER_TB(SURVEY_ANSWER_ID, SURVEY_ID, SURVEY_TYPE_ID, SURVEY_CONTENTS_ID, SURVEY_TYPE, USER_ID, ANSWER) VALUES(null,?, ?, 1, 2, ?, ?)',[result[0].SURVEY_ID, surveyTypeId, userId, combineAnswer], function(e,r){
								console.log(e);
							});
							
							// 결과값 뽑아내기
							var valueArray = new Array();
							client.query('select ANSWER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ?',[surveyTypeId],function(e,r){
								for(i in answer){
									var surveyType1 = r[0].ANSWER.split(',')[i].split('STID')[1].split('ST')[1].split('A')[0];
									if(surveyType1 == 1){
										(function(i){
											console.log('surveyType----------------')
											console.log(parseInt(i)+1);
											client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?),",",-1), "ST", -1),"A",1) as STID, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
												console.log(r)	
													valueArray.push(r);
													if(parseInt(i)+1 == answer.length){
														console.log('양자');
														res.json(valueArray);	
													}
											})	
										})(i)
									}else if(surveyType1 ==2){ //단수선택형

											(function(i){
												console.log(parseInt(i)+1);
												client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
													console.log(r)
													valueArray.push(r);
													if(parseInt(i)+1 == answer.length){
														console.log('단수선택형');
														res.json(valueArray);	
													}
												})
											})(i)
									}else if(surveyType1 ==3){ //복수선택형
										console.log(surveyTypeId);
										console.log(surveyType1);
											(function(i){
												console.log(parseInt(i)+1);
												client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
													console.log(r)
													valueArray.push(r);
													if(parseInt(i)+1 == answer.length){
														console.log('단수선택형');
														res.json(valueArray);	
													}
												console.log('----------------------')		
												})
											})(i)
									}else if(surveyType1 ==4){ //순위형
										(function(i){
											console.log('순위형')
											console.log(parseInt(i)+1);
											client.query('select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1), "_", 1) AS PER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? group by PER ORDER BY COUNT DESC',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
												console.log(r)
												valueArray.push(r);
												if(parseInt(i)+1 == answer.length){
													res.json(valueArray);	
												}
											});
										})(i)
									}else if(surveyType1 ==5){ //별점형
										console.log('별 들어옴')
										var length = req.body.length;
										var group = new Array();
										(function(i){
											//select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "A", -1), "_", 1), ":", 1) AS PER, SUM(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "A", -1), "_", 1), ":", -1)) AS VAL FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = 574 (참여 인원수 / 전체값 보냄)
											select SURVEY_ANSWER_ID, answer, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), ",", -1) AS survey_type,
												 SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), ",", -1), 'A', -1) , '_', 3), '_', -1),":",-1)
												FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = 580 order by SURVEY_ANSWER_ID desc; 
											console.log('length : '+length)
											for(j=0; j<length; j++){
												(function(j){	
												client.query('select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1), "_", 1) AS PER , SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), ",", -1), "A", -1) , "_", ?), "_", -1),":",1) as PER, SUM(SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), ",", -1), "A", -1) , "_", ?), "_", -1),":",-1)) as value FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? order by SURVEY_ANSWER_ID desc;',[parseInt(i)+1, parseInt(i)+1, parseInt(i)+1, parseInt(j)+1, parseInt(i)+1, parseInt(j)+1, surveyTypeId],function(e,result){
													
													
													if(parseInt(j)+1 == length){
														group.push(result);
														valueArray.push(group);
														group = new Array();
													}else{
														group.push(result);
													}
													
													if(parseInt(i)+1 == answer.length){
														if(parseInt(j)+1 == length){
															console.log(valueArray);
															res.json(valueArray)
														}
													}
												});
												})(j)
											}
										})(i)
									}
								}	
							})
					});
				});
			break;
			case 'etc':
				//TypeID
				var surveyTypeId = '받아오는 컨텐츠 아이디';

				// 결과값 뽑아내기
				var valueArray = new Array();
				console.log(surveyTypeId)
				for(i in answer){ //i는 중질문 갯수
						client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1) AS ANSWER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ? GROUP BY ANSWER',[parseInt(i)+1, surveyTypeId],function(e,r){
							console.log(r);
							if(parseInt(i)+1 == answer.length){
								res.json(r);	
							}
							console.log('----------------------')		
						})
				}

			break;
		}*/
		//결과화면 전송해줘야함.
	}else if(req.params.id == 'p_test'){ /////////////////////////////////////////////////////////
			console.log('썸네일 수정 ');
			var form = new formidable.IncomingForm();
			var files = [];
			var fields = [];
			form.keepExtensions = true;
			//If you want the files written to form.uploadDir to include the extensions of the original files, set this property to true. (확장자 이름 써줄거냐 말거냐)
		    /*form.uploadDir = imagePath; //업로드할 위치 지정*/
		    form.maxFieldsSize = 10 * 1024*1024; //최대 업로드 크기
		    form.multiples = true; //다중업로드 여부
		    form.encoding = 'utf-8'; //인코딩
		    var imagePath = 'resources/images/builder/thumbnail/'; //********** 이미지 저장 경로를 바꾸고 싶으면 이쪽 path를 변경해주면 된다.
		    form.parse(req,function(err, fields, files){
		    	//console.log(fields);
		    	for(i in fields){
		    		console.log(fields[i])
		    		fs.writeFile(imagePath+'test'+i+'.png', fields[i], 'base64', function(err) { //out1.png 컨텐츠 번호로 바꿔줘야함.
					});
		    	}
		    	
		    });
	}
}





