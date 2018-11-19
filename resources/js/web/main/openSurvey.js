$('section.survey').css('display','none');

$(document).ready(function(){
	
    $('.surveyWrap').css('display','none');
    
    //$('.conDiv').click(function(){
    $('#wrap').on('click', '.conDiv',function(){ //컨텐츠 클릭시 
    	
    	$('.surveyWrap1').css('display','');
		$('.top_move_btn').css('display','none')
		
		var contentsId = $(this).attr('id');
	 	var userId = $('#userId').val()
	 	console.log('openSurvey userId:::'+userId);
		var localValue = localStorage.getItem("contentsId"+contentsId)
		
		//web에서 toast 안됨
		alert('응답 이미지 원본을 보시려면\n이미지를 길게 눌러주세요');
		
		if(userId == 0){ //비로그인 유저일 경우
	   			show_result(contentsId, userId);
	    		//$('html, body').animate({scrollTop : offset.top}, 0);

	   			/*$.toast.config.align = 'center';
	   		    $.toast.config.width = 180;
   				$.toast('<p style="text-align:center">응답 이미지 원본을 보시려면</p><p style="text-align:center">이미지를 길게 눌러주세요</p>', {
   			        duration: 2000,
   			        type: 'info'
   			    });*/
   				
	 	    	var scrollHeight = $(window).scrollTop()
	 	    	var documentHeight = $(document).height(); 

	 	   	 	var offset = $("#" + contentsId).offset();
	 	   	 	console.log('offset');
	 	   	 	console.log(offset);
	 	   	 	

        		$('#wrap').animate({scrollTop : offset.top}, 0);
        		console.log({scrollTop : offset.top});
	   		
    	}else{ //로그인 유저일 경우
    		var surveyId = $('#'+contentsId + ' .surveyId').attr('id'); 
    		
    		var join_check_data = {"userId":userId, "surveyId":surveyId}
    		
    		$.ajax({
    	 		url : '/join_check_survey',
    	 		data : join_check_data,
    	 		success:function(data){	
    	 	    	var scrollHeight = $(window).scrollTop()
    	 	    	var documentHeight = $(document).height();
    	 	    	
    	 	   	 	var offset = $("#" + contentsId).offset();

    	 			if(data == 'join_ok'){ //최초 참여
    	 				if(contentsId == 301){ //추후 삭제
    	 	        		console.log('etc')
    	 	        		result_chart('312', 'etc');
    	 	        	}else{
    	 	        		$('html, body').animate({scrollTop : offset.top}, 0);
    	 	        		/* $('body').on('scroll touchmove mousewheel', function(e) {
    	 	        			   e.preventDefault();
    	 	        			   e.stopPropagation(); 
    	 	        			   return false;
    	 	        		}); */
    	 	        		$('.survey_category_button').css('display','none');
    	 	            	$('.header').css({'position':''}); //헤더 고정 풀기
    	 	            	//$('body').css('position','fixed'); //바디 고정
    	 	            	$('.flexslider').css('padding-top','0');	//상단 배너 padding 0
    	 	        		/*ido.setContentId(contentsId) //앱호출 */
    	 	            	console.log('C ID : '+contentsId);
    	 	            	console.log($('#'+contentsId).children('.cCategory').text());
    	 	            	$('section.survey').css('display','');
    	 	            	$('.surveyWrap').css('display','');
    	 	            	$('.surveyWrap1').css('display','');
    	 	            	
    	 	            	$.ajax({
    	 	              		url:'/m_contents_view?contentsId='+contentsId+'',
    	 	              		success:function(data){
    	 	                	console.log(data);
    	 	              		var survey = data.data1;  //설문 정보
    	 	              			
    	 	              			
   	 	              			//localstorage
   	 	              			
   	 	                		$('.surveyWrap').append(
   	 	                			'<div class="surveyContainer">'+
   	 	                			'<input type="hidden" id="contentsId" value="'+contentsId+'">'+
   	 	                          	'<div class="surveyHeader">'+
   	 	                              	'<div class="closeButton"><img src="images/main/survey/sub_close_bt.png"></div>'+
   	 	                                  '<div class="categoryButton">'+$('#'+contentsId).children('.cCategory').text()+'</div>'+
   	 	                                  /* '<div class="surveyTitle">'+data.data1[0].SURVEY_TITLE+'</div>'+ */
   	 	                              '</div>'+
   	 	                              '<div class="surveyContents"></div>'+
   	 	                           '<div class="surveyFooter"></div>'+
   	 	                          '</div><input type="hidden" class="contentsId" value="'+contentsId+'">'
   	 	                        );
    	 	         
	 	    	            	for(index in survey){
    	 	    	            	$.ajax({
    	 	    	             		url : '/upload/listSurveySecondTitle?surveyId='+data.data1[0].SURVEY_ID,
    	 	    	              		type : 'GET',
    	 	    	              		success : function(data){
    	 	    	              			$('#total').val(data.title.length) //설문조사의 갯수
    	 	    	                		console.log(data);
    	 	    	                		//title 값 for
    	 	    	                		for(var i in data.title){
    	 	    	                			//i값 숫자로 변환
    	 	    	    		                i = parseInt(i);
    	 	    	    		                console.log('survey_type_id::'+data.title[i].SURVEY_TYPE_ID);
    	 	    	    		                //답변 타입 텍스트:1, 이미지:2
    	 	    	    		                var answerType = data.title[i].SURVEY_ANSWER_TYPE;
    	 	    	    		                
    	 	    	    		                var idx=0;
    	 	    	    		                
    	 	    	    		                //첫번째 survey 
    	 	    	    		                var surveyType = data.title[i].SURVEY_TYPE;
    	 	    	    		                console.log('type : '+surveyType)
    	 	    	    					  	if(surveyType=='1'){  //양자택일형
    	 	    	    					    	console.log('양자택일형' + i);
    	 	    	    					    	var json = {title:data.title[i], reply:data.reply[i]};
    	 	    	    						    chooseType(json, i);
    	 	    	    					    	//console.log(json);
    	 	    	    					  	}else if(surveyType=='2'){  //단수선택형
    	 	    	    					  		console.log('단수선택형'+i);
    	 	    	    						    var json = {title:data.title[i], reply:data.reply[i]};
    	 	    	    						    singleType(json, i);
    	 	    	    					  	}else if(surveyType=='3'){  //복수선택형
    	 	    	    						    console.log('복수선택형'+i);
    	 	    	    						    var json = {title:data.title[i], reply:data.reply[i]};
    	 	    	    						    selectType(json, i);
    	 	    	    					  	}else if(surveyType=='4'){  //순위형
    	 	    	    					  		console.log('순위형'+i);
    	 	    	    						    var json = {title:data.title[i], reply:data.reply[i]};
    	 	    	    					    	rankingType(json, i); 
    	 	    	    					  	}else if(surveyType=='5'){  //별점채점형
    	 	    	    					  		console.log('별점채점형'+i);
    	 	    	    						    var json = {title:data.title[i], reply:data.reply[i]};
    	 	    	    						    starType(json, i);
    	 	    	    						    //textType(json, i);
    	 	    	    					  	}//if
    	 	    	    					  	
    	 	    	    					}//for  data.title
    	 	    	    					
    	 	    	                
    	 	    	    					/********** 다음버튼 클릭시 ***********/
    	 	    	    					$('.surveyFooter').on('click','.next_bt',function(){
    	 	    	    						var nextId = $(this).attr('id').split('nextBtn')[1];
    	 	    	    						$('#clearBtn'+nextId+'').remove();
    	 	    	    						$('#nextBtn'+nextId+'').remove();
    	 	    	    						$('#showChart'+nextId+'').remove();
    	 	    	    						
    	 	    	    						var formLength = $('.surveyContents form').size(); //클릭된 form 사이즈
    	 	    	    						var surveyCount = $(this).attr('id').split('nextBtn')[1]; // 현재 다음 버튼
    	 	    	    						var surveyType = $('#surveyType'+surveyCount).val();
    	 	    	    						if(surveyCount < formLength){
    	 	    	    							$(this).css('display','none');
    	 	    	    							//현재 다음 버튼
    	 	    	    							console.log('surveyCount : '+surveyCount)
    	 	    	    							$('#fBtn'+(parseInt(surveyCount)+1)).css('display','none');
    	 	    	    							$('#reviseBtn'+(parseInt(surveyCount))).css('display','none');
    	 	    	    							// 다음 버튼
    	 	    	    							$('#fBtn'+(parseInt(surveyCount)+1)).css('display','');
    	 	    	    							$('#reviseBtn'+(parseInt(surveyCount)+1)).css('display','');
    	 	    	    							
    	 	    	    							$('#surveyForm'+surveyCount).css('display','none');
    	 	    	    							$('#surveyForm'+(parseInt(surveyCount)+1)).css('display','');
    	 	    	    							$('#surveyCount').val();
    	 	    	    							
    	 	    	    							if(surveyType == 1){ //양자택일형
    	 	    	    			                  	inputChoose('next', surveyCount);
    	 	    	    			                  	var contsRst = contsRstVal.getValue();
    	 	    	    			                }else if(surveyType==2){ //단수선택형
    	 	    	    			                	
    	 	    	    			                  	inputSingle('next', surveyCount);
    	 	    	    			                }else if(surveyType==3){//복수선택형
    	 	    	    			                  	inputSelect('next', surveyCount);
    	 	    	    			                }else if(surveyType==4){//순위형
    	 	    	    			                  	console.log('다음 버튼 클릭 순위형');
    	 	    	    			                	inputRank('next', surveyCount);
    	 	    	    			                }else if(surveyType==5){//별점채점형
    	 	    	    			                	console.log(surveyCount);
    	 	    	    			                	inputStar('next', surveyCount);
    	 	    	    			                  	var starScore = starScoreObj.getValue();
    	 	    	    			                  	console.log('starScore::::::????'+starScore);
    	 	    	    			                  	if(starScore==''){
    	 	    	    			                    	alert('해당 답변에 별점을 주시기 바랍니다.');
    	 	    	    			                    	return false;
    	 	    	    			                  	}
    	 	    	    			                  	//inputText('next', idx);
    	 	    	    			                }
    	 	    	    						}else{ //설문 마지막
    	 	    	    							if(surveyType == 1){//양자택일형
    	 	    	    								inputChoose('finish', surveyCount);
    	 	    	    		                    	var contsRst = contsRstVal.getValue();
    	 	    	    		                    	console.log('contsRst:::::::??????'+contsRst);
    	 	    	    		                    	//result_chart(); //결과화면 차트 
    	 	    	    		                  	}else if(surveyType==2){//단수선택형
    	 	    	    		                  		console.log('단수선택 마지막 : '+surveyCount);
    	 	    	    		                  		inputSingle('finish', surveyCount);
    	 	    	    						     	/* reload_main();	  */
    	 	    	    						     	//result_chart(); //결과화면 차트 
    	 	    	    		                  	}else if(surveyType==3){//복수선택형
    	 	    	    		                    	inputSelect('finish', surveyCount);
    	 	    	    						     	/* reload_main();	  */
    	 	    	    						     	//result_chart(); //결과화면 차트 
    	 	    	    		                  	}else if(surveyType==4){//순위형
    	 	    	    		                  		var count = 0;
    	 	    	    		                  		$('.rank_img').each(function(index,r){
    	 	    	    		                  			count++;
    	 	    	    		                  		})
    	 	    	    		                  		if(count == 3){
    	 	    	    		                  			inputRank('finish', surveyCount);
    	 	    	    				                    //result_chart(); //결과화면 차트 	
    	 	    	    		                  		}else{
    	 	    	    		                  			alert('순위는 3위까지 입니다')
    	 	    	    		                  		}
    	 	    	
    	 	    	    		                  	}else if(surveyType==5){//별점채점형
    	 	    	    			                    inputStar('finish', surveyCount); 
    	 	    	    			                   /*  var starScore = starScoreObj.getValue();
    	 	    	    			                    console.log('starScore::::::????'+starScore); */
    	 	    	    		                  	}
    	 	    	    						}
    	 	    	                				});//end next click
    	 	    	    					/********** 다음버튼 클릭시 ***********/
    	 	    	                
    	 	    	    					/* *********** 수정버튼 클릭시 *********** */
    	 	    	    					$('.surveyHeader').on('click','.revise_bt',function(){
    	 	    	    						var formLength = $('.surveyContents form').size(); //클릭된 form 사이즈
    	 	    	    						var surveyCount = $(this).attr('id').split('reviseBtn')[1]; // 현재 다음 버튼
    	 	    	    						var surveyType = $('#surveyType'+surveyCount).val();
    	 	    	    						
    	 	    	    						if(surveyCount == 2){
    	 	    	    							//현재 수정 버튼
    	 	    	    							$('#nextBtn'+surveyCount).css('display','none');
    	 	    	    							$('#reviseBtn'+surveyCount).css('display','none');
    	 	    	    							// 이전 수정 버튼
    	 	    	    							$('#nextBtn'+(parseInt(surveyCount)-1)).css('display','');
    	 	    	    							$('#surveyForm'+surveyCount).css('display','none');
    	 	    	    							$('#surveyForm'+(parseInt(surveyCount)-1)).css('display','');
    	 	    	    						}else{
    	 	    	    							//현재 수정 버튼
    	 	    	    							$('#nextBtn'+surveyCount).css('display','none');
    	 	    	    							$('#reviseBtn'+surveyCount).css('display','none');
    	 	    	    							// 이전 수정 버튼
    	 	    	    							$('#nextBtn'+(parseInt(surveyCount)-1)).css('display','');
    	 	    	    							$('#reviseBtn'+(parseInt(surveyCount)-1)).css('display','');
    	 	    	    							
    	 	    	    							$('#surveyForm'+surveyCount).css('display','none');
    	 	    	    							$('#surveyForm'+(parseInt(surveyCount)-1)).css('display','');
    	 	    	    						}
    	 	    	    						
    	 	    	    						if(surveyType == 1){ //양자택일형
    	 	    	    		                  	inputChoose('revise', surveyCount);
    	 	    	    		                  	var contsRst = contsRstVal.getValue();
    	 	    	    		                }else if(surveyType==2){ //단수선택형
    	 	    	    		                  	inputSingle('revise', surveyCount);
    	 	    	    		                }else if(surveyType==3){//복수선택형
    	 	    	    		                  	inputSelect('revise', surveyCount);
    	 	    	    		                }else if(surveyType==4){//순위형
    	 	    	    		                  	console.log('다음 버튼 클릭 순위형');
    	 	    	    		                	inputRank('revise', surveyCount);
    	 	    	    		                }else if(surveyType==5){//별점채점형
    	 	    	    		                	inputStar('revise', surveyCount);
    	 	    	    		                  	var starScore = starScoreObj.getValue();
    	 	    	    		                  	console.log('starScore::::::????'+starScore);
    	 	    	    		                  	if(starScore==''){
    	 	    	    		                    	alert('해당 답변에 별점을 주시기 바랍니다.');
    	 	    	    		                    	return false;
    	 	    	    		                  	}
    	 	    	    		                  	//inputText('next', idx);
    	 	    	    		                }
    	 	    	                		});
    	 	    	    					/* *********** 수정버튼 클릭시 *********** */
    	 	    	    					
    	 	    	    					
    	 	    	    					
    	 	    	    				},//end success
   	 	    	              			error : function(error){
   	 	    	              			}
    	 	    	            		});//end ajax 
    	 	    	
    	 	    	          		} /*surveyFor문 끝*/
    	 	    	          		
    	 	    	          		//댓글 수
    	 	    	          		$('.reply_cnt').html(data.reply.length);
    	 	    	          		
    	 	    	          		$('.reply_container').on('click', function(){//댓글로 이동
    	 	    	          			console.log('댓글 클릭!');
    	 	    	          			var contents_id = data.data1[0].CONTENTS_ID;
    	 	    	          			console.log('contents_id::'+contents_id);
    	 	    	          			location.href = 'reply/view_reply?contents_id='+contents_id;
    	 	    	          		});
    	 	    	    			
    	 	    	    		}//end success
    	 	    	    	});//end ajax  
    	 	        	}
    	 			}else{ //이미 참여함
    	 				show_result(contentsId);
    		    		$('html, body').animate({scrollTop : offset.top}, 0);
    	 			}
    	 		}
    	 	}) // ajax : join_check_survey 
    	}//비로그인 끝 	 
      }) /*conDiv Click function 끝*/
      $('.surveyWrap').on('click', '.closeButton',function(){
        $('.surveyWrap').empty();
        $('section.survey').css('display','none'); 
        $('.surveyWrap').css('display','none'); 
        $('.survey_category_button').css('display','')
      })
  /*---------------------------------------------------------*/
 })
 