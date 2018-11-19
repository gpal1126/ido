$(document).ready(function () {
    //Wizard
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {

        var $target = $(e.target);
    
        if ($target.parent().hasClass('disabled')) {
            return false;
        }
    });

    $(".next-step").click(function (e) {
        var $active = $('.wizard .nav-tabs li.active');
        $active.next().removeClass('disabled');
        nextTab($active);

    });
    $(".prev-step").click(function (e) {

        var $active = $('.wizard .nav-tabs li.active');
        prevTab($active);

    });
    
});

function nextTab(elem) {
    $(elem).next().find('a[data-toggle="tab"]').click();
}
function prevTab(elem) {
    $(elem).prev().find('a[data-toggle="tab"]').click();
}


$(document).ready(function(){
	console.log($("a[id*='m']").attr('id'));
	$('.surveyWrap').css('display','none');
	$('.wrap1').css('display','none');
	
	$('a[id*=manage]').click(function(){
		var manage_id = $(this).attr('id').split('manage_')[1]; //슬라이드바에 있는 id값들 뽑아오는 부분.
		switch(manage_id){
			case 'contents':
				$('#contents_table').css('display', '')
				break;
			case 'coupon':
				console.log('쿠폰');
				break;
			case 'advertisement':
				console.log('광고');
				break;
			case 'survey':
				console.log('서베이');
				break;	
		}
	});


	//체크박스 전체 체크 function
	$("#checkAll").change(function () {
		console.log('t')
	    $("input:checkbox").prop('checked', $(this).prop("checked"));
	});

	

	//delete 컨텐츠 버튼 클릭
	$('#delete_contents').click(function(){
		if (confirm("정말 삭제하시겠습니까??") == true){    //확인
			if (confirm("해당 컨텐츠가 영구히 삭제됩니다. 정말 삭제하시겠습니까??") == true){
				$("input[name=box]:checked").each(function() { //체크박스에 체크된 id값 추출을 위한 function
					var test = $(this).attr('id');
					console.log(test);
					var json = {"contents_id":test}
					$.ajax({
						url:'/upload/delete_contents',
						data : json,
						success:function(){
							console.log('ff');
							window.location.reload();
						}
					})
				});
			}else{
				return;
			}
		}else{   //취소
		    return;
		}
	});
	
	//등록
	$('#new_contents').click(function(){
		var partnerId = $('#partnerId').val();
		location.href="/m_survey/reg_survey?contents_id=new&partnerId="+partnerId;
	});

	$('#m_new_contents').click(function(){
		var partnerId = $('#partnerId').val();
		location.href="/m_survey/reg_survey?contents_id=new&partnerId="+partnerId;
	});

	// 수정 - > 보기 클릭시 새창 띄우는 function
	$('.view_conts').click(function(){
		var update_id = $(this).attr('id').split('update_')[1]
		console.log($(this).attr('id'));
		window.open("/upload/builder_thumbnail?contents_id="+update_id+"", "에디터 새창", "width=1100, height=1100, toolbar=no, menubar=no, scrollbars=no, resizable=yes, top=-600px" );  
	});

	$(function () {
	    $(".tab_content").hide();
	    $(".tab_content:first").show();

	    $("ul.tabs li").click(function () {
	        $("ul.tabs li").removeClass("active").css("color", "#333");
	        //$(this).addClass("active").css({"color": "darkred","font-weight": "bolder"});
	        $(this).addClass("active").css("color", "darkred");
	        $(".tab_content").hide()
	        var activeTab = $(this).attr("rel");
	        $("#" + activeTab).fadeIn();
	    });
	});
	
	function cutString(str, len){//글자 자르기 func
		if(str.length > len){
			str = str.substring(0, len)+'..';
		}
		return str;
	}
	
	$('.surveyWrap').on('click', '.closeButton, .finish_bt', function(){ //미리보기 닫기
		$('.surveyWrap').empty();
		$('.surveyWrap').css('display','none');
		$('body').css('position',''); //바디 고정 풀기
	});
	
	
	$('.revise_btn').click(function(){//수정버튼 클릭
		//return false; //수정 클릭 방지
		$('#listWrap').css('display','');
		var contentsId = $(this).attr('id').split('_')[0];
		console.log('contentsId::'+contentsId);
		var surveyId = $(this).attr('id').split('_')[1];
		console.log('surveyId::'+surveyId);
		var partnerId = $('#partnerId').val(); 
		$.ajax({
			//url : '/selectTempStore?surveyId='+$('#surveyId_title').val()+'',
			url : '/upload/listSurveySecondTitle?surveyId='+surveyId+'',
			type : 'GET',
			success : function(data){
				console.log(data);
				//title 값 for
				for(var i in data.title){
					//i값 숫자로 변환
					i = parseInt(i);  
					
					//답변 타입 텍스트:1, 이미지:2
					var answerType = data.title[i].SURVEY_ANSWER_TYPE;
					
					//설문 유형 타입
					var surveyType = data.title[i].SURVEY_TYPE;
					var surveyTypeTxt = '';
					if(surveyType=='1'){
						surveyTypeTxt = '양자택일형';
					}else if(surveyType=='2'){
						surveyTypeTxt = '단수선택형';
					}else if(surveyType=='3'){
						surveyTypeTxt = '복수선택형';
					}else if(surveyType=='4'){
						surveyTypeTxt = '순위형';
					}else if(surveyType=='5'){
						surveyTypeTxt = '별점채점형';
					}//if
					
					//설문조사 조회
					var listSurvey = '';
					
					listSurvey += ''+
									'<div class="survey_conts_div" id="surveyContsDiv'+(i+1)+'">'+
										'<input type="hidden" id="surveyAnswerType'+(i+1)+'" name="surveyAnswerType" value="'+answerType+'">'+
										'<input type="hidden" id="surveyTypeId'+(i+1)+'" name="surveyTypeId" value="'+data.title[i].SURVEY_TYPE_ID+'">'+
										'<input type="hidden" id="surveyType'+(i+1)+'" name="surveyType" value="'+data.title[i].SURVEY_TYPE+'">'+
										'<div class="conts_img_div">'+
										'';
										
										
					//$('#listDiv').append(listSurvey);
					var j=0;
	 				//contents 값 for
					if( surveyType != '5' ){ //별점형을 제외한 유형 
		 		  		for(j in data.reply[i]){
		 		  			j = parseInt(j);
		 		  			var contsImg = '';
		 		  			listSurvey +=	'<div class="contsDiv'+(i+1)+'" id="contsDiv'+(i+1)+'_'+(j+1)+'" style="">'+
		 			  							'<input type="hidden" id="surveyContentsId'+(j+1)+'" name="surveyContentsId" value="'+data.reply[i][j]['SURVEY_CONTENTS_ID']+'">';
		 			  		if(answerType=='1'){
		 			  			listSurvey +=	//'<div></div>'+
		 						  				'<div class="contsTxtDiv">'+
		 							  				'<span style="margin-left:25px;background:url(/images/common/builder/survey/reply_bullet.png) no-repeat; width:4px;height:4px; display:inline-block; overflow: hidden;vertical-align: middle;"></span>'+
		 							  				'<span class="contsTxtSpan" id="contentsSpan'+(i+1)+'_'+(j+1)+'" >'+data.reply[i][j]['SURVEY_CONTENTS']+'</span>'+
		 						  				'</div>';
		 			  		}
		 			  		if(answerType=='2'){
		 			  			listSurvey +=	''+	
		 							  			'<div class="img_div">'+
		 			  								'<div class="list_img" id="img'+(i+1)+'_'+(j+1)+'" style="background: url('+data.reply[i][j]['SURVEY_CROP_IMAGE']+'); width:100%; height:100%; background-size: cover; background-position: 0px; background-repeat: no-repeat;"></div>'+
		 			  							'</div>';
		 				  						/* '<div class="contsTxtDiv">'+
		 				  							'<span style="margin-left:25px;background:url(/images/common/builder/survey/reply_bullet.png) no-repeat; width:4px;height:4px;display: inline-block; overflow: hidden;vertical-align: middle;"></span>'+
		 				  							'<span class="contsTxtSpan" id="contentsSpan'+(i+1)+'_'+(j+1)+'" >'+data.reply[i][j]['SURVEY_CONTENTS']+'</span>'+
		 				  						'</div>'; */
		 			  		}//if			
		 			  		listSurvey +=	'</div>';
		 			  					
		 				}//for
					}else if( surveyType == '5' ){ //별점형일 경우
						if(surveyType=='5'){
							listSurvey +=	'<div class="contsDiv'+(i+1)+'" id="contsDiv'+(i+1)+'_'+(j+1)+'" style="">'+
	  											'<input type="hidden" id="surveyContentsId'+(j+1)+'" name="surveyContentsId" value="'+data.reply[i][j]['SURVEY_CONTENTS_ID']+'">';
							listSurvey +=		'<div class="img_div">'+
	 												'<div class="list_img" id="img'+(i+1)+'" style="background: url('+data.title[i]['SECOND_SURVEY_CROP_IMAGE']+'); width:100%; height:100%; background-size: cover; background-position: 0px; background-repeat: no-repeat;"></div>'+
	 											'</div>';
							listSurvey +=	'</div>';
	 					}
					}
	 		  		
	 		  		var title = data.title[i].SECOND_SURVEY_TITLE;
	 		  		//휴대폰 기종 
					var ua = navigator.userAgent.toLowerCase();

					if (ua.indexOf('ipad') > -1){//ipad
						console.log('ios');
						listSurvey += 		'</div>';
						listSurvey +=		'<div class="conts_txt_div">'+
												'<div class="survey_type_div">'+
													'<div class="survey_type_btn">설문유형</div>'+
													'<span class="survey_type_txt">'+surveyTypeTxt+'</span>'+
												'</div>'+
												'<div class="survey_title_div">'+
													'<div class="survey_title_btn">제목</div>'+
													'<span class="survey_title">'+cutString(title, 15)+'</span>'+
												'</div>'+
											'</div>';
											
						listSurvey += 	'</div>';
					}else {				
						listSurvey += 		'</div>';
						listSurvey +=		'<div class="conts_txt_div">'+
												'<div class="survey_type_div">'+
													'<div class="survey_type_btn">설문유형</div>'+
													'<span class="survey_type_txt">'+surveyTypeTxt+'</span>'+
												'</div>'+
												'<div class="survey_title_div">'+
													'<div class="survey_title_btn">제목</div>'+
													'<span class="survey_title">'+cutString(title, 7)+'</span>'+
												'</div>'+
											'</div>';
											
						listSurvey += 	'</div>';
					}
					
					//설문리스트 구분선
					listSurvey += 	''+
									'<hr class="hr_line">'+
									'';
					
					$('#listDiv').append(listSurvey);
					
					//이미지 4개씩 뿌리기
					$('#contsDiv'+(i+1)+'_5 .img_div').css('clear', 'both');
					
					//리스트 종료
			  		$('.list_wrap').on('click', '.close_btn', function(){
			  			$('.list_wrap').css('display','none');
			  			$('.list_wrap #listDiv').empty();
			  		});
			  		
			  		//console.log('(i+1) 하나::'+(i+1));
			  		(function(i){
			  			//설문 컨텐츠 클릭
			  			$('#listDiv').on('click', '#surveyContsDiv'+(i+1)+'', function(){
				  			//console.log('(i+1)::'+(i+1));
				  			var surveyTypeId = $('#surveyTypeId'+(i+1)+'').val();
				  			console.log('설문 컨텐츠 클릭');
				  			console.log('surveyTypeId::'+surveyTypeId);
				  			location.href='/m_survey/update_survey_type?partnerId='+partnerId+'&contentsId='+contentsId+'&surveyTypeId='+surveyTypeId;
			  			});
			  		})(i);
				}//for
					
			},//end success
			error : function(error){
				console.log(error);
			}
		});//end ajax
		
		$('.add_survey').click(function(){//추가하기 버튼
			location.href='/m_survey/reg_survey_type?contentsId='+contentsId+'&partnerId='+$('#partnerId').val()+'&surveyId='+surveyId;
		});//end add_survey 버튼 클릭
		
	});
	
	//설문조사 리스트 조회하기
	function selectSurveyTitle(surveyId){
		//var surveyId = $('#surveyId').val();
		console.log('surveyId::'+surveyId);
		$.ajax({
			//url : '/selectTempStore?surveyId='+$('#surveyId_title').val()+'',
			url : '/upload/listSurveySecondTitle?surveyId='+surveyId+'',
			type : 'GET',
			success : function(data){
				console.log(data);
				//title 값 for
				for(var i in data.title){
					//i값 숫자로 변환
					i = parseInt(i);  
					
					//답변 타입 텍스트:1, 이미지:2
					var answerType = data.title[i].SURVEY_ANSWER_TYPE;
					
					//설문 유형 타입
					var surveyType = data.title[i].SURVEY_TYPE;
					var surveyTypeTxt = '';
					if(surveyType=='1'){
						surveyTypeTxt = '순위형';
					}else if(surveyType=='2'){
						surveyTypeTxt = '별점형';
					}else if(surveyType=='3'){
						surveyTypeTxt = '이중택일형';
					}else if(surveyType=='4'){
						surveyTypeTxt = '선택형';
					}else if(surveyType=='5'){
						surveyTypeTxt = '텍스트형';
					}//if
					
					//설문조사 조회
					var listSurvey = '';
					
					listSurvey += ''+
									'<div class="survey_conts_div" id="surveyContsDiv">'+
										'<input type="hidden" id="surveyAnswerType'+(i+1)+'" name="surveyAnswerType" value="'+answerType+'">'+
										'<input type="hidden" id="surveyTypeId'+(i+1)+'" name="surveyTypeId" value="'+data.title[i].SURVEY_TYPE_ID+'">'+
										'<input type="hidden" id="surveyType'+(i+1)+'" name="surveyType" value="'+data.title[i].SURVEY_TYPE+'">'+
										'<div class="conts_img_div">'+
										'';
										
										
					//$('#listDiv').append(listSurvey);
					var j=0;
	 				//contents 값 for
	 		  		for(j in data.reply[i]){
	 		  			j = parseInt(j);
	 		  			var contsImg = '';
	 		  			listSurvey +=	'<div class="contsDiv'+i+'" id="contsDiv'+(i+1)+'_'+(j+1)+'" style="">'+
	 			  							'<input type="hidden" id="surveyContentsId'+(j+1)+'" name="surveyContentsId" value="'+data.reply[i][j]['SURVEY_CONTENTS_ID']+'">';
	 			  		if(answerType=='1'){
	 			  			listSurvey +=	//'<div></div>'+
	 						  				'<div class="contsTxtDiv">'+
	 							  				'<span style="margin-left:25px;background:url(/images/common/builder/survey/reply_bullet.png) no-repeat; width:4px;height:4px; display:inline-block; overflow: hidden;vertical-align: middle;"></span>'+
	 							  				'<span class="contsTxtSpan" id="contentsSpan'+(i+1)+'_'+(j+1)+'" >'+data.reply[i][j]['SURVEY_CONTENTS']+'</span>'+
	 						  				'</div>';
	 			  		}
	 			  		if(answerType=='2'){
	 			  			listSurvey +=	
	 							  			/* '<div class="delSurContsDiv"><img class="deleteConts'+i+'" id="deleteConts'+(i+1)+'_'+(j+1)+'" src="/images/common/builder/survey/delBtn.png" style="width:15px; height:15px;" onclick="delConts('+i+','+j+', '+data.reply[i][j]['SURVEY_CONTENTS_ID']+')"></div> '+ */
	 							  			'<div class="img_div">'+
	 							  				'<div class="img" id="img'+(i+1)+'_'+(j+1)+'" style="background: url('+data.reply[i][j]['SURVEY_CROP_IMAGE']+'); width:100%; height:100%; background-size: cover; background-position: 0px; background-repeat: no-repeat;"></div>'+
	 							  			'</div>'+
	 				  						/* '<div class="contsTxtDiv">'+
	 				  							'<span style="margin-left:25px;background:url(/images/common/builder/survey/reply_bullet.png) no-repeat; width:4px;height:4px;display: inline-block; overflow: hidden;vertical-align: middle;"></span>'+
	 				  							'<span class="contsTxtSpan" id="contentsSpan'+(i+1)+'_'+(j+1)+'" >'+data.reply[i][j]['SURVEY_CONTENTS']+'</span>'+
	 				  						'</div>'; */
	 				  						'';
	 			  		}//if			
	 			  		listSurvey +=	'</div>';
	 			  					
	 				}//for
									
					listSurvey += 		'</div>';
					listSurvey +=		'<div class="conts_txt_div">'+
											'<div class="survey_type_div">'+
												'<div class="survey_type_btn">설문유형</div>'+
												'<span class="survey_type_txt">'+surveyTypeTxt+'</span>'+
											'</div>'+
											'<div class="survey_title_div">'+
												'<div class="survey_title_btn">제목</div>'+
												'<span class="survey_title">'+data.title[i].SECOND_SURVEY_TITLE+'</span>'+
											'</div>'+
										'</div>';
										
					listSurvey += 	'</div>';
					
					$('.list_wrap').append(listSurvey);
					//$('.conts_img_div').append(listSurvey);
	 				
					//리스트 종료
			  		$('#makeq').on('click', '.close_btn', function(){
			  			$('.list_wrap').css('display','none');
			  			$('.list_wrap').empty();
			  		});
			  		
					//설문조사 조회 html append
					//임시저장 wrap
					$('#surveyDiv'+i+'').wrap('<a href="#" id="atag'+i+'" onclick="unwrapFunc('+i+','+j+'); return false;" style="text-decoration:none;"></a>');
					
				}//for
					
			},//end success
			error : function(error){
				console.log(error);
			}
		});//end ajax
	}
	
	
	
	//***************************************************************************************************
	/*$('.conDiv').click(function(){//컨텐츠 클릭시
      	$('.survey_category_button').css('display','none');
      	$('.header').css({'position':''}); //헤더 고정 풀기
      	$('body').css('position','fixed'); //바디 고정
      	console.log($(this).attr('id'));
      	var contentsId = $(this).attr('id');

      	ido.setContentId(contentsId) //앱호출 

      	$('.surveyWrap').css('display','');
      	
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
                            '<div class="surveyTitle">'+data.data1[0].SURVEY_TITLE+'</div>'+ 
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
								    result_chooseType(json, i, userId);
							    	//console.log(json);
							  	}else if(surveyType=='2'){  //단수선택형
							  		console.log('단수선택형'+i);
								    var json = {title:data.title[i], reply:data.reply[i]};
								    result_singleType(json, i, userId);
							  	}else if(surveyType=='3'){  //복수선택형
								    console.log('복수선택형'+i);
								    var json = {title:data.title[i], reply:data.reply[i]};
								    result_selectType(json, i, userId);
							  	}else if(surveyType=='4'){  //순위형
							  		console.log('순위형'+i);
							  	
								    var json = {title:data.title[i], reply:data.reply[i]};
								    console.log(json)
								    result_rankingType(json, i, userId); 
							  	}else if(surveyType=='5'){  //별점채점형
							  		console.log('별점채점형'+i);
								    var json = {title:data.title[i], reply:data.reply[i]};
								    result_starType(json, i, userId);
								    //textType(json, i);
							  	}//if
							  	
							}//for  data.title
    					

        					/********** 다음버튼 클릭시 ***********//*
                
	    					 *********** 수정버튼 클릭시 *********** 
	    					
	    					 < 버튼 클릭시 	 
	    					$('.surveyHeader').on('click','.revise_bt',function(){
	    						var formLength = $('.surveyContents form').size(); //클릭된 form 사이즈
	    						var surveyCount = $(this).attr('id').split('reviseBtn')[1]; // 현재 다음 버튼
	    						var surveyType = $('#surveyType'+surveyCount).val();
	    						console.log(surveyCount)
	    						
								$('#nBtn'+surveyCount).css('display','none');
	    						$('#reviseBtn'+surveyCount).css('display','none');
	    						$('#sBtn'+surveyCount).css('display','none'); //통계보기
	    						$('#surveyForm'+surveyCount).css('display','none');
	    						
	    						
	    						$('#reviseBtn'+(parseInt(surveyCount)-1)).css('display','');
	    						$('#nBtn'+(parseInt(surveyCount)-1)).css('display','');
	    						$('#sBtn'+(parseInt(surveyCount)-1)).css('display',''); //통계보기
	    						$('#surveyForm'+(parseInt(surveyCount)-1)).css('display','');
	                		});
							
	                				
	                		 > 버튼 클릭시 	                				
	    					$('.surveyHeader').on('click','.n_bt',function(){
	    						var formLength = $('.surveyContents form').size(); //클릭된 form 사이즈
	    						var surveyCount = $(this).attr('id').split('nBtn')[1]; // 현재 다음 버튼
	    						var surveyType = $('#surveyType'+surveyCount).val();
	    						
	    						console.log('surveyCount : '+surveyCount)
	    						
								$('#nBtn'+surveyCount).css('display','none');
								$('#sBtn'+surveyCount).css('display','none'); //통계보기
								$('#surveyForm'+surveyCount).css('display','none');
								
								
								$('#reviseBtn'+(parseInt(surveyCount)+1)).css('display',''); // < (이전버튼)
								$('#nBtn'+(parseInt(surveyCount)+1)).css('display','');
								$('#sBtn'+(parseInt(surveyCount)+1)).css('display',''); //통계보기
								$('#surveyForm'+(parseInt(surveyCount)+1)).css('display','');
	
	                		});
	    					 *********** 수정버튼 클릭시 *********** 
	    					
	    					/********** 통계보기 클릭시 ***********//*
	    					$('.surveyWrap').on('click','.show_chart',function(){
	    						console.log('통계보기')
	    						var nextId = $(this).attr('id').split('sBtn')[1];
	    						var formLength = $('.surveyContents form').size(); //클릭된 form 사이즈
	    						var surveyCount = $(this).attr('id').split('sBtn')[1]; // 현재 다음 버튼
	    						var surveyType = $('#surveyType'+surveyCount).val();
	    						
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
	    						
	                		});//end next click
	    					/********** 통계보기 클릭시 ***********//*
	    					
	    				},//end success																
	          			error : function(error){
	          			}
            		});//end ajax 

          		} surveyFor문 끝
	          		
          		//댓글 수
          		$('.reply_cnt').html(data.reply.length);
          		
          		$('.reply_container').on('click', function(){//댓글로 이동
          			console.log('댓글 클릭!');
          			var contents_id = data.data1[0].CONTENTS_ID;
          			console.log('contents_id::'+contents_id);
          			location.href = 'reply/m_view_reply?contents_id='+contents_id;
          		});
	    			
	    	}//end success
	    });//end ajax  
      	
    }); conDiv Click function 끝*/
	
	
})


