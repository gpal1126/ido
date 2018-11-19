//순위형타입
function inputRank(button ,idx){
	//idx : 중질문의 갯수에 맞춰서 값이 변함. 버튼을 클릭시 idx값은 증감한다. 중질문의 숫자를 기준으로
	//index : 중질문 내의 답변의 수 **아래 each function은 유저의 답변값들을 조회해서 가져오는 function이다.
	//button : next인지 finish인지로 구분한다. 마지막 값일경우 결과화면을 유저에게 보여주자.
	var jsonArray = new Array();
	var surveyTypeId = $('#surveyTypeId'+(idx+1)).val();
	$('div.contsDiv'+(idx+1)).children().children().each(function(index, val){
		var ob = new Object();	
		ob.typeId = 'survey_answer_T'+surveyTypeId+'_A'+index;
		ob.answer = $('input[name="rank_sub_input'+(idx+1)+'"]').eq(index).val();
		jsonArray.push(ob);
	});
	var json ={"answer":jsonArray,"surveyType":"rank"}
	if(button == 'next'){
		$.ajax({
			url:'/survey/input_survey_answer',
			type:'POST',
			data:json,
			dataType:"json",
			success:function(){
				clickCount = 0;
			}
		})
	}else if(button =='finish'){
		$.ajax({
			url:'/survey/input_survey_answer_finish',
			type:'POST',
			data:json,
			dataType:"json",
			success:function(data){
				console.log(data);
				
				clickCount = 0;
				$('.selectSurveyDiv').remove();
				$('.finishBtn').remove();
				
				var rank = data.rank;
				var star = data.star;
				var choice = data.choice;
				var select = data.select;
				var surveyTitleHtml ='<div class="surveyResult">'+
										'<div class="top_container">'+
											'<div class="line_bar"></div><br>'+
										'</div>'+
										'<div class="result_container">';
										if(rank!=undefined){
					surveyTitleHtml +=		'<div class="rank_container"></div>';
										}
										if(star!=undefined){
					surveyTitleHtml +=		'<div class="star_container"></div>';
										}
										if(choice!=undefined){
					surveyTitleHtml +=		'<div class="choice_container"></div>';
										}
										if(select!=undefined){
					surveyTitleHtml +=		'<div class="select_container"></div>';
										}
					surveyTitleHtml +=		'<div class="text_container"></div>'+
										'</div>'+
									'</div>';
				$('div[id*=dialog-survey]').append(surveyTitleHtml);
				
				//순위형 func
				rankFunc(rank);
				
				//별점형 func
				starFunc(star);
				
				//이중택일 func
				choiceFunc(choice);
				
				//선택형 func
				selectFunc(select);
			} /*success*/
		})
	}
}

//js getter/setter
function Value(val){
	var value=val;
	this.getValue = function(){
		return value;
	};
	
	this.setValue = function(val){
		value=val;
	};
}

/** 별점형 타입 **/
//별점형 결과 답변 객체 선언
var starScoreObj = new Value();

function inputStar(button, idx){
	console.log('surveyAnswer 별점형 js ');
	var answerArr = new Array();
	
	var surveyTypeId = $('#surveyTypeId'+(idx+1)).val();
	console.log('surveyTypeId???????????'+surveyTypeId);
	//answerArr.push(surveyTypeId);
	
	$('#surveyDiv'+(idx+1)+' .contsDiv').each(function(j){
		var starArr = new Array();
		var surveyContsId = $('#contsDiv'+(idx+1)+'_'+(j+1)+'').children('#surveyContentsId'+(j+1)+'').val();
		console.log('surveyContsId::'+surveyContsId);
		var starScore = $('#contsDiv'+(idx+1)+'_'+(j+1)+'').children().children('#starRating'+(idx+1)+'_'+(j+1)+'').val();
		console.log('starScore:::::::::::::'+starScore);
		starArr.push(surveyContsId);
		starArr.push(starScore);
		
		answerArr.push(starArr);
		starScoreObj.setValue(starScore);
		
		console.log('answerArr>>>>>>>>>>>>>');
		console.log(answerArr);
	});
	
	var json ={"surveyTypeId":surveyTypeId, "answer":answerArr, "surveyType":"star"}
	
	if(button == 'next'){
		$.ajax({
			url:'/survey/input_survey_answer',
			type:'POST',
			data:json,
			dataType:"json",
			success:function(){
				clickCount = 0;
			}
		})
	}else if(button =='finish'){
		$.ajax({
			url:'/survey/input_survey_answer_finish',
			type:'POST',
			data:json,
			dataType:"json",
			success:function(data){
				clickCount = 0;
				$('.selectSurveyDiv').remove();
				$('.finishBtn').remove();
				
				var rank = data.rank;
				var star = data.star;
				var choice = data.choice;
				var select = data.select;
				var surveyTitleHtml ='<div class="surveyResult">'+
											'<div class="top_container">'+
												'<div class="line_bar"></div><br>'+
											'</div>'+
											'<div class="result_container">';
											if(rank!=undefined){
					surveyTitleHtml 		+=	'<div class="rank_container"></div>';
											}
											if(star!=undefined){
					surveyTitleHtml +=			'<div class="star_container"></div>';
											}
											if(choice!=undefined){
					surveyTitleHtml +=			'<div class="choice_container"></div>';
											}
											if(select!=undefined){
					surveyTitleHtml +=			'<div class="select_container"></div>';
											}
					surveyTitleHtml +=			'<div class="text_container"></div>'+
											'</div>'+
									'</div>';
				$('div[id*=dialog-survey]').append(surveyTitleHtml);
				
				//순위형 func
				rankFunc(rank);
				
				//별점형 func
				starFunc(star);
				
				//이중택일 func
				choiceFunc(choice);
				
				//선택형 func
				selectFunc(select);
			}//end success
		})
	}
}
/** 별점형 타입 **/

