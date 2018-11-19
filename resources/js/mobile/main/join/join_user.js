
$(function(){
	
	/***** step1 *****/
	$('.step1_wrap').css('display','');	//step1 보이기
	$('.step2_wrap').css('display','none'); //step2 숨기기	
	$('.step3_wrap').css('display','none');	//step3 숨기기
	$('.step4_wrap').css('display','none');	//step4 숨기기
	$('.step5_wrap').css('display','none');	//step5 숨기기
	$('ul .step1').addClass('On');	//step1 스텝 class 주기
	
	$('#chkagree').click(function(){//동의합니다 클릭시
		var chkagree = $('#chkagree').is(':checked');
	    if(chkagree == true){
	    	$('.chkagree').css('color', '#6aaddb');
	    	$('.chk_img').attr('src', '/img/mobile/main/join/join_check_on_bt.png');
	    }else {
	    	$('.chkagree').css('color', '#fff');
	    	$('.chk_img').attr('src', '/img/mobile/main/join/join_check_off_bt.png');
	    }
	});
	
	$('.chk_img').click(function(e){//동의 체크 이미지 클릭시 
		e.preventDefault();
		$('#chkagree').click();
	});
	
	$('#step1_cancel').click(function(){
		if(confirm("회원가입을 취소하겠습니까?")) {
            location.href= '/m_index';
        } else {
        }
	});
    
	$('#step1_next').click(function(){
		var chkagree = $('#chkagree').is(':checked');
	    if(chkagree == false){
	    	alert('동의하셔야 합니다.')
	    }else{
	    	//location.href = "/m_join/join_step2";
	    	$('.step1_wrap').css('display','none');	//step1 숨기기
	    	$('.step2_wrap').css('display',''); //step2 보이기	
	    	$('.step3_wrap').css('display','none');	//step3 숨기기
	    	$('.step4_wrap').css('display','none');	//step4 숨기기
	    	$('.step5_wrap').css('display','none');	//step5 숨기기
	    	$('ul .step1').removeClass('On');	//step1 스텝 class 제거
	    	$('ul .step2').addClass('On');	//step2 스텝 class 주기
		}
	})
	/*****step1 *****/
	
	
	/*****step2 *****/
	$('.step2_wrap input').click(function(){//input focus시 bottom 색상 변경
		if( $('input').is(':focus') == true){
			console.log('이메일 포커스!');
			$('.step2_wrap input').parent().parent().css('border-bottom', '1px solid #5c5c5c');
			$(this).parent().parent().css('border-bottom', '1px solid #f9c510');
		}
	});
	
	$('.human').click(function(){//성별 radio 기능
		if( $('#male').is(':checked') == true ){
			$('.male').attr('src', '/img/mobile/main/join/join_man_on.png');
			$('label[for=male]').css('color', '#fac612');
			$('.female').attr('src', '/img/mobile/main/join/join_woman_off.png');
			$('label[for=female]').css('color', '#fff');
		}else if( $('#female').is(':checked') == true){
			$('.male').attr('src', '/img/mobile/main/join/join_man_off.png');
			$('label[for=male]').css('color', '#fff');
			$('.female').attr('src', '/img/mobile/main/join/join_woman_on.png');
			$('label[for=female]').css('color', '#fac612');
		}
	});
	
	var dup = false; //중복체크 여부를 위한 변수
  	var sex = '';
  	$('#checkMail').click(function(){
    	var email1 = $('#email1').val();
    	//var email2 = $('#email2').val();
    	//var email = email1 +'@'+ email2;
    	if(email1 == ''){
      		alert('메일을 입력해주세요');
    	}else{
      		var json = {'email': email1};
	      	$.ajax({
	        	url : '/check_id/email',
	        	data : json,
	        	success : function(data){
	          		if(data=='success'){
			            alert('사용가능한 이메일 입니다.');
	    		        dup = true;
	        	  	}else{
			            alert('사용 불가능한 이메일 입니다.');
	           			//$('#failMail').css('display', '');
	          		}
	        	} 
	    	}); 
   		}
  	});

	//패스워드 일치 일치/불일치 확인
  	$('input[name="sex"]').click(function(){
    	sex = $(this).attr('value');
    	var pw1 = $('#pw1').val();
    	var pw2 = $('#pw2').val();
    	if(pw1 != pw2){
      		$('#discordPw').css('display', '');
      		//$('#join').css('height','auto');
    	}else{
      		$('#discordPw').css('display', 'none');
    	}
  	});
	
	//step2 이전 버튼
	$('#step2_prev').click(function(){
		$('.step1_wrap').css('display','');	//step1 보이기
		$('.step2_wrap').css('display','none'); //step2 숨기기	
		$('.step3_wrap').css('display','none');	//step3 숨기기
		$('.step4_wrap').css('display','none');	//step4 숨기기
		$('.step5_wrap').css('display','none');	//step5 숨기기
		$('ul .step2').removeClass('On');	//step2 스텝 class 제거
		$('ul .step1').addClass('On');	//step1 스텝 class 주기
	});

	//다음으로 Validation check
  	$('#step2_next').click(function(){
    	if(dup == false){
      		alert('이메일 중복체크를 해주세요');
    	}else{
	      	var email1 = $('#email1').val();
	      	//var email2 = $('#email2').val();
	      	var pw1 = $('#pw1').val();
	      	var pw2 = $('#pw2').val();
	      	//var email = email1 +'@'+ email2;
	      	
	      	if(pw1 != pw2){
	      		$('#discordPw').css('display', '');
	      		//$('#join').css('height','auto');
	      		return false;
	    	}else{
	      		$('#discordPw').css('display', 'none');
	    	}
	      	
	      	if($('#discordPw').attr('style') == ''){
	        	alert('비밀번호가 일치하지 않습니다.')
	      	}else{
	        	if(email1 == '' || pw1 =='' || pw2 =='' || sex ==''){
	          		alert('필수항목 입력해주세요.');
	        	}else{
	        		$('.step1_wrap').css('display','none');	//step1 숨기기
	    	    	$('.step2_wrap').css('display','none'); //step2 숨기기	
	    	    	$('.step3_wrap').css('display','');	//step3 보이기
	    	    	$('.step4_wrap').css('display','none'); //step4 숨기기	
	    	    	$('.step5_wrap').css('display','none'); //step5 숨기기	
	    	    	$('ul .step2').removeClass('On');	//step2 스텝 class 제거
	    	    	$('ul .step3').addClass('On');	//step3 스텝 class 주기
	    	    	
	    	    	$('.step3_wrap').parent('#join').css('height', '100%'); //step3 스텝 height auto주기
	          		//$('#u_mail').val(email1);
	          		//$('#u_pw').val(pw1);
	          		//$('#u_sex').val(sex);
	          		//var json = {'email': email1, 'pw':pw1, 'sex':sex};
	          		
	          		/* $.ajax({
	    	        	url : '/m_join/join_step3',
	    	        	data: json,
	    	        	success : function(){
			          		//location.href = '/m_join/join_step3';
	    	        	} 
	    	    	}); */ 
	        	}//if
	      	}//if
    	}//if
  	});
	/***** step2 *****/
  	
  	
  	/***** step3 *****/
  	$("input").focusout(function(){//input text focus 아웃시 이벤트
		console.log('포커스아웃');
		$('input[type=text], input[type=password]').parent().parent().css('border-bottom', '1px solid #5c5c5c');
	});
	
	if( $('.step3_wrap').css('display') != 'none' ){//스텝3이면 height auto
		console.log('스텝3 보이기');
		$('.step3_wrap').parent('#join').css({'height':'100%', 'overflow':'auto'});
	}
	
	$('.step3_wrap input').click(function(){//input focus시 bottom 색상 변경
		if( $('.step3_wrap .nickpro input').is(':focus') == true){
			//$('input').parent().parent().css('border-bottom', '1px solid #5c5c5c');
			$(this).parent().parent().css('border-bottom', '1px solid #f9c510');
		}
	});
	
	//처음에 공개여부 공개 선택
	$('#open').attr('checked','checked');
	if( $('#open').is(':checked')==true ){ //공개 클릭
		$('.open').attr('src', '/img/mobile/main/join/join_open_on.png');
		$('label[for=open]').css('color', "#fac612");
		$('.no_open').attr('src', '/img/mobile/main/join/join_close_off.png');
		$('label[for=no_open]').css('color', "#fff");
	}
	
	$('.open_chk').click(function(){//공개 비공개 라디오 function
		if( $('#open').is(':checked')==true ){ //공개 클릭
			$('.open').attr('src', '/img/mobile/main/join/join_open_on.png');
			$('label[for=open]').css('color', "#fac612");
			$('.no_open').attr('src', '/img/mobile/main/join/join_close_off.png');
			$('label[for=no_open]').css('color', "#fff");
		}else if( $('#no_open').is(':checked') == true ){	//비공개 클릭
			$('.no_open').attr('src', '/img/mobile/main/join/join_close_on.png');
			$('label[for=no_open]').css('color', "#fac612");
			$('.open').attr('src', '/img/mobile/main/join/join_open_off.png');
			$('label[for=open]').css('color', "#fff");
		}//if
	});
	
  	var nick_dup = false; //중보체크 여부를 위한 변수
  	$('#checkNickname').click(function(){
    	var nickName = $('#nickName').val();
    	if(nickName == '' || typeof nickName == 'undefined'){
      		alert('닉네임을 입력해주세요.')
    	}else{
      		var json = {'nickName': nickName};
      		$.ajax({
        		url : '/check_id/nickName',
        		data : json,
        		success : function(data){
          			if(data=='success'){
            			alert('사용 가능한 닉네임 입니다');
            			nick_dup = true;
            			$('#u_nickName').val(nickName);
          			}else{
            			alert('사용 불가능한 닉네임 입니다');
            			$('#nickName').val('');
          			}
        		} 
      		}); 
    	}
    });
  	
  	//프로필 사진
  	$('#image').on('change', function() {
    	var file = $('#image').prop("files")[0];
      	blobURL = window.URL.createObjectURL(file);
      	$('.photowrap img').attr('src', blobURL);
      	$('.photowrap').slideDown(); 
  	});
  
  	//step3 이전 버튼
	$('#step3_prev').click(function(){
		$('.step1_wrap').css('display','none');	//step1 숨기기
    	$('.step2_wrap').css('display',''); //step2 보이기	
    	$('.step3_wrap').css('display','none');	//step3 숨기기
    	$('.step4_wrap').css('display','none');	//step4 숨기기
    	$('.step5_wrap').css('display','none');	//step5 숨기기
    	$('ul .step3').removeClass('On');	//step3 스텝 class 제거
    	$('ul .step2').addClass('On');	//step2 스텝 class 주기  
  	});
  
	//다음스텝 이동
  	$('#step3_next').click(function(){
  		
  		/* var slashIdx = $('.step3_wrap .photowrap img').attr('src').lastIndexOf('/');
  		var profileChk = $('.step3_wrap .photowrap img').attr('src').substring(slashIdx+1);
  		console.log('profileChk::'+profileChk);
  		
  		if( profileChk == 'join_pic_bg.png' ){
  			alert('프로필을 사진을 넣어주세요.');
  			return false;
  		} */
  		console.log('nick_dup::'+nick_dup);
		if(nick_dup == false){
      		alert('닉네임 중복체크를 해주세요');
    	}else{
      		var email = $('#email1').val();
      		var pw = $('#pw1').val();
      		var sex = $('input[name="sex"]:checked').val();
      		var nickName = $('#nickName').val();
      		var profile_image = $('#image').prop("files")[0];
      		var openChk = $('input[name="openChk"]:checked').val();
      		console.log('email::'+email);
      		console.log('pw::'+pw);
      		console.log('sex::'+sex);
      		console.log('nickName::'+nickName);
      		console.log('profile_image::'+profile_image);
      		console.log('openChk::'+openChk);
      		
      		var fd = new FormData();
	      	fd.append('email', email);
	      	fd.append('password', pw);
	      	fd.append('sex', sex);
	      	fd.append('nickName',nickName);
	      	fd.append('openChk',openChk);
	      	fd.append('file',profile_image);
	      	//fd.append('openChk', openChk); //추후 컬럼 추가해야됨
	      	
	      	$.ajax({
        		url : '/sign_in',
        		data : fd,
        		processData: false,
        		contentType: false,
        		type : 'POST',
        		success:function(){
        			$('.step1_wrap').css('display','none');	//step1 숨기기
        	    	$('.step2_wrap').css('display','none'); //step2 숨기기	
        	    	$('.step3_wrap').css('display','none');	//step3 숨기기
        	    	$('.step4_wrap').css('display','');	//step4 보이기
        	    	$('.step5_wrap').css('display','none');	//step5 숨기기
        	    	$('ul .step3').removeClass('On');	//step3 스텝 class 제거
        	    	$('ul .step4').addClass('On');	//step4 스텝 class 주기  

        	    	$('.step4_wrap').parent('#join').css('height', '100%'); //step4 스텝 height 100%주기
        	    	
        	    	//step4에 이메일/닉네임 값주기
        	    	$('#reg_email').text($('#email1').val());
        	      	$('#reg_nickName').text($('#nickName').val());
        		}
			});
    	}
  	});
  	/***** step3 *****/
  	
	
  	/***** step4 *****/
  	if( $('.step4_wrap').css('display') != 'none' ){//스텝3이면 height auto
		console.log('스텝4 보이기');
		$('.step4_wrap').parent('#join').css('height', '100%');
	} 
  	
  	$('#startIdo').click(function(){ //IDO 메인으로 이동
    	location.href="/";
  	});
  	
  	/*$('.detail_btn').click(function(){ //상세정보 wrap 띄우기
  		$('#join').css('display','none');
  		$('.step5_wrap').css('display','');
  	});*/
  	/***** step4 *****/
  	
});