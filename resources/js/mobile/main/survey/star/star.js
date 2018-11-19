


function starType(json, i){
	console.log('별점형::');
	console.log(json.title.SECOND_SURVEY_TITLE == '마음에 드는 상품/서비스/상호를 골라주세요');
	if(json.title.SECOND_SURVEY_TITLE == '마음에 드는 상품/서비스/상호를 골라주세요'){
		console.log('ffff')
		json.title.SECOND_SURVEY_TITLE = '마음에 드는<br><br> 상품/서비스/상호를 골라주세요';
		$('.surveySecondTitleDiv').after('<br><br>')
	}
	//중질문 타이틀
	/*var surveyTitleHtml = ''+
    	'<div id="surveyDiv'+(i+1)+'" class="surveyDiv" style="border:0px solid #000; position:relative;">'+
    		'<input type="hidden" id="surveyAnswerType'+(i+1)+'" name="surveyAnswerType" value="'+json.title.SURVEY_ANSWER_TYPE+'">'+
  			'<input type="hidden" id="surveyTypeId'+(i+1)+'" name="surveyTypeId" value="'+json.title.SURVEY_TYPE_ID+'"/>'+
  			'<input type="hidden" id="surveyType'+(i+1)+'" name="surveyType" value="'+json.title.SURVEY_TYPE+'">'+
  			'<div class="type_star"></div>'+
  			'<div class="star_type_img" style="margin-left:5%;"></div><br>'+
  			 '<div class="surveyTypeDiv" style="font-size:1.2em; font-weight:700; margin-left:42%;"><span class="surveyTypeTxt">별점형</span></div><br>'+ 
    		'<div class="surveySecondTitleDiv">'+
      			'<span class="titleSpan" id="titleSpan'+(i+1)+'"><span style="color:#438CBE;">◎</span> '+json.title.SECOND_SURVEY_TITLE+'</span>'+
      			'<div class="blue_line"></div>'+
      			'<div class="secSvyTitleDiv">'+
      				'<img class="secSvyTitleImg" src="'+json.title.SECOND_SURVEY_IMAGE_PATH+'" id="secSvyTitleImg'+(i+1)+'" style="width:100px; height:100px; margin:0 0 0 32%"/>'+
    			'</div>'+
    		'</div><br><br>'+
    		'<div class="starContainer" style="position:absolute; left:110px; top:200px;"></div>'+
	//중질문 타이틀 append            
	$('#selectSurveyDiv'+(index+1)).append(surveyTitleHtml);
    		'';*/
	
	var surveyTitleHtml = ''+
						  '<form id="surveyForm'+(i+1)+'">'+
						  	'<div id="surveyDiv'+(i+1)+'" class="surveyDiv" style="border:0px solid #000;">'+
						  		'<input type="hidden" id="surveyAnswerType'+(i+1)+'" name="surveyAnswerType" value="'+json.title.SURVEY_ANSWER_TYPE+'">'+
						  		'<input type="hidden" id="surveyTypeId'+(i+1)+'" name="surveyTypeId" value="'+json.title.SURVEY_TYPE_ID+'"/>'+
						  		'<input type="hidden" id="surveyType'+(i+1)+'" name="surveyType" value="'+json.title.SURVEY_TYPE+'">'+
						  		'<div class="select_type_img" style="margin-left:5%;"></div><br>'+
						  		/* '<div class="surveyTypeDiv" style="font-size:1.2em; font-weight:700; margin-left:42%"><span class="surveyTypeTxt">선택형</span></div><br>'+ */
						  		'<div class="surveySecondTitleDiv">'+
						  			'<span class="titleSpan" id="titleSpan'+(i+1)+'" style="color:white; z-index:800">'+json.title.SECOND_SURVEY_TITLE+'</span>'+
						  		'</div><br>'+
						  		'<div class="star_img_div">'+
						  			'<img class="star_img" src="'+json.title.SECOND_SURVEY_CROP_IMAGE+'">'+
						  		'</div>'+
						  		'<div class="star_title">'+json.title.IMAGE_NAME+'</div>'+
						  		'<div class="star_conts conts_div">'+
						  		'</div>'+
						  	'</div>'+	
						  '</form>'+
						  '';
	
	$('.surveyContents').append(surveyTitleHtml);
    
  
    for(var j in json.reply){
    	console.log(json.reply[j]);
    	console.log('json.reply.length::'+json.reply.length);
    	j = parseInt(j);
    	//중질문 답변            
		var surveyReplyHtml = '<div class="contsDiv" id="contsDiv'+(i+1)+'_'+(j+1)+'">'+
      						  	'<input type="hidden" class="surveyContentsId" id="surveyContentsId'+(j+1)+'" name="surveyContentsId" value="'+json.reply[j].SURVEY_CONTENTS_ID+'">';
    
		/*if(json.title.SURVEY_ANSWER_TYPE=='1'){
			surveyReplyHtml +=  //'<div></div>'+
        		'<div class="contsTxtDiv">'+
          			'<span class="contsTxtSpan" id="contentsSpan'+(i+1)+'_'+(j+1)+'" >'+json.reply[j].SURVEY_CONTENTS+'</span>'+
        		'</div>'+
        		'<div class="starDiv">'+
          			'<span class="star" id="star'+(i+1)+'_'+(j+1)+'"></span>'+
          			'<input type="hidden" class="starRating" id="starRating'+(i+1)+'_'+(j+1)+'"/>'+
        		'</div>'+
        		'';
		}//end if*/
		
		drawStarConts(i, j); //별점형 평가항목 그리기 
		
		function drawStarConts(i, j){//별점형 평가항목 그리기 
			if(json.title.SURVEY_ANSWER_TYPE=='2'){
				surveyReplyHtml += '<div class="contsTxtDiv">'+
	          					   		'<span class="contsTxtSpan" id="contentsSpan'+(i+1)+'_'+(j+1)+'" >'+json.reply[j].SURVEY_CONTENTS+'</span>'+
	          					   '</div>'+
	          					   '<div class="starDiv" style="text-align: center;">'+
	          					   		'<span class="star" id="star'+(i+1)+'_'+(j+1)+'"></span>'+
	          					   		'<input type="hidden" class="starRating" id="starRating'+(i+1)+'_'+(j+1)+'"/>'+
	          					   '</div>'+
	          					   ''; 
			}//if     
			surveyReplyHtml +=   '</div>';
	  
			//중질문 답변 append
			$('.surveyAnswer_container').append('<input type="hidden" id="st_title'+json.reply[j].SURVEY_CONTENTS_ID+'" value="'+json.title.SECOND_SURVEY_TITLE+'">');
			$('.surveyAnswer_container').append('<input type="hidden" id="star'+json.reply[j].SURVEY_CONTENTS_ID+'" value="'+json.reply[j].SURVEY_CONTENTS+'">');
			$('#surveyForm'+(i+1)+' .star_conts').append(surveyReplyHtml);
			$('#surveyForm'+(i+1)+' .star_conts').append('<input type="hidden" class="starLength"  id="starLength'+json.reply[j].SURVEY_CONTENTS_ID+'" value="'+json.reply.length+'">');
		$('#surveyDiv'+(i+1)+' #star'+(i+1)+'_'+(j+1)+'').raty({
			score: 0
			,path : "/img/mobile/main/survey"
			,width : 200
			,click: function(score, evt) {
				var clkContsDiv = $(this).attr('id');
				//j값 뽑아오기
				var j = clkContsDiv.split('_')[1];
				j = parseInt(j);
				$('#starRating'+(i+1)+'_'+j+'').val(score);
			}//end click
		});//end raty

		switch(json.reply.length){
			case 1:
				console.log('111111');
				$('#surveyForm'+(i+1)+' .star_conts .contsDiv').css('margin', '12% auto 0 auto');
				break;
			case 2:
  				console.log('222222');
  				$('#surveyForm'+(i+1)+' .star_conts .contsDiv').css('float', 'left');
  				$('#surveyForm'+(i+1)+' .star_conts').css('padding-top', '3%');
  				break;
			case 3:
  				console.log('333333');
  				$('#surveyForm'+(i+1)+' .star_conts .contsDiv').css('float', 'left');
  				$('#surveyForm'+(i+1)+' .star_conts').css('padding-top', '3%');
  				break;
			case 4:
				console.log('44444');
				$('#surveyForm'+(i+1)+' .star_conts .contsDiv').css('float', 'left');
				$('#surveyForm'+(i+1)+' .star_conts').css('padding-top', '3%');
				break;
			case 5:
				console.log('5555');
				//$('#surveyForm'+(i+1)+' .star_conts').css('height', '31%');
				$('#surveyForm'+(i+1)+' .star_conts .contsDiv').css('float', 'left');
				break;
		}//end switch
		}
		
	}//for
    
    $('#surveyDiv'+(i+1)+' .star_img').taphold( function(){
    	$('#surveyDiv'+(i+1)+' .star_img').after('<div class="zoom_btn" id="zoomBtn_'+(i+1)+'"><img class="magnifying"></div>')
    	$('#zoomBtn_'+(i+1)+'').css({'top':'-160px'});
    	
    	var surveyContentsId = $('div[id*=contsDiv'+(i+1)+'_] #surveyContentsId1').val();
		//console.log('surveyContentsId::'+surveyContentsId);
		location.href="/m_view_origin_image?surveyContentsId="+surveyContentsId;
		
		$('#surveyForm'+(i+1)+' .zoom_btn').remove();	//돋보기 제거
		$('#contentsSpan'+(i+1)+'_'+id+'').parent().css('top','0px');	//텍스트 위치
    	
    	/*
    	$('#zoomBtn_'+(i+1)+'').on({
			taphold: function(e) {//돋보기 제거
				
				//돋보기버튼 제거 true(응답이미지 바로 선택 방지 위해)
				zoomBtn_remove = true;
				
				$('#zoomBtn_'+(i+1)+'').remove();
				
				//0.5초 후에 돋보기버튼 제거 false로 바뀜 
				setTimeout( function() {
					//돋보기버튼 제거 false
					zoomBtn_remove = false;
				}, 500);
				
			},
			click: function(e) {
				
				/** 0.1초 후에 돋보기 클릭 가능 **//*
				//응답 이미지 taphold (돋보기 바로 클릭 방지 위해)
				select_taphold = false;
				setTimeout( function() {
					//돋보기 taphold 0.1초 후 true로 변경
					select_taphold = true;
					if(select_taphold == false){
						return false;
					}else {
						
						var surveyContentsId = $('div[id*=contsDiv'+(i+1)+'_] #surveyContentsId1').val();
						//console.log('surveyContentsId::'+surveyContentsId);
						location.href="/m_view_origin_image?surveyContentsId="+surveyContentsId;
						
						$('#surveyForm'+(i+1)+' .zoom_btn').remove();	//돋보기 제거
						$('#contentsSpan'+(i+1)+'_'+id+'').parent().css('top','0px');	//텍스트 위치
						
						//돋보기 클릭시 이동
						$('#zoomBtn_'+(i+1)+'').click(function(){
						});
					}
				}, 100);
				/** 0.1초 후에 돋보기 클릭 가능 **//*
				
			}
		});//zoomBtn_* on function
    	*/
    	
    });
    
	var star_val_chk = true;
	$('.star').click(function(){
    	$('div[id*=contsDiv'+(i+1)+'_]').each(function(idx){
    		//console.log('idx::'+idx);
    		if( $('#starRating'+(i+1)+'_'+(idx+1)+' ').val()=='' ){
    			//if( $('.starRating').val()!='' && typeof $('.starRating').val() != 'undefined' ){
    			star_val_chk = false;
    			return false;
    			
    		}else {
    			star_val_chk = true;
    		}
    	});
    	
    	//var id = $(this).attr('id').split('_')[1];
    	//console.log('id::'+id);
    	//console.log('star_val_chk::'+star_val_chk);
    	if( star_val_chk == true ){
    		
    		//별점을 채점할 시 footer 중복생성 방지
    		if( $('input[id*=starRating'+(i+1)+']').val() != '' ){
    			$('#clearBtn'+(i+1)+'').remove(); //수정하기 지우기
    			$('#nextBtn'+(i+1)+'').remove(); //확정하기 지우기
    			$('#showChart'+(i+1)+'').remove(); //통계보기 지우기
    		}//if
    		
    		//다시 그리기
    		//버튼 3개 만듬	    
    		if(i == 0){
    			if((i+1) == $('#total').val()){
    			}else{
    			
    				//$('#fBtn'+(i+1)+'').remove();
    				$('.surveyFooter').append('<div class="footerBtn starRevise" id=clearBtn'+(i+1)+'>수정하기</div>'+
							'<div class="footerBtn next_bt survey_bt" id=nextBtn'+(i+1)+'>확정하기</div>'+
								'<div class="footerBtn" id=showChart'+(i+1)+'>통계보기</div>')	
    			}	
    		}else if((i+1) == $('#total').val()){
    			$('.surveyFooter').append('<div class="footerBtn starRevise" id=clearBtn'+(i+1)+'>수정하기</div>'+
						'<div class="footerBtn next_bt survey_bt finish_bt" id=nextBtn'+(i+1)+'>확정하기</div>'+
							'<div class="footerBtn" id=showChart'+(i+1)+'>통계보기</div>')
    		}else{
    			
    			$('.surveyFooter').append('<div class="footerBtn starRevise" id=clearBtn'+(i+1)+'>수정하기</div>'+
						'<div class="footerBtn next_bt survey_bt" id=nextBtn'+(i+1)+'>확정하기</div>'+
							'<div class="footerBtn" id=showChart'+(i+1)+'>통계보기</div>')
    		}
    		
    		$('#fBtn'+(i+1)+'').remove(); //별점 매겨주세요 지우기
    	}
			
	});//end star click 
    
    if(i == 0){
		if((i+1) == $('#total').val()){
			$('.surveyFooter').append('<div class="next_bt survey_bt finish_bt"  id="fBtn'+(i+1)+'"  style="width:100%; float:left; ">별점을 매겨주세요</div>');
		}else{
			console.log('여기로 들어옴')
			$('.surveyFooter').append('<div class="next_bt survey_bt" id="fBtn'+(i+1)+'" >별점을 매겨주세요</div>');	
		}	
	}else if((i+1) == $('#total').val()){
		$('.surveyHeader').append('<div class="revise_bt survey_bt" id="reviseBtn'+(i+1)+'"><img src="img/mobile/main/survey/arrow_back.png"></div>');
		$('.surveyFooter').append('<div class="next_bt survey_bt finish_bt" id="fBtn'+(i+1)+'"  style="width:100%; float:left; ">별점을 매겨주세요</div>');
  		$('#surveyForm'+(i+1)).css('display','none');
  		$('#reviseBtn'+(i+1)).css('display','none');
  		$('#fBtn'+(i+1)).css('display','none');
	}else{
  		$('.surveyFooter').append('<div class="next_bt survey_bt"  id="fBtn'+(i+1)+'" style="width:100%; float:left; ">별점을 매겨주세요</div>');
  		$('#surveyForm'+(i+1)).css('display','none');
  		$('#reviseBtn'+(i+1)).css('display','none');
  		$('#fBtn'+(i+1)).css('display','none');
	}
   
    $('.surveyWrap').on('click', '#clearBtn'+(i+1)+'', function(){
    	console.log('별점형 수정하기');
		
		var clearId = $(this).attr('id').split('clearBtn')[1];
		console.log($(this).attr('id').split('clearBtn')[1])
		
		//값 초기화
		$('input[name=score]').val(''); 
		$('.starRating').val(''); 
		//별그리기 초기화
		$('#surveyDiv'+(i+1)+' .star').raty({
			score: 0
			,path : "/img/mobile/main/survey"
			,width : 200
			,click: function(score, evt) {
				var clkContsDiv = $(this).attr('id');
				//j값 뽑아오기
				var j = clkContsDiv.split('_')[1];
				j = parseInt(j);
				$('#starRating'+(i+1)+'_'+j+'').val(score);
			}//end click
		});//end raty
		
		console.log('clearId : '+clearId)
		$('#clearBtn'+clearId+'').remove();
		$('#nextBtn'+clearId+'').remove();
		$('#showChart'+clearId+'').remove();
		
		$('#fBtn'+(i+1)+'').remove();
		if(i == 0){
			$('.surveyFooter').append('<div class="next_bt survey_bt"  id="fBtn'+(i+1)+'" >별점을 매겨주세요</div>');	
		}else if((i+1) == $('#total').val()){

			/*$('.surveyHeader').append('<div class="revise_bt survey_bt" id="reviseBtn'+(i+1)+'"><img src="img/mobile/main/survey/arrow_back.png" style="height:28px;"></div>');*/
			$('.surveyFooter').append('<div class="next_bt survey_bt finish_bt" id="fBtn'+(i+1)+'" style="width:100%; float:left; ">별점을 매겨주세요</div>');
		}else{
			$('.surveyFooter').append('<div class="next_bt survey_bt" id="fBtn'+(i+1)+'" style="width:100%; float:left; ">별점을 매겨주세요</div>');
/*	  		$('.surveyFooter').append('<div class="next_bt survey_bt" id="fBtn'+(i+1)+'" style="width:100%; float:left; ">다음</div>');*/

		}//if
	});
    
    
    $('.surveyWrap').on('click', '#showChart'+(i+1)+'', function(){
		console.log('통계보기::'+$('#contentsId').val());
		//show_result($('#contentsId').val(), '');
		console.log('통계보기')
		var surveyCount = (i+1); // 현재 다음 버튼
		var surveyType = $('#surveyType'+(i+1)).val();
			
		if(surveyType == 1){//양자택일형
			result_inputChoose('finish', surveyCount);
        	var contsRst = contsRstVal.getValue();
        	console.log('contsRst:::::::??????'+contsRst);
      	}else if(surveyType==2){//단수선택형
      		console.log(surveyCount)
      		console.log('단수선택 마지막 : '+surveyCount);
      		result_inputSingle('finish', surveyCount);
      	}else if(surveyType==3){//복수선택형
      		result_inputSelect('finish', surveyCount);
      	}else if(surveyType==4){//순위형
      		result_inputRank('finish', surveyCount);
      	}else if(surveyType==5){//별점채점형
      		result_inputStar('finish', surveyCount); 
      	}
	});
}//end starType