/** 이중택일형 타입 **/
//이중택일 결과 답변 객체 선언
var contsRstVal = new Value();

function inputChoice(button, idx){
	//idx : 중질문의 갯수에 맞춰서 값이 변함. 버튼을 클릭시 idx값은 증감한다. 중질문의 숫자를 기준으로
	//index : 중질문 내의 답변의 수 **아래 each function은 유저의 답변값들을 조회해서 가져오는 function이다.
	//button : next인지 finish인지로 구분한다. 마지막 값일경우 결과화면을 유저에게 보여주자.
	
	var answerArr = new Array();
	
	var surveyTypeId = $('#surveyTypeId'+(idx+1)+'').val();
	console.log('surveyTypeId???????????'+surveyTypeId);
	
	//결과 답변 
	var contsRst = contsRstVal.getValue();
	console.log('contsRst??????::::::'+contsRst);
	//결과 답변 surveycontentsId값
	var surveyContsId = $('#surveyDiv'+(idx+1)+' #'+contsRst+'').children('input[name="surveyContentsId"]').val();
	console.log('surveyContsId:????'+surveyContsId);
	
	answerArr.push(surveyTypeId);
	answerArr.push(surveyContsId);
	
	var json = {'answer':answerArr, 'surveyType':'choice' }; 
		
	if(button=='next'){
		$.ajax({
			url:'/survey/input_survey_answer',
			type:'POST',
			data:json,
			dataType:'json',
			success:function(){
				clickCount=0;
			}
		});
	}else if(button=='finish'){
		$.ajax({
			url:'/survey/input_survey_answer_finish',
			type:'POST',
			data:json,
			dataType:'json',
			success:function(data){
				clickCount = 0;
				$('.selectSurveyDiv').remove();
				$('.finishBtn').remove();
				
				var rank = data.rank;
				var star = data.star;
				var choice = data.choice;
				var select = data.select;
				var surveyTitleHtml ='<div class="surveyResult">'+
										'<div class="top_container">'+
											'<div class="line_bar"></div><br>'+
										'</div>'+
										'<div class="result_container">';
										if(rank!=undefined){
					surveyTitleHtml +=		'<div class="rank_container"></div>';
										}
										if(star!=undefined){
					surveyTitleHtml +=		'<div class="star_container"></div>';
										}
										if(choice!=undefined){
					surveyTitleHtml +=		'<div class="choice_container"></div>';
										}
										if(select!=undefined){
					surveyTitleHtml +=		'<div class="select_container"></div>';
										}
					surveyTitleHtml +=		'<div class="text_container"></div>'+
										'</div>'+
									'</div>';
				$('div[id*=dialog-survey]').append(surveyTitleHtml);
				
				//순위형 func
				rankFunc(rank);
				
				//별점형 func
				starFunc(star);
				
				//이중택일 func
				choiceFunc(choice);
				
				//선택형 func
				selectFunc(select);
			}//end success
		});
	}//if
} 
/** 이중택일형 타입 **/

