function result_selectType(json, i, userId){
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
	$('.surveyContents #surveyDiv'+(i+1)+' .conts_div').append(surveyReplyHtml);

	console.log('???????????????????? : '+$('div[name$=_s4]').attr('id'));
	
	$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'width':'40%'});
	$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'height':$('#contsDiv'+(i+1)+'_'+json.reply.length+'').width()});
	//$('div[class*="contsDiv"]').css({'overflow':'hidden'});
	
	console.log('height:::::'+$('div[class*="contsDiv"]').width());
	switch(json.reply.length){
		case 2 :
			console.log('222222');
			$('.contsContainer').css({'top':'120px'});
			$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'float':'left'});
			$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'margin':'10% 0 10% 10%'});
			$('#surveyForm'+(i+1)+' div[name$=_s2]').css({'margin-left':'5%'});
			$('.surveyFooter').css({'position':'absolute', 'bottom':'0'});
		break;
		case 3 :
			console.log('333333');
			$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'margin':'7.5% 0 0 7%'});  
			$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'float':'left'});
			$('#surveyForm'+(i+1)+' div[name$=_s2]').css({'margin-left':'5%'});
			$('#surveyForm'+(i+1)+' div[name$=_s3]').css({'margin-left':'31%'});
			$('.surveyFooter').css({'position':'absolute', 'bottom':'0'});
		break;
		case 4 :
			console.log('444444');
			$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'margin':'7.5% 0 0 7%'});
			$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'float':'left'});
			$('#surveyForm'+(i+1)+' div[name$=_s2], div[name$=_s4]').css({'margin-left':'5%'});
			$('.surveyFooter').css({'position':'absolute', 'bottom':'0'});
		break;
		case 5 :
			console.log('555555');
			$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'margin':'7.5% 0 0 7%'});
			$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'float':'left'});
			$('#surveyForm'+(i+1)+' div[name$=_s2], div[name$=_s4]').css({'margin-left':'5%'});
			//$('div[name$=_s5]').css({'margin-left':'30%'});
			$('.surveyFooter').css({'position':'', 'padding-bottom':'2%'});
		break;
		case 6 :
			console.log('666666');
			$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'margin':'7.5% 0 0 7%'});
			$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'float':'left'});
			$('#surveyForm'+(i+1)+' div[name$=_s2], div[name$=_s4], div[name$=_s6]').css({'margin-left':'5%'});
			$('.surveyFooter').css({'position':'', 'padding-bottom':'2%'});
		break;
		case 7 :
			console.log('77777');
			//$('div[class*="contsDiv"]').css({'height':$('#contsDiv'+(i+1)+'_'+json.reply.length+'').width()});
			$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'margin':'7.5% 0 0 7%'});
			$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'float':'left'});
			$('#surveyForm'+(i+1)+' div[name$=_s2], div[name$=_s4], div[name$=_s6]').css({'margin-left':'5%'});
			//$('div[name$=_s7]').css('margin-left','30%');
			$('.surveyFooter').css({'position':'', 'padding-bottom':'2%'});
		break;
		case 8 :
			console.log('88888');
			//$('div[class*="contsDiv"]').css({'height':$('#contsDiv'+(i+1)+'_'+json.reply.length+'').width()});
			$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'margin':'7.5% 0 0 7%'});
			$('#surveyForm'+(i+1)+' div[class*="contsDiv"]').css({'float':'left'});
			$('#surveyForm'+(i+1)+' div[name$=_s2], div[name$=_s4], div[name$=_s6], div[name$=_s8]').css({'margin-left':'5%'});
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
		
		//선택이미지가 없으면 돋보기 이미지가 보이게
		if( $('#chooseImg_'+(i+1)+'_'+id+'').attr('id') == undefined ){
			$('#select_sub_input_'+(i+1)+'_'+id).parent().after('<div class="zoom_btn" id="zoomBtn_'+(i+1)+'_'+id+'"><img class="magnifying"></div>')
			$('#zoomBtn_'+(i+1)+'_'+id+'').next().css({'position':'relative', 'top':'-70px'});
			$('#zoomBtn_'+(i+1)+'_'+id+'').css('top', '-150px');
			$('#contentsSpan'+(i+1)+'_'+id+'').parent().css('top','-149px');
		}//if
		
		var surveyContentsId = $('#zoomBtn_'+(i+1)+'_'+id+'').parents().children('.img').children('.surveyContentsId').val();
		location.href="/m_view_origin_image?surveyContentsId="+surveyContentsId;
		
		$('#surveyForm'+(i+1)+' .zoom_btn').remove();	//돋보기 제거
		$('#contentsSpan'+(i+1)+'_'+id+'').parent().css('top','0px');	//텍스트 위치
		
		/*
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
				
				/** 0.1초 후에 돋보기 클릭 가능 **//*
				//응답 이미지 taphold (돋보기 바로 클릭 방지 위해)
				select_taphold = false;
				setTimeout( function() {
					//돋보기 taphold 0.1초 후 true로 변경
					select_taphold = true;
					if(select_taphold == false){
						return false;
					}else {
						
						var surveyContentsId = $('#zoomBtn_'+(i+1)+'_'+id+'').parents().children('.img').children('.surveyContentsId').val();
						location.href="/m_view_origin_image?surveyContentsId="+surveyContentsId;
						
						$('#surveyForm'+(i+1)+' .zoom_btn').remove();	//돋보기 제거
						$('#contentsSpan'+(i+1)+'_'+id+'').parent().css('top','0px');	//텍스트 위치
						
						//돋보기 클릭시 이동
						$('#zoomBtn_'+(i+1)+'_'+id+'').click(function(){
						});
					}
				}, 100);
				/** 0.1초 후에 돋보기 클릭 가능 **//*
				
			}
		});//zoomBtn_* on function
		*/
		
	},
	click : function(e){
		
	}
});
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


}/*end selectType */

