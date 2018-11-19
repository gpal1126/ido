function selectType(json, i){
	console.log('복수선택형::');
	console.log(json)
	//중질문 타이틀
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
				'<div class="conts_div"></div>'+
			'</div>'+	
		'</form><input type="hidden" id="surveyAnswerNum'+(i+1)+'" value='+json.title.ANSWER_NUM+'>'+
		'';
	
	//중질문 타이틀 append    
	//$('.surveyContents').append('<div id="selectSurveyDiv'+(index+1)+'"></div>')  
	//$('#selectSurveyDiv'+(index+1)).append(surveyTitleHtml);
	$('.surveyContents').append(surveyTitleHtml);
	
	for(j in json.reply){
		j = parseInt(j);
		console.log('j::'+j);
		console.log(json.reply[j].SURVEY_CONTENTS_ID);
		console.log(json.reply[j].SURVEY_CONTENTS);
		console.log(json.reply[j].SURVEY_IMAGE_PATH);
		console.log(json.reply[j].SURVEY_CROP_IMAGE);
	
		//중질문 답변            
		var surveyReplyHtml = 
		'<div class="contsDiv'+(i+1)+' img" id="contsDiv'+(i+1)+'_'+(j+1)+'" name="contsDiv'+(i+1)+'_s'+(j+1)+'">';
	  		
	
		if(json.title.SURVEY_ANSWER_TYPE=='1'){
			surveyReplyHtml +=  //'<div></div>'+
	    	'<div class="contsTxtDiv">'+
	      		'<span class="contsTxtSpan" name="c'+json.reply[j].SURVEY_CONTENTS_ID+'" id="contentsSpan'+(i+1)+'_'+(j+1)+'" >'+json.reply[j].SURVEY_CONTENTS+'</span>'+
	    	'</div>';
		}//if
		
		if(json.title.SURVEY_ANSWER_TYPE=='2'){
			surveyReplyHtml +=  
	   		//'<img src="'+json.reply[j].SURVEY_IMAGE_PATH+'" name="selectCheckbox"  id="select_img'+(i+1)+'_'+(j+1)+'" width="100%" height="300px" style="-webkit-transform: translate(0%,-20%);" />'+
			'<div class="img" name="selectCheckbox"  id="select_img'+(i+1)+'_'+(j+1)+'" style="background: url('+json.reply[j].SURVEY_CROP_IMAGE+'); width:100%; height:100%; background-size: cover; background-position: 0px; background-repeat: no-repeat;">'+        
	       		'<input type="hidden" class="surveyContentsId" id="surveyContentsId'+(j+1)+'" name="surveyContentsId" value="'+json.reply[j].SURVEY_CONTENTS_ID+'">'+
	       		'<input type="hidden" name="select_sub_input'+(i+1)+'" id="select_sub_input_'+(i+1)+'_'+(j+1)+'" value="">'+
	    	'</div>'+             
	  		'<div class="contsTxtDiv">'+
	    		'<span class="contsTxtSpan" name="c'+json.reply[j].SURVEY_CONTENTS_ID+'" id="contentsSpan'+(i+1)+'_'+(j+1)+'" >'+json.reply[j].SURVEY_CONTENTS+'</span>'+
	  		'</div>'; 
		}//if     
	  
	  				surveyReplyHtml += 
	  				'</div>';
	
		//중질문 답변 append
	  	
	  	$('.surveyAnswer_container').append('<input type="hidden" id="select'+json.reply[j].SURVEY_CONTENTS_ID+'" value="'+json.reply[j].SURVEY_CONTENTS+'">');
		$('.surveyContents #surveyDiv'+(i+1)+' .conts_div').append(surveyReplyHtml);
	
		console.log('???????????????????? : '+$('div[name$=_s4]').attr('id'));
		
		$('#surveyForm'+(i+1)+' .conts_div').css({'padding-top':'50px'});
		$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'width':'200px'});
		$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'height':$('#contsDiv'+(i+1)+'_'+json.reply.length+'').width()});
		
		console.log('height:::::'+$('div[class*="contsDiv"]').width());
		switch(json.reply.length){
			case 2 :
				console.log('222222');
				$('.contsContainer').css({'top':'120px'});
				$('#surveyForm'+(i+1)+' .conts_div').css({'padding-left':'23.5%'});
				$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'float':'left'});
				$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'margin':'60px 0 10% 7%'});
				$('#surveyForm'+(i+1)+' div[name$=_s2]').css({'margin-left':'5%'});
				$('.surveyFooter').css({'position':'absolute', 'bottom':'0'});
			break;
			case 3 :
				console.log('333333');
				$('#surveyForm'+(i+1)+' .conts_div').css({'padding-left':'25.5%'});
				$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'margin':'30px 0 40px 7%'});  
				$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'float':'left'});
				$('#surveyForm'+(i+1)+' div[name$=_s2]').css({'margin-left':'5%'});
				$('#surveyForm'+(i+1)+' div[name$=_s3]').css({'margin-left':'21%'});
				$('#surveyForm'+(i+1)+' div[name$=_s3]').css({'clear': 'both'});
				$('.surveyFooter').css({'position':'absolute', 'bottom':'0'});
			break;
			case 4 :
				console.log('444444');
				$('#surveyForm'+(i+1)+' .conts_div').css({'padding-left':'25.5%'});
				$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'margin':'30px 0 40px 7%'});
				$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'float':'left'});
				$('#surveyForm'+(i+1)+' div[name$=_s2], #surveyForm'+(i+1)+' div[name$=_s4]').css({'margin-left':'5%'});
				$('#surveyForm'+(i+1)+' div[name$=_s3]').css({'clear': 'both'});
				$('.surveyFooter').css({'position':'absolute', 'bottom':'0'});
			break;
			case 5 :
				console.log('555555');
				$('#surveyForm'+(i+1)+' .conts_div').css({'padding-left':'11%'});
				/*$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'margin':'0 0 10% 10%'});*/
				$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'margin':'30px 0 40px 7%'});
				$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'float':'left'});
				/*$('#surveyForm'+(i+1)+' div[name$=_s2], #surveyForm'+(i+1)+' div[name$=_s4]').css({'margin-left':'5%'});*/
				$('#surveyForm'+(i+1)+' div[name$=_s4]').css({'clear': 'both'});
				//$('div[name$=_s5]').css({'margin-left':'30%'});
				$('.surveyFooter').css({'position':'', 'padding-bottom':'2%'});
			break;
			case 6 :
				console.log('666666');
				$('#surveyForm'+(i+1)+' .conts_div').css({'padding-left':'11%'});
				$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'margin':'30px 0 40px 7%'});
				$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'float':'left'});
				/*$('#surveyForm'+(i+1)+' div[name$=_s2], #surveyForm'+(i+1)+' div[name$=_s4], #surveyForm'+(i+1)+' div[name$=_s6]').css({'margin-left':'5%'});*/
				$('#surveyForm'+(i+1)+' div[name$=_s4]').css({'clear': 'both'});
				$('.surveyFooter').css({'position':'', 'padding-bottom':'2%'});
			break;
			case 7 :
				console.log('77777');
				$('#surveyForm'+(i+1)+' .conts_div').css({'padding-left':'0'});
				$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'margin':'30px 0 40px 7%'});
				$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'float':'left'});
				/*$('#surveyForm'+(i+1)+' div[name$=_s2], #surveyForm'+(i+1)+' div[name$=_s4], #surveyForm'+(i+1)+' div[name$=_s6]').css({'margin-left':'5%'});*/
				//$('div[name$=_s7]').css('margin-left','30%');
				$('#surveyForm'+(i+1)+' div[name$=_s5]').css({'clear': 'both'});
				$('.surveyFooter').css({'position':'', 'padding-bottom':'2%'});
			break;
			case 8 :
				console.log('88888');
				$('#surveyForm'+(i+1)+' .conts_div').css({'padding-left':'0'});
				$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'margin':'30px 0 40px 7%'});
				$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'float':'left'});
				/*$('#surveyForm'+(i+1)+' div[name$=_s2], #surveyForm'+(i+1)+' div[name$=_s4], #surveyForm'+(i+1)+' div[name$=_s6], #surveyForm'+(i+1)+' div[name$=_s8]').css({'margin-left':'5%'});*/
				$('#surveyForm'+(i+1)+' div[name$=_s5]').css({'clear': 'both'});
				$('.surveyFooter').css({'position':'', 'padding-bottom':'2%'});
			break;
		}//end switch
	
	}//for
	
	
	var answerNum = $('#surveyAnswerNum'+(i+1)+'').val();
	var clickCount = 0;
	
	//돋보기 버튼 제거 chk(응답이미지 바로 선택 방지 위해)
	var zoomBtn_remove = false;
	
	$('div[id*=select_img'+(i+1)+']').on({ //답변 이미지 div on
		taphold: function(e) {
			console.log('tabhold');
			
			//응답 이미지 taphold true (돋보기 바로 클릭 방지 위해)
			var select_taphold = true;
			
			var id = $(this).attr('id').split('img'+(i+1)+'_')[1];
			
			$('#surveyForm'+(i+1)+' .zoom_btn').remove();	//돋보기 제거
			$('.contsTxtSpan').parent().css({'position':'relative', 'top':'0'});
			
			
			//응답 이미지를 선택한 후 길게 눌러 돋보기 이미지가 나온 뒤(선택이미지는 display:none) 다른 응답을 길게 누르면 
			//이전에 선택했던 선택이미지가 다시 보임  
			$('.contsDiv'+(i+1)+'').each( function(idx){
				idx = parseInt(idx);
				for(var num=1; num<=answerNum; num++){//응답 수만큼 for문 돌림
					//응답 이미지 선택되면(응답 값이 있으면)
					if( $('#surveyForm'+(i+1)+' #select_sub_input_'+(i+1)+'_'+(idx+1)+'').val() == ''+num+'' ) { 
						//선택했던 응답 이미지 id값(응답 값이 있는 id 값) 뽑아내기
						var select_id = $('#select_sub_input_'+(i+1)+'_'+(idx+1)+'').attr('id').split('select_sub_input_'+(i+1)+'_')[1];
						$('#chooseImg_'+(i+1)+'_'+select_id+'').css('display','');	//선택이미지 보이게
						$('.contsDiv'+(i+1)+' #select_img'+(i+1)+'_'+select_id+'').css({'opacity':'0.6'});	//응답이미지 opacity 주기
						$('#contentsSpan'+(i+1)+'_'+select_id+'').parent().css({'position':'relative', 'top':'-200px'}); //응답 텍스트 위치
					}//if 
				}//for
			});
			
			//선택이미지가 없으면 돋보기 이미지가 보이게
			if( $('#chooseImg_'+(i+1)+'_'+id+'').attr('id') == undefined ){
				$('#select_sub_input_'+(i+1)+'_'+id).parent().after('<div class="zoom_btn" id="zoomBtn_'+(i+1)+'_'+id+'"><img class="magnifying"></div>')
				$('#contentsSpan'+(i+1)+'_'+id+'').parent().css({'position':'relative', 'top':'-200px'});
			}//if
			
			$('#zoomBtn_'+(i+1)+'_'+id+'').on({
				taphold: function(e) {
					
					//돋보기버튼 제거 true(응답이미지 바로 선택 방지 위해)
					zoomBtn_remove = true;
					
					$('#zoomBtn_'+(i+1)+'_'+id+'').remove();
					$('#contentsSpan'+(i+1)+'_'+id+'').parent().css('top','0px');
					
					//0.5초 후에 돋보기버튼 제거 false로 바뀜 
					setTimeout( function() {
						//돋보기버튼 제거 false
						zoomBtn_remove = false;
						
						//alert('clickCount::'+clickCount);
					}, 500);
				},
				click: function(e) {
					
					/** 0.1초 후에 돋보기 클릭 가능 **/
					//응답 이미지 taphold (돋보기 바로 클릭 방지 위해)
					select_taphold = false;
					setTimeout( function() {
						//돋보기 taphold 0.1초 후 true로 변경
						select_taphold = true;
						if(select_taphold == false){
							return false;
						}else {
							//돋보기 클릭시 이동
							//$('#zoomBtn_'+(i+1)+'_'+id+'').click(function(){
								var surveyContentsId = $('#zoomBtn_'+(i+1)+'_'+id+'').parents().children('.img').children('.surveyContentsId').val();
								location.href="/view_origin_image?surveyContentsId="+surveyContentsId;
								
								$('#surveyForm'+(i+1)+' .zoom_btn').remove();	//돋보기 제거
								$('#contentsSpan'+(i+1)+'_'+id+'').parent().css('top','0px');	//텍스트 위치
							//});
						}
					}, 100);
					/** 0.1초 후에 돋보기 클릭 가능 **/
					
					/* $('.zoomWrap').css('display','');
					$('.zoomWrap').append('	<img class="origin_img" id="origin_img'+(i+1)+'_'+(id)+'" src="'+json.reply[(id-1)].SURVEY_IMAGE_PATH+'" data-zoom-image="'+json.reply[(id-1)].SURVEY_IMAGE_PATH+'" style=" width:90%; height:auto; margin:30% 0 0 5%; ">'+        
						  '<div class="lens_btn lens_img" id="lens_img'+(i+1)+'_'+(id)+'" style="position:absolute; top:10%; right:8%; color:#fff; ">돋보기</div>'+
						  '<div class="lens_btn cancel_img" id="cancel_img'+(i+1)+'_'+(id)+'" style="position:absolute; top:10%; right:8%; display:none; z-index:1000; color:#fff;">취소</div>' 
							); */
					$('.lens_btn').click(function(){
						$('.lens_btn').toggle();	//토글 사용
						
						$('.lens_btn').toggle().is(':visible');	//렌즈 토글 visible 
						if( $('.lens_btn').toggle().is(':visible') == true ){	//보이는 텍스트이면
							console.log( $(this).text() );
							if( $(this).text()=='돋보기' ){//돋보기 클릭시
								console.log('돋보기!');
								$('#origin_img'+(i+1)+'_'+(id)+'').elevateZoom({
									zoomType: 'lens',
									lensShape: 'round',
									zoomLens: true
								});
							}else if( $(this).text()=='취소' ){//취소 클릭시
								console.log('취소!');
								$('.zoomLens').css('display','none');
							}
						}
					});//lens_btn click 
				}
			});//zoomBtn_* on function
			
		},
		click : function(e){
			var id = $(this).attr('id').split('img'+(i+1)+'_')[1];
			console.log('id : '+answerNum);
			
			//돋보기 제거 false일 때 응답 선택 가능 
			if(zoomBtn_remove == false ){
			
				clickCount++;
				
				if(clickCount <= answerNum){
					console.log('c count : '+clickCount)
					if(clickCount == answerNum){
						if(i == 0){
							if((i+1) == $('#total').val()){
								$('.surveyFooter').append('<div class="footerBtn selectRevise" id=clearBtn'+(i+1)+'>수정하기</div>'+
										'<div class="footerBtn next_bt survey_bt finish_bt" id=nextBtn'+(i+1)+'>확정하기</div>'+
											'<div class="footerBtn" id=showChart'+(i+1)+'>통계보기</div>')
							}else{
								$('.surveyFooter').append('<div class="footerBtn selectRevise" id=clearBtn'+(i+1)+'>수정하기</div>'+
										'<div class="footerBtn next_bt survey_bt" id=nextBtn'+(i+1)+'>확정하기</div>'+
											'<div class="footerBtn" id=showChart'+(i+1)+'>통계보기</div>')	
							}	
						}else if((i+1) == $('#total').val()){
							$('.surveyFooter').append('<div class="footerBtn selectRevise" id=clearBtn'+(i+1)+'>수정하기</div>'+
									'<div class="footerBtn next_bt survey_bt finish_bt" id=nextBtn'+(i+1)+'>확정하기</div>'+
										'<div class="footerBtn" id=showChart'+(i+1)+'>통계보기</div>')
						}else{
							$('.surveyFooter').append('<div class="footerBtn selectRevise" id=clearBtn'+(i+1)+'>수정하기</div>'+
									'<div class="footerBtn next_bt survey_bt" id=nextBtn'+(i+1)+'>확정하기</div>'+
										'<div class="footerBtn" id=showChart'+(i+1)+'>통계보기</div>')
						}
						$('#fBtn'+(i+1)+'').remove();
					}
					
					if($('#select_sub_input_'+(i+1)+'_'+id).val()=='1'){
						
					}else{
						$('#select_sub_input_'+(i+1)+'_'+id).val(clickCount);
						$('#select_sub_input_'+(i+1)+'_'+id).parent().after('<div class="choose_img" id="chooseImg_'+(i+1)+'_'+id+'"><img class="choose"></div>')
						$('#chooseImg_'+(i+1)+'_'+id+'').next().css({'position':'relative', 'top':'-200px'});
						$(this).css('opacity', '0.7');
		
					}//end if
				}else {
					alert(answerNum+'개 모두 선택하셨습니다');
				}
			}//if
	  
			//버튼 3개 만듬	    		
		}
	});

	/** 선택이미지 길게 누르면 돋보기 이미지 보이게 **/
	$('.surveyWrap').on('taphold', 'div[id*=chooseImg_'+(i+1)+']', function(e){
		console.log('선택이미지 taphold');
		console.log('(i+1)::'+(i+1));
		
		//응답 id 값 뽑아내기
		var id = $(this).attr('id').split('chooseImg_'+(i+1)+'_')[1];
		
		//돋보기 이미지 지우고 다시 생성
		$('#surveyForm'+(i+1)+' .zoom_btn').remove();
		$('#select_sub_input_'+(i+1)+'_'+id).parent().after('<div class="zoom_btn" id="zoomBtn_'+(i+1)+'_'+id+'"><img class="magnifying"></div>')
		
		//응답 텍스트 위치 
		if( $('#zoomBtn_'+(i+1)+'_'+id+'').attr('id') != undefined ){ 
			$('#contentsSpan'+(i+1)+'_'+id+'').parent().css({'position':'relative', 'top':'-200px'});
		}//if
		
		$('.contsDiv'+(i+1)+'').each( function(idx){
			idx = parseInt(idx);
			//선택이미지도 없고 돋보기 이미지도 없을 때 응답 텍스트 초기화
			if( $('#chooseImg_'+(i+1)+'_'+(idx+1)+'').attr('id') == undefined && $('#zoomBtn_'+(i+1)+'_'+(idx+1)+'').attr('id') == undefined ){
				console.log('없는 값 idx::'+(idx+1))
				$('#contentsSpan'+(i+1)+'_'+(idx+1)+'').parent().css({'position':'relative', 'top':'0'});
			}
			
			for(var num=1; num<=answerNum; num++){	//응답 수만큼 for문 돌림
				//응답 이미지 선택되면(응답 값이 있으면) css 변경 
				if( $('#surveyForm'+(i+1)+' #select_sub_input_'+(i+1)+'_'+(idx+1)+'').val() == ''+num+'' ) { 
				$('#chooseImg_'+(i+1)+'_'+(idx+1)+'').css('display','');	//선택이미지 보이게
				$('.contsDiv'+(i+1)+' #select_img'+(i+1)+'_'+(idx+1)+'').css({'opacity':'0.6'});	//응답이미지 opacity 주기
				}//for
			}//for
		});
		
		
		
		$('#zoomBtn_'+(i+1)+'_'+id+'').on({	
			taphold: function(e) {	//돋보기 제거
				
				//돋보기버튼 제거 true(응답이미지 바로 선택 방지 위해)
				zoomBtn_remove = true;
				
				$('#zoomBtn_'+(i+1)+'_'+id+'').remove();	//돋보기 이미지 제거
				$('#contentsSpan'+(i+1)+'_'+id+'').parent().css('top','0px');	//응답 텍스트 위치
				
				for(var num=1; num<=answerNum; num++){//응답 수만큼 for문 돌림
					//응답 이미지 선택되면(응답 값이 있으면) css 변경
					if( $('#surveyForm'+(i+1)+' #select_sub_input_'+(i+1)+'_'+id+'').val() == ''+num+'' ) { 
						$('#chooseImg_'+(i+1)+'_'+id+'').css('display','');	//선택이미지 보이게
						$('.contsDiv'+(i+1)+' #select_img'+(i+1)+'_'+id+'').css({'opacity':'0.6'});	//응답이미지 opacity 주기
						$('#contentsSpan'+(i+1)+'_'+id+'').parent().css({'position':'relative', 'top':'-200px'}); //응답 텍스트 위치
					}//if	
				}//for 
				
				//0.5초 후에 돋보기버튼 제거 false로 바뀜 
				setTimeout( function() {
					//돋보기버튼 제거 false
					zoomBtn_remove = false;
					//응답 이미지 클릭수 초기화
					count = 0;
					//alert('count:'+count);
				}, 500);
			},
			click: function(e) {
				
				/** 0.1초 후에 돋보기 클릭 가능 **/
				//응답 이미지 taphold (돋보기 바로 클릭 방지 위해)
				select_taphold = false;
				setTimeout( function() {
					//돋보기 taphold 0.1초 후 true로 변경
					select_taphold = true;
					if(select_taphold == false){
						return false;
					}else {
						//돋보기 클릭시 이동
						//$('#zoomBtn_'+(i+1)+'_'+id+'').click(function(){
							var surveyContentsId = $('#zoomBtn_'+(i+1)+'_'+id+'').parents().children('.img').children('.surveyContentsId').val();
							location.href="/view_origin_image?surveyContentsId="+surveyContentsId;
							
							$('#surveyForm'+(i+1)+' .zoom_btn').remove();	//돋보기 제거
							$('#contentsSpan'+(i+1)+'_'+id+'').parent().css('top','0px');	//텍스트 위치
							
							for(var num=1; num<=answerNum; num++){//응답 수만큼 for문 돌림
								//응답 이미지 선택되면(응답 값이 있으면) css 변경
								if( $('#surveyForm'+(i+1)+' #select_sub_input_'+(i+1)+'_'+id+'').val() == ''+num+'' ) { 
									$('#chooseImg_'+(i+1)+'_'+id+'').css('display','');	//선택이미지 보이게
									$('.contsDiv'+(i+1)+' #select_img'+(i+1)+'_'+id+'').css({'opacity':'0.6'});	//응답이미지 opacity 주기
									$('#contentsSpan'+(i+1)+'_'+id+'').parent().css({'position':'relative', 'top':'-200px'}); //응답 텍스트 위치
								}//if
							}//for
						//});
					}
				}, 100);
				/** 0.1초 후에 돋보기 클릭 가능 **/
			}
		});//zoomBtn_* on function
		
		count = 0;
		select_click = false;
		
		console.log('id:'+id);
		
		//응답 이미지 opacity 초기화	
		$('.contsDiv'+(i+1)+' #select_img'+(i+1)+'_'+id+'').css({'opacity':''});
		//선택 이미지 안보이게
		$('#surveyForm'+(i+1)+' #chooseImg_'+(i+1)+'_'+id+'').css('display','none');
		//$('#surveyForm'+(i+1)+' #select_sub_input_'+(i+1)+'_'+id+'').val(0);
		console.log(id)
		
	});
	/** 선택이미지 길게 누르면 돋보기 이미지 보이게 **/

	if(i == 0){
		if((i+1) == $('#total').val()){
			$('.surveyFooter').append('<div class="next_bt survey_bt finish_bt"  id="fBtn'+(i+1)+'"  style="width:100%; float:left; ">'+answerNum+'개를 선택해 주세요</div>');
		}else{
			$('.surveyFooter').append('<div class="next_bt survey_bt" id="fBtn'+(i+1)+'" >'+answerNum+'개를 선택해 주세요</div>');	
		}	
	}else if((i+1) == $('#total').val()){
		/*$('.surveyHeader').append('<div class="revise_bt survey_bt" id="reviseBtn'+(i+1)+'"><img src="img/mobile/main/survey/arrow_back.png"></div>');*/
		$('.surveyFooter').append('<div class="next_bt survey_bt finish_bt" id="fBtn'+(i+1)+'"  style="width:100%; float:left; ">'+answerNum+'개를 선택해 주세요</div>');
			$('#surveyForm'+(i+1)).css('display','none');
			$('#reviseBtn'+(i+1)).css('display','none');
			$('#fBtn'+(i+1)).css('display','none');
	}else{
			$('.surveyFooter').append('<div class="next_bt survey_bt"  id="fBtn'+(i+1)+'" style="width:100%; float:left; ">'+answerNum+'개를 선택해 주세요</div>');
			$('#surveyForm'+(i+1)).css('display','none');
			$('#reviseBtn'+(i+1)).css('display','none');
			$('#fBtn'+(i+1)).css('display','none');
	}


	$('.surveyWrap').on('click', '#clearBtn'+(i+1)+'', function(){
		
		//var clearId = $(this).attr('id').split('clearBtn')[1];
		//console.log($(this).attr('id').split('clearBtn')[1])
		
		clickCount = 0;
		
		$('.contsDiv'+(i+1)+' .contsTxtDiv').css({'position':'', 'top':''});
		$('.contsDiv'+(i+1)+' div[name="selectCheckbox"]').css({'opacity':''});
		
		$('#surveyForm'+(i+1)+' .zoom_btn').remove();	//돋보기 이미지 제거
		$('#surveyForm'+(i+1)+' .choose_img').remove();
		$('input[name=select_sub_input'+(i+1)+']').val(0);
		console.log((i+1))
		$('#clearBtn'+(i+1)+'').remove();
		$('#nextBtn'+(i+1)+'').remove();
		$('#showChart'+(i+1)+'').remove();
		
		//버튼 제거하고 다시 생성(설문을 여러번 참여시 버튼 여러개 생성 방지)
		$('#fBtn'+(i+1)+'').remove();
		if(i == 0){
			$('.surveyFooter').append('<div class="next_bt survey_bt"  id="fBtn'+(i+1)+'" >'+answerNum+'개를 선택해 주세요</div>');	
	
		}else if((i+1) == $('#total').val()){
			/*$('.surveyHeader').append('<div class="revise_bt survey_bt" id="reviseBtn'+(i+1)+'"><img src="img/mobile/main/survey/arrow_back.png" style="height:28px;"></div>');*/
			$('.surveyFooter').append('<div class="next_bt survey_bt finish_bt" id="fBtn'+(i+1)+'" style="width:100%; float:left; ">'+answerNum+'개를 선택해 주세요</div>');
	
		}else{
	  		$('.surveyFooter').append('<div class="next_bt survey_bt" id="fBtn'+(i+1)+'" style="width:100%; float:left; ">다음</div>');
	
		}//if
	});
}/*end selectType */










