	
	function cutString(str, len){//글자 자르기 func
		if(str.length > len){
			str = str.substring(0, len)+'..';
		}
		return str;
	}

	var call = 0 ;
	
    //이미지로딩 서버로 요청
    function call_image(no, category){
    	call++;
      	console.log('받는값 no::'+no);
      	if(call == 1){
        	$.ajax({
	          	url : 'http://14.63.174.108/m_main?no='+no+'&category='+category,
	          	async: false,
	          	type : 'GET',
	          	success : function(data) {
	            	call = 0;
	            	var jCount = $('#jCount').val();
	            	console.log(data);
	            	//처음 이미지 로딩 할 때 - no값 초기화 선언
	            	var no = 0;
	            	var firstCategory = new Array();
	            	var secondCategory = new Array();
	            	//서버에서 데이터 응답받아 이미지 여러개 가져옴
	            	for(var i in data.contents){
	            		var categoryTxt = (data.contents[i].CATEGORY.split('_')[0]).toUpperCase();	//카테고리 Txt
	            		firstCategory[i] = data.contents[i].CATEGORY.split('_')[0];
	              		secondCategory[i] = data.contents[i].CATEGORY.split('_')[1];
	              		
	              		
						switch(firstCategory[i]){
							case 'fashion':
						    	firstCategory[i]="패션/뷰티"
						      	break;
						  	case 'food':
						    	firstCategory[i]= "음식/여행"
						      	break;    
						  	case 'hobby':
						      	firstCategory[i]="취미/게임"
						      	break;    
						  	case 'life':
						    	firstCategory[i]="생활/쇼핑"
						      	break;    
						  	case 'edu':
						      	firstCategory[i]="정치/교육"
						      	break;    
						  	case 'digital':
						      	firstCategory[i]="디지털/가전"
						      	break;    
						  	case 'car':
						      	firstCategory[i]="자동차/교통"
						      	break;    
						  	case 'media':
						      	firstCategory[i]="방송/연예"
						      	break;                            
						  	case 'sports':
						      	firstCategory[i]="스포츠/건강"
						      	break;        
	              		}//end switch
	          
          
	       				var category = data.category; 
			            
			            
			            var survey_title = data.contents[i].SECOND_SURVEY_TITLE;
			            
	          			if(i % 2 == 0){
				            chg_no = data.no;
				            $('#category').val(category);
				            
				            var left_html = '';
				            var right_html = '';
				            
	            			if(data.contents[i].IMAGE_TYPE == 'type2'){
	              				$('.left').append(
	              					'<div class="conDiv" style="position: relative; margin-top:5px;" id="'+data.contents[i].CONTENTS_ID+'">'+
	              						'<div style="width:100%; height:100%; background-color:black;"></div>'+
	              						'<div class="cCategory">'+
	              							firstCategory[i]+
	                        			'</div>'+
	                        			'<div class="cTitle">'+
	                        				cutString(survey_title, 5)+
	                        			'</div>'+
	                      				'<div class="cImage" style="height:100%;">'+
	                        				'<img src="'+data.contents[i].SURVEY_CROP_IMAGE+'" alt="" style="height:208.3px;"/>'+
	                        			'</div>'+
	                        			'<div class="cRegDate">'+'<span><img src="images/common/main/calendar.png"></span>'+
	                        				data.contents[i].REG_DATE+
	                        			'</div>'+
	                        			'<div class="cReply">'+'<span><img src="images/common/main/reply.png" style="width:13px; height:13px;"></span><span style="padding-left:5px;">153</span>'+
	                        			'</div>'+
	                      			'</div>');
		               		}else{//모바일
		               			left_html += ''+
					               			 '<div class="conDiv" style="position:relative; margin-top:5px;" id="'+data.contents[i].CONTENTS_ID+'">'+
					               			 	'<div style="position:absolute; width:100%; height:100%; background-color:black; opacity:0.4"></div>'+
					               			 	'<div class="cCategory" value="'+firstCategory[i]+'">'+
					               			 		firstCategory[i]+
					               			 	'</div>'+
					               			 	'<div class="cTitle">'+
					               			 		cutString(survey_title, 9)+
					               			 	'</div>';
		               			left_html += 	'<div class="cImage" style="height:100%;">';
		               			
		               			if( data.contents[i].SURVEY_TYPE == '5' ){//별점형이면
		               				left_html += ''+
		               							 	'<img src="'+data.contents[i].SECOND_SURVEY_CROP_IMAGE+'" alt="" />'+
		               							 '';
		               			}else {
		               				left_html += ''+
          							 				'<img src="'+data.contents[i].SURVEY_CROP_IMAGE+'" alt="" />'+
          							 			 '';
		               			}//if
		               			left_html += 	'</div>';
		               			
		               			left_html +=	'<div class="cRegDate">'+'<span><img src="images/common/main/calendar.png" style="width:13px; height:13px;"></span><span style="padding-left:5px;">'
		               								+data.contents[i].REG_DATE+'</span>'+
		               							'</div>'+
		               							'<div class="cReply">'+
		               								'<span><img src="images/common/main/reply.png" style="width:13px; height:13px;"></span><span style="padding-left:5px;">153</span>'+
		               							'</div>'+
		               						 '</div>';
		               			
		               			$('.left').append(left_html);
		               			
		              			/*$('.left').append(
		                        	'<div class="conDiv" style="position:relative; margin-top:5px;" id="'+data.contents[i].CONTENTS_ID+'">'+
		                        		'<div style="position:absolute; width:100%; height:100%; background-color:black; opacity:0.4"></div>'+
		                        		'<div class="cCategory" value="'+firstCategory[i]+'">'+
		                        			firstCategory[i]+
	                        			'</div>'+
	                        			'<div class="cTitle">'+
	                        				cutString(survey_title, 9)+
	                        			'</div>'+
		                        		'<div class="cImage" style="height:100%;">'+
		                          			'<img src="'+data.contents[i].SURVEY_CROP_IMAGE+'" alt="" />'+
		                        		'</div>'+
		                        		'<div class="cRegDate">'+'<span><img src="images/common/main/calendar.png" style="width:13px; height:13px;"></span><span style="padding-left:5px;">'
				                      	+data.contents[i].REG_DATE+'</span>'+
	                        			'</div>'+
	                        			'<div class="cReply">'+'<span><img src="images/common/main/reply.png" style="width:13px; height:13px;"></span><span style="padding-left:5px;">153</span>'+
	                        			'</div>'+
		                      		'</div>');*/
	               			}//end if
	               			console.log(data.contents[i].CONTENTS_ID)
	          			}else{
	            			chg_no = data.no;
	            
							if(data.contents[i].IMAGE_TYPE == 'type2'){
	            				$('.right').append(
	            					'<div class="conDiv" style="position: relative; margin-top:5px;" id="'+data.contents[i].CONTENTS_ID+'">'+
	            						'<div class="cCategory">'+
	            							firstCategory[i]+
	                        			'</div>'+
	                        			'<div class="cTitle">'+
	                        				cutString(survey_title, 5)+
	                        			'</div>'+
			                        	'<div class="cImage" style="height:100%;">'+
			                      			'<img src="'+data.contents[i].SURVEY_CROP_IMAGE+'" alt="" style="height:208.3px;"/>'+
			                       		'</div>'+
			                       		'<div class="cRegDate">'+'<span><img src="images/common/main/calendar.png" style="width:13px; height:13px;"></span><span style="padding-left:5px;">'
				                      	+data.contents[i].REG_DATE+'</span>'+
	                        			'</div>'+
	                        			'<div class="cReply">'+'<span><img src="images/common/main/reply.png" style="width:13px; height:13px;"></span><span style="padding-left:5px;">153</span>'+
	                        			'</div>'+
			                     	'</div>');
	             			}else{//모바일
		               			right_html += ''+
		               			 			 '<div class="conDiv" style="position:relative; margin-top:5px;" id="'+data.contents[i].CONTENTS_ID+'">'+
		               			 			 	'<div style="position:absolute; width:100%; height:100%; background-color:black; opacity:0.4"></div>'+
		               			 			 	'<div class="cCategory" value="'+firstCategory[i]+'">'+
		               			 			 		firstCategory[i]+
		               			 			 	'</div>'+
		               			 			 	'<div class="cTitle">'+
		               			 			 		cutString(survey_title, 9)+
		               			 			 	'</div>';
		               			right_html += 	'<div class="cImage" style="height:100%;">';
          			
		               			if( data.contents[i].SURVEY_TYPE == '5' ){//별점형이면
		               				right_html += ''+
		               							 	'<img src="'+data.contents[i].SECOND_SURVEY_CROP_IMAGE+'" alt="" />'+
		               							 '';
		               			}else {
		               				right_html += ''+
		               							 	'<img src="'+data.contents[i].SURVEY_CROP_IMAGE+'" alt="" />'+
		               							 '';
		               			}//if
		               			right_html += 	'</div>';
          			
		               			right_html +=	'<div class="cRegDate">'+'<span><img src="images/common/main/calendar.png" style="width:13px; height:13px;"></span>'+
		               								'<span style="padding-left:5px;">'+data.contents[i].REG_DATE+'</span>'+
		               							'</div>'+
		               							'<div class="cReply">'+
		               								'<span><img src="images/common/main/reply.png" style="width:13px; height:13px;"></span><span style="padding-left:5px;">153</span>'+
		               							'</div>'+
		               						 '</div>';
          			
		               			$('.right').append(right_html);
		               			
	            				/*$('.right').append(
				                    '<div class="conDiv" style="position:relative;  margin-top:5px;" id="'+data.contents[i].CONTENTS_ID+'">'+
				                    	'<div style="position:absolute; width:100%; height:100%; background-color:black; opacity:0.4"></div>'+	
				                    	'<div class="cCategory">'+
				                    		firstCategory[i]+
	                        			'</div>'+
	                        			'<div class="cTitle">'+
	                        				cutString(survey_title, 9)+
	                        			'</div>'+
				                    	'<div class="cImage" style="height:100%;">'+
				                        	'<img src="'+data.contents[i].SURVEY_CROP_IMAGE+'" alt="" />'+
				                      	'</div>'+
				                      	'<div class="cRegDate">'+'<span><img src="images/common/main/calendar.png" style="width:13px; height:13px;"></span><span style="padding-left:5px;">'
				                      	+data.contents[i].REG_DATE+'</span>'+
	                        			'</div>'+
	                        			'<div class="cReply">'+'<span><img src="images/common/main/reply.png" style="width:13px; height:13px;"></span><span style="padding-left:5px;">153</span>'+
	                        			'</div>'+
				                    '</div>');*/
		             		}//if
	          			}//if
	        			/* 현재 pc 화면 */  
	        		}//for
	            
		            //계속 변경되는 no값 - 아래에서 hidden으로 no값을 줌
		            $('#chg_no').val(chg_no);
		            $('#category').val(category);
		            console.log('이미지 로딩 success! 다음 chg_no값:::'+ chg_no);
		            console.log('이미지 로딩 success! 다음 category:::'+ category);
	          	}//end success
        	});//end ajax
        }//end call if
    }//end call_image function
   
    
    //무한 스크롤 구현
    $(window).scroll(function() {
		chg_no = $("#chg_no").val();
 		console.log(chg_no);

		category = $("#category").val();
		console.log(category);
		if(category == 'undefined'){
			console.log('들어옴');
		}else{
			console.log('아님');
		}//end if

		//          스크롤의 위치값        윈도우의 크기
		var scrollHeight = $(window).scrollTop() + $(window).height();
		//현재페이지(문서)의 높이
		var documentHeight = $(document).height();
		/* console.log('documentHeight:'+documentHeight);
		console.log('scrollHeight:'+scrollHeight);*/
		//스크롤 위치값과 현재문서 높이가 같으면 = 스크롤을 끝까지 내리면 
		if((documentHeight - scrollHeight) > 400 && (documentHeight - scrollHeight) < 450) {
			//이미지 로딩 함수 호출
			call_image(chg_no, category);
			console.log('받는 값 chg_no::::'+chg_no);
		}//if
		
		//상위 이동 버튼 
		if(scrollHeight > 750){
		 	$('.top_move_div').css('display','block');
		}else {
		 	$('.top_move_div').css('display','none');
		}//end if
    });