
$(document).ready(function(){
	$('#titleDiv').append('<input type="text" id="surveyTitle" name="surveyTitle">'+
							/*'<div class="thumbnailFileDiv"><button class="btn btn-primary btn-sm" id="thumbnailFileBtn">썸네일</button></div><div></div>'+*/
							'<div class="thumbnailDiv" id="thumbnailDiv" style="border:none;">'+
   								'<br/><img class="thumbnailImg" id="thumbnailImg" alt=""  onclick="foo.import();" src="" style="background:url(/images/common/builder/survey/thumbnail_img_bg.png) no-repeat; margin-right:300px; border:none; width:50px; height:25px;">'+
	   					   '</div>');
	// $('#thumbnailImg').click(function(e){
	// 	e.preventDefault();
	// 	$('#surveyThumbnail').click();
	// });
	 
	// //input type=file 숨기기
	// $('#surveyThumbnail').css('display', 'none');
	     
	// $('#surveyThumbnail').change(function(){
	// 	if(this.files && this.files[0]){
	// 		var reader = new FileReader();
			
	// 		reader.onload = function(e){
				
	// 			$('.thumbnailDiv').css('display','inline-block');
	// 			$('.thumbnailDiv').append($('.thumbnailDiv #thumbnailImg').attr('src', e.target.result));
	// 		}
	// 		reader.readAsDataURL(this.files[0]);
	// 	}//if
	// });
});

//대질문 저장하기
// function insertTitle() {
	
// 	//대질문 팝업창 -> 중질문 리스트 팝업창에 대질문 값 뿌리기 
// 	var titleDone = $('#surveyTitle').val();
// 	console.log('titleDone::'+titleDone);
// 	$('#titleDone').val(titleDone);
	
// 	//대질문 val 체크
// 	if($('#surveyTitle').val()==''){
// 		if($('.explain').val()==undefined){
// 			//$('#surveyTitle').after('<div><span id="surveyTitleValChkSpan" style="margin-left:-180px;">* 대질문을 입력해주세요.</span>');	
// 			$('#surveyTitle').after('<div><p class="surveyTitle"> <span class="explain"> 질문을 입력해주세요.</span> </p>');	
// 		}//if
// 	}else {
// 		$('.explain').remove();
// 	}//if
	
// 	if($('.explain').attr('class')!=undefined){
// 		return false;
// 	}//if
	
	
	
// 	//FormData 선언
// 	var fd = new FormData();

// 	//cotentsId 값 받아오기
// 	var contentsId = getUrlParameter('contentsId');
// 	console.log('contentsId:::'+contentsId);
// 	fd.append('contentsId', contentsId);
	
// 	//대질문
// 	fd.append('surveyTitle', $('#surveyTitle').val());
// 	console.log($('#surveyTitle').val())
// 	// var file = $('#surveyThumbnail').prop('files')[0];

// 	//파일 값
// 	fd.append('file', foo.crop(350,250,'png').string);
// 	console.log(foo.crop(350,250,'png').string);
// 	//return false;
	
// 	$.ajax({
// 		url : '/upload/insertSurveyTitle',
// 		data : fd,
// 		type : 'POST',
// 		processData : false,
// 		contentType : false,
// 		success : function(data){
// 			console.log(data[1]);
// 			console.log(data);
			
// 			//서버에서 가져온 surveyId 값을 value에 넣주기 
// 			var surveyId = data[0].surveyId;
// 			$('#surveyId').val(surveyId);
			
// 			//location.href='/views/surveySecondTitleForm?surveyId='+data[0].surveyId;
// 			dialog = $( "#dialog-listSurvey" ).dialog({
// 				autoOpen: true,
// 				height: 1000,
// 				width: 1000,
// 				modal: true,
// 				buttons: {
// 					//"저장": insertTitle,
// 					"닫기": function() {
// 						$( "#dialog-listSurvey" ).dialog( "close" );
// 						$( "#dialog-surveyTitle" ).dialog( "close" );
// 						//컨텐츠 새창으로 다시 돌아가기
// 						location.href="/upload/builder_contents?contentsId="+contentsId;
// 					}
// 				},
// 				close: function() {
// 					//form[ 0 ].reset();
// 					//allFields.removeClass( "ui-state-error" );
// 				}
// 			});
// 		}
// 	});
// }
