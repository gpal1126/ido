$(document).ready(function(){
	$('.select_answer_number_container').css('display','none');

	$('#surveyTitle_input').click(function(){
		$('.select_title_type').css('display','');
		$('.hidden_div').css('height','20%')
	})
	
	$('.select_title_type div').click(function(){
		console.log('들어옴"0')
		$('.sample_wrap .sample_footer').css('display',''); //완료 버튼 보이기
		
		$(this).blur(); 
		console.log('select_title_type::'+$(this).attr('class') );
		console.log('select_title_type::'+$(this).text());
		if( $(this).attr('class') == 'select_title_type_3' ){ //자유형이면
			$('.surveyTitle_input input[type="text"]').attr('placeholder','질문 제목을 입력해주세요.');
			$('.surveyTitle_input input[type="text"]').attr("readonly",false);
			$('.surveyTitle_input input[type="text"]').val($('.select_title_type_3 input[type=text]').val());
			$('.surveyTitle_input input[type="text"]').removeAttr('disabled');
			$('.surveyTitle_input input[type="text"]').css('text-align','left');
			$('.surveyTitle_input input[type="text"]').focus();
		}else {
			$('.surveyTitle_input input[type="text"]').val($(this).text());
			console.log('타이틀값:::::'+$('.surveyTitle_input input[type="text"]').val());
			$('.surveyTitle_input input[type="text"]').attr('disabled','disabled');
			$(this).blur(); 
		}
		
		if( $('.surveyTitle_input input[type="text"]').val()!='undefined' ){//select box 가리기
			$("#number option:eq(0)").attr("selected", "selected");
			$('.select_answer_number_container').css('display','');
			$('.select_title_type').css('display','none');
			$('.hidden_div').css('height','')
			
			var number = $("#number option:selected").val();
			$('#answer_number').val(number);
			$('.sample_answer_view_container').empty();
			/* $('.wrap_footer').css('display',''); */ //
			for(var i=0; i<number; i++){
				$('.sample_answer_view_container').append('<div class="answer_n" id="a_'+(i+1)+'" style="">'+
														   		'<img class="" id="img'+(i+1)+'" onclick="document.all.surveyImagePath'+(i+1)+'.click()" style="object-fit:cover; width:140px; height:140px; border-radius:100px;" src="/img/mobile/builder/survey/reg_survey/answer_n'+(i+1)+'.png">'+
														   		'<input type="file" name="surveyImagePath"id="surveyImagePath'+(i+1)+'" style="display: none;"/>'+
														   '</div>');
			}
			switch(number){
				case '2' : 
					$('.answer_n').css('float', 'left')
					$('.answer_n').css('margin-left', '9%')
					$('.answer_n').css('margin-top', '20%')
				break;
			}
			
			$('.sample_wrap .sample_footer').css('display',''); //완료 버튼 보이기
		}
		
	});

})