function viewSlide(){
	var wrap = jQuery('.slides_wrap'),
    slides = wrap.find('.img_slide'),
    active = slides.filter('.active'),
    buttons = jQuery('.slide_button'),
    i = slides.index(active),
    width = wrap.width();

// Listen for swipe events on slides, and use a custom 'activate'
// event to add and remove the class 'active' to the previous
// or next slide, and to keep the index up-to-date. The class
// 'active' uses CSS transitions to make the slide move.

slides

.on('swipeleft', function(e) {
	if (i === slides.length - 1) { return; }
	slides.eq(i + 1).trigger('activate');
	
})
.on('swiperight', function(e) {
	console.log('right')
	if (i === 0) { return; }
	slides.eq(i - 1).trigger('activate');
})

.on('activate', function(e) {
	slides.eq(i).removeClass('active');
	buttons.eq(i).removeClass('on');

	jQuery(e.target).addClass('active');

	// Update the active slide index
	i = slides.index(e.target);

	// select active class for slide button
	buttons.eq(i).addClass('on');
})

// The code below handles what happens before any swipe event is triggered.
// It makes the slides demo on this page work nicely, but really doesn't
// have much to do with demonstrating the swipe events themselves. For more
// on move events see:
//
// http://stephband.info/jquery.event.move

.on('movestart', function(e) {
	console.log('mouseStart')
	// If the movestart heads off in a upwards or downwards
	// direction, prevent it so that the browser scrolls normally.
	if ((e.distX > e.distY && e.distX < -e.distY) ||
	    (e.distX < e.distY && e.distX > -e.distY)) {
		e.preventDefault();
		return;
	}

	// To allow the slide to keep step with the finger,
	// temporarily disable transitions.
	wrap.addClass('notransition');
})

.on('move', function(e) {

	var left = 100 * e.distX / width;
	console.log(left)
	// Move slides with the finger
	if (e.distX < 0) {
		if (slides[i+1]) {
			slides[i].style.left = left + '%';
			slides[i+1].style.left = (left+100)+'%';
		}
		else {
			slides[i].style.left = left/4 + '%';
		}
	}
	if (e.distX > 0) {
		if (slides[i-1]) {
			slides[i].style.left = left + '%';
			slides[i-1].style.left = (left-100)+'%';
		}
		else {
			slides[i].style.left = left/5 + '%';
		}
	}
})

.on('moveend', function(e) {
	wrap.removeClass('notransition');
	
	slides[i].style.left = '';

	if (slides[i+1]) {
		slides[i+1].style.left = '';
	}
	if (slides[i-1]) {
		slides[i-1].style.left = '';
	}
});

// Make the buttons work, too. Hijack the id stored in the href and use
// it to activate the slide.

jQuery(document)
.on('click', '.slide_button', function(e) {
	var href = e.currentTarget.hash;

	jQuery(href).trigger('activate');

	e.preventDefault();
});

return wrap;
}



