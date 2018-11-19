
	
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
	
	function getUrlParameter(sParam){ //View에 URL에 접근하여 get parameter값을 가져옴
		var sPageURL = window.location.search.substring(1);
	  	var sURLVariables = sPageURL.split('&');
	  	for (var i = 0; i < sURLVariables.length; i++) {
	    	var sParameterName = sURLVariables[i].split('=');
        	if (sParameterName[0] == sParam) {
          	return sParameterName[1];
        	}//if
	  	}//for
	}

	//설문조사 리스트 조회하기
	function selectSurveyTitle(){
		$.ajax({
			//url : '/selectTempStore?surveyId='+$('#surveyId_title').val()+'',
			url : '/upload/listSurveySecondTitle?surveyId='+$('#surveyId').val()+'',
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
				 	var selectSurvey = ''+
				 					   '<div id="surveyDiv'+i+'" style="border:0px solid #000;" class="survey_tb01">'+
				 					   	'<div class="delSurTypeDiv"><img class="deleteSurveyType'+i+'" id="deleteSurveyType'+(i+1)+'" src="/images/common/builder/survey/survey_list_closebt.gif" style="margin-right:5px;" onclick="delSurveyType('+i+','+data.title[i].SURVEY_TYPE_ID+')"></div>'+
					 					   	'<input type="hidden" id="surveyAnswerType'+(i+1)+'" name="surveyAnswerType" value="'+answerType+'">'+
											'<span id="surveyTypeIdSpan'+(i+1)+'"><input type="hidden" id="surveyTypeId'+(i+1)+'" name="surveyTypeId" value="'+data.title[i].SURVEY_TYPE_ID+'"/></span>'+
											'<div class="surveyTypeDiv"><span class="surveyTypeTxt">'+surveyTypeTxt+'</span></div>'+
											'<input type="hidden" id="surveyType'+(i+1)+'" name="surveyType" value="'+data.title[i].SURVEY_TYPE+'">'+
				  							'<div class="surveyTitleDiv">';
				 	if(surveyType=='2'){
				 		selectSurvey +=			'<div class="secSvyTitleDiv">'+
				 									'<img class="secSvyTitleImg" src="'+data.title[i]['SECOND_SURVEY_IMAGE_PATH']+'" id="secSvyTitleImg'+(i+1)+'"/>'+
				 								'</div>';
				 	}//if
				  	selectSurvey +=				'<span style="margin-left:20px;background:url(/images/common/builder/survey/circle_bullet.png) no-repeat; width:14px;height:14px;display: inline-block; overflow: hidden;vertical-align: middle;"></span>'+
				  								'<span class="titleSpan" id="titleSpan'+(i+1)+'" >'+data.title[i].SECOND_SURVEY_TITLE+'</span>'+
				  							'</div>'+
				  							'<div></div><br/>';
					var j=0;
					//contents 값 for
			  		for(j in data.reply[i]){
			  			j = parseInt(j);
						var img = data.reply[i][j]['SURVEY_IMAGE_PATH']; 
				  		selectSurvey +=	'<div class="contsDiv'+i+'" id="contsDiv'+(i+1)+'_'+(j+1)+'">'+
				  							'<input type="hidden" id="surveyContentsId'+(j+1)+'" name="surveyContentsId" value="'+data.reply[i][j]['SURVEY_CONTENTS_ID']+'">';
				  		if(answerType=='1'){
				  			selectSurvey +=	//'<div></div>'+
							  				'<div class="contsTxtDiv">'+
								  				'<span style="margin-left:25px;background:url(/images/common/builder/survey/reply_bullet.png) no-repeat; width:4px;height:4px; display:inline-block; overflow: hidden;vertical-align: middle;"></span>'+
								  				'<span class="contsTxtSpan" id="contentsSpan'+(i+1)+'_'+(j+1)+'" >'+data.reply[i][j]['SURVEY_CONTENTS']+'</span>'+
							  				'</div>';
				  		}
				  		if(answerType=='2'){
					  		selectSurvey +=	
								  			'<div class="delSurContsDiv"><img class="deleteConts'+i+'" id="deleteConts'+(i+1)+'_'+(j+1)+'" src="/images/common/builder/survey/delBtn.png" style="width:15px; height:15px;" onclick="delConts('+i+','+j+', '+data.reply[i][j]['SURVEY_CONTENTS_ID']+')"></div> '+
					  						'<img class="img" src="'+data.reply[i][j]['SURVEY_IMAGE_PATH']+'" id="img'+(i+1)+'_'+(j+1)+'" style="width:200px; height:160px;"/>'+
					  						'<div class="contsTxtDiv">'+
					  							'<span style="margin-left:25px;background:url(/images/common/builder/survey/reply_bullet.png) no-repeat; width:4px;height:4px;display: inline-block; overflow: hidden;vertical-align: middle;"></span>'+
					  							'<span class="contsTxtSpan" id="contentsSpan'+(i+1)+'_'+(j+1)+'" >'+data.reply[i][j]['SURVEY_CONTENTS']+'</span>'+
					  						'</div>';	
				  		}//if			
				  						'</div>'; 
					}//for
			  	
			  		selectSurvey += '</div>';
					 
					//설문조사 조회 html append
					$('#listDiv').append(selectSurvey);
					//임시저장 wrap
					$('#surveyDiv'+i+'').wrap('<a href="#" id="atag'+i+'" onclick="unwrapFunc('+i+','+j+'); return false;" style="text-decoration:none;"></a>');
					
				}//for
					
			},//end success
			error : function(error){
				console.log(error);
			}
		});//end ajax
	}

	//surveyId 값
	//var surveyId = getUrlParameter('surveyId');
	var surveyId = $('#surveyId').val();
	console.log('surveyId::'+surveyId);
	
	var btn1Cnt = 0;	//순위형 클릭수 선언
	var btn2Cnt = 0;	//벌점형 클릭수 선언
	var btn3Cnt = 0;	//택일형 클릭수 선언
	var btn4Cnt = 0;	//선택형 클릭수 선언
	var btn5Cnt = 0;	//텍스트형 클릭수 선언
	
	var btn1Click = false;	//순위형 클릭 선언
	var btn2Click = false;	//별점형 클릭 선언
	var btn3Click = false;	//택일형 클릭 선언
	var btn4Click = false;	//선택형 클릭 선언
	var btn5Click = false;	//텍스트형 클릭 선언
	
	var survey1 = false;	//텍스트 저장 버튼
	var survey2 = false; 	//이미지 저장 버튼
	
	//저장시 insertDiv 초기화 
	function surveyBtn(){
		//설문조사 유형 클릭수 초기화
		btn1Cnt = 0;
		btn2Cnt = 0;
		btn3Cnt = 0;
		btn4Cnt = 0;
		btn5Cnt = 0;
		
		//설문조사 유형 클릭 유무 초기화
		btn1Click = false;
		btn2Click = false;
		btn3Click = false;
		btn4Click = false;
		btn5Click = false;
		
		//유형 선택 버튼 click 초기화
		$("#btn1").attr('onclick', '').unbind('click');
		$("#btn2").attr('onclick', '').unbind('click');
		$("#btn3").attr('onclick', '').unbind('click');
		$("#btn4").attr('onclick', '').unbind('click');
		$("#btn5").attr('onclick', '').unbind('click');
		$("#btn1").attr('onclick', 'button1()').bind('click');
		$("#btn2").attr('onclick', 'button2()').bind('click');
		$("#btn3").attr('onclick', 'button3()').bind('click');
		$("#btn4").attr('onclick', 'button4()').bind('click');
		$("#btn5").attr('onclick', 'button5()').bind('click');
		console.log('btn1Cnt:::::'+btn1Cnt);
		console.log('btn2Cnt:::::'+btn2Cnt);
		console.log('btn3Cnt:::::'+btn3Cnt);
		console.log('btn4Cnt:::::'+btn4Cnt);
		console.log('btn5Cnt:::::'+btn5Cnt);
		
		//이미지 배열 초기화
		imgArr = new Value();
		console.log(imgArr.getValue());
	}
	
	//텍스트/이미지 val 체크 함수
	function valChkFunc(){
		//validation span 체크
		if($('li[rel="tab1"]').attr('class')=='active'){
			txtValChk();
			return false;
		}else if($('li[rel="tab2"]').attr('class')=='active'){
			imgValChk();
			return false;
		}else if(btn5Click==true){
			console.log('텍스트형 val chk!!!!');
			txtValChk();
			return false;
		}//if
	}
	
	//텍스트/이미지 저장 btn Func
	function saveBtnFunc(){
		//텍스트 서베이 저장 버튼 클릭시
		$('#survey1').on('click', function(){
			//순위형 validation 체크 span
			txtValChk();
			//설문조사 등록
			insertAjax();
		});
		
		//이미지 서베이 저장 버튼 클릭시
		$('#survey2').on('click', function(){
			//순위형 validation 체크 span
			imgValChk();
			//설문조사 등록
			insertAjax();
		});
	}
	
	//팝업 close시 함수
	function closePopFunc(){
		//설문조사 리스트 팝업 close
		//$( "#dialog-listSurvey" ).dialog('close');
		//설문조사 리스트 초기화
		$('#listDiv').empty();
		//등록 div 제거
		$('#insertDiv').remove();
		
		//유형선택 class 제거
		$('#makeq section.choiceType ul li a.crownOn').attr('class', 'crownOff');
		$('#makeq section.choiceType ul li a.starOn').attr('class', 'starOff');
		$('#makeq section.choiceType ul li a.choiceOn').attr('class', 'choiceOff');
		$('#makeq section.choiceType ul li a.numberOn').attr('class', 'numberOff');
		$('#makeq section.choiceType ul li a.textOn').attr('class', 'textOff');
		
		//답변추가 수 초기화
		contsAddBtnClickCnt = 0;
		
		//저장시 서베이 버튼과 insertDiv 초기화
		surveyBtn();
	}
	
	//팝업 reload 함수
	function reloadPopFunc(){
		//팝업 close시 초기화
		closePopFunc();
		
		//설문조사 리스트 팝업 open
		$( "#dialog-listSurvey" ).dialog('open');
		
		//설문 조사 리스트 값 뿌려짐
		selectSurveyTitle();
		
		//스크롤 고정
		$( 'html, body' ).stop().animate({ scrollTop : '+=1' });
	}
	
	//순위형/별점형/택일형/선택형/텍스트형 클릭시 func
	function btnClickFunc(){
		//다른 버튼 클릭시 validation 체크
		$('#btn1').on('click', function(){
			//별점형 클릭시 체크
			if(btn1Cnt>0){
				alert('설문지를 먼저 작성해주세요.');
				
				//validation span 체크
				valChkFunc();
			}//if
		});
		$('#btn2').on('click', function(){
			//별점형 클릭시 체크
			if(btn2Cnt>0){
				alert('설문지를 먼저 작성해주세요.');
				
				//validation span 체크
				valChkFunc();
			}//if
		});
		$('#btn3').on('click', function(){
			//택일형 클릭시 체크
			if(btn3Cnt>0){
				alert('설문지를 먼저 작성해주세요.');
				
				//validation span 체크
				valChkFunc();
			}//if
		});
		$('#btn4').on('click', function(){
			//선택형 클릭시 체크
			if(btn4Cnt>0){
				alert('설문지를 먼저 작성해주세요.');
				
				//validation span 체크
				valChkFunc();
			}//if
		});
		$('#btn5').on('click', function(){
			//텍스트형 클릭시 체크
			if(btn5Cnt>0){
				alert('설문지를 먼저 작성해주세요.');
				
				//validation span 체크
				valChkFunc();
			}//if
		});
	}
	
	//순위형
	function button1(){
		
		//스크롤 고정
		$( 'html, body' ).stop().animate({ scrollTop : '+=1' });
		
		btn1Click = true;
		
		//순위형 클릭수 증가
		btn1Cnt += 1;
		console.log('btn1 클릭수:'+btn1Cnt);
		console.log('btn2 클릭수:'+btn2Cnt);
		console.log('btn3 클릭수:'+btn3Cnt);
		console.log('btn4 클릭수:'+btn4Cnt);
		console.log('btn5 클릭수:'+btn5Cnt);
		
		//처음에 순위형 클릭시 
		if(btn1Cnt == 1) {
			
			//별점형과 택일형 클릭수가 0이여야 됨
			if(btn2Cnt==0 && btn3Cnt==0 && btn4Cnt==0 && btn5Cnt==0){
				//div 보이기
				$('#listDiv').before('<div id="insertDiv"></div>');
				//순위형 클릭시 유형 선택 class 주기
				$('#btn1').attr('class','crownOn');
				
				//순위형 클릭시 질문1txt와 답변1txt append하기
				btnTxt();
				
				//다른 버튼 클릭시 validation 체크 func
				btnClickFunc()
				
				//텍스트 서베이 저장 버튼 클릭시
				$('#survey1').on('click', function(){
					//순위형 validation 체크 span
					txtValChk();
					//설문조사 등록
					insertAjax();
				});
				
				//이미지 서베이 저장 버튼 클릭시
				$('#survey2').on('click', function(){
					//순위형 validation 체크 span
					imgValChk();
					//설문조사 등록
					insertAjax();
				});
				
				//취소 버튼
				$('#cancel1').on('click', function(){
					//팝업 닫을 때 초기화 
					reloadPopFunc();
				});
				
				$('#cancel2').on('click', function(){
					//팝업 닫을 때 초기화 
					reloadPopFunc();
				});
				
			}//if
		}
	}
	
	//별점형
	function button2(){
		
		//스크롤 고정
		$( 'html, body' ).stop().animate({ scrollTop : '+=1' });
		
		btn2Click = true;
		
		//별점형 클릭수 증가
		btn2Cnt += 1;
		console.log('btn1 클릭수:'+btn1Cnt);
		console.log('btn2 클릭수:'+btn2Cnt);
		console.log('btn3 클릭수:'+btn3Cnt);
		console.log('btn4 클릭수:'+btn4Cnt);
		console.log('btn5 클릭수:'+btn5Cnt);
		
		//처음 별점형 버튼을 클릭했을 때
		if(btn2Cnt==1){
			//순위형과 택일형 클릭수가 0이여야됨
			if(btn1Cnt==0 && btn3Cnt==0 && btn4Cnt==0 && btn5Cnt==0){
				//div 보이기
				$('#listDiv').before('<div id="insertDiv"></div>');
				//별점형 클릭시 유형 선택 class 주기
				$('#btn2').attr('class','starOn');
				
				//벌점형 클릭시 질문2txt와 답변2-1, 답변2-2txt append하기
				btnTxt();
				
				//다른 버튼 클릭시 validation 체크 func
				btnClickFunc()
				
				//텍스트 서베이 저장 버튼 클릭시
				$('#survey1').on('click', function(){
					//텍스트 validation 체크 span
					txtValChk();
					//설문조사 등록
					insertAjax();
				});
				
				//이미지 서베이 저장 버튼 클릭시
				$('#survey2').on('click', function(){
					//텍스트 validation 체크 span
					imgValChk();
					//설문조사 등록
					insertAjax();
				});
				
				//취소 버튼
				$('#cancel1').on('click', function(){
					//팝업 닫을 때 초기화 
					reloadPopFunc();
				});
				
				$('#cancel2').on('click', function(){
					//팝업 닫을 때 초기화 
					reloadPopFunc();
				});
			}//if
		}
		/*else {
			//validation span 체크
			txtValChk();	
			//설문조사 등록
			if($('#insertDiv').val()!=undefined){
				insertAjax();
			}//if
		}//if
		 */	
	}
	
	//택일형
	function button3(){
		
		//스크롤 고정
		$( 'html, body' ).stop().animate({ scrollTop : '+=1' });
		
		btn3Click = true;
		
		//택일형 클릭수 증가
		btn3Cnt += 1;
		console.log('btn1 클릭수:'+btn1Cnt);
		console.log('btn2 클릭수:'+btn2Cnt);
		console.log('btn3 클릭수:'+btn3Cnt);
		console.log('btn4 클릭수:'+btn4Cnt);
		console.log('btn5 클릭수:'+btn5Cnt);
		
		//처음에 택일형 클릭하였을 때
		if(btn3Cnt==1){
			//순위형과 별점형 클릭수 0이여야 함
			if(btn1Cnt==0 && btn2Cnt==0 && btn4Cnt==0 && btn5Cnt==0){
				//div 보이기
				$('#listDiv').before('<div id="insertDiv"></div>');
				//택일형 클릭시 유형 선택 class 주기
				$('#btn3').attr('class','choiceOn');
				
				//질문, 답변 append하기
				btn3Txt();		
				
				//다른 버튼 클릭시 validation 체크 func
				btnClickFunc()
				
				//텍스트 서베이 저장 버튼 클릭시
				$('#survey1').on('click', function(){
					//validation 체크 span
					txtValChk();
					//설문조사 등록
					insertAjax();
				});
				
				//이미지 서베이 저장 버튼 클릭시
				$('#survey2').on('click', function(){
					//validation 체크 span
					imgValChk();
					//설문조사 등록
					insertAjax();
				});
				
				//취소 버튼
				$('#cancel1').on('click', function(){
					//팝업 닫을 때 초기화 
					reloadPopFunc();
				});
				
				$('#cancel2').on('click', function(){
					//팝업 닫을 때 초기화 
					reloadPopFunc();
				});
			}//if
		}
		/*
		else {
			//validation span 체크
			txtValChk();
			//설문조사 등록
			if($('#insertDiv').val()!=undefined){
				insertAjax();
			}//if
		}//if
		*/
	}
	
	//선택형
	function button4(){
		
		//스크롤 고정
		$( 'html, body' ).stop().animate({ scrollTop : '+=1' });
		
		btn4Click = true;
		
		//선택형 클릭수 증가
		btn4Cnt += 1;
		console.log('btn1 클릭수:'+btn1Cnt);
		console.log('btn2 클릭수:'+btn2Cnt);
		console.log('btn3 클릭수:'+btn3Cnt);
		console.log('btn4 클릭수:'+btn4Cnt);
		console.log('btn5 클릭수:'+btn5Cnt);
		
		//처음에 선택형 클릭하였을 때
		if(btn4Cnt==1){
			//순위형과 별점형 클릭수 0이여야 함
			if(btn1Cnt==0 && btn2Cnt==0 && btn3Cnt==0 && btn5Cnt==0){
				//div 보이기
				$('#listDiv').before('<div id="insertDiv"></div>');
				//선택형 클릭시 유형 선택 class 주기
				$('#btn4').attr('class','numberOn');
				
				//질문, 답변 append하기
				btnTxt();		
				
				//다른 버튼 클릭시 validation 체크 func
				btnClickFunc()
				
				//텍스트 서베이 저장 버튼 클릭시
				$('#survey1').on('click', function(){
					//validation 체크 span
					txtValChk();
					//설문조사 등록
					insertAjax();
				});
				
				//이미지 서베이 저장 버튼 클릭시
				$('#survey2').on('click', function(){
					//validation 체크 span
					imgValChk();
					//설문조사 등록
					insertAjax();
				});
				
				//취소 버튼
				$('#cancel1').on('click', function(){
					//팝업 닫을 때 초기화 
					reloadPopFunc();
				});
				
				$('#cancel2').on('click', function(){
					//팝업 닫을 때 초기화 
					reloadPopFunc();
				});
			}//if
		}
		/*
		else {
			//validation span 체크
			txtValChk();
			//설문조사 등록
			if($('#insertDiv').val()!=undefined){
				insertAjax();
			}//if
		}//if
		*/
	}
	
	//텍스트형
	function button5(){
		
		//스크롤 고정
		$( 'html, body' ).stop().animate({ scrollTop : '+=1' });
		
		btn5Click = true;
		
		//텍스트형 클릭수 증가
		btn5Cnt += 1;
		console.log('btn1 클릭수:'+btn1Cnt);
		console.log('btn2 클릭수:'+btn2Cnt);
		console.log('btn3 클릭수:'+btn3Cnt);
		console.log('btn4 클릭수:'+btn4Cnt);
		console.log('btn5 클릭수:'+btn5Cnt);
		
		//처음에 텍스트형 클릭하였을 때
		if(btn5Cnt==1){
			//순위형과 별점형 클릭수 0이여야 함
			if(btn1Cnt==0 && btn2Cnt==0 && btn3Cnt==0 && btn4Cnt==0){
				//div 보이기
				$('#listDiv').before('<div id="insertDiv"></div>');
				//텍스트형 클릭시 유형 선택 class 주기
				$('#btn5').attr('class','textOn');
				
				//질문, 답변 append하기
				btnTxt();		
				
				//다른 버튼 클릭시 validation 체크 func
				btnClickFunc()
				
				//텍스트 서베이 저장 버튼 클릭시
				$('#survey1').on('click', function(){
					//validation 체크 span
					txtValChk();
					//설문조사 등록
					insertAjax();
				});
				
				//이미지 서베이 저장 버튼 클릭시
				$('#survey2').on('click', function(){
					//validation 체크 span
					imgValChk();
					//설문조사 등록
					insertAjax();
				});
				
				//취소 버튼
				$('#cancel1').on('click', function(){
					//팝업 닫을 때 초기화 
					reloadPopFunc();
				});
				
				$('#cancel2').on('click', function(){
					//팝업 닫을 때 초기화 
					reloadPopFunc();
				});
			}//if
		}
		/*
		else {
			//validation span 체크
			txtValChk();
			//설문조사 등록
			if($('#insertDiv').val()!=undefined){
				insertAjax();
			}//if
		}//if
		*/
	}
	
	/////////////////////////////////////////////////////////////////////////////
	
	// + 버튼 클릭시 항목 추가
	function addBtn(i, j){
		//surveyType 값 선언
		var surveyTypeVal = $('#surveyDiv'+i+' input[name="surveyType"]').val();
		
		//항목 추가 버튼 클릭수 
		var addBtnCnt = 0;
		if($('#insertDiv').val()!=undefined){
			addBtnCnt = $('.addBtn'+i+'').size()+1;
		}else {
			addBtnCnt = $('.addBtn'+i+'').size()+1;
		}//if
		
		if(addBtnCnt < 9){
			//항목 추가 버튼 클릭수 만큼 append
			if($('.contsValChkSpan').val()==undefined){	//validation 체크 span이 없으면
				//removeBtn 다음에 after
				//새로 insert
				if($('#insertDiv').val()!=undefined){
					//순위형/선택형/텍스트형 클릭일 때
					if(btn1Click==true || btn4Click==true || btn5Click==true){
						$('#txtContsDiv'+$('.addBtn'+i+'').size()+'').after('<div></div><span id="txtContsDiv'+addBtnCnt+'"><input type="text" id="surveyContents'+addBtnCnt+'" name="surveyContents" placeholder="내용을 입력해주세요."><input type="button" class="addBtn'+i+'" id="addBtn'+addBtnCnt+'" onclick="addBtn('+i+','+(j+1)+')"><input type="button" class="removeBtn'+i+'" id="removeBtn'+addBtnCnt+'" onclick="removeBtn('+i+','+(j+1)+')"></span><div></div>');
					}else if(btn2Click == true){	//별점형 클릭일 때 
						$('#txtContsDiv'+$('.addBtn'+i+'').size()+'').after('<div></div><span id="txtContsDiv'+addBtnCnt+'"><input type="text" id="surveyContents'+addBtnCnt+'" name="surveyContents" placeholder="내용을 입력해주세요."><input type="button" class="addBtn'+i+'" id="addBtn'+addBtnCnt+'" onclick="addBtn('+i+','+(j+1)+')"><input type="button" class="removeBtn'+i+'" id="removeBtn'+addBtnCnt+'" onclick="removeBtn('+i+','+(j+1)+')"><input type="button" class="gradeBtn'+i+'" id="gradeBtn'+addBtnCnt+'" onclick="gradeBtn()" ></span><div></div>');
					}else if(btn3Click == true){	//택일형 클릭일 때
						//alert('택일형');
					}//if
				}else {//기존 survey 수정
					//surveyType이 1(순위형)/4(선택형)/5(텍스트형)일 때
					if(surveyTypeVal=='1' || surveyTypeVal=='4' || surveyTypeVal=='5'){
						$('#surveyDiv'+i+' #txtContsDiv'+(addBtnCnt-1)+'').after('<div></div><span id="txtContsDiv'+addBtnCnt+'"><span style="margin-left:25px;background:url(/images/common/builder/survey/reply_bullet.png) no-repeat; width:4px;height:4px;display: inline-block; overflow: hidden;vertical-align: middle;"></span><input type="text" id="surveyContents'+(i+1)+'_'+addBtnCnt+'" name="surveyContents" placeholder="내용을 입력해주세요."><input type="button" class="addBtn'+i+'" id="addBtn'+(addBtnCnt)+'" onclick="addBtn('+i+','+(addBtnCnt-1)+')"><input type="button" class="removeBtn'+i+'" id="removeBtn'+(addBtnCnt)+'" onclick="removeBtn('+i+','+(addBtnCnt-1)+')"></span><div></div>');
					}else if(surveyTypeVal == '2'){	//surveyType이 2(별점형)일 때
						$('#surveyDiv'+i+' #txtContsDiv'+(addBtnCnt-1)+'').after('<div></div><span id="txtContsDiv'+addBtnCnt+'"><span style="margin-left:25px;background:url(/images/common/builder/survey/reply_bullet.png) no-repeat; width:4px;height:4px;display: inline-block; overflow: hidden;vertical-align: middle;"></span><input type="text" id="surveyContents'+(i+1)+'_'+addBtnCnt+'" name="surveyContents" placeholder="내용을 입력해주세요."><input type="button" class="addBtn'+i+'" id="addBtn'+(addBtnCnt)+'" onclick="addBtn('+i+','+(addBtnCnt-1)+')"><input type="button" class="removeBtn'+i+'" id="removeBtn'+(addBtnCnt)+'" onclick="removeBtn('+i+','+(addBtnCnt-1)+')"><input type="button" class="gradeBtn'+i+'" id="gradeBtn'+(addBtnCnt)+'" onclick="gradeBtn()"></span><div></div>');
					}else if(surveyTypeVal == '3'){	//surveyType이 3(택일형)일 때
						alert('택일형');
					}//if
				}//if
			}else {	// validation 체크 span이 있으면
				//버튼 사이즈 체크
				if($('.addBtn'+i+'').size() < 3){
					//validation 체크 span 다음에 after
					//새로 insert
					if($('#insertDiv').val()!=undefined){
						//순위형/선택형/텍스트형 클릭일 때
						if(btn1Click==true || btn4Click==true || btn5Click==true){
							$('#contsValChkSpan'+(addBtnCnt-1)+'').after('<div></div><span id="txtContsDiv'+addBtnCnt+'"><input type="text" id="surveyContents'+addBtnCnt+'" name="surveyContents" placeholder="내용을 입력해주세요."><input type="button" class="addBtn'+i+'" id="addBtn'+addBtnCnt+'" onclick="addBtn('+i+','+(addBtnCnt-1)+')"><input type="button" class="removeBtn'+i+'" id="removeBtn'+addBtnCnt+'" onclick="removeBtn('+i+','+(addBtnCnt-1)+')"></span><div></div>');
						}else if(btn2Click == true){	//별점형 클릭일 때
							$('#contsValChkSpan'+(addBtnCnt-1)+'').after('<div></div><span id="txtContsDiv'+addBtnCnt+'"><input type="text" id="surveyContents'+addBtnCnt+'" name="surveyContents" placeholder="내용을 입력해주세요."><input type="button" class="addBtn'+i+'" id="addBtn'+addBtnCnt+'" onclick="addBtn('+i+','+(addBtnCnt-1)+')"><input type="button" class="removeBtn'+i+'" id="removeBtn'+addBtnCnt+'" onclick="removeBtn('+i+','+(addBtnCnt-1)+')"><input type="button" class="gradeBtn'+i+'" id="gradeBtn'+(addBtnCnt)+'" onclick="gradeBtn()"></span><div></div>');
						}else if(btn3Click == true){	//택일형 클릭일 때
							alert('택일형');
						}//if
					}else {//기존 survey 수정
						//surveyType이 1(순위형)/4(선택형)/5(텍스트형)일 때
						if(surveyTypeVal == '1' || surveyTypeVal == '4' || surveyTypeVal == '5'){
							$('#contsValChkSpan'+(addBtnCnt-1)+'').after('<div></div><span id="txtContsDiv'+addBtnCnt+'"><span style="margin-left:25px;background:url(/images/common/builder/survey/reply_bullet.png) no-repeat; width:4px;height:4px;display: inline-block; overflow: hidden;vertical-align: middle;"></span><input type="text" id="surveyContents'+(i+1)+'_'+addBtnCnt+'" name="surveyContents" placeholder="내용을 입력해주세요."><input type="button" class="addBtn'+i+'" id="addBtn'+addBtnCnt+'" onclick="addBtn('+i+','+(addBtnCnt-1)+')"><input type="button" class="removeBtn'+i+'" id="removeBtn'+addBtnCnt+'" onclick="removeBtn('+i+','+(addBtnCnt-1)+')"></span><div></div>');
						}else if(surveyTypeVal == '2'){ //surveyType이 2(별점형)일 때
							$('#contsValChkSpan'+(addBtnCnt-1)+'').after('<div></div><span id="txtContsDiv'+addBtnCnt+'"><span style="margin-left:25px;background:url(/images/common/builder/survey/reply_bullet.png) no-repeat; width:4px;height:4px;display: inline-block; overflow: hidden;vertical-align: middle;"></span><input type="text" id="surveyContents'+(i+1)+'_'+addBtnCnt+'" name="surveyContents" placeholder="내용을 입력해주세요."><input type="button" class="addBtn'+i+'" id="addBtn'+addBtnCnt+'" onclick="addBtn('+i+','+(addBtnCnt-1)+')"><input type="button" class="removeBtn'+i+'" id="removeBtn'+addBtnCnt+'" onclick="removeBtn('+i+','+(addBtnCnt-1)+')"><input type="button" class="gradeBtn'+i+'" id="gradeBtn'+(addBtnCnt)+'" onclick="gradeBtn()"></span><div></div>');
						}else if(surveyTypeVal == '3'){ //surveyType이 3(택일형)일 때
							alert('택일형');
						}//if
					}//if
				}else {
					//새로 insert
					if($('#insertDiv').val()!=undefined){
						//순위형/선택형/텍스트형 클릭일 때
						if(btn1Click==true || btn4Click == true || btn5Click == true){
							//removeBtn 다음에 after
							$('#txtContsDiv'+$('.addBtn'+i+'').size()+'').after('<div></div><span id="txtContsDiv'+addBtnCnt+'"><input type="text" id="surveyContents'+addBtnCnt+'" name="surveyContents" placeholder="내용을 입력해주세요."><input type="button" class="addBtn'+i+'" id="addBtn'+addBtnCnt+'" onclick="addBtn('+i+','+(addBtnCnt-1)+')"><input type="button" class="removeBtn'+i+'" id="removeBtn'+addBtnCnt+'" onclick="removeBtn('+i+','+(addBtnCnt-1)+')"></span><div></div>');
						}else if(btn2Click == true){	//별점형 클릭일 때
							//별점 버튼 다음에 after
							$('#txtContsDiv'+$('.addBtn'+i+'').size()+'').after('<div></div><span id="txtContsDiv'+addBtnCnt+'"><input type="text" id="surveyContents'+addBtnCnt+'" name="surveyContents" placeholder="내용을 입력해주세요."><input type="button" class="addBtn'+i+'" id="addBtn'+addBtnCnt+'" onclick="addBtn('+i+','+(addBtnCnt-1)+')"><input type="button" class="removeBtn'+i+'" id="removeBtn'+addBtnCnt+'" onclick="removeBtn('+i+','+(addBtnCnt-1)+')"><input type="button" class="gradeBtn'+i+'" id="gradeBtn'+(addBtnCnt)+'" onclick="gradeBtn()"></span><div></div>');
						}else if(btn3Click == true){	//택일형 클릭일 때
							alert('택일형');
						}//if
					}else {
						//surveyType이 1(순위형)/4(선택형)/5(텍스트형)일 때
						if(surveyTypeVal=='1' || surveyTypeVal=='4' || surveyTypeVal=='5'){
							$('#txtContsDiv'+$('.addBtn'+i+'').size()+'').after('<div></div><span id="txtContsDiv'+addBtnCnt+'"><span style="margin-left:25px;background:url(/images/common/builder/survey/reply_bullet.png) no-repeat; width:4px;height:4px;display: inline-block; overflow: hidden;vertical-align: middle;"></span><input type="text" id="surveyContents'+(i+1)+'_'+addBtnCnt+'" name="surveyContents" placeholder="내용을 입력해주세요."><input type="button" class="addBtn'+i+'" id="addBtn'+addBtnCnt+'" onclick="addBtn('+i+','+(addBtnCnt-1)+')"><input type="button" class="removeBtn'+i+'" id="removeBtn'+addBtnCnt+'" onclick="removeBtn('+i+','+(addBtnCnt-1)+')"></span><div></div>');
						}else if(surveyTypeVal == '2'){ //surveyType이 2(별점형)일 때
							$('#txtContsDiv'+$('.addBtn'+i+'').size()+'').after('<div></div><span id="txtContsDiv'+addBtnCnt+'"><span style="margin-left:25px;background:url(/images/common/builder/survey/reply_bullet.png) no-repeat; width:4px;height:4px;display: inline-block; overflow: hidden;vertical-align: middle;"></span><input type="text" id="surveyContents'+(i+1)+'_'+addBtnCnt+'" name="surveyContents" placeholder="내용을 입력해주세요."><input type="button" class="addBtn'+i+'" id="addBtn'+addBtnCnt+'" onclick="addBtn('+i+','+(addBtnCnt-1)+')"><input type="button" class="removeBtn'+i+'" id="removeBtn'+addBtnCnt+'" onclick="removeBtn('+i+','+(addBtnCnt-1)+')"><input type="button" class="gradeBtn'+i+'" id="gradeBtn'+(addBtnCnt)+'" onclick="gradeBtn()"></span><div></div>');
						}else if(surveyTypeVal == '3'){ //surveyType이 3(택일형)일 때
							alert('택일형');
						}//if
					}//if
				}//if
			}//if 
		}else {
			alert('항목을 더이상 추가할 수 없습니다.');
		}//if
	}
	
	// - 버튼 클릭시 항목 삭제
	function removeBtn(i, j){
		//항목 삭제 버튼 개수
		var removeBtnCnt = $('.removeBtn'+i+'').size();
		
		//surveyType 값 선언
		var surveyTypeVal = $('#surveyDiv'+i+' input[name="surveyType"]').val();
		
		if(removeBtnCnt > 2){
			//새로 insert
			if($('#insertDiv').val()!=undefined){
				//txtContsDiv 삭제
				$('#txtContsDiv'+(removeBtnCnt)+'').remove();
			}else {//기존 survey 수정
				//해당 설문조사의 txtContsDiv 삭제
				$('#surveyDiv'+i+' #txtContsDiv'+(j+1)+'').remove();
			}//if
		}else {
			alert('항목을 더이상 삭제할 수 없습니다.');
		}//if
	}
	
	//설문조사 임시저장한 수정 파일 불러오기
	function unwrapFunc(i, j){
		i = parseInt(i);
		j = parseInt(j);
		console.log('i::::'+i);
		//a태그 클릭하면 text box로 val값 가져옴
		$('#surveyDiv'+i+'').unwrap();
		
		//unwrap되면 width 늘리기
		$('#surveyDiv'+i+'').css('width','900px');

		//중질문 삭제버튼 없애기
		$('#deleteSurveyType'+(i+1)+'').css('display','none');
		//중질문에 해당하는 컨텐츠 삭제 버튼 없애기
		$('.deleteConts'+i+'').css('display','none');
		
		//별점형일 경우 중질문 이미지 수정
		if($('#surveyType'+(i+1)+'').val()=='2'){
			console.log('별점형입니다~');
			$('#secSvyTitleImg'+(i+1)+'').before('<input type="file" id="secSvyTitleUpload'+(i+1)+'" name="secSvyTitleUpload">');
			readSvyTitleImg(i);
		}//if
		
		// 텍스트/이미지별 조건 수정//////////////
		if($('#surveyAnswerType'+(i+1)+'').val()=='1'){
			//title span -> text box로 변경
			$('#titleSpan'+(i+1)+'').wrap('<input type="text" id="secondSurveyTitle'+(i+1)+'" name="secondSurveyTitle" value="'+$('#titleSpan'+(i+1)+'').text()+'" placeholder="질문을 입력해주세요.">');
			
			//contents span -> text box로 변경
			for(var contsIdx=0; contsIdx<=j; contsIdx++){
				//surveyType 값 선언
				var surveyTypeVal = $('#surveyDiv'+i+' input[name="surveyType"]').val();
				
				//surveyType이 1(순위형)/4(선택형)/5(텍스트형)일 때 
				$('#contentsSpan'+(i+1)+'_'+(contsIdx+1)+'').wrap('<span id="txtContsDiv'+(contsIdx+1)+'"><input type="text" id="surveyContents'+(i+1)+'_'+(contsIdx+1)+'" name="surveyContents" value="'+$('#contentsSpan'+(i+1)+'_'+(contsIdx+1)+'').text()+'" placeholder="내용을 입력해주세요."></span>');
				if(surveyTypeVal=='1' || surveyTypeVal=='4' || surveyTypeVal=='5'){
					$('#surveyContents'+(i+1)+'_'+(contsIdx+1)+'').after('<input type="button" class="addBtn'+i+'" id="addBtn'+(contsIdx+1)+'" onclick="addBtn('+i+','+contsIdx+')"><input type="button" class="removeBtn'+i+'" id="removeBtn'+(contsIdx+1)+'" onclick="removeBtn('+i+','+contsIdx+')"></div><div></div>');
				}else if(surveyTypeVal=='2'){//surveyType이 2(별점형)일 때
					$('#surveyContents'+(i+1)+'_'+(contsIdx+1)+'').after('<input type="button" class="addBtn'+i+'" id="addBtn'+(contsIdx+1)+'" onclick="addBtn('+i+','+contsIdx+')"><input type="button" class="removeBtn'+i+'" id="removeBtn'+(contsIdx+1)+'" onclick="removeBtn('+i+','+contsIdx+')"><input type="button" class="gradeBtn'+i+'" id="gradeBtn'+(contsIdx+1)+'" onclick="gradeBtn()"></div><div></div>');
				}else if(surveyTypeVal=='3'){//surveyType이 3(택일형)일 때
					//$('#surveyContents'+(i+1)+'_'+(contsIdx+1)+'').after('<input type="button" class="fileBtn'+i+'" id="fileBtn'+(contsIdx+1)+'" value="(#)" onclick="fileBtn('+i+','+contsIdx+')"></div><div></div>');
					//alert('택일형!!');				
				}//if
				//$('#surveyContents'+(i+1)+'_'+(j+1)+'').after('<input type="button" id="addBtn'+(i+1)+'_'+(j+1)+'" value="(+)" onclick="addBtn('+i+','+j+')"><input type="button" id="removeBtn'+(i+1)+'_'+(j+1)+'" value="(-)" onclick="removeBtn('+i+')"><div></div>');
			}//for
		}else if($('#surveyAnswerType'+(i+1)+'').val()=='2'){
			$('#titleSpan'+(i+1)+'').wrap('<input type="text" id="secondSurveyTitle'+(i+1)+'" name="secondSurveyTitle" value="'+$('#titleSpan'+(i+1)+'').text()+'" placeholder="질문을 입력해주세요.">');
			$('#secondSurveyTitle'+(i+1)+'').after('<input type="button" class="addConts'+i+'" id="addConts1" onclick="contsAddBtn('+i+','+j+')">');
			for(var contsIdx=0; contsIdx<=j; contsIdx++){
				var contsId = $('#surveyDiv'+i+' #surveyContentsId'+(contsIdx+1)+'').val();
				//답변 이미지 파일 업로드 append
				$('#img'+(i+1)+'_'+(contsIdx+1)+'').before('<input type="file" id="surveyImagePath'+(i+1)+'_'+(contsIdx+1)+'" name="surveyImagePath">');
				//title span -> text box로 변경
				$('#contentsSpan'+(i+1)+'_'+(contsIdx+1)+'').wrap('<span id="txtContsDiv'+(contsIdx+1)+'"><input type="text" id="surveyContents'+(i+1)+'_'+(contsIdx+1)+'" name="surveyContents" value="'+$('#contentsSpan'+(i+1)+'_'+(contsIdx+1)+'').text()+'" placeholder="내용을 입력해주세요."></span>');
			}//for
			
			//기존 이미지 수정시 읽어오기 
			readImg(i);
		}//if
		
		//임시 저장 버튼 
		$('#surveyDiv'+i+'').append('<div style="text-align:right;"><input type="button" class="tempStore" id="tempStore'+i+'" onclick="tempStore('+i+', '+j+')"/></div>');
		
		//surveyType 값 선언
		var surveyTypeVal = $('#surveyDiv'+i+' input[name="surveyType"]').val();
		
		var surveyAnswerTypeVal = $('#surveyDiv'+i+' input[name="surveyAnswerType"]').val();
		
		//btn1, btn2, btn3 이벤트 합친거
		for(var btnId=1; btnId<=3; btnId++){
			$('#btn'+btnId+'').click(function(){
				//validation 체크
				if(surveyAnswerTypeVal=='1'){
					txtValChk();
				}else if(surveyAnswerTypeVal=='2'){
					imgValChk();
				}//if
				
				//임시저장 버튼이 있으면
				if($('input[id*="tempStore"]').val()!=undefined){
					//새로 저장 div 제거
					$('#insertDiv').remove();
					
					alert('먼저 임시저장을 해주세요.');
					return false;
				}
				
				//질문txt와 내용1txt 내용2txt 모두 값이 있으면 db에 저장
				/*
				if($('input[name="secondSurveyTitle"]').val()!='' && $('#surveyContents'+(i+1)+'_'+1+'').val()!='' && $('#surveyContents'+(i+1)+'_'+2+'').val()!==''){
					//설문조사 유형 id 선언
					var surveyTypeId = $('#surveyTypeId'+(i+1)).val();
					
					//FormData 선언
					var fd = new FormData();
					
					//해당 div의 필드 값 뽑아오기
					var data = $('#surveyDiv'+i+' input[type="text"]').serialize();
					//contentsId 필드 값들 가져오기
					var contsId = $('#surveyDiv'+i+' input[name="surveyContentsId"]').serialize();
					
					
					//모든 데이터 append
					fd.append('data', data);
					//ContentsId val 값들 append
					fd.append('contsId', contsId);
					
					$.ajax({
						url : '/tempStore/'+surveyTypeId,
						data : fd,
						type : 'POST',
						processData : false,
						contentType : false,
						success : function(data){
							alert('임시 저장되었습니다.');
							console.log(data);
							
							//location.href='/views/surveySecondTitleForm?surveyId='+$('#surveyId').val();
						}
					});//end ajax
				}//if
				*/
			});
		}//for
	}
	
	//탭 형식 
	function tabsFunc(){
		$(".tab_content").hide();
	    $(".tab_content:first").show();
	
	    $("ul.tabs li").click(function (e) {
	        $("ul.tabs li").removeClass("active").css("color", "#333");
	        //$(this).addClass("active").css({"color": "darkred","font-weight": "bolder"});
	        $(this).addClass("active").css("color", "#fafafa");
	        $(".tab_content").hide();
	        var activeTab = $(this).attr("rel");
	        $("#" + activeTab).fadeIn()
	    });
	}
	//////////////////////////////////////////////////
	
	//파일 -> 답변추가로 버튼명 변경
	function fileBtnChg(){
		//순위형/별점형일 때
		if( btn1Click==true || btn2Click==true ){
			$('#fileBtn').click(function(e){
				e.preventDefault();
				$('#surveyImagePath').click();
			});
			//input type=file 숨기기
			$('#surveyImagePath').css('display', 'none');
			
		}else if(btn3Click==true){ // 택일형일 때
			$('input:radio[name="choice"]').on('click',function(){
				
				//file버튼 수
				var fileBtnCnt = $('#tab2 .fileBtn').size();
				for(var i=1; i<=fileBtnCnt; i++){
					
					$('#tab2 #fileBtn'+(i)+'').click(function(e){
						e.preventDefault();
						$('#tab2 #surveyImagePath'+(i)+'').click();

					//input type=file 숨기기
					$('#tab2 #surveyImagePath'+(i)+'').css('display', 'none');
					});
					
				}//for
			});
		}//if
	}
	//////////////////////////////////////////////////
	function readSvyTitleImg(i){
		if($('#insertDiv').val()!=undefined){	//새로 등록할 때
			if(btn2Click==true){	//별점형일 때
				
				//텍스트탭일 경우
				//설문title 이미지를 클릭하면 
				$('#tab1 #secSvyTitleImg').click(function(e){
					e.preventDefault();
					$('#tab1 #secSvyTitleUpload').click();
				});
				
				//surveyTitle 업로드 버튼 숨김
				$('#tab1 #secSvyTitleUpload').css('display','none');
				
				$('#tab1 #secSvyTitleUpload').change(function(){
					if(this.files && this.files[0]){
						//확장자 구분
						switch(this.files[0].name.substring(this.files[0].name.lastIndexOf('.') + 1).toLowerCase()){
					        case 'jpg': case 'png':
					            break;
					        case 'gif':
					        	alert('GIF 이미지는 사용하실 수 없습니다.');
					        	return false;
					        	//break;
					        default:
					            $(this).val('');
					            // error message here
					            alert("이미지 파일이 아닙니다.");
					            break;
					    }//switch
						
						var reader = new FileReader();
						
						reader.onload = function(e){
							
							$('#tab1 .secSvyTitleDiv').css('display','inline-block');
							$('#tab1 .secSvyTitleDiv #secSvyTitleImg').attr('src', e.target.result);
						}
						reader.readAsDataURL(this.files[0]);
					}//if
				});
				
				//이미지탭일 경우
				//설문title 이미지를 클릭하면 
				$('#tab2 #secSvyTitleImg').click(function(e){
					e.preventDefault();
					$('#tab2 #secSvyTitleUpload').click();
				});
				
				//surveyTitle 업로드 버튼 숨김
				$('#tab2 #secSvyTitleUpload').css('display','none');
				
				$('#tab2 #secSvyTitleUpload').change(function(){
					if(this.files && this.files[0]){
						//확장자 구분
						switch(this.files[0].name.substring(this.files[0].name.lastIndexOf('.') + 1).toLowerCase()){
					        case 'jpg': case 'png':
					            break;
					        case 'gif':
					        	alert('GIF 이미지는 사용하실 수 없습니다.');
					        	return false;
					        	//break;
					        default:
					            $(this).val('');
					            // error message here
					            alert("이미지 파일이 아닙니다.");
					            break;
					    }//switch
						
						var reader = new FileReader();
						
						reader.onload = function(e){
							
							$('#tab2 .secSvyTitleDiv').css('display','inline-block');
							$('#tab2 .secSvyTitleDiv #secSvyTitleImg').attr('src', e.target.result);
						}
						reader.readAsDataURL(this.files[0]);
					}//if
				});
			}
		}else {//수정할 때 
			
			console.log($('#secSvyTitleImg'+(i+1)+'').attr('id'));
			//설문title 이미지를 클릭하면 
			$('#secSvyTitleImg'+(i+1)+'').click(function(e){
				e.preventDefault();
				$('#secSvyTitleUpload'+(i+1)+'').click();
			});
			
			//surveyTitle 업로드 버튼 숨김
			$('#secSvyTitleUpload'+(i+1)+'').css('display','none');
			
			$('#secSvyTitleUpload'+(i+1)+'').change(function(){
				if(this.files && this.files[0]){
					//확장자 구분
					switch(this.files[0].name.substring(this.files[0].name.lastIndexOf('.') + 1).toLowerCase()){
				        case 'jpg': case 'png':
				            break;
				        case 'gif':
				        	alert('GIF 이미지는 사용하실 수 없습니다.');
				        	return false;
				        	//break;
				        default:
				            $(this).val('');
				            // error message here
				            alert("이미지 파일이 아닙니다.");
				            break;
				    }//switch
					
					var reader = new FileReader();
					
					reader.onload = function(e){
						
						$('#surveyDiv'+(i+1)+' .secSvyTitleDiv').css('display','inline-block');
						$('.secSvyTitleDiv #secSvyTitleImg'+(i+1)+'').attr('src', e.target.result);
					}
					reader.readAsDataURL(this.files[0]);
				}//if
			});
		}
	}
	
	//파일 이미지 불러오기 배열 선언 
	var imgArr = new Value();
	//답변 파일 업로드시 바로 이미지 출력
	function readImg(k){
		if($('#insertDiv').val()!=undefined){	//새로 등록할 때
			//순위형/별점형/선택형 일 때
			if( btn1Click==true || btn2Click==true || btn4Click==true){
				var contsDivCnt = $('.contsDiv').size();
				for(var i=0; i<contsDivCnt; i++){
					i = parseInt(i);
					
					//이미지 클릭시 파일 업로드
					$('#img'+(i+1)+'').click(function(e){
						console.log(i);
						
						e.preventDefault();
						console.log($(this).attr('id'));
						if('img'+i+'' == $(this).attr('id') ){
							$('#surveyImagePath'+i+'').click();
						}
					});
					
					//input type=file 숨기기
					$('#surveyImagePath'+(i+1)+'').css('display', 'none');
					
					$('#surveyImagePath'+(i+1)+'').change(function(){
						for(var j=0; j<this.files.length; j++){
							//확장자 구분
							switch(this.files[j].name.substring(this.files[j].name.lastIndexOf('.') + 1).toLowerCase()){
						        case 'jpg': case 'png':
						            break;
						        case 'gif':
						        	alert('GIF 이미지는 사용하실 수 없습니다.');
						        	return false;
						        	//break;
						        default:
						            $(this).val('');
						            // error message here
						            alert("이미지 파일이 아닙니다.");
						            break;
						    }//switch
							if(this.files && this.files[j]){
								var reader = new FileReader();
								//현재 surveyImagePath 값 담음
								var imgPathId = $(this).attr('id');
									
									reader.onload = function(e){
										i = parseInt(i);
										
										var img = $('#img'+i+'');
										
										//현재값과 surveyImagePath의 값이 같으면
										if('surveyImagePath'+i+'' == imgPathId){
											img.css('display','inline-block');
											img.attr('src', e.target.result);
										}//if
									}
								reader.readAsDataURL(this.files[j]);
							}//if
						}//for
					});
				}//for
			}else if(btn3Click==true){	//택일형 일 때
				var radioChkVal ='';
				$('input:radio[name="choice"]').on('click',function(){
					radioChkVal = $('#tab2 input:radio[name="choice"]:checked').val();
					//int로 변환
					radioChkVal = parseInt(radioChkVal);
				
					
					for(var i=0; i<radioChkVal; i++){
						i = parseInt(i);
						
						//이미지 클릭시 파일 업로드
						$('#img'+(i+1)+'').click(function(e){
							var contsDivCnt = $('.contsDiv').size();
							for(var i=0; i<contsDivCnt; i++){
								e.preventDefault();
								if('img'+(i+1)+'' == $(this).attr('id') ){
									$('#surveyImagePath'+(i+1)+'').click();
								}//if
							}//for
						});
						
						//input type=file 숨기기
						$('#surveyImagePath'+(i+1)+'').css('display', 'none');
						
						$('#surveyImagePath'+(i+1)+'').change(function(){
							for(var j=0; j<this.files.length; j++){
								//확장자 구분
								switch(this.files[j].name.substring(this.files[j].name.lastIndexOf('.') + 1).toLowerCase()){
						        case 'jpg': case 'png':
						            break;
						        case 'gif':
						        	alert('GIF 이미지는 사용하실 수 없습니다.');
						        	return false;
						        	//break;
						        default:
						            $(this).val('');
						            // error message here
						            alert("이미지 파일이 아닙니다.");
						            break;
								}//switch
								
								if(this.files && this.files[j]){
									var reader = new FileReader();
									
									//현재 surveyImagePath 값 담음
									var imgPathId = $(this).attr('id');
									
									reader.onload = function(e){
										for(var no=1; no<=i; no++){
											var img = $('#img'+no+'');
											var contsDiv = $('#tab2 #contsDiv'+no+'');
											
											if('surveyImagePath'+no+'' == imgPathId){
												contsDiv.css('display','inline-block');
												img.attr('src', e.target.result);
											}//if
										}//for
									}
									reader.readAsDataURL(this.files[j]);
								}//if
							}//for
						});
					}//for
				});	
			}//if
		}else {//수정일 때
			var contsDivCnt = $('#surveyDiv'+k+' .contsDiv'+k+'').size();
			//readImg 배열 선언
			var readImgArr = new Array();
			for(var i=0; i<contsDivCnt; i++){
				
				//이미지 클릭시 파일 업로드
				$('#img'+(k+1)+'_'+(i+1)+'').click(function(e){
					for(var i=0; i<contsDivCnt; i++){
						console.log(i);
					
						e.preventDefault();
						console.log($(this).attr('id'));
						if('img'+(k+1)+'_'+(i+1)+'' == $(this).attr('id') ){
							$('#surveyImagePath'+(k+1)+'_'+(i+1)+'').click();
						}//if
					}//for
				});
				
				//input type=file 숨기기
				$('#surveyImagePath'+(k+1)+'_'+(i+1)+'').css('display', 'none');
				
				$('#surveyImagePath'+(k+1)+'_'+(i+1)+'').change(function(){
					
					//conts id, img, 내용들의 값 선언
					var conts = $(this).parents().attr('id');
					//conts 내용들을 담음
					readImgArr.push(conts);
					console.log(readImgArr);
					
					//이미지 배열 setter
					imgArr.setValue(readImgArr);
					
					for(var j=0; j<this.files.length; j++){
						//확장자 구분
						switch(this.files[j].name.substring(this.files[j].name.lastIndexOf('.') + 1).toLowerCase()){
					        case 'jpg': case 'png':
					            break;
					        case 'gif':
					        	alert('GIF 이미지는 사용하실 수 없습니다.');
					        	return false;
					        	//break;
					        default:
					            $(this).val('');
					            // error message here
					            alert("이미지 파일이 아닙니다.");
					            break;
					    }//switch
						if(this.files && this.files[j]){
							var reader = new FileReader();
							//현재 surveyImagePath 값 담음
							var imgPathId = $(this).attr('id');
								
							reader.onload = function(e){
								i = parseInt(i);
								//현재값과 surveyImagePath의 값이 같으면
								//수정일 때 답변추가시 새 이미지 출력
								if('surveyImagePath'+(k+1)+'_'+i+'' == imgPathId){
									var img = $('#img'+(k+1)+'_'+i+'');
									
									img.css('display','inline-block');
									img.attr('src', e.target.result);
								}//if
								
								//수정 일 때 기존 이미지 수정시
								for(var l=0; l<i; l++){
									if('surveyImagePath'+(k+1)+'_'+l+'' == imgPathId){
										$('#img'+(k+1)+'_'+l+'').attr('src', e.target.result);
									}//if
								}//for
							}
							reader.readAsDataURL(this.files[j]);
						}//if
					}//for
				});
			}//for
		}//if
	}
	
	//답변추가 클릭수 선언
	var contsAddBtnClickCnt = 0;
	
	function contsAddBtn(i, j){//i=중질문 개수 j=질문당 컨텐츠 개수
		var contsHtml = '';
		
		if($('#insertDiv').val()!=undefined){	//새로 등록할 때
			//답변추가 클릭수 증가
			contsAddBtnClickCnt += 1;		
			//no에 다시 담음
			var no = contsAddBtnClickCnt;
			//답변 개수 8개까지만 추가 가능
			if(contsAddBtnClickCnt<9){
				//답변추가 클릭하면 컨텐츠 append
				//j = parseInt(j);
				contsHtml +=  '<div class="contsDiv" id="contsDiv'+no+'" >'+
								'<div class="delSurContsDiv"><img class="deleteConts'+i+'" id="deleteConts'+(i+1)+'_'+no+'" src="/images/common/builder/survey/delBtn.png" style="width:15px; height:15px;" onclick="delConts('+i+','+no+', null)"></div> '+
								'<input type="file" id="surveyImagePath'+no+'" name="surveyImagePath">'+
								'<img class="img" id="img'+no+'" alt="" src=""> '+
								'<div></div><span id="txtContsDiv'+no+'"><input type="text" id="surveyContents'+no+'" name="surveyContents" placeholder="내용을 입력해주세요."></span>'+
		   					  '</div>';
		   					  
				$('#tab2 #txtDiv2').append(contsHtml);
			}else {
				alert('더 이상 추가할 수 없습니다.');
			}//if
		}else {
			//img 개수 
			var imgCnt = $('#surveyDiv'+i+' .img').size();
			
			if(imgCnt<8){
				
			contsHtml +=  '<div class="contsDiv'+i+'" id="contsDiv'+(i+1)+'_'+(imgCnt+1)+'">'+
							'<input type="file" id="surveyImagePath'+(i+1)+'_'+(imgCnt+1)+'" name="surveyImagePath">'+
							'<img class="img" id="img'+(i+1)+'_'+(imgCnt+1)+'" alt="" src=""> '+
							'<div></div><span id="txtContsDiv'+(imgCnt+1)+'"><span style="margin-left:25px;background:url(/images/common/builder/survey/reply_bullet.png) no-repeat; width:4px;height:4px;display: inline-block; overflow: hidden;vertical-align: middle;"></span><input type="text" id="surveyContents'+(i+1)+'_'+(imgCnt+1)+'" name="surveyContents" placeholder="내용을 입력해주세요."></span>'+
			 			  '</div>';
			  
			$('#contsDiv'+(i+1)+'_'+(imgCnt)+'').after(contsHtml);		
			}else {
				alert('더 이상 추가할 수 없습니다.');
			}//if
		}//if
		
		//파일 이미지 출력
		readImg(i);
	}
	
	function delConts(i, j, contsId){
		var delContsCnt = $('.deleteConts'+i+'').size();
		console.log('delContsCnt::'+delContsCnt);
		console.log('i, j::'+i+', '+j);
		
		$('#deleteConts'+(i+1)+'_'+(j+1)+'').on('click', function(){
			$('#atag'+i+'').on('click',function(e){
				e.preventDefault();
			});
		});
		
		if(delContsCnt > 2){
			if($('#insertDiv').val()!=undefined){
				var contsId='';
				//contsDiv 삭제
				$('#contsDiv'+j+'').remove();
				
			}else {//기존 survey 수정
				var fd = new FormData();
				fd.append('contsId', contsId);
				
				//return false;
				if(confirm('삭제하시겠습니까?') == true){
					//해당 설문조사의 contsDiv 삭제
					$('#surveyDiv'+i+' #contsDiv'+(i+1)+'_'+(j+1)+'').remove();
					$.ajax({
						url : '/upload/deleteConts?contsId='+contsId,
						data : fd,
						type : 'POST',
						processData : false,
						contentType : false,
						success : function(){
							//location.href='/views/surveySecondTitleForm?surveyId='+$('#surveyId').val();
							alert('컨텐츠가 삭제되었습니다.');
						}//end success
					});//end ajax
					reloadPopFunc();
				} else {
					reloadPopFunc();
					return false;
				}
				
			}//if
		}else {
			alert('항목을 더이상 삭제할 수 없습니다.');
			reloadPopFunc();
		}//if
		
	}
	
	function delSurveyType(i, surveyTypeId){
		//var delSurveyCnt = $('.deleteSurvey'+i+'').size();
		
		var fd = new FormData();
		fd.append('surveyTypeId', surveyTypeId);
		
		//return false;
		if(confirm('삭제하시겠습니까?') == true){
			//중질문삭제 버튼 제거 
			$('#deleteSurveyType'+(i+1)+'').remove();
			//해당 설문조사의 contsDiv 제거
			$('#surveyDiv'+i+'').remove();
			$.ajax({
				url : '/upload/deleteSurveyType?surveyTypeId='+surveyTypeId+'',
				data : fd,
				type : 'POST',
				processData : false,
				contentType : false,
				success : function(){
					//location.href='/views/surveySecondTitleForm?surveyId='+$('#surveyId').val();
				}//end success
			});//end ajax
			alert('설문조사가 삭제되었습니다.');
			reloadPopFunc();
		}else {
			reloadPopFunc();
			return false;
		}//if
	}
	
	//순위형, 별점형, 선택형  질문, 답변 append 합친거
	function btnTxt(){
		if(typeof $('#secondSurveyTitle').val()=='undefined' && typeof $('#surveyContents1_1').val()=='undefined' && typeof $('#surveyContents1_2').val()=='undefined'){
			
			//i, j 선언
			var i=0;
			var j=0;
			
			var txtHtml = '';
			txtHtml += '<div id="txtDiv1">';
			//별점형일 때 surveyTitle 이미지 append					
			if(btn2Click == true){
				txtHtml += 	'<input type="file" id="secSvyTitleUpload" name="secSvyTitleUpload" >'+
							'<div class="secSvyTitleDiv" id="secSvyTitleDiv">'+
					   			'<img class="secSvyTitleImg" id="secSvyTitleImg" alt="" src=""> '+
					   		'</div>'; 
			}//if	
			txtHtml +=		'<input type="text" id="secondSurveyTitle1" name="secondSurveyTitle" placeholder="질문을 입력해주세요."><div></div>'+                                                                                                                                                                                                                               
							'<span id="txtContsDiv1">'+
								'<input type="text" id="surveyContents1" name="surveyContents" placeholder="내용을 입력해주세요.">'+
								'<input type="button" class="addBtn'+i+'" id="addBtn1" onclick="addBtn('+i+','+j+')">'+
								'<input type="button" class="removeBtn'+i+'" id="removeBtn1" onclick="removeBtn('+i+','+j+')">'+
								'';
			//별점형일 때 별점형 버튼 append					
			if(btn2Click == true){
				txtHtml += 		'<input type="button" class="gradeBtn'+i+'" id="gradeBtn1" onclick="gradeBtn()">';
			}//if					
			txtHtml +=			'<div></div>'+
							'</span>'+       
							'<span id="txtContsDiv2">'+
								'<input type="text" id="surveyContents2" name="surveyContents" placeholder="내용을 입력해주세요.">'+
								'<input type="button" class="addBtn'+i+'" id="addBtn2" onclick="addBtn('+i+','+j+')">'+
								'<input type="button" class="removeBtn'+i+'" id="removeBtn2" onclick="removeBtn('+i+','+j+')">';
			//별점형일 때 별점형 버튼 append					
			if(btn2Click == true){
				txtHtml += 		'<input type="button" class="gradeBtn'+i+'" id="gradeBtn2" onclick="gradeBtn()">';
			}//if					
			txtHtml	+=			'<div></div>'+
							'</span>'+
						'</div>';
			
			var fileHtml = '';
			fileHtml += '<div id="txtDiv2">';
			//별점형일 때 surveyTitle 이미지 append					
			if(btn2Click == true){
				fileHtml += '<input type="file" id="secSvyTitleUpload" name="secSvyTitleUpload" >'+
							'<div class="secSvyTitleDiv" id="secSvyTitleDiv">'+
					   			'<img class="secSvyTitleImg" id="secSvyTitleImg" alt="" src="" style="background:url(/images/common/builder/survey/img_add.png); no-repeat; border:none; width:200px; height:160px; cursor:pointer;"> '+
					   		'</div>'; 
			}//if	
			fileHtml +=		'<input type="text" id="secondSurveyTitle2" name="secondSurveyTitle" placeholder="질문을 입력해주세요.">'+
							'<input type="button" class="addConts'+i+'" id="addConts1" onclick="contsAddBtn('+i+','+j+')">'+
					   	'</div>';
			
			//순위형/별점형/선택형일 경우
			var html1 = '<section class="mquestion">'+
							'<h1> 질문입력 </h1> <span class="addtion">최대 8개까지 입력이 가능합니다.</span> '+
							'<div id="container">'+
								'<ul class="tabs">'+
									'<li class="active" rel="tab1">텍스트</li>'+
									'<li rel="tab2">이미지</li>'+
								'</ul>'+
								'<div class="tab_container boxline">'+
									'<div id="tab1" class="tab_content">'+
										txtHtml+
										'<br/><br/>'+
										'<div class="insertBtn">'+
											'<nav>'+
												'<ul>'+
													'<li>'+
														'<a href="#" class="saveSurvey" id="survey1"/></a>'+
													'</li>'+
													'<li>'+
														'<a href="#" class="cancelSurvey" id="cancel1"/></a>'+
													'</li>'+
												'</ul>'+
											'</nav>'+
										'</div>'+
									'</div>'+	
									'<div id="tab2" class="tab_content">'+
										fileHtml+
										'<br/><br/>'+
										'<div class="insertBtn">'+
											'<nav>'+
												'<ul>'+
													'<li>'+
														'<a href="#" class="saveSurvey" id="survey2"/></a>'+
													'</li>'+
													'<li>'+
														'<a href="#" class="cancelSurvey" id="cancel2"/></a>'+
													'</li>'+
												'</ul>'+
											'</nav>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</section>';
			
			//텍스트형일 경우
			var html2 = '<section class="mquestion">'+
							'<h1> 질문입력 </h1> <span class="addtion">최대 8개까지 입력이 가능합니다.</span> '+
							txtHtml+
							'<br/><br/>'+
							'<div class="insertBtn">'+
								'<nav>'+
									'<ul>'+
										'<li>'+
											'<a href="#" class="saveSurvey" id="survey1"/></a>'+
										'</li>'+
										'<li>'+
											'<a href="#" class="cancelSurvey" id="cancel1"/></a>'+
										'</li>'+
									'</ul>'+
								'</nav>'+
							'</div>'+
						'</section>';
			
			//순위형/별점형/선택형일 경우 append
			if(btn1Click==true || btn2Click==true || btn4Click==true){
				$('#insertDiv').append(html1);
			}else if(btn5Click==true){	//텍스트형일 경우 append
				$('#insertDiv').append(html2);
			}
			
			//별점형일 경우 surveyTitle 이미지 출력
			if(btn2Click==true){
				//surveytitle 이미지 출력
				readSvyTitleImg(i);
			}
			
			//순위형/별점형/선택형일 경우
			if(btn1Click==true || btn2Click==true || btn4Click==true){
				//탭형식 
				tabsFunc();
				
				//파일 -> 답변추가로 버튼명 변경
				fileBtnChg();
				
				//파일 이미지 출력
				readImg(i);
			}//if
		}//if
	}
	
	//택일형 클릭시 질문, 내용 txt append하기
	function btn3Txt(){
		if(typeof $('#secondSurveyTitle').val()=='undefined' && typeof $('#surveyContents1').val()=='undefined' && typeof $('#surveyContents2').val()=='undefined'){

			//i, j 선언
			var i=0, j=0;
			
			//radio 버튼 
			var choiceHtml = '<div id="choiceDiv">'+
							  	'<span>'+
							  		'<label><input type="radio" name="choice" value="2">2개</label>'+
							  		'<label><input type="radio" name="choice" value="4">4개</label>'+
							  		'<label><input type="radio" name="choice" value="8">8개</label>'+
							  	'</span>'+
							 '</div>'+
							 '<div id="txtDiv">'+
							 '</div>';
			
			//텍스트/이미지 탭				  
			$('#insertDiv').append('<div id="container">'+
									'<ul class="tabs">'+
										'<li class="active" rel="tab1">텍스트</li>'+
										'<li rel="tab2">이미지</li>'+
									'</ul>'+
									'<div class="tab_container">'+
										'<div id="tab1" class="tab_content boxline">'+
											choiceHtml+
											//'<br/><br/><input type="button" id="survey1" value="저장" /><input type="button" id="cancel1" value="취소" />'+
										'</div>'+	
										'<div id="tab2" class="tab_content boxline">'+
											choiceHtml+
											//fileHtml+
											'<br/><br/>'+
											'<div class="insertBtn">'+
												'<nav>'+
													'<ul>'+
														'<li>'+
															'<a href="#" class="saveSurvey" id="survey2"/></a>'+
														'</li>'+
														'<li>'+
															'<a href="#" class="cancelSurvey" id="cancel2"/></a>'+
														'</li>'+
													'</ul>'+
												'</nav>'+
											'</div>'+
										'</div>'+
									'</div>'+
								'</div>');
			
			$('input[name="choice"]').on("click", function(){
				//다른 라디오 버튼 클릭시 초기화 (txtDiv 하위요소 제거)
				$('#tab1 #txtDiv').empty();
				$('#tab2 #txtDiv').empty();
					
				//텍스트탭 질문
				//title 질문
				var contsHtml = '<input type="text" id="secondSurveyTitle1" name="secondSurveyTitle" placeholder="질문을 입력해주세요."><div></div>';
				
				//텍스트 탭 라디오버튼 체크
				//2개 택일형
				if($('#tab1 input:radio[name="choice"]:checked').val() == '2'){
					//contents 내용
					for(var i=0; i<2; i++){
						contsHtml += '<span id="txtContsDiv'+(i+1)+'">'+
										'<input type="text" id="surveyContents'+(i+1)+'" name="surveyContents" placeholder="내용을 입력해주세요.">'+
									 '</span>'+
									 '<div></div>';
					}//for
				}else if($('#tab1 input:radio[name="choice"]:checked').val()=='4'){//4개 택일형
					//contents 내용
					for(var i=0; i<4; i++){
						contsHtml += '<span id="txtContsDiv'+(i+1)+'">'+
										'<input type="text" id="surveyContents'+(i+1)+'" name="surveyContents" placeholder="내용을 입력해주세요.">'+
									 '</span>'+
									 '<div></div>';
					}//for
				}else if($('#tab1 input:radio[name="choice"]:checked').val()=='8'){//8개 택일형
					//contents 내용
					for(var i=0; i<8; i++){
						contsHtml += '<span id="txtContsDiv'+(i+1)+'">'+
										'<input type="text" id="surveyContents'+(i+1)+'" name="surveyContents" placeholder="내용을 입력해주세요.">'+
									 '</span>'+
									 '<div></div>';
					}//for
				}//if
				
				//텍스트탭 insertDiv에 contents append
				$('#tab1 #txtDiv').append(contsHtml);
				
				
				//이미지탭 질문 txt
				var fileHtml = '<input type="text" id="secondSurveyTitle2" name="secondSurveyTitle" placeholder="질문을 입력해주세요."><div></div>';
				
				//이미지 탭 라디오버튼 체크
				//2개 택일형
				if($('#tab2 input:radio[name="choice"]:checked').val() == '2'){
					//contents 내용
					for(var i=0; i<2; i++){
						// 이미지 파일 
						fileHtml += '<input type="file" id="surveyImagePath'+(i+1)+'" name="surveyImagePath" >'+
									'<div class="contsDiv" id="contsDiv'+(i+1)+'">'+
							   			'<img class="img" id="img'+(i+1)+'" alt="" src="" style="background:url(/images/common/builder/survey/img_add.png); no-repeat;"> '+
										'<div></div><span id="txtContsDiv'+(i+1)+'"><input type="text" id="surveyContents'+(i+1)+'" name="surveyContents" placeholder="내용을 입력해주세요."></span>'+	
							   		'</div>'; 
					}//for
				}else if($('#tab2 input:radio[name="choice"]:checked').val()=='4'){//4개 택일형
					//contents 내용
					for(var i=0; i<4; i++){
						// 이미지 파일 
						fileHtml += '<input type="file" id="surveyImagePath'+(i+1)+'" name="surveyImagePath" >'+
									'<div class="contsDiv" id="contsDiv'+(i+1)+'">'+
							   			'<img class="img" id="img'+(i+1)+'" alt="" src=""> '+
							   			'<div></div><span id="txtContsDiv'+(i+1)+'"><input type="text" id="surveyContents'+(i+1)+'" name="surveyContents" placeholder="내용을 입력해주세요."></span>'+
							   		'</div>'; 
					}//for
				}else if($('#tab2 input:radio[name="choice"]:checked').val()=='8'){//8개 택일형
					//contents 내용
					for(var i=0; i<8; i++){
						// 이미지 파일 
						fileHtml += '<input type="file" id="surveyImagePath'+(i+1)+'" name="surveyImagePath" >'+
									'<div class="contsDiv" id="contsDiv'+(i+1)+'">'+
							   			'<img class="img" id="img'+(i+1)+'" alt="" src=""> '+
							   			'<div></div><span id="txtContsDiv'+(i+1)+'"><input type="text" id="surveyContents'+(i+1)+'" name="surveyContents" placeholder="내용을 입력해주세요."></span>'+
							   		'</div>'; 
					}//for
				}//if
				
				//이미지탭 append
				$('#tab2 #txtDiv').append(fileHtml);	
			});
			
			//저장/취소 버튼 append 
			$('#txtDiv').after('<br/><br/>'+
								'<div class="insertBtn">'+
									'<nav>'+
										'<ul>'+
											'<li>'+
												'<a href="#" class="saveSurvey" id="survey1"/></a>'+
											'</li>'+
											'<li>'+
												'<a href="#" class="cancelSurvey" id="cancel1"/></a>'+
											'</li>'+
										'</ul>'+
									'</nav>'+
								'</div>');
			
			//탭형식 
			tabsFunc();
			
			//파일 -> 답변추가로 버튼명 변경
			fileBtnChg();
			
			//파일 이미지 출력
			readImg(i);
		}//if
	}
	
	//질문txt와 내용1txt, 내용2txt의 값 validation 체크
	function txtValChk() {
		
		//탭 유무 chk
		if(btn1Click==true || btn2Click==true || btn3Click==true || btn4Click==true){//순위형/별점형/택일형/선택형일 경우 tab이 있음
			var tabChk = '#tab1 ';
		}else if(btn5Click==true){
			var tabChk = '';
		}//if
		
		console.log('tabChk:::'+tabChk);
		
		if($('#insertDiv').val()!=undefined){	//새로 등록할 때
			if(btn2Click==true){//별점형일 경우 중질문 이미지 val chk
				if($(tabChk+'#secSvyTitleImg').attr('src')==''){
					if($(tabChk+'#secSvyTitleImgChkSpan').val()==undefined){
						$(tabChk+'.secSvyTitleDiv').append('<div></div><span id="secSvyTitleImgChkSpan"> *중질문 이미지를 추가해주세요.</span>')
					}//if
				}else {
					$(tabChk+'#secSvyTitleImgChkSpan').remove();
				}//if
			}//if
			//질문txt 값이 null이면
			if($(tabChk+'input[name="secondSurveyTitle"]').val()==''){
				//secondSurveyTitle validation span이 없으면 추가
				if($(tabChk+'#titleValChkSpan').val()==undefined){
					$(tabChk+'input[name="secondSurveyTitle"]').after('<div></div><span id="titleValChkSpan"> *질문을 입력해주세요.</span>');
				}//if
			}else {
				//질문txt 값이 있으면 validation span 제거
				$(tabChk+'#titleValChkSpan').remove();
			}//if
		}else {//수정할 때
			if(btn2Click==true){//별점형일 경우 추후 수정
				if($('#secSvyTitleImgChkSpan').val()==undefined){
					$('.secSvyTitleDiv').append('<span id="secSvyTitleImgChkSpan"> *중질문 이미지를 추가해주세요.</span>')
				}
			}
			if($('input[name="secondSurveyTitle"]').val()==''){
				//secondSurveyTitle validation span이 없으면 추가
				if($('#titleValChkSpan').val()==undefined){
					$('input[name="secondSurveyTitle"]').after('<div></div><span id="titleValChkSpan"> *질문을 입력해주세요.</span>');
				}//if
			} else {
				//질문txt 값이 있으면 validation span 제거
				$('#titleValChkSpan').remove();
			}//if
		}//if
		var titleCnt = $('.titleSpan').size();
		
		//새로 insert일 때
		if($('#insertDiv').val()!=undefined){
			console.log('하하');
			for(var j=0; j<2; j++){
				if($(tabChk+'#surveyContents'+(j+1)+'').val()==''){
					//내용 validation span이 없으면 추가
					if($(tabChk+'#contsValChkSpan'+(j+1)+'').val()==undefined){
						$(tabChk+'#txtContsDiv'+(j+1)+'').after('<div></div><span class="contsValChkSpan" id="contsValChkSpan'+(j+1)+'"> *내용을 입력해주세요.</span><div></div>');
					}//if
				} else {
					//내용txt 값이 있으면 validation span 제거
					$(tabChk+'#contsValChkSpan'+(j+1)+'').remove();
				}//if
			}//for
		}else {//수정시
			//title for문
			for(var i=0; i<titleCnt; i++){
				//contents 2개만 validation 체크
				for(var j=0; j<2; j++){
					//int로 변환
					i = parseInt(i);
					j = parseInt(j);
					
					 //컨텐츠 값 선언
					var contsVal = $('#surveyDiv'+i+' #surveyContents'+(i+1)+'_'+(j+1)+'').val();
					
					//text box이면서 값이 null일때 
				 	if(typeof contsVal=='string' && (!contsVal || contsVal=='')){
						//내용 validation span이 없으면 추가
						if($('#surveyDiv'+(i)+' #contsValChkSpan'+(j+1)+'').val()==undefined){
							$('#surveyDiv'+(i)+' #removeBtn'+(j+1)+'').after('<div></div><span class="contsValChkSpan" id="contsValChkSpan'+(j+1)+'"> *내용을 입력해주세요.</span><div></div>');
						}//if
					}else if((typeof contsVal=='string' && (contsVal && contsVal!=''))) { //text box이면서 값이 null이 아닐 때
						//내용txt 값이 있으면 validation span 제거
						$('#surveyDiv'+(i)+' #contsValChkSpan'+(j+1)+'').remove();
					}//if
				}//for		
			}//for
		}//if
		
		//택일형 등록시 val chk
		if(btn3Click==true){
			var txtContsCnt = $(tabChk+'input[id*="surveyContents"]').size();
			for(var i=0; i<txtContsCnt; i++){
				if($(tabChk+'#surveyContents'+(i+1)+'').val()==''){
					//내용 validation span이 없으면 추가
					if($(tabChk+'#contsValChkSpan'+(i+1)+'').val()==undefined){
						$(tabChk+'#txtContsDiv'+(i+1)+'').after('<div></div><span class="contsValChkSpan" id="contsValChkSpan'+(i+1)+'"> *내용을 입력해주세요.</span><div></div>');
					}//if
				} else {
					//내용txt 값이 있으면 validation span 제거
					$(tabChk+'#contsValChkSpan'+(i+1)+'').remove();
				}//if					
			}//for
		}//if
	}	
			
	//이미지 validation 체크		
	function imgValChk(){
		if($('#insertDiv').val()!=undefined){//새로 등록시 
			if(btn2Click==true){//별점형일 경우 중질문 이미지 val chk
				if($('#tab2 #secSvyTitleImg').attr('src')==''){
					if($('#tab2 #secSvyTitleImgChkSpan').val()==undefined){
						$('#tab2 .secSvyTitleDiv').append('<div></div><span id="secSvyTitleImgChkSpan"> *중질문 이미지를 추가해주세요.</span>')
					}//if
				}else {
					$('#tab2 #secSvyTitleImgChkSpan').remove();
				}//if
			}//if
			//질문txt 값이 null이면
			if($('#tab2 input[name="secondSurveyTitle"]').val()==''){
				//secondSurveyTitle validation span이 없으면 추가
				if($('#tab2 #titleValChkSpan').val()==undefined){
					if(btn1Click==true || btn2Click==true || btn4Click==true){
						$('#tab2 #addConts1').after('<div></div><span id="titleValChkSpan"> *질문을 입력해주세요.</span>');
					}else if(btn3Click==true){
						$('#tab2 #secondSurveyTitle2').after('<div></div><span id="titleValChkSpan"> *질문을 입력해주세요.</span>');
					}//if
				}//if
			}else {
				//질문txt 값이 있으면 validation span 제거
				$('#tab2 #titleValChkSpan').remove();
			}//if
		}else {//수정시
			//질문txt 값이 null이면
			if($('input[name="secondSurveyTitle"]').val()==''){
				//secondSurveyTitle validation span이 없으면 추가
				if($('#titleValChkSpan').val()==undefined){
					console.log($('input[name="secondSurveyTitle"]').next());
					$('input[name="secondSurveyTitle"]').next().after('<div></div><span id="titleValChkSpan"> *질문을 입력해주세요.</span>');
					//$('input[name="secondSurveyTitle"]').after('<div></div><span id="titleValChkSpan"> 질문을 입력해주세요.</span>');
				}//if
			}else {
				//질문txt 값이 있으면 validation span 제거
				$('#titleValChkSpan').remove();
			}//if
		}//if	
		
		if($('#insertDiv').val()!=undefined){//새로 등록시
			//txt val chk
			for(var j=0; j<8; j++){
				if($('#tab2 #surveyContents'+(j+1)+'').val()==''){
					//내용 validation span이 없으면 추가
					
					if($('#tab2 #contsValChkSpan'+(j+1)+'').val()==undefined){
						$('#tab2 #txtContsDiv'+(j+1)+'').after('<div></div><span class="contsValChkSpan" id="contsValChkSpan'+(j+1)+'"> *내용을 입력해주세요.</span>');
					}//if
				} else {
					//내용txt 값이 있으면 validation span 제거
					$('#tab2 #contsValChkSpan'+(j+1)+'').remove();
				}//if
			}//for
			
			//이미지 컨텐츠 등록시 img chk 
			var imgCnt = $('#tab2 .img').size();
			console.log('imgCnt::'+imgCnt);
			for(var j=0; j<8; j++){
				console.log('j:::'+j);
				if( $('#tab2 #img'+(j+1)+'').attr('src')=='' ){
					//img chk span이 없으면 추가
					if($('#tab2 #imgChkSpan'+(j+1)+'').val()==undefined){
						$('#tab2 #img'+(j+1)+'').after('<div></div><span class="imgChkSpan" id="imgChkSpan'+(j+1)+'"> *이미지를 추가해주세요.</span>');
					}//if
				}else {
					//img가 있으면 img chk span 제거
					$('#tab2 #imgChkSpan'+(j+1)+'').remove();
				}//if
			}//for
		}else {//수정시
			
			var titleCnt = $('.titleSpan').size();
			//title for문
			for(var i=0; i<titleCnt; i++){
				//contents validation 체크
				//컨텐츠 개수 선언
				var contsCnt = $('#surveyDiv'+i+' .contsDiv'+i+'').size();
				
				for(var j=0; j<contsCnt; j++){
					//int로 변환
					i = parseInt(i);
					j = parseInt(j);
				 	
					//surveyType 값 선언
					var surveyAnswerTypeVal = $('#surveyDiv'+i+' input[name="surveyAnswerType"]').val();
				 
					//text box이면서 값이 null일때 
					if($('#surveyDiv'+i+' #surveyContents'+(i+1)+'_'+(j+1)+'').val()==''){
						//내용 validation span이 없으면 추가
						if($('#surveyDiv'+i+' #contsValChkSpan'+(j+1)+'').val()==undefined){
							$('#surveyDiv'+i+' #txtContsDiv'+(j+1)+'').after('<div></div><span class="contsValChkSpan" id="contsValChkSpan'+(j+1)+'"> *내용을 입력해주세요.</span>');
							return false;
						}//if
					} else {
						//내용txt 값이 있으면 validation span 제거
						$('#surveyDiv'+i+' #contsValChkSpan'+(j+1)+'').remove();
					}//if
					
					//img가 없을 때 val chk
					if( $('#surveyDiv'+i+' #img'+(i+1)+'_'+(j+1)+'').attr('src')=='' ){
						//img chk span이 없으면 추가
						if($('#surveyDiv'+i+' #imgChkSpan'+(i+1)+'_'+(j+1)+'').val()==undefined){
							$('#surveyDiv'+i+' #img'+(i+1)+'_'+(j+1)+'').after('<div></div><span class="imgChkSpan" id="imgChkSpan'+(i+1)+'_'+(j+1)+'"> *이미지를 추가해주세요.</span>');
						}//if
					}else {
						//img가 있으면 img chk span 제거
						$('#surveyDiv'+i+' #imgChkSpan'+(i+1)+'_'+(j+1)+'').remove();
					}//if 
					
					/*
					//컨텐츠 값 선언
					var contsVal = $('#surveyDiv'+i+' #surveyContents'+(i+1)+'_'+(j+1)+'').val();
					console.log('contsVal:'+contsVal);
				 	if(typeof contsVal=='string' && (!contsVal || contsVal=='')){
						console.log(typeof $('#surveyContents'+(i+1)+'_'+(j+1)+'').val());
						console.log($('#surveyContents'+(i+1)+'_'+(j+1)+'').val());
						console.log($('#surveyContents'+(i+1)+'_'+(j+1)+''));
						console.log('i_j:'+(i+1)+'_'+(j+1));
						
						//내용 validation span이 없으면 추가
						if($('#surveyDiv'+i+' #contsValChkSpan'+(j+1)+'').val()==undefined){
							console.log('컨텐츠 val 체크!!!');
							$('#surveyDiv'+i+' #txtContsDiv'+(j+1)+'').after('<div></div><span class="contsValChkSpan" id="contsValChkSpan'+(j+1)+'"> 내용을 입력해주세요.</span>');
							console.log($('#surveyDiv'+i+' #txtContsDiv'+(j+1)+'').attr('id'));
							console.log($('#contsValChkSpan'+(j+1)+'').attr('id'));
						}//if
					}else if((typeof contsVal=='string' && (contsVal && contsVal!=''))) { //text box이면서 값이 null이 아닐 때
						//내용txt 값이 있으면 validation span 제거
						$('#surveyDiv'+i+' #contsValChkSpan'+(j+1)+'').remove();
					}//if
					*/
				}//for	
			}//for
		}//if
	}		
	
	//설문조사 insert ajax
	function insertAjax(){
		
		//탭 유무 chk
		if(btn1Click==true || btn2Click==true || btn3Click==true || btn4Click==true){//순위형/별점형/택일형/선택형일 경우 tab이 있음
			var tabChk = '#tab1 ';
		}else if(btn5Click==true){
			var tabChk = '';
		}//if
		
		//택일형 등록시 val chk
		if(btn3Click==true){
			//택일형 radio chk
			RadioTxtChkVal = $('input:radio[name="choice"]:checked').val();
			//택일형 div가 보이면서 라디오 버튼을 선택하지 않으면
			if($('#choiceDiv').val()!=undefined){
				if(RadioTxtChkVal==undefined){
					alert('갯수를 선택 후 설문을 작성해주세요.');
					return false;
				}//if
			}//if
		}//if
		
		//텍스트탭 insert
		//질문txt와 내용1txt 내용2txt 모두 값이 있으면 db에 저장
		if($('li[rel="tab1"]').attr('class')=='active' || btn5Click==true){
		//if( $(tabChk+'#secondSurveyTitle1').val()!='' && $(tabChk+'#surveyContents1').val()!='' && $(tabChk+'#surveyContents2').val()!='' ){
			console.log('tabChk::'+tabChk);
			
			//txt val chk
			var txtContsCnt1 = $(tabChk+'input[id*="surveyContents"]').size();
			for(var i=0; i<txtContsCnt1; i++){
				if($(tabChk+'#contsValChkSpan'+(i+1)+'').attr('id')!=undefined){
					console.log('텍스트탭 txt val chk');
					return false;
				}//if
			}//for
			
			//FormData 선언
			var fd = new FormData();

			if(btn2Click==true){//별점형일 경우 중질문 이미지 val chk
				if($(tabChk+'#secSvyTitleImg').attr('src')==''){
					return false;
				}
				var titleFile = $('#tab1 #secSvyTitleUpload').prop('files')[0];
				console.log('titleFile::'+titleFile);
				fd.append('titleFile', titleFile);
				
			}
			
			//모든 text 필드 값
			var data = $(tabChk+'input[type="text"]').serialize();
			console.log('tabChk::'+tabChk);
			//var data = $('input[type="text"]').not('input[name="secondSurveyTitle"]').serialize();
			 
			//설문조사 유형, 순위형 : 1
			if(btn1Click==true){
				fd.append('surveyType', 1);
			}else if(btn2Click==true){	//설문조사 유형, 별점형 : 2
				fd.append('surveyType', 2);
			}else if(btn3Click==true){	//설문조사 유형, 택일형 : 3
				fd.append('surveyType', 3);
			}else if(btn4Click==true){	//설문조사 유형, 선택형 : 4
				fd.append('surveyType', 4);
			}else if(btn5Click==true){	//설문조사 유형, 텍스트형 : 5
				fd.append('surveyType', 5);
			}//if
			
			//설문조사 id 값
			fd.append('surveyId', $('#surveyId').val());
			//모든 text 필드 값 append
			fd.append('data', data);
			
			console.log('surveyId::'+$('#surveyId').val());
			//console.log('surveyType::'+surveyType);
			console.log('data::'+data);
			console.log(fd);
		
			$.ajax({
				url : '/upload/insertSurveySecondTitle',
				data : fd,
				type : 'POST',
				//dataType: 'json',
				processData : false,
				contentType : false,
				success : function(){
					alert('설문지가 저장되었습니다.');
					//팝업 초기화 
					reloadPopFunc();
				}//end success
			});//end ajax
			
		}else if($('li[rel="tab2"]').attr('class')=='active'){
			
			console.log('이미지 저장');
			
			//이미지탭일 경우
			if($('li[rel="tab2"]').attr('class')=='active'){
				var contsDivCnt = $('#tab2 div[id*="contsDiv"]').size();
				console.log('contsDivCnt:::'+contsDivCnt);
				if(contsDivCnt<2){
					alert('최소 2개 이상의 답변을 작성해주세요.');
					return false;
				}//if
			}//if
			
			var txtContsCnt2 = $('#tab2 input[id*="surveyContents"]').size();
			for(var i=0; i<txtContsCnt2; i++){
				if($('#tab2 #contsValChkSpan'+(i+1)+'').attr('id')!=undefined){
					console.log('이미지탭 이미지 val chk');
					return false;
				}//if
			}//for
			
			//img val chk
			var imgContsCnt = $('#tab2 .img').size();
			for(var i=0; i<imgContsCnt; i++){
				if($('#tab2 #imgChkSpan'+(i+1)+'').attr('id')!=undefined){
					console.log('이미지탭 이미지 val chk');
					return false;
				}//if
			}//for
			
			
			//FormData 선언
			var fd = new FormData();
			
			if(btn2Click==true){//별점형일 경우 중질문 이미지 val chk
				if($('#tab2 #secSvyTitleImg').attr('src')==''){
					return false;
				}
				var titleFile = $('#tab2 #secSvyTitleUpload').prop('files')[0];
				console.log('titleFile::'+titleFile);
				fd.append('titleFile', titleFile);
				
			}
			
			//모든 text 필드 값
			var data = $('#tab2 input[type="text"]').serialize();
		
			//중질문 답변 이미지 파일 개수
			var fileCnt = $('#tab2 input[name="surveyImagePath"]').size();
			console.log('fileCnt:::'+fileCnt);
			
			//중질문 답변 이미지 파일 값
			for(var i=0; i<fileCnt; i++){
				i = parseInt(i);	
				var file = $('#tab2 input[name="surveyImagePath"]')[i].files[0];
				
				fd.append('file', file);
				console.log(file);
			}//for
			
			//설문조사 유형, 순위형 : 1
			if(btn1Click==true){
				fd.append('surveyType', 1);
			}else if(btn2Click==true){	//설문조사 유형, 별점형 : 2
				fd.append('surveyType', 2);
			}else if(btn3Click==true){	//설문조사 유형, 택일형 : 3
				fd.append('surveyType', 3);
			}else if(btn4Click==true){	//설문조사 유형, 선택형 : 4
				fd.append('surveyType', 4);
			}else if(btn5Click==true){	//설문조사 유형, 텍스트형 : 5
				fd.append('surveyType', 5);
			}//if
			
			//설문조사 id 값
			fd.append('surveyId', $('#surveyId').val());
			//모든 text 필드 값 append
			fd.append('data', data);
			
			$.ajax({
				url : '/upload/insertSurveySecondTitle',
				data : fd,
				type : 'POST',
				//dataType: 'json',
				processData : false,
				contentType : false,
				success : function(){
					alert('설문지가 저장되었습니다.');
					//팝업 초기화 
					reloadPopFunc();
				}//end success
			});//end ajax
			
			
		}//if
	}
	
	//임시저장
	function tempStore(i, j){
		//FormData 선언
		var fd = new FormData();
		
		if($('#surveyType'+(i+1)+'').val()=='2'){//별점형일 경우 중질문 이미지 val chk
			if($('#secSvyTitleImg'+(i+1)+'').attr('src')==''){
				return false;
			}
			var titleFile = $('#secSvyTitleUpload'+(i+1)+'').prop('files')[0];
			console.log('titleFile::'+titleFile);
			fd.append('titleFile', titleFile);
		}//if
		
		//컨텐츠 array 선언 
		var conts = new Array();
		
		var value = imgArr.getValue();
		if($('#surveyAnswerType'+(i+1)+'').val()=='2'){	//이미지일 경우에만 이쪽을 돔
			for(var no in value){
				no = parseInt(no);
				var contsNo = value[no].split('_')[1];
				console.log('value[no]::'+value[no]);
				console.log('contsNo::'+contsNo);
				//file length 선언
				var fileLeng = $('#surveyDiv'+i+' input[type="file"]').size();
				console.log('fileLeng::'+fileLeng);
				
				//contsId 값
				var contsId = $('#'+value[no]).children('input[name="surveyContentsId"]').val();
				console.log('해당 no에 대한 contsId:'+contsId);
				//img path id 값
				var imgPathId = $('#'+value[no]).children('input[name="surveyImagePath"]').attr('id');
				console.log('해당 no에 대한 imgPathId:'+imgPathId);
				//var file = ($('#'+value[no]).children('input[name="surveyImagePath"]'))[no].files[0];
				var file = $('#surveyDiv'+i+' input[name="surveyImagePath"]')[(contsNo-1)].files[0];
				fd.append('file', file);
				//var file = $('#surveyDiv'+i+' input[type="file"]')[(fileLeng-1)].files[0];
				//console.log(file);
				
				//이미지일 경우 텍스트는 안받음(이미지만 받는다)
				
				//컨텐츠 내용 div id 값 선언 (이미지일시 텍스트 값 안받음 혹시 모르니 추후 삭제) 
				//var txtContsDiv = $('#'+value[no]).children('#txtContsDiv'+(contsNo)+'').attr('id');
				//컨텐츠 내용 값 
				//var txtContsVal = $('#'+txtContsDiv+'').children('input[name="surveyContents"]').val();
				//console.log('해당 no에 대한 txtContsVal:'+txtContsVal);
				
				//컨텐츠들을 담음
				conts.push({'contsId':contsId, 'imgPathId':imgPathId});
				//conts.push({'contsId':contsId, 'imgPathId':imgPathId, 'txtContsVal':txtContsVal});
				console.log(file);
			}//for
		}//if
			
		//컨텐츠를 json string으로 담음
		var contsJson = JSON.stringify(conts);
		
		//답변 타입 선언
		var surveyAnswerTypeVal = $('#surveyDiv'+i+' input[name="surveyAnswerType"]').val();
		
		if(surveyAnswerTypeVal=='1'){//텍스트 타입
			txtValChk();
		}else if(surveyAnswerTypeVal=='2'){//이미지 타입
			imgValChk();
		}//if
		
		//해당 질문의 컨텐츠 개수 선언
		var ContsCnt = $('#surveyDiv'+i+' .contsDiv'+i+'').size();
		
		//컨텐츠 img와 txt val chk 
		for(var no=0; no<ContsCnt; no++){
			if($('#surveyDiv'+i+' #contsValChkSpan'+(no+1)+'').attr('id')!=undefined){
				return false;
			}//if
	
			if($('#surveyDiv'+i+' #imgChkSpan'+(i+1)+'_'+(no+1)+'').attr('id')!=undefined){
				return false;
			}//if
		}//for
		
		//질문txt와 내용1txt 내용2txt 모두 값이 있으면 db에 저장
		if($('input[name="secondSurveyTitle"]').val()!='' && $('#surveyContents'+(i+1)+'_'+(j+1)+'').val()!=''){
			
			//$('#surveyTypeIdSpan'+i+' ');
			//설문조사 유형 id 선언
			var surveyTypeId = $('#surveyTypeId'+(i+1)).val();
			
			//질문 값
			var secondSurveyTitle = $('#surveyDiv'+i+' input[name="secondSurveyTitle"]').val();
			
			//컨텐츠 id 값
			var surveyContentsId = $('#surveyDiv'+i+' input[name="surveyContentsId"]').serialize();
			
			//컨텐츠 txt 값
			var surveyContents = $('#surveyDiv'+i+' input[name="surveyContents"]').serialize();
			
			//질문 append
			fd.append('secondSurveyTitle', secondSurveyTitle);
			//컨텐츠 부분(이미지, id, 컨텐츠txt) append
			fd.append('contsJson', contsJson);
			//컨텐츠 id
			fd.append('surveyContentsId', surveyContentsId);
			//컨텐츠 txt
			fd.append('surveyContents', surveyContents);
			
			$.ajax({
				url : '/upload/tempStoreSvySecTitle?surveyTypeId='+surveyTypeId,
				data : fd,
				//dataType : json,
				type : 'POST',
				processData : false,
				contentType : false,
				success : function(){
					console.log('임시저장 성공!');
					alert('임시 저장되었습니다.');
					
					//팝업 초기화 
					reloadPopFunc();
				}
			});//end ajax
		}//if
	}