//선택형 타입
function inputSelect(button, idx){
	var jsonArray = new Array();
	var surveyTypeId = $('#surveyTypeId'+(idx+1)).val();
	$('div.contsDiv'+(idx+1)).children().children().each(function(index, val){
		var ob = new Object();	
		ob.typeId = 'survey_answer_T'+surveyTypeId+'_A'+index;
		ob.answer = $('input[name="select_sub_input'+(idx+1)+'"]').eq(index).val();
		jsonArray.push(ob);
	});
	var json ={"answer":jsonArray,"surveyType":"select"}
	if(button == 'next'){
		$.ajax({
			url:'/survey/input_survey_answer',
			type:'POST',
			data:json,
			dataType:"json",
			success:function(){
				clickCount = 0;
			}
		})
	}else if(button =='finish'){
		$.ajax({
			url:'/survey/input_survey_answer_finish',
			type:'POST',
			data:json,
			dataType:"json",
			success:function(data){
				clickCount = 0;
				$('.selectSurveyDiv').remove();
				$('.finishBtn').remove();
				
				var rank = data.rank;
				var star = data.star;
				var choice = data.choice;
				var select = data.select;
				var surveyTitleHtml ='<div class="surveyResult">'+
										'<div class="top_container">'+
											'<div class="line_bar"></div><br>'+
										'</div>'+
										'<div class="result_container">';
										if(rank!=undefined){
					surveyTitleHtml +=		'<div class="rank_container"></div>';
										}
										if(star!=undefined){
					surveyTitleHtml +=		'<div class="star_container"></div>';
										}
										if(choice!=undefined){
					surveyTitleHtml +=		'<div class="choice_container"></div>';
										}
										if(select!=undefined){
					surveyTitleHtml +=		'<div class="select_container"></div>';
										}
					surveyTitleHtml +=		'<div class="text_container"></div>'+
										'</div>'+
									'</div>';
				$('div[id*=dialog-survey]').append(surveyTitleHtml);
				
				//순위형 func
				rankFunc(rank);
				
				//별점형 func
				starFunc(star);
				
				//이중택일 func
				choiceFunc(choice);
				
				//선택형 func
				selectFunc(select);
			}//end success
		});
	}
}

/************************** 순위형 function *****************************/
function rankFunc(rank){
	console.log(rank);
	for(i in rank){
		if(i % 2 == 0){
			$('.rank_container').append('<div class="hrBar"></div><br class="hrBr">'+
					 '<div class="center_container">'+
					 	'<div class="rank_type_img"></div>'+
						'<div class="secondTitleContainer">'+
							'<div class="secondTitleBtn"></div>'+
							'<div class="secondTitle">'+
								'<p>'+rank[i][0].SECOND_SURVEY_TITLE+'</p>'+
							'</div>'+
						'</div>'+
						'</div>'+
						'<div class="dotteBar"></div><br><br>'+
						'<div class="bottm_container">'+
							'<div class="rank1" id="'+rank[i][0].SURVEY_TYPE_ID+'">'+
								'<div class="rank1Btn"></div>'+
								'<img src="'+rank[i][0].SURVEY_IMAGE_PATH+'" style="width: 200px; height: 200px">'+
							'</div>'+
						'</div>');
		}else if(i%2 == 1){
			console.log(rank[i][0].SURVEY_CONTENTS_ID);
			$('#'+rank[i][0].SURVEY_TYPE_ID+'').after('<div class="rank2">'+
														'<div class="rank2Btn"></div>'+
														'<img src="'+rank[i][0].SURVEY_IMAGE_PATH+'" style="width: 200px; height: 200px">'+
													 	'</div>');
		}
	}
}
/************************** 순위형 function *****************************/

/************************** 별점형 function *****************************/
function starFunc(star){
	console.log(star);
	for(var i in star){
		i = parseInt(i);
		console.log(star[i]);
		
		var starHtml = '';
		
		starHtml += ''+
					//'<div class="rstStarDiv">'+
						'<div class="rstTitle" id="rstTitle'+(i+1)+'">'+
							'<div class="line_bar_img"> </div>'+
							'<div class="star_type_img"></div>'+
							'<div class="second_title">'+
								'<div class="second_title_img"></div>'+
								'<div class="second_title_txt"><p>'+star[i][0].SECOND_SURVEY_TITLE+'</p></div>'+
							'</div>'+
						'</div>'+	
						'<div class="dot_bar_img"></div>'+
						'<div>'+
							'<div>'+
								'<img class="second_title_imgPath" src="'+star[i][0].SECOND_SURVEY_IMAGE_PATH+'">'+
							'</div>'+
						'</div>'+
					'';	
		
		for(var j in star[i]){
			j = parseInt(j);
			
			//console.log(star[i][j]);
			
			//var choiceHtml = '';
			starHtml +=		''+		
						  	'<div class="rst_conts" id="rst_conts'+(j+1)+'">'+
  								'<div class="rst_conts_txt" id="rst_conts_txt'+(j+1)+'" >'+star[i][j].SURVEY_CONTENTS+'</div>'+
  								'';
			
  			starHtml +=			'<div class="rst_avg_star">';
  			
  			//별점 평균 반올림
  			var avgStar = Math.round(star[i][j].ANSWER);
  			console.log(avgStar);
  			for(var cnt=1; cnt<=5; cnt++){ 
  				console.log('cnt::'+cnt);
  				if(avgStar==cnt){ //별점 평균이 cnt와 같으면 
  					for(var starNo=1; starNo<=cnt; starNo++){	//cnt만큼 별을 찍음
  						console.log('starNo::'+starNo);
  						starHtml += '<img src="/images/common/main/result_survey/star_on_icon.png">';
  					}//for
  					for(var starNo=cnt; starNo<5; starNo++){	//cnt만큼 별을 찍음
  						starHtml += '<img src="/images/common/main/result_survey/star_off_icon.png">';
  					}//for
  				}//if
  			}//for
  			
  			starHtml +=			'</div>';
			starHtml +=	   '</div>';
		}//for
		
		//starHtml +='</div>';
		$('.star_container').append(starHtml);
		
		
	}//for
}
/************************** 별점형 function *****************************/

