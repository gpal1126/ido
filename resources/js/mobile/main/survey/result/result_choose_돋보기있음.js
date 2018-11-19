function result_chooseType(json, i, userId){
		console.log('양자택일형::');
		console.log(json);
		//양자택일형 추가한거(0920)
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
        	'</form>'+
        	'';
    
		//중질문 타이틀 append    
		//$('.surveyContents').append('<div id="selectSurveyDiv'+(index+1)+'"></div>')  
		//$('#selectSurveyDiv'+(index+1)).append(surveyTitleHtml);
		$('.surveyContents').append(surveyTitleHtml);
		
		for(j in json.reply){
			j = parseInt(j);
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
              		'<span class="contsTxtSpan" id="contentsSpan'+(i+1)+'_'+(j+1)+'" >'+json.reply[j].SURVEY_CONTENTS+'</span>'+
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
  			
			$('.surveyContents #surveyDiv'+(i+1)+' .conts_div').append(surveyReplyHtml);
			$('.surveyAnswer_container').append('<input type="hidden" id="c'+json.reply[j].SURVEY_CONTENTS_ID+'" value="'+json.reply[j].SURVEY_CONTENTS+'">');
			
			$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'width':'41%'});
			$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'height':$('#contsDiv'+(i+1)+'_'+json.reply.length+'').width()});
			
			//$('div[class*="contsDiv"]').css({'overflow':'hidden'});
			
			console.log('height:::::'+$('div[class*="contsDiv"]').width());
			switch(json.reply.length){
				case 2 :
  					$('.contsContainer').css({'top':'120px'});
  					$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'float':'left'});
  					$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'margin':'20% 0 9% 7%'});  
  					$('#surveyForm'+(i+1)+' div[name$=_s2]').css({'margin-left':'5%'});
  					$('.surveyFooter').css({'position':'absolute', 'bottom':'0'});
				break;
			}//end switch

		}//for
		
		var count = 0;
		
		//돋보기 버튼 제거 chk(응답이미지 바로 선택 방지 위해)
		var zoomBtn_remove = false;
		
		$('div[id*=select_img'+(i+1)+']').on({ //답변 이미지 div on
			taphold: function(e) {
				
				//응답 이미지 taphold true (돋보기 바로 클릭 방지 위해)
				var select_taphold = true;
				
				var id = $(this).attr('id').split('img'+(i+1)+'_')[1];
				
				$('#surveyForm'+(i+1)+' .zoom_btn').remove();	//돋보기 제거
				$('.contsTxtSpan').parent().css({'position':'relative', 'top':'0'});
				
				
				$('.contsDiv'+(i+1)+'').each( function(idx){
					idx = parseInt(idx);
					
					//응답 이미지를 선택한 후 길게 눌러 돋보기 이미지가 나온 뒤(선택이미지는 display:none) 다른 응답을 길게 누르면 
					//이전에 선택했던 선택이미지가 다시 보임  
					//console.log(':::::::::::::::::'+$('#select_sub_input_'+(i+1)+'_'+(idx+1)+'').val());
					if( $('#surveyForm'+(i+1)+' #select_sub_input_'+(i+1)+'_'+(idx+1)+'').val() == '1' ) { //응답 값이 1이면
						//선택했던 응답 이미지 id값(응답 값이 1 인 id 값) 뽑아내기
						var select_id = $('#select_sub_input_'+(i+1)+'_'+(idx+1)+'').attr('id').split('select_sub_input_'+(i+1)+'_')[1];
						$('#chooseImg_'+(i+1)+'_'+select_id+'').css('display','');	//선택이미지 보이게
						$('.contsDiv'+(i+1)+' #select_img'+(i+1)+'_'+select_id+'').css({'opacity':'0.6'});	//응답이미지 opacity 주기
						$('#contentsSpan'+(i+1)+'_'+select_id+'').parent().css({'position':'relative', 'top':'-70px'}); //응답 텍스트 위치
					} 
				});
				
				//돋보기 이미지가 있으면
				/*if( $('#zoomBtn_'+(i+1)+'_'+id+'').attr('id') != undefined ){ 
					$('#contentsSpan'+(i+1)+'_'+id+'').parent().css({'position':'relative', 'top':'-154px'});
				}*/
				
				//선택이미지가 없으면 돋보기 이미지가 보이게
				if( $('#chooseImg_'+(i+1)+'_'+id+'').attr('id') == undefined ){
					$('#select_sub_input_'+(i+1)+'_'+id).parent().after('<div class="zoom_btn" id="zoomBtn_'+(i+1)+'_'+id+'"><img class="magnifying"></div>')
					//$('.contsTxtSpan').parent().css({'position':'relative', 'top':'-154px'});
					$('#contentsSpan'+(i+1)+'_'+id+'').parent().css({'position':'relative', 'top':'-153px'});
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
								$('#zoomBtn_'+(i+1)+'_'+id+'').click(function(){
									var surveyContentsId = $(this).parents().children('.img').children('.surveyContentsId').val();
									location.href="/m_view_origin_image?surveyContentsId="+surveyContentsId;
									
									$('.zoom_btn').remove();	//돋보기 제거
									$('#contentsSpan'+(i+1)+'_'+id+'').parent().css('top','0px');	//텍스트 위치
								});
							}
						}, 100);
						/** 0.1초 후에 돋보기 클릭 가능 **/
						
					}
				});//zoomBtn_* on function
			},
			click : function(e){
				
			}
		});
		
		/** 선택이미지 길게 누르면 돋보기 이미지 보이게 **/
		$('.surveyWrap').on('taphold', 'div[id*=chooseImg_'+(i+1)+']', function(e){
			console.log('선택이미지 taphold');
			console.log('(i+1)::'+(i+1));
			
			//응답 id 값 뽑아내기
			var id = $(this).attr('id').split('chooseImg_'+(i+1)+'_')[1];
			
			//돋보기 이미지 지우고 다시 생성
			$('.zoom_btn').remove();
			$('#select_sub_input_'+(i+1)+'_'+id).parent().after('<div class="zoom_btn" id="zoomBtn_'+(i+1)+'_'+id+'"><img class="magnifying"></div>')
			
			//응답 텍스트 위치 
			if( $('#zoomBtn_'+(i+1)+'_'+id+'').attr('id') != undefined ){ 
				$('#contentsSpan'+(i+1)+'_'+id+'').parent().css({'position':'relative', 'top':'-153px'});
			}//if
			
			$('.contsDiv'+(i+1)+'').each( function(idx){
				idx = parseInt(idx);
				//선택이미지도 없고 돋보기 이미지도 없을 때 응답 텍스트 초기화
				if( $('#chooseImg_'+(i+1)+'_'+(idx+1)+'').attr('id') == undefined && $('#zoomBtn_'+(i+1)+'_'+(idx+1)+'').attr('id') == undefined ){
					console.log('없는 값 idx::'+(idx+1))
					$('#contentsSpan'+(i+1)+'_'+(idx+1)+'').parent().css({'position':'relative', 'top':'0'});
				}
			});
			
			
			$('#zoomBtn_'+(i+1)+'_'+id+'').on({	
				taphold: function(e) {	//돋보기 제거
					
					//돋보기버튼 제거 true(응답이미지 바로 선택 방지 위해)
					zoomBtn_remove = true;
					
					$('#zoomBtn_'+(i+1)+'_'+id+'').remove();	//돋보기 이미지 제거
					$('#contentsSpan'+(i+1)+'_'+id+'').parent().css('top','0px');	//응답 텍스트 위치
					
					if( $('#surveyForm'+(i+1)+' #select_sub_input_'+(i+1)+'_'+id+'').val() == '1' ) { //응답 값이 1이면
						$('#chooseImg_'+(i+1)+'_'+id+'').css('display','');	//선택이미지 보이게
						$('.contsDiv'+(i+1)+' #select_img'+(i+1)+'_'+id+'').css({'opacity':'0.6'});	//응답이미지 opacity 주기
						$('#contentsSpan'+(i+1)+'_'+id+'').parent().css({'position':'relative', 'top':'-70px'}); //응답 텍스트 위치
					} 
					
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
			/*
			$('#clearBtn'+(i+1)+'').remove();
			$('#nextBtn'+(i+1)+'').remove();
			$('#showChart'+(i+1)+'').remove();
			
			//버튼 제거하고 다시 생성(설문을 여러번 참여시 버튼 여러개 생성 방지)
			$('#fBtn'+(i+1)+'').remove();
			if(i == 0){
				$('.surveyFooter').append('<div class="next_bt survey_bt"  id="fBtn'+(i+1)+'" >1개를 선택해 주세요</div>');	

			}else if((i+1) == $('#total').val()){
				$('.surveyFooter').append('<div class="next_bt survey_bt finish_bt" id="fBtn'+(i+1)+'" style="width:100%; float:left; ">1개를 선택해 주세요</div>');

			}else{
		  		$('.surveyFooter').append('<div class="next_bt survey_bt" id="fBtn'+(i+1)+'" style="width:100%; float:left; ">1개를 선택해 주세요</div>');

			}//if
			*/		
		});
		/** 선택이미지 길게 누르면 돋보기 이미지 보이게 **/
		
		
		//양자택일형 추가한거(0920)
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

  }/*Choose */



	