function chooseType(json, i){
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
		
		
		//$('div[id*=select_img'+(i+1)+']').css({ '-webkit-user-select':'none', '-khtml-user-select':'none', '-moz-user-select':'none', 'ms-user-select':'none', 'user-select':'none' });
		//$('div[id*=select_img'+(i+1)+']').css({'-webkit-user-select':'none' }); // 답변이미지 div 복사 방지
		
		var count = 0;
		
		//돋보기 버튼 제거 chk(응답이미지 바로 선택 방지 위해)
		var zoomBtn_remove = false;
		
		$('div[id*=select_img'+(i+1)+']').on({ //답변 이미지 div on
			taphold: function(e) {
				
				//응답 이미지 taphold true (돋보기 바로 클릭 방지 위해)
				var select_taphold = true;
				
				var id = $(this).attr('id').split('img'+(i+1)+'_')[1];
				
				//$('#zoomBtn_'+(i+1)+'_'+id+'').css({'-webkit-user-select':'none' });	//돋보기 div 복사방지
				//$('#zoomBtn_'+(i+1)+'_'+id+'').children().css({'-webkit-user-select':'none' });
				
				//선택이미지가 없으면 돋보기 이미지가 보이게
				if( $('#chooseImg_'+(i+1)+'_'+id+'').attr('id') == undefined ){
					$('#select_sub_input_'+(i+1)+'_'+id).parent().after('<div class="zoom_btn" id="zoomBtn_'+(i+1)+'_'+id+'"><img class="magnifying"></div>')
					$('#zoomBtn_'+(i+1)+'_'+id+'').next().css({'position':'relative', 'top':'-70px'});
					$('#contentsSpan'+(i+1)+'_'+id+'').parent().css('top','-154px');
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
									location.href="/view_origin_image?surveyContentsId="+surveyContentsId;
								});
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
				
				//응답 이미지 클릭 수 증가
				count++;
				
				//돋보기 제거 false일 때 응답 선택 가능 
				if(zoomBtn_remove == false){
					
					if(count <= 1){
						$('.footerBtn').remove();
						var id = $(this).attr('id').split('img'+(i+1)+'_')[1];
						$('#nextBtn'+$(this).attr('id').split('select_img')[1].split('_')[0]).css('opacity','1')
						console.log(count);
						console.log('id : '+id);
						console.log( '클릭 id:::'+$(this).attr('id').split('select_img')[1].split('_')[0]);
						var surveyFormId = $(this).attr('id').split('select_img')[1].split('_')[0];
						if( $(this).attr('id') ){
							
							//모두 해제 
							$('#surveyForm'+surveyFormId+' div[id*="chooseImg_"]').remove();
							$('input[id*="select_sub_input_'+(i+1)+'_"]').val('0');
							$('div[id*=select_img'+(i+1)+'_]').next().css({'position':'', 'top':''});
							$('div[id*=select_img'+(i+1)+'_]').css({'opacity':''});
							//모두 해제 
							
							//선택한 이미지 
							$('#select_sub_input_'+(i+1)+'_'+id).val('1');
							$('#select_sub_input_'+(i+1)+'_'+id).parent().after('<div class="choose_img" id="chooseImg_'+(i+1)+'_'+id+'"></div>')
							$('#chooseImg_'+(i+1)+'_'+id+'').next().css({'position':'relative', 'top':'-70px'});
							$(this).css('opacity', '0.6');
							//선택한 이미지 
							
							//버튼 3개 만듬				
							if(i == 0){
								if((i+1) == $('#total').val()){
									$('.surveyFooter').append('<div class="footerBtn singleRevise" id=clearBtn'+(i+1)+'>수정하기</div>'+
											'<div class="footerBtn next_bt survey_bt finish_bt" id=nextBtn'+(i+1)+'>확정하기</div>'+
											'<div class="footerBtn" id=showChart'+(i+1)+'>통계보기</div>')
								}else{
									$('.surveyFooter').append('<div class="footerBtn singleRevise" id=clearBtn'+(i+1)+'>수정하기</div>'+
											'<div class="footerBtn next_bt survey_bt" id=nextBtn'+(i+1)+'>확정하기</div>'+
											'<div class="footerBtn" id=showChart'+(i+1)+'>통계보기</div>')	
								}	
							}else if((i+1) == $('#total').val()){
								$('.surveyFooter').append('<div class="footerBtn singleRevise" id=clearBtn'+(i+1)+'>수정하기</div>'+
										'<div class="footerBtn next_bt survey_bt finish_bt" id=nextBtn'+(i+1)+'>확정하기</div>'+
										'<div class="footerBtn" id=showChart'+(i+1)+'>통계보기</div>')
							}else{
								$('.surveyFooter').append('<div class="footerBtn singleRevise" id=clearBtn'+(i+1)+'>수정하기</div>'+
										'<div class="footerBtn next_bt survey_bt" id=nextBtn'+(i+1)+'>확정하기</div>'+
										'<div class="footerBtn" id=showChart'+(i+1)+'>통계보기</div>')
							}
							$('#fBtn'+(i+1)+'').remove();
							//버튼 3개 만듬	    		
						}else{
						}//end if
					}//end if
				
				}//end if
			}
		});
		//양자택일형 추가한거(0920)
		if(i == 0){
			if((i+1) == $('#total').val()){
				$('.surveyFooter').append('<div class="next_bt survey_bt finish_bt"  id="fBtn'+(i+1)+'"  style="width:100%; float:left; ">1개를 선택해 주세요</div>');
			}else{
				$('.surveyFooter').append('<div class="next_bt survey_bt" id="fBtn'+(i+1)+'" >1개를 선택해 주세요</div>');	
			}	
		}else if((i+1) == $('#total').val()){
			$('.surveyFooter').append('<div class="next_bt survey_bt finish_bt" id="fBtn'+(i+1)+'"  style="width:100%; float:left; ">1개를 선택해 주세요</div>');
	  		$('#surveyForm'+(i+1)).css('display','none');
	  		$('#reviseBtn'+(i+1)).css('display','none');
	  		$('#fBtn'+(i+1)).css('display','none');
		}else{
	  		$('.surveyFooter').append('<div class="next_bt survey_bt"  id="fBtn'+(i+1)+'" style="width:100%; float:left; ">1개를 선택해 주세요</div>');
	  		$('#surveyForm'+(i+1)).css('display','none');
	  		$('#reviseBtn'+(i+1)).css('display','none');
	  		$('#fBtn'+(i+1)).css('display','none');
		}
		
		
		$('.surveyWrap').on('click', '#clearBtn'+(i+1)+'', function(){
			console.log('단수 선택 수정클릭');
			count = 0;
			select_click = false;
			
			var clearId = $(this).attr('id').split('clearBtn')[1];
			console.log($(this).attr('id').split('clearBtn')[1])
			
			$('.contsDiv'+clearId+' .contsTxtDiv').css({'position':'', 'top':''});
			$('.contsDiv'+clearId+' div[name="selectCheckbox"]').css({'opacity':''});
				
			$('#surveyForm'+clearId+' .choose_img').remove();
			$('input[name=select_sub_input'+clearId+']').val(0);
			console.log(clearId)
			$('#clearBtn'+clearId+'').remove();
			$('#nextBtn'+clearId+'').remove();
			$('#showChart'+clearId+'').remove();
			
			//버튼 제거하고 다시 생성(설문을 여러번 참여시 버튼 여러개 생성 방지)
			$('#fBtn'+(i+1)+'').remove();
			if(i == 0){
				$('.surveyFooter').append('<div class="next_bt survey_bt"  id="fBtn'+(i+1)+'" >1개를 선택해 주세요</div>');	

			}else if((i+1) == $('#total').val()){
				$('.surveyFooter').append('<div class="next_bt survey_bt finish_bt" id="fBtn'+(i+1)+'" style="width:100%; float:left; ">1개를 선택해 주세요</div>');

			}else{
		  		$('.surveyFooter').append('<div class="next_bt survey_bt" id="fBtn'+(i+1)+'" style="width:100%; float:left; ">1개를 선택해 주세요</div>');

			}//if
		});
  }/*Choose */



	