function result_starType(json, i, userId){
	console.log('결과 별점 별점형::');
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
				score: 5
				,path : "/img/mobile/main/survey"
				,width : 200
				,readOnly : true
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
    	
	});//end star click 
    
	if(userId == 0){ //비로그인 유저
		if(i == 0){
			if((i+1) == $('#total').val()){
				$('.surveyFooter').append('<div class="login_bt"  id="fBtn'+(i+1)+'" style="float:left; ">로그인이 필요합니다</div><div class="show_chart" id="sBtn'+(i+1)+'" style="float:left; ">통계보기</div>');
			}else{
				$('.surveyFooter').append('<div class="login_bt"  id="fBtn'+(i+1)+'" style="float:left; ">로그인이 필요합니다</div><div class="show_chart" id="sBtn'+(i+1)+'" style="float:left; ">통계보기</div>');
				$('.surveyHeader').append('<div class="n_bt survey_bt" id="nBtn'+(i+1)+'"><img src="img/mobile/main/survey/arrow_next.png"></div>');
			}	
		}else if((i+1) == $('#total').val()){
			$('.surveyHeader').append('<div class="revise_bt survey_bt" id="reviseBtn'+(i+1)+'"><img src="img/mobile/main/survey/arrow_back.png"></div>');
			$('.surveyFooter').append('<div class="login_bt"  id="fBtn'+(i+1)+'" style="float:left; ">로그인이 필요합니다</div><div class="show_chart" id="sBtn'+(i+1)+'" style="float:left; ">통계보기</div>');	
	  		$('#surveyForm'+(i+1)).css('display','none');
	  		$('#reviseBtn'+(i+1)).css('display','none');
	  		$('#nBtn'+(i+1)).css('display','none'); // > 버튼
	  		$('#fBtn'+(i+1)).css('display','none');
	  		$('#sBtn'+(i+1)).css('display','none');
		}else{
			$('.surveyHeader').append('<div class="revise_bt survey_bt" id="reviseBtn'+(i+1)+'"><img src="img/mobile/main/survey/arrow_back.png"></div>');
			$('.surveyFooter').append('<div class="login_bt"  id="fBtn'+(i+1)+'" style="float:left; ">로그인이 필요합니다</div><div class="show_chart" id="sBtn'+(i+1)+'" style="float:left; ">통계보기</div>');
			$('.surveyHeader').append('<div class="n_bt survey_bt" id="nBtn'+(i+1)+'"><img src="img/mobile/main/survey/arrow_next.png"></div>');	
	  		
			$('#surveyForm'+(i+1)).css('display','none');
	  		$('#reviseBtn'+(i+1)).css('display','none');
	  		$('#nBtn'+(i+1)).css('display','none'); // > 버튼
	  		$('#fBtn'+(i+1)).css('display','none');
	  		$('#sBtn'+(i+1)).css('display','none');
		}
	}else{
		if(i == 0){
			if((i+1) == $('#total').val()){
				$('.surveyFooter').append('<div class="success_bt"  id="fBtn'+(i+1)+'" style="float:left; ">이미 참여하셨습니다</div><div class="show_chart" id="sBtn'+(i+1)+'" style="float:left; ">통계보기</div>');
			}else{
				$('.surveyFooter').append('<div class="success_bt"  id="fBtn'+(i+1)+'" style="float:left; ">이미 참여하셨습니다</div><div class="show_chart" id="sBtn'+(i+1)+'" style="float:left; ">통계보기</div>');
				$('.surveyHeader').append('<div class="n_bt survey_bt" id="nBtn'+(i+1)+'"><img src="img/mobile/main/survey/arrow_next.png"></div>');
			}	
		}else if((i+1) == $('#total').val()){
			$('.surveyHeader').append('<div class="revise_bt survey_bt" id="reviseBtn'+(i+1)+'"><img src="img/mobile/main/survey/arrow_back.png"></div>');
			$('.surveyFooter').append('<div class="success_bt"  id="fBtn'+(i+1)+'" style="float:left; ">이미 참여하셨습니다</div><div class="show_chart" id="sBtn'+(i+1)+'" style="float:left; ">통계보기</div>');	
	  		$('#surveyForm'+(i+1)).css('display','none');
	  		$('#reviseBtn'+(i+1)).css('display','none');
	  		$('#nBtn'+(i+1)).css('display','none'); // > 버튼
	  		$('#fBtn'+(i+1)).css('display','none');
	  		$('#sBtn'+(i+1)).css('display','none');
		}else{
			$('.surveyHeader').append('<div class="revise_bt survey_bt" id="reviseBtn'+(i+1)+'"><img src="img/mobile/main/survey/arrow_back.png"></div>');
			$('.surveyFooter').append('<div class="success_bt"  id="fBtn'+(i+1)+'" style="float:left; ">이미 참여하셨습니다</div><div class="show_chart" id="sBtn'+(i+1)+'" style="float:left; ">통계보기</div>');
			$('.surveyHeader').append('<div class="n_bt survey_bt" id="nBtn'+(i+1)+'"><img src="img/mobile/main/survey/arrow_next.png"></div>');	
	  		
			$('#surveyForm'+(i+1)).css('display','none');
	  		$('#reviseBtn'+(i+1)).css('display','none');
	  		$('#nBtn'+(i+1)).css('display','none'); // > 버튼
	  		$('#fBtn'+(i+1)).css('display','none');
	  		$('#sBtn'+(i+1)).css('display','none');
		}
	}

}//end starType