//순위형타입
function inputRank(button ,idx){
	//idx : 중질문의 갯수에 맞춰서 값이 변함. 버튼을 클릭시 idx값은 증감한다. 중질문의 숫자를 기준으로
	//index : 중질문 내의 답변의 수 **아래 each function은 유저의 답변값들을 조회해서 가져오는 function이다.
	//button : next인지 finish인지로 구분한다. 마지막 값일경우 결과화면을 유저에게 보여주자.
	var count = $('#count').val(); //설문참여 다음 버튼클릭시 그 값을 Count 하기위한 input tag 값 
	var jsonArray = new Array();
	var rankArray = new Array();
	var answer ='';
	var surveyTypeId = $('#surveyTypeId'+idx).val();
	
	/*$('div.contsDiv'+(idx+1)).children().children().each(function(index, val){
		var ob = new Object();	
		ob.typeId = 'survey_answer_T'+surveyTypeId+'_A'+index;
		ob.answer = $('input[name="rank_sub_input'+(idx+1)+'"]').eq(index).val();
		jsonArray.push(ob);
	});*/
	var length = $('div.contsDiv'+(idx)).children().children('input').length; // 답변의 갯수

	$('div.contsDiv'+(idx)).children().children('input').each(function(index, val){
		var rankValue = $(this).parents().children('input:eq(0)').val(); //1일때의 ID값
		/*console.log($(this).parents().children('input:eq(0)').val())*/
		if($(val).val() == 1){
			rankArray[0] = rankValue;
			console.log($(val))
		}else if($(val).val() == 2){
			rankArray[1] = '_'+rankValue;
		}else if($(val).val() == 3){
			rankArray[2] = '_'+rankValue;
		}
	});

	console.log(surveyTypeId)
	var json ={"answer":answer,"surveyType":"rank"}
	if(button == 'next'){
		count++;
		$('#count').val(count);
		$('.surveyAnswer_container').append('<input type="hidden" value="STID'+surveyTypeId+'ST4A'+rankArray[0]+rankArray[1]+rankArray[2]+'" id=answer_'+count+'>')
	}else if(button=='revise'){
		count--;
		$('#count').val(count);
		$('#answer_'+(idx-1)).remove();
	}else if(button =='finish'){
		var length = $('.starLength').val();

		localStorage.setItem("contentsId"+$('.contentsId').val(), $('.contentsId').val())
		count++;
		$('.surveyAnswer_container').append('<input type="hidden" value="STID'+surveyTypeId+'ST4A'+rankArray[0]+rankArray[1]+rankArray[2]+'" id=answer_'+count+'>')
		$('.surveyAnswer_container').children('input').each(function(index, val){
			jsonArray.push($('#answer_'+(index+1)).val())
		})
		
		var json ={"answer":jsonArray,"surveyType":"rank", "length":length}
		console.log(jsonArray)
		$.ajax({
			url:'/survey/input_survey_answer_finish',
			type:'POST',
			data:json,
			dataType:"json",
			success:function(data){
				for(i in data){
					if(i == 0){
						if(typeof data[i][0].STID == 'undefined'){ //별점형은 object로 한번 더 감싸져서 옴 
							$('.img_slides_wrap').append('<div class="wrap_'+data[i][0][0].PER+' img_slide slide active" id="wrap_'+data[i][0][0].PER+'""></div>')
						}else{
							$('.img_slides_wrap').append('<div class="wrap_'+data[i][0].PER+' img_slide slide active" id="wrap_'+data[i][0].PER+'""></div>')	
						}
					}else{
						if(typeof data[i][0].STID == 'undefined'){ //별점형은 object로 한번 더 감싸져서 옴 
							$('.img_slides_wrap').append('<div class="wrap_'+data[i][0][0].PER+' img_slide slide" id="wrap_'+data[i][0][0].PER+'""></div>')
							for(j in data[i]){
								console.log(data[i][j][0].PER)
							}
							console.log('***************************')
							
						}else{
							$('.img_slides_wrap').append('<div class="wrap_'+data[i][0].PER+' img_slide slide" id="wrap_'+data[i][0].PER+'""></div>')	
						}
					}
					
					
					
					if(typeof data[i][0].STID == 'undefined'){ //별점형은 object로 한번 더 감싸져서 옴 
						result_chart(data[i], 'star');
					}else{
						
						var typeId = data[i][0].STID;
						if(typeId == 1){
							result_chart(data[i], 'choose');
						}else if(typeId == 2){
							result_chart(data[i], 'single');
						}else if(typeId == 3){
							result_chart(data[i], 'select');
						}else if(typeId == 4){
							result_chart(data[i], 'rank');
						}
					}
				}
					
				viewSlide();
				
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

				//별점형 func
				starFunc(star);
				
				//이중택일 func
				choiceFunc(choice);
				
				//선택형 func
				selectFunc(select);
			} 
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
	var idx = parseInt(idx);
	console.log('surveyAnswer 별점형 js ');
	var answerArr = new Array();
	var jsonArray = new Array();
	var surveyTypeId = $('#surveyTypeId'+idx).val();
	var count = $('#count').val(); //설문참여 다음 버튼클릭시 그 값을 Count 하기위한 input tag 값 
	
	var answer ='';
	var length = $('div.contsDiv'+(idx)).children().children('input').length; // 답변의 갯수
	$('div.contsDiv'+(idx)).children('input').each(function(index, val){
		console.log($(val).val());
	})

	
	//answerArr.push(surveyTypeId);
	var length = $('#surveyDiv'+idx+' .contsDiv').length; // 답변의 갯수
	$('#surveyDiv'+idx+' .contsDiv').each(function(j){
		var starArr = new Array();
	
		var surveyContsId = $('#contsDiv'+idx+'_'+(j+1)+'').children('#surveyContentsId'+(j+1)+'').val();
		console.log('surveyContsId::'+surveyContsId);
		var starScore = $('#contsDiv'+idx+'_'+(j+1)+'').children().children('#starRating'+idx+'_'+(j+1)+'').val();
		console.log('starScore:::::::::::::'+j);
		
		console.log(length);
		answer += surveyContsId +':';
		
		if(j == length){
			answer += starScore;
		}else{
			if(length == j+1){
				if(starScore == ''){
					answer += '0'	
				}else{
					answer += starScore
				}
			}else{
				if(starScore == ''){
					answer += '0_'	
				}else{
					answer += starScore + '_';	
				}
			}
		}
	});
	console.log(answer);
	var json ={"surveyTypeId":surveyTypeId, "answer":answerArr, "surveyType":"star"}
	
	if(button == 'next'){
		count++;
		$('#count').val(count);
		$('.surveyAnswer_container').append('<input type="hidden" value="STID'+surveyTypeId+'ST5A'+answer+'" id=answer_'+count+'>')

	}else if(button=='revise'){
		
	}else if(button =='finish'){
		localStorage.setItem("contentsId"+$('.contentsId').val(), $('.contentsId').val())
		count++;
		$('#count').val(count);
		var length = $('#starLength'+answer.split(':')[0]).val();
		$('.surveyAnswer_container').append('<input type="hidden" value="STID'+surveyTypeId+'ST5A'+answer+'" id=answer_'+count+'>')
		$('.surveyAnswer_container').children('input').each(function(index, val){
			console.log('answer????????'+ $('#answer_'+(index+1)).val() );
			jsonArray.push($('#answer_'+(index+1)).val())
		})
		
		var json ={"answer":jsonArray,"surveyType":"star", "length":length}
		console.log(jsonArray);
		
		$.ajax({
			url:'/survey/input_survey_answer_finish',
			type:'POST',
			data:json,
			dataType:"json",
			success:function(data){
				for(i in data){
					if(i == 0){
						if(typeof data[i][0].STID == 'undefined'){ //별점형은 object로 한번 더 감싸져서 옴 
							$('.img_slides_wrap').append('<div class="wrap_'+data[i][0][0].PER+' img_slide slide active" id="wrap_'+data[i][0][0].PER+'""></div>')
						}else{
							$('.img_slides_wrap').append('<div class="wrap_'+data[i][0].PER+' img_slide slide active" id="wrap_'+data[i][0].PER+'""></div>')	
						}
					}else{
						if(typeof data[i][0].STID == 'undefined'){ //별점형은 object로 한번 더 감싸져서 옴 
							$('.img_slides_wrap').append('<div class="wrap_'+data[i][0][0].PER+' img_slide slide" id="wrap_'+data[i][0][0].PER+'""></div>')
							for(j in data[i]){
								console.log(data[i][j][0].PER)
							}
							console.log('***************************')
							
						}else{
							$('.img_slides_wrap').append('<div class="wrap_'+data[i][0].PER+' img_slide slide" id="wrap_'+data[i][0].PER+'""></div>')	
						}
					}
					
					
					
					if(typeof data[i][0].STID == 'undefined'){ //별점형은 object로 한번 더 감싸져서 옴 
						result_chart(data[i], 'star');
					}else{
						
						var typeId = data[i][0].STID;
						if(typeId == 1){
							result_chart(data[i], 'choose');
						}else if(typeId == 2){
							result_chart(data[i], 'single');
						}else if(typeId == 3){
							result_chart(data[i], 'select');
						}else if(typeId == 4){
							result_chart(data[i], 'rank');
						}
					}
				}
					
				viewSlide();
			}//end success
		})
	}
}
/** 별점형 타입 **/

/** 양자택일 타입 **/
//이중택일 결과 답변 객체 선언
var contsRstVal = new Value();

function inputChoose(button, idx){
	console.log('양자택일형')
	var count = $('#count').val(); //설문참여 다음 버튼클릭시 그 값을 Count 하기위한 input tag 값 
	var jsonArray = new Array();
	var surveyTypeId = $('#surveyTypeId'+(idx)).val();
	var answer ='';
	var length = $('div.contsDiv'+(idx)).children().children('input').length; // 답변의 갯수
	$('div.contsDiv'+(idx)).children('input').each(function(index, val){
		console.log($(val).val());
	})
	$('div.contsDiv'+(idx)).children().children('input').each(function(index, val){
		if($(val).val() == 1){
			var sigleValue = $(this).parents().children('input:eq(0)').val(); //1일때의 ID값
			/*console.log($(this).parents().children('input:eq(0)').val())*/
			answer += sigleValue;
		}else{
			
		}
		console.log(answer);
	});
	if(button == 'next'){
		count++;
		$('#count').val(count);
		$('.surveyAnswer_container').append('<input type="hidden" value="STID'+surveyTypeId+'ST1A'+answer+'" id=answer_'+count+'>')
	}else if(button=='revise'){
		count--;
		$('#count').val(count);
		$('#answer_'+(idx-1)).remove();
	}else if(button =='finish'){
		localStorage.setItem("contentsId"+$('.contentsId').val(), $('.contentsId').val())
		count++;
		console.log('count : '+count);
		var length = $('.starLength').val();
		
		$('.surveyAnswer_container').append('<input type="hidden" value="STID'+surveyTypeId+'ST1A'+answer+'" id=answer_'+count+'>')
		$('.surveyAnswer_container').children('input').each(function(index, val){
			jsonArray.push($('#answer_'+(index+1)).val())
		})
		var json ={"answer":jsonArray,"surveyType":"choose", "length":length}
		console.log(jsonArray);
		$.ajax({
			url:'/survey/input_survey_answer_finish',
			type:'POST',
			data:json,
			dataType:"json",
			success:function(data){
				for(i in data){
					if(i == 0){
						if(typeof data[i][0].STID == 'undefined'){ //별점형은 object로 한번 더 감싸져서 옴 
							$('.img_slides_wrap').append('<div class="wrap_'+data[i][0][0].PER+' img_slide slide active" id="wrap_'+data[i][0][0].PER+'""></div>')
						}else{
							$('.img_slides_wrap').append('<div class="wrap_'+data[i][0].PER+' img_slide slide active" id="wrap_'+data[i][0].PER+'""></div>')	
						}
					}else{
						if(typeof data[i][0].STID == 'undefined'){ //별점형은 object로 한번 더 감싸져서 옴 
							$('.img_slides_wrap').append('<div class="wrap_'+data[i][0][0].PER+' img_slide slide" id="wrap_'+data[i][0][0].PER+'""></div>')
							for(j in data[i]){
								console.log(data[i][j][0].PER)
							}
							console.log('***************************')
							
						}else{
							$('.img_slides_wrap').append('<div class="wrap_'+data[i][0].PER+' img_slide slide" id="wrap_'+data[i][0].PER+'""></div>')	
						}
					}
					
					
					
					if(typeof data[i][0].STID == 'undefined'){ //별점형은 object로 한번 더 감싸져서 옴 
						result_chart(data[i], 'star');
					}else{
						
						var typeId = data[i][0].STID;
						if(typeId == 1){
							result_chart(data[i], 'choose');
						}else if(typeId == 2){
							result_chart(data[i], 'single');
						}else if(typeId == 3){
							result_chart(data[i], 'select');
						}else if(typeId == 4){
							result_chart(data[i], 'rank');
						}
					}
				}
					
				viewSlide();
				
				
				
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
			}
		})
	}
} 
/** 이중택일형 타입 **/

//단수선택형
function inputSingle(button, idx){
	console.log('단수선택형')
	var count = $('#count').val(); //설문참여 다음 버튼클릭시 그 값을 Count 하기위한 input tag 값 
	console.log($(this))
	var jsonArray = new Array();
	var surveyTypeId = $('#surveyTypeId'+(idx)).val();
	var answer ='';
	var length = $('div.contsDiv'+(idx)).children().children('input').length; // 답변의 갯수
	$('div.contsDiv'+(idx)).children('input').each(function(index, val){
		console.log($(val).val());
	})
	$('div.contsDiv'+(idx)).children().children('input').each(function(index, val){
		if($(val).val() == 1){
			var sigleValue = $(this).parents().children('input:eq(0)').val(); //1일때의 ID값
			/*console.log($(this).parents().children('input:eq(0)').val())*/
			answer += sigleValue;
		}else{
			
		}
	});
	console.log(answer);
	if(button == 'next'){
		count++;
		$('#count').val(count);
		$('.surveyAnswer_container').append('<input type="hidden" value="STID'+surveyTypeId+'ST2A'+answer+'" id=answer_'+count+'>')
	}else if(button=='revise'){
		count--;
		$('#count').val(count);
		$('#answer_'+(idx-1)).remove();
	}else if(button =='finish'){
		count++;
		var length = $('.starLength').val();
		localStorage.setItem("contentsId"+$('.contentsId').val(), $('.contentsId').val())
		$('.surveyAnswer_container').append('<input type="hidden" value="STID'+surveyTypeId+'ST2A'+answer+'" id=answer_'+count+'>')
		$('.surveyAnswer_container').children('input').each(function(index, val){
			jsonArray.push($('#answer_'+(index+1)).val())
		})
		var json ={"answer":jsonArray,"surveyType":"single", "length":length}
		
		$.ajax({
			url:'/survey/input_survey_answer_finish',
			type:'POST',
			data:json,
			dataType:"json",
			success:function(data){
			/*	location.href='/m_index/chart?data='+data;*/
				/*for(i in data){
					
					if(i == 0){
						$('.img_slides_wrap').append('<div class="wrap_'+data[i][0].PER+' img_slide slide active" id="wrap_'+data[i][0].PER+'""></div>')	
					}else{
						$('.img_slides_wrap').append('<div class="wrap_'+data[i][0].PER+' img_slide slide " id="wrap_'+data[i][0].PER+'""></div>')
					}
					
					var typeId = data[i][0].STID;
					console.log('---')
					if(typeId == 1){
						result_chart(data[i], 'choose');
					}else if(typeId == 2){
						result_chart(data[i], 'single');
					}
				}
				viewSlide();*/
				
				for(i in data){
					if(i == 0){
						if(typeof data[i][0].STID == 'undefined'){ //별점형은 object로 한번 더 감싸져서 옴 
							$('.img_slides_wrap').append('<div class="wrap_'+data[i][0][0].PER+' img_slide slide active" id="wrap_'+data[i][0][0].PER+'""></div>')
						}else{
							$('.img_slides_wrap').append('<div class="wrap_'+data[i][0].PER+' img_slide slide active" id="wrap_'+data[i][0].PER+'""></div>')	
						}
					}else{
						if(typeof data[i][0].STID == 'undefined'){ //별점형은 object로 한번 더 감싸져서 옴 
							$('.img_slides_wrap').append('<div class="wrap_'+data[i][0][0].PER+' img_slide slide" id="wrap_'+data[i][0][0].PER+'""></div>')
							for(j in data[i]){
								console.log(data[i][j][0].PER)
							}
							console.log('***************************')
							
						}else{
							$('.img_slides_wrap').append('<div class="wrap_'+data[i][0].PER+' img_slide slide" id="wrap_'+data[i][0].PER+'""></div>')	
						}
					}
					
					
					
					if(typeof data[i][0].STID == 'undefined'){ //별점형은 object로 한번 더 감싸져서 옴 
						result_chart(data[i], 'star');
					}else{
						
						var typeId = data[i][0].STID;
						if(typeId == 1){
							result_chart(data[i], 'choose');
						}else if(typeId == 2){
							result_chart(data[i], 'single');
						}else if(typeId == 3){
							result_chart(data[i], 'select');
						}else if(typeId == 4){
							result_chart(data[i], 'rank');
						}
					}
				}
					
				viewSlide();
				
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
			}
		})
	}
}

function inputSelect(button, idx){
	console.log('복수선택형')
	var count = $('#count').val(); //설문참여 다음 버튼클릭시 그 값을 Count 하기위한 input tag 값 
	var jsonArray = new Array();
	var surveyTypeId = $('#surveyTypeId'+(idx)).val();
	var answer ='';
	var length = $('div.contsDiv'+(idx)).children().children('input').length; // 답변의 갯수
	
	$('div.contsDiv'+(idx)).children().children('input').each(function(index, val){
		var selectValue = $(this).parents().children('input:eq(0)').val(); //1일때의 ID값

		/*console.log($(this).parents().children('input:eq(0)').val())*/
		
		if($(val).val().length == 1){
			if($(val).val() == 1){
				answer += selectValue
			}
		}
	});
	
	$('div.contsDiv'+(idx)).children().children('input').each(function(index, val){
		var selectValue = $(this).parents().children('input:eq(0)').val(); //1일때의 ID값

		if($(val).val().length == 1){
			if($(val).val() != 1){
				answer += '_'+selectValue
			}
		}
	});
	console.log(answer);
	if(button == 'next'){
		count++;
		$('#count').val(count);
		$('.surveyAnswer_container').append('<input type="hidden" value="STID'+surveyTypeId+'ST3A'+answer+'" id=answer_'+count+'>')
	}else if(button=='revise'){
		
	}else if(button =='finish'){
		count++;
		console.log('count : '+count);
		$('.surveyAnswer_container').append('<input type="hidden" value="STID'+surveyTypeId+'ST3A'+answer+'" id=answer_'+count+'>')
		$('.surveyAnswer_container').children('input').each(function(index, val){
			jsonArray.push($('#answer_'+(index+1)).val())
		})
		var length = $('.starLength').val();
		
		var json ={"answer":jsonArray,"surveyType":"select", "length":length}
		console.log(jsonArray);
		$.ajax({
			url:'/survey/input_survey_answer_finish',
			type:'POST',
			data:json,
			dataType:"json",
			success:function(data){
				for(i in data){
					if(i == 0){
						if(typeof data[i][0].STID == 'undefined'){ //별점형은 object로 한번 더 감싸져서 옴 
							$('.img_slides_wrap').append('<div class="wrap_'+data[i][0][0].PER+' img_slide slide active" id="wrap_'+data[i][0][0].PER+'""></div>')
						}else{
							$('.img_slides_wrap').append('<div class="wrap_'+data[i][0].PER+' img_slide slide active" id="wrap_'+data[i][0].PER+'""></div>')	
						}
					}else{
						if(typeof data[i][0].STID == 'undefined'){ //별점형은 object로 한번 더 감싸져서 옴 
							$('.img_slides_wrap').append('<div class="wrap_'+data[i][0][0].PER+' img_slide slide" id="wrap_'+data[i][0][0].PER+'""></div>')
							for(j in data[i]){
								console.log(data[i][j][0].PER)
							}
							console.log('***************************')
							
						}else{
							$('.img_slides_wrap').append('<div class="wrap_'+data[i][0].PER+' img_slide slide" id="wrap_'+data[i][0].PER+'""></div>')	
						}
					}
					
					
					
					if(typeof data[i][0].STID == 'undefined'){ //별점형은 object로 한번 더 감싸져서 옴 
						result_chart(data[i], 'star');
					}else{
						
						var typeId = data[i][0].STID;
						if(typeId == 1){
							result_chart(data[i], 'choose');
						}else if(typeId == 2){
							result_chart(data[i], 'single');
						}else if(typeId == 3){
							result_chart(data[i], 'select');
						}else if(typeId == 4){
							result_chart(data[i], 'rank');
						}
					}
				}
					
				viewSlide();
				
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
			}
		})
	}
}

/************************** 순위형 function *****************************/
function rankFunc(rank){
	console.log(rank);
	for(i in rank){
		if(i % 2 == 0){
			$('.rank_container').after('<div class="hrBar"></div><br class="hrBr">'+
					 '<div class="center_container">'+
						'<div class="typeButton"></div><br>'+
						/*'<div class="secondTitleContainer" style="height: 50px">'+*/
							'<div class="secondTitleBtn"></div>'+
							'<div class="secondTitle">'+
								'<p>'+rank[i][0].SECOND_SURVEY_TITLE+'</p>'+
							'</div>'+
						/*'</div>'+*/
						'</div>'+
						'<div class="dotteBar"></div><br><br>'+
						'<div class="bottm_container">'+
							'<div class="rank1" id="'+rank[i][0].SURVEY_TYPE_ID+'">'+
								'<div class="rank1Btn"></div>'+
								'<img src="'+rank[i][0].SURVEY_IMAGE_PATH+'" style="width: 100px; height: 100px">'+
								'<p class="rst_conts_p" id="rst_conts_p'+(i+1)+'">'+
  									'<span class="rst_conts_txt" id="rst_conts_txt'+(i+1)+'" >'+rank[i][0].SURVEY_CONTENTS+'</span>'+
  								'</p>'+
							'</div>'+
						'</div><br/><div class="hrBar"></div><br class="hrBr">');
		}else if(i%2 == 1){
			console.log(rank[i][0].SURVEY_CONTENTS_ID);
			$('#'+rank[i][0].SURVEY_TYPE_ID+'').after('<div class="rank2">'+
														'<div class="rank2Btn"></div>'+
														'<img src="'+rank[i][0].SURVEY_IMAGE_PATH+'" style="width: 100px; height: 100px">'+
														'<p class="rst_conts_p" id="rst_conts_p'+(i+1)+'">'+
						  									'<span class="rst_conts_txt" id="rst_conts_txt'+(i+1)+'" >'+rank[i][0].SURVEY_CONTENTS+'</span>'+
						  								'</p>'+
													 	'</div><br/>');
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
							'<div class="secondTitleBtn"></div>'+
							'<div class="secondTitle">'+
								'<p>'+star[i][0].SECOND_SURVEY_TITLE+'</p>'+
							'</div>'+
						'</div>'+	
						'<div class="dotteBar"></div>'+
						'<div class="star_img_div">'+
							'<img class="star_ques_img" src="'+star[i][0].SECOND_SURVEY_IMAGE_PATH+'">'+
						'</div>'+
					'';	
		
		for(var j in star[i]){
			j = parseInt(j);
			
			//console.log(star[i][j]);
			
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
		
		$('.star_container').append(starHtml+'<br/><div class="hrBar"></div><br class="hrBr">');
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
							'<div class="secondTitleBtn"></div>'+
							'<div class="secondTitle">'+
								'<p>'+choice[i][0].SECOND_SURVEY_TITLE+'</p>'+
							'</div>'+
						'</div>'+	
						'<div class="dotteBar"></div>'+
					'';	
		
		for(var j in choice[i]){
			j = parseInt(j);
			
			console.log(choice[i][j]);
			
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
		
		choiceHtml +='';
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
						'<div class="select_type_img"></div><br>'+
						/*'<div class="secondTitleContainer" style="height: 50px">'+*/
							'<div class="secondTitleBtn"></div>'+
							'<div class="secondTitle">'+
								'<p>'+select[j][0].SECOND_SURVEY_TITLE+'</p>'+
							'</div>'+
						/*'</div>'+*/
						'</div>'+
						'<div class="dotteBar"></div>'+
						'<div class="bottms_container">'+
						'</div>');
		$('.bottms_container').append('<div id="chartdiv" style="width: 90%; height: 200px;"></div><div class="hrBar"></div><br class="hrBr">')
		for(k in select[j]){
			var chartObj = new Object();
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