/************************** 이중택일형 function *****************************/
function choiceFunc(choice){
	console.log(choice);
	for(var i in choice){
		i = parseInt(i);
		//console.log(choice[i]);
		
		var choiceHtml = '';
		
		choiceHtml += ''+
					//'<div class="rstChoiceDiv">'+
						'<div class="rstTitle" id="rstTitle'+(i+1)+'">'+
							'<div class="line_bar_img"> </div>'+
							'<div class="choice_type_img"></div>'+
							'<div class="second_title">'+
								'<div class="second_title_img"></div>'+
								'<div class="second_title_txt"><p>'+choice[i][0].SECOND_SURVEY_TITLE+'</p></div>'+
							'</div>'+
						'</div>'+	
						'<div class="dot_bar_img"></div>'+
					'';	
		
		for(var j in choice[i]){
			j = parseInt(j);
			
			console.log(choice[i][j]);
			
			//var choiceHtml = '';
			choiceHtml +=	''+		
						  	'<span class="rst_conts" id="rst_conts'+(j+1)+'">'+
						  	'';
			if(j==0){
			choiceHtml +=   	'<div class="choiceRank1"></div>';
			}
			if(j==1){
			choiceHtml += 		'<div class="choiceRank2"></div>';
			}
						  		
			
			choiceHtml +=	  	'<img class="rst_conts_img" src="'+choice[i][j].SURVEY_IMAGE_PATH+'" id="rst_conts_img'+(j+1)+'"/>'+
	  							'<p class="rst_conts_p" id="rst_conts_p'+(j+1)+'">'+
	  								'<span class="rst_conts_txt" id="rst_conts_txt'+(j+1)+'" >'+choice[i][j].SURVEY_CONTENTS+'</span>'+
	  							'</p>'+
						  	'</span>'+
						  '';
		}//for
		
		choiceHtml +=''+
					//'</div>';
		
		$('.choice_container').append(choiceHtml);
		
	}//for
}
/************************** 이중택일형 function *****************************/

/************************** 선택형 function *****************************/
function selectFunc(select){
	console.log(select);
	var chartData = new Array();
	var chartObj = new Object();
	for(j in select){
		j = parseInt(j);
		$('.select_container').append('<div class="hrBar"></div><br class="hrBr">'+
					 '<div class="center_container">'+
					 	'<div class="select_type_img"></div>'+
						'<div class="secondTitleContainer">'+
							'<div class="secondTitleBtn"></div>'+
							'<div class="secondTitle">'+
								'<p>'+select[j][0].SECOND_SURVEY_TITLE+'</p>'+
							'</div>'+
						'</div>'+
						'</div>'+
						'<div class="dotteBar"></div><br><br>'+
						'<div class="bottms_container">'+
						'</div>');
		$('.bottms_container').append('<div id="chartdiv" style="width: 100%; height: 300px;"></div>')
		for(k in select[j]){
			var chartObj = new Object();
			console.log(select[j][k]);
			console.log(select[j][k].SURVEY_CONTENTS_ID);
			chartObj.country = select[j][k].SURVEY_CONTENTS;
			chartObj.litres = select[j][k].COUNT;
			
			
			chartData.push(chartObj);
		}
		console.log('-------------------------');
		console.log(chartData);
		console.log(chartData.length);
	}/*for*/
	var chart;
	var legend;


    // PIE CHART
    chart = new AmCharts.AmPieChart();
    chart.dataProvider = chartData;
    chart.titleField = "country";
    chart.valueField = "litres";
    chart.outlineColor = "#FFFFFF";
    chart.outlineAlpha = 0.8;
    chart.outlineThickness = 2;

    // WRITE
    chart.write("chartdiv");
}
/************************** 선택형 function *****************************/