/*click : function(e){
	
	var id = $(this).attr('id').split('img'+(i+1)+'_')[1];
  
	console.log('id : '+id);
	if($('#select_sub_input_'+(i+1)+'_'+id).val()=='1'){
		//$('#select_sub_input_'+(i+1)+'_'+id).val('0');
		//$('#select_sub_input_'+(i+1)+'_'+id).parent().after('<div class="choose_img" style="content : url(images/common/builder/survey/sub_chose_icon.png); width:100px; height:100px; position:relative; top:-130px; left:50px;"></div>')
	}else{
		$('#select_sub_input_'+(i+1)+'_'+id).val('1');
		//$('#select_sub_input_'+(i+1)+'_'+id).parent().wrap('<div id="selectWrap'+id+'" style="content : url(images/common/builder/survey/check_img2.png); width:100px; height:100px;"></div>');
		$('#select_sub_input_'+(i+1)+'_'+id).parent().after('<div class="choose_img" id="chooseImg_'+(i+1)+'_'+id+'"></div>')
		$('#chooseImg_'+(i+1)+'_'+id+'').next().css({'position':'relative', 'top':'-70px'});
		$(this).css('opacity', '0.3');

	}//end if

			//선택 이미지 클릭시 선택 제거
	$('#chooseImg_'+(i+1)+'_'+id+'').click(function(){
		$('#chooseImg_'+(i+1)+'_'+id+'').remove();
		$('#select_sub_input_'+(i+1)+'_'+id).val('0');
		$('#select_img'+(i+1)+'_'+id+'').next().css({'position':'', 'top':''});
		$('#select_img'+(i+1)+'_'+id+'').css({'opacity':''});
		if( $('.choose_img').val() == undefined ){//선택이미지가 모두 없으면 선택완료 버튼 제거
			//$('.next_bt').css('display', 'none');
			//$('.finish_bt').css('display', 'none');
		}//if
	});//end chooseImg_* click
}*/