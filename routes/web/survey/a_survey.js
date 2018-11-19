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

////////////////////////////////////////

//안드로이드 결과 화면
exports.a_survey = function(req, res){
	 if(req.params.id == 'input_survey_answer_finish'){
			console.log('/input_survey_answer_finish 접속됨');
			var surveyType = req.param('surveyType');
			var surveyTypeId = req.param('surveyTypeId');
			var userId = req.param('userId')
			var surveyType1 = req.param('surveyType1');
			var answer = ['1'];
			if(surveyType == 1){
				surveyType = 'choose';
			}else if(surveyType == 2){
				surveyType = 'single';
			}else if(surveyType == 3){
				surveyType = 'select';
			}else if(surveyType == 4){
				surveyType = 'rank';
			}else if(surveyType == 5){
				surveyType = 'star';
			}
			
			console.log(req.user)
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
						
						client.query('INSERT INTO SURVEY_ANSWER_TB(SURVEY_ANSWER_ID, SURVEY_ID, SURVEY_TYPE_ID, SURVEY_CONTENTS_ID, SURVEY_TYPE, USER_ID, ANSWER) VALUES(null,?, ?, 1, 2, ?, ?)',[result[0].SURVEY_ID, surveyTypeId, userId, req.query.answer], function(e,r){
							console.log(e);
							console.log('insert됨')
						});
						
						// 결과값 뽑아내기
						
						console.log('surveyTypeId : '+surveyTypeId);
					
						client.query('select ANSWER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ?',[surveyTypeId],function(e,r){
							var valueArray = new Array();
							var rLength = r[0].ANSWER.split(',').length;
							console.log(rLength)
							for(var i=0; i < rLength; i++){
								(function(i){
								var surveyType1 = r[0].ANSWER.split(',')[i].split('STID')[1].split('ST')[1].split('A')[0];
								if(surveyType1 == 1){
									console.log('양자택일형');
									client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(TB1.ANSWER, ",", ?),",",-1), "ST", -1),"A",1) as STID, SUBSTRING_INDEX(SUBSTRING_INDEX(TB1.ANSWER, ",", ?), "A", -1) AS PER, TB2.SECOND_SURVEY_TITLE FROM SURVEY_ANSWER_TB TB1 LEFT JOIN SURVEY_TYPE_TB TB2 ON TB1.SURVEY_TYPE_ID = TB2.SURVEY_TYPE_ID WHERE TB1.SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
										var max = 0;
										valueArray.push({"chartValue":r});
										for(j in r){
											(function(j){
												max+=r[j].COUNT;
												client.query('SELECT C_TB.SURVEY_CONTENTS, S_TB.SECOND_SURVEY_TITLE FROM SURVEY_CONTENTS_TB C_TB LEFT JOIN SURVEY_TYPE_TB S_TB ON C_TB.SURVEY_TYPE_ID = S_TB.SURVEY_TYPE_ID WHERE C_TB.SURVEY_CONTENTS_ID=?',[r[j].PER],function(e,result){
													percent = r[j].COUNT / max * 100; //백분율 계산
													valueArray[i].chartValue[j].SECOND_SURVEY_TITLE = result[0].SECOND_SURVEY_TITLE //질문
													valueArray[i].chartValue[j].SURVEY_CONTENTS = result[0].SURVEY_CONTENTS //컨텐츠 담는 부분 
													valueArray[i].chartValue[j].PERCENT = Math.round(percent) //백분율 담는 부분
													
													if(parseInt(j)+1 == r.length){
														console.log(valueArray[i])
														if(parseInt(i)+1 == rLength){
															var acc = JSON.stringify(valueArray);
															res.end(acc);
														}
														
													}
												});
											})(j)
										}
									})	

								}else if(surveyType1 ==2){ //단수선택형
										console.log('단수선택형');
											console.log('단수 : ' + i )
											client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1) AS PER, TB2.SECOND_SURVEY_TITLE FROM SURVEY_ANSWER_TB TB1 LEFT JOIN SURVEY_TYPE_TB TB2 ON TB1.SURVEY_TYPE_ID = TB2.SURVEY_TYPE_ID WHERE TB1.SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
												var max = 0;
												valueArray.push({"chartValue":r});
												for(j in r){
													(function(j){
														max+=r[j].COUNT;
														client.query('SELECT C_TB.SURVEY_CONTENTS, S_TB.SECOND_SURVEY_TITLE FROM SURVEY_CONTENTS_TB C_TB LEFT JOIN SURVEY_TYPE_TB S_TB ON C_TB.SURVEY_TYPE_ID = S_TB.SURVEY_TYPE_ID WHERE C_TB.SURVEY_CONTENTS_ID=?',[r[j].PER],function(e,result){
															percent = r[j].COUNT / max * 100; //백분율 계산
															valueArray[i].chartValue[j].SECOND_SURVEY_TITLE = result[0].SECOND_SURVEY_TITLE //질문
															valueArray[i].chartValue[j].SURVEY_CONTENTS = result[0].SURVEY_CONTENTS //컨텐츠 담는 부분 
															valueArray[i].chartValue[j].PERCENT = Math.round(percent) //백분율 담는 부분
															
															if(parseInt(j)+1 == r.length){
																
																if(parseInt(i)+1 == rLength){
																	var acc = JSON.stringify(valueArray);
																	res.end(acc);
																}
																
															}
														});
													})(j)
												}
											})
										
								}else if(surveyType1 ==3){ //복수선택형
									console.log('복수선택형---')
									var tArray = new Array();
									var countArray = new Array();
									
										var length = r[0].ANSWER.split(',')[i].split('_').length;
										for(j=0; j<length; j++){
											(function(j){
												client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1), "_", ?),"_", -1) AS PER, TB2.SECOND_SURVEY_TITLE FROM SURVEY_ANSWER_TB TB1 LEFT JOIN SURVEY_TYPE_TB TB2 ON TB1.SURVEY_TYPE_ID = TB2.SURVEY_TYPE_ID WHERE TB1.SURVEY_TYPE_ID = ? group by PER ORDER BY COUNT DESC',[parseInt(i)+1, parseInt(i)+1, parseInt(j)+1, surveyTypeId],function(e,r){
													if(j == 0){
														for(k in r){
															countArray.push({"PER":r[k].PER,"COUNT":r[k].COUNT, "SECOND_SURVEY_TITLE":r[k].SECOND_SURVEY_TITLE});
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
															(function(y){
																client.query('SELECT C_TB.SURVEY_CONTENTS, S_TB.SECOND_SURVEY_TITLE FROM SURVEY_CONTENTS_TB C_TB LEFT JOIN SURVEY_TYPE_TB S_TB ON C_TB.SURVEY_TYPE_ID = S_TB.SURVEY_TYPE_ID WHERE C_TB.SURVEY_CONTENTS_ID=?',[r[j].PER],function(e,result){
																	console.log("**********************")
																	countArray[y].SURVEY_CONTENTS = result[0].SURVEY_CONTENTS;
																	countArray[y].SECOND_SURVEY_TITLE = result[0].SECOND_SURVEY_TITLE;
																});
																countArray[y].STID = '3';
																countArray[y].PERCENT = Math.round(countArray[y].COUNT / max * 100); //백분율 계산
															})(y)
														}
														valueArray.push({"chartValue":countArray});
														if(parseInt(i)+1 == rLength){
															console.log('복수선택형');
															res.json(valueArray);	
														}
													}
												})
											})(j)
										}
									
								}else if(surveyType1 ==4){ //순위형
										client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1), "_", 1) AS PER, TB2.SECOND_SURVEY_TITLE FROM SURVEY_ANSWER_TB TB1 LEFT JOIN SURVEY_TYPE_TB TB2 ON TB1.SURVEY_TYPE_ID = TB2.SURVEY_TYPE_ID WHERE TB1.SURVEY_TYPE_ID = ? GROUP BY PER ORDER BY COUNT DESC',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
											/*console.log(r)*/
											var max = 0;
											valueArray.push({"chartValue":r});
											for(j in r){
												(function(j){
													max+=r[j].COUNT;
													client.query('SELECT C_TB.SURVEY_CONTENTS, S_TB.SECOND_SURVEY_TITLE FROM SURVEY_CONTENTS_TB C_TB LEFT JOIN SURVEY_TYPE_TB S_TB ON C_TB.SURVEY_TYPE_ID = S_TB.SURVEY_TYPE_ID WHERE C_TB.SURVEY_CONTENTS_ID=?',[r[j].PER],function(e,result){
														percent = r[j].COUNT / max * 100; //백분율 계산
														valueArray[i].chartValue[j].SECOND_SURVEY_TITLE = result[0].SECOND_SURVEY_TITLE //질문
														valueArray[i].chartValue[j].SURVEY_CONTENTS = result[0].SURVEY_CONTENTS //컨텐츠 담는 부분 
														valueArray[i].chartValue[j].PERCENT = Math.round(percent) //백분율 담는 부분
														
														
														if(parseInt(j)+1 == r.length){
															console.log(valueArray[i])
															if(parseInt(i)+1 == rLength){
																var acc = JSON.stringify(valueArray);
																res.end(acc);
															}
														}
													});
												})(j)
											}
										});
									
								}else if(surveyType1 ==5){ //별점형
									console.log('별 들어옴')
									
									var length = r[0].ANSWER.split(',')[i].split('_').length
									var group = new Array();
									
										//select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "A", -1), "_", 1), ":", 1) AS PER, SUM(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "A", -1), "_", 1), ":", -1)) AS VAL FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = 574 (참여 인원수 / 전체값 보냄)
										/*select SURVEY_ANSWER_ID, answer, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), ",", -1) AS survey_type,
											 SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), ",", -1), 'A', -1) , '_', 3), '_', -1),":",-1)
											FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = 580 order by SURVEY_ANSWER_ID desc; */
										
										for(star=0; star<length; star++){
											
											(function(star){
												console.log(valueArray[0])
												client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1), "_", 1) AS PER ,  SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), ",", -1), "A", -1) , "_", ?), "_", -1),":",1) as PER, TB2.SECOND_SURVEY_TITLE , ROUND(AVG(SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), ",", -1), "A", -1) , "_", ?), "_", -1),":",-1))) as PERCENT FROM SURVEY_ANSWER_TB TB1 LEFT JOIN SURVEY_TYPE_TB TB2 ON TB1.SURVEY_TYPE_ID = TB2.SURVEY_TYPE_ID WHERE TB1.SURVEY_TYPE_ID = ? order by SURVEY_ANSWER_ID desc;',[parseInt(i)+1, parseInt(i)+1, parseInt(i)+1, parseInt(star)+1, parseInt(i)+1, parseInt(star)+1, surveyTypeId],function(e,result){
												
													if(length == 1){
														valueArray.push({"chartValue":result});
													}else{
														if(parseInt(star)+1 == length){
															group.push(result[0]);
															group = new Array();
														}else{
															if(star == 0){
																group.push(result[0]);
																valueArray.push({"chartValue":group});
															}else{
																group.push(result[0]);
															}
														}	
													}
																										
													client.query('SELECT SURVEY_CONTENTS FROM SURVEY_CONTENTS_TB WHERE SURVEY_CONTENTS_ID=?',[result[0].PER],function(e,result1){
														
														valueArray[i].chartValue[star].SURVEY_CONTENTS = result1[0].SURVEY_CONTENTS //컨텐츠 담는 부분 
														//valueArray[i].chartValue[star].PERCENT = Math.round(percent) //백분율 담는 부분
														
														
														if(parseInt(star)+1 == length){
															
															if(parseInt(i)+1 == rLength){
																	res.json(valueArray);
																
															}
														}
													});
													
													
												
											});
											})(star)
										}
									
								}
								})(i)
							}	
						})
				});
			});

	 }else if(req.params.id == 'a_show_result'){
		 console.log('/input_survey_answer_finish 접속됨');
			var surveyType = req.param('surveyType');
			var surveyTypeId = req.param('surveyTypeId');
			var surveyType1 = req.param('surveyType1');
			var answer = ['1'];
			if(surveyType == 1){
				surveyType = 'choose';
			}else if(surveyType == 2){
				surveyType = 'single';
			}else if(surveyType == 3){
				surveyType = 'select';
			}else if(surveyType == 4){
				surveyType = 'rank';
			}else if(surveyType == 5){
				surveyType = 'star';
			}
			
			console.log(req.query.answer);
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
	
						// 결과값 뽑아내기
						
						console.log(surveyTypeId);
					
						client.query('select ANSWER FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = ?',[surveyTypeId],function(e,r){
							var valueArray = new Array();
							var rLength = r[0].ANSWER.split(',').length;
							console.log(rLength)
							for(var i=0; i < rLength; i++){
								(function(i){
								var surveyType1 = r[0].ANSWER.split(',')[i].split('STID')[1].split('ST')[1].split('A')[0];
								if(surveyType1 == 1){
									console.log('양자택일형');
										client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(TB1.ANSWER, ",", ?),",",-1), "ST", -1),"A",1) as STID, SUBSTRING_INDEX(SUBSTRING_INDEX(TB1.ANSWER, ",", ?), "A", -1) AS PER, TB2.SECOND_SURVEY_TITLE FROM SURVEY_ANSWER_TB TB1 LEFT JOIN SURVEY_TYPE_TB TB2 ON TB1.SURVEY_TYPE_ID = TB2.SURVEY_TYPE_ID WHERE TB1.SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
											var max = 0;
											valueArray.push({"chartValue":r});
											for(j in r){
												(function(j){
													max+=r[j].COUNT;
													client.query('SELECT C_TB.SURVEY_CONTENTS, S_TB.SECOND_SURVEY_TITLE FROM SURVEY_CONTENTS_TB C_TB LEFT JOIN SURVEY_TYPE_TB S_TB ON C_TB.SURVEY_TYPE_ID = S_TB.SURVEY_TYPE_ID WHERE C_TB.SURVEY_CONTENTS_ID=?',[r[j].PER],function(e,result){
														percent = r[j].COUNT / max * 100; //백분율 계산
														valueArray[i].chartValue[j].SECOND_SURVEY_TITLE = result[0].SECOND_SURVEY_TITLE //질문
														valueArray[i].chartValue[j].SURVEY_CONTENTS = result[0].SURVEY_CONTENTS //컨텐츠 담는 부분 
														valueArray[i].chartValue[j].PERCENT = Math.round(percent) //백분율 담는 부분
														
														if(parseInt(j)+1 == r.length){
															
															if(parseInt(i)+1 == rLength){
																var acc = JSON.stringify(valueArray);
																res.end(acc);
															}
															
														}
													});
												})(j)
											}
										})
								}else if(surveyType1 ==2){ //단수선택형
										console.log('단수선택형');
											console.log('단수 : ' + i )
											client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1) AS PER, TB2.SECOND_SURVEY_TITLE FROM SURVEY_ANSWER_TB TB1 LEFT JOIN SURVEY_TYPE_TB TB2 ON TB1.SURVEY_TYPE_ID = TB2.SURVEY_TYPE_ID WHERE TB1.SURVEY_TYPE_ID = ? GROUP BY PER',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
												var max = 0;
												valueArray.push({"chartValue":r});
												for(j in r){
													(function(j){
														max+=r[j].COUNT;
														client.query('SELECT SURVEY_CONTENTS FROM SURVEY_CONTENTS_TB WHERE SURVEY_CONTENTS_ID=?',[r[j].PER],function(e,result){
															percent = r[j].COUNT / max * 100; //백분율 계산
															
															valueArray[i].chartValue[j].SURVEY_CONTENTS = result[0].SURVEY_CONTENTS //컨텐츠 담는 부분 
															valueArray[i].chartValue[j].PERCENT = Math.round(percent) //백분율 담는 부분
															
															if(parseInt(j)+1 == r.length){
																
																if(parseInt(i)+1 == rLength){
																	var acc = JSON.stringify(valueArray);
																	res.end(acc);
																}
																
															}
														});
													})(j)
												}
											})
										
								}else if(surveyType1 ==3){ //복수선택형
									console.log('복수선택형---')
									var tArray = new Array();
									var countArray = new Array();
									
										var length = r[0].ANSWER.split(',')[i].split('_').length;
										for(j=0; j<length; j++){
											(function(j){
												client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1), "_", ?),"_", -1) AS PER, TB2.SECOND_SURVEY_TITLE FROM SURVEY_ANSWER_TB TB1 LEFT JOIN SURVEY_TYPE_TB TB2 ON TB1.SURVEY_TYPE_ID = TB2.SURVEY_TYPE_ID WHERE TB1.SURVEY_TYPE_ID = ? group by PER ORDER BY COUNT DESC',[parseInt(i)+1, parseInt(i)+1, parseInt(j)+1, surveyTypeId],function(e,r){
													if(j == 0){
														for(k in r){
															countArray.push({"PER":r[k].PER,"COUNT":r[k].COUNT, "SECOND_SURVEY_TITLE":r[k].SECOND_SURVEY_TITLE});
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
															(function(y){
																client.query('SELECT SURVEY_CONTENTS FROM SURVEY_CONTENTS_TB WHERE SURVEY_CONTENTS_ID=?',[countArray[y].PER],function(e,result){
																	console.log("**********************")
																	countArray[y].SURVEY_CONTENTS = result[0].SURVEY_CONTENTS;
																});
																countArray[y].STID = '3';
																countArray[y].PERCENT = Math.round(countArray[y].COUNT / max * 100); //백분율 계산
															})(y)
														}
														valueArray.push({"chartValue":countArray});
														if(parseInt(i)+1 == rLength){
															console.log('복수선택형');
															res.json(valueArray);	
														}
													}
												})
											})(j)
										}
									
								}else if(surveyType1 ==4){ //순위형
										client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1), "_", 1) AS PER, TB2.SECOND_SURVEY_TITLE FROM SURVEY_ANSWER_TB TB1 LEFT JOIN SURVEY_TYPE_TB TB2 ON TB1.SURVEY_TYPE_ID = TB2.SURVEY_TYPE_ID WHERE TB1.SURVEY_TYPE_ID = ? GROUP BY PER ORDER BY COUNT DESC',[parseInt(i)+1, parseInt(i)+1, surveyTypeId],function(e,r){
											/*console.log(r)*/
											var max = 0;
											valueArray.push({"chartValue":r});
											for(j in r){
												(function(j){
													max+=r[j].COUNT;
													client.query('SELECT SURVEY_CONTENTS FROM SURVEY_CONTENTS_TB WHERE SURVEY_CONTENTS_ID=?',[r[j].PER],function(e,result){
														percent = r[j].COUNT / max * 100; //백분율 계산
														
														valueArray[i].chartValue[j].SURVEY_CONTENTS = result[0].SURVEY_CONTENTS //컨텐츠 담는 부분 
														valueArray[i].chartValue[j].PERCENT = Math.round(percent) //백분율 담는 부분
														
														
														if(parseInt(j)+1 == r.length){
															if(parseInt(i)+1 == rLength){
																var acc = JSON.stringify(valueArray);
																res.end(acc);
															}
														}
													});
												})(j)
											}
										});
									
								}else if(surveyType1 ==5){ //별점형
									console.log('별 들어옴')
									
									var length = r[0].ANSWER.split(',')[i].split('_').length
									var group = new Array();
									
										//select count(*) as count, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "A", -1), "_", 1), ":", 1) AS PER, SUM(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), "A", -1), "_", 1), ":", -1)) AS VAL FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = 574 (참여 인원수 / 전체값 보냄)
										/*select SURVEY_ANSWER_ID, answer, SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), ",", -1) AS survey_type,
											 SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", 1), ",", -1), 'A', -1) , '_', 3), '_', -1),":",-1)
											FROM SURVEY_ANSWER_TB WHERE SURVEY_TYPE_ID = 580 order by SURVEY_ANSWER_ID desc; */
										
										for(star=0; star<length; star++){
											
											(function(star){
												console.log(valueArray[0])
												client.query('select count(*) as COUNT, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "ST", -1), "A",1) AS STID, SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), "A", -1), "_", 1) AS PER ,  SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), ",", -1), "A", -1) , "_", ?), "_", -1),":",1) as PER, TB2.SECOND_SURVEY_TITLE , ROUND(AVG(SUBSTRING_INDEX(substring_index(substring_index ( SUBSTRING_INDEX( SUBSTRING_INDEX(SUBSTRING_INDEX(ANSWER, ",", ?), ",", -1), "A", -1) , "_", ?), "_", -1),":",-1))) as PERCENT FROM SURVEY_ANSWER_TB TB1 LEFT JOIN SURVEY_TYPE_TB TB2 ON TB1.SURVEY_TYPE_ID = TB2.SURVEY_TYPE_ID WHERE TB1.SURVEY_TYPE_ID = ? order by SURVEY_ANSWER_ID desc;',[parseInt(i)+1, parseInt(i)+1, parseInt(i)+1, parseInt(star)+1, parseInt(i)+1, parseInt(star)+1, surveyTypeId],function(e,result){
												
													if(length == 1){
														valueArray.push({"chartValue":result});
													}else{
														if(parseInt(star)+1 == length){
															group.push(result[0]);
															group = new Array();
														}else{
															if(star == 0){
																group.push(result[0]);
																valueArray.push({"chartValue":group});
															}else{
																group.push(result[0]);
															}
														}	
													}
																										
													client.query('SELECT C_TB.SURVEY_CONTENTS, S_TB.SECOND_SURVEY_TITLE FROM SURVEY_CONTENTS_TB C_TB LEFT JOIN SURVEY_TYPE_TB S_TB ON C_TB.SURVEY_TYPE_ID = S_TB.SURVEY_TYPE_ID WHERE C_TB.SURVEY_CONTENTS_ID=?',[result[0].PER],function(e,result1){
														percent = 15
														valueArray[i].chartValue[star].SECOND_SURVEY_TITLE = result1[0].SECOND_SURVEY_TITLE //컨텐츠 담는 부분
														valueArray[i].chartValue[star].SURVEY_CONTENTS = result1[0].SURVEY_CONTENTS //컨텐츠 담는 부분 
														//valueArray[i].chartValue[star].PERCENT = Math.round(percent) //백분율 담는 부분
														
														
														if(parseInt(star)+1 == length){
															
															if(parseInt(i)+1 == rLength){
																	res.json(valueArray);
																
															}
														}
													});

												
											});
											})(star)
										}
									
								}
								})(i)
							}	
						})
				});
			});
	 }
}

