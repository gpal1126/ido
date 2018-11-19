
$(document).ready(function(){
	
	
	var newListChk = false; 
	var bestListChk = false;
	
	$.ajax({
      	url:'/reply/view_replyForm?contentsId='+getUrlParameter('contents_id')+'',
      	success:function(data){
			console.log(data); 
      		//var chg_no = data.no;
      		
      		var contents_id = getUrlParameter('contents_id');
			
			//댓글 개수
	      	$('.reply_cnt').html(data.rcount);
			$('#replyCnt').val(data.rcount);
			$('#sessionId').val(data.session);
			
			var session_id = $('#sessionId').val();
			console.log('session_id:::::????'+ session_id);
			
			if(session_id == ''){ //세션이 없으면
				$('.reply_footer #replyContents').attr('disabled', true);
				$('.reply_footer #replyContents').attr('placeholder', '로그인이 필요한 서비스입니다.');
				$('.reply_footer .submit_reply').click(false);
			}else {
				$('.reply_footer #replyContents').attr('disabled', false);
				$('.reply_footer #replyContents').attr('placeholder', '깨끗한 댓글을 달아주세요.');
			}
			
			var replyCnt = $('#replyCnt').val();
			console.log('댓글 수::'+replyCnt);
			
			//댓글 컨텐츠 view
			reply_func(0);
			
			//댓글달기, 추천하기, 삭제하기
  			click_func();
			
		}//end success
	});//end ajax  
	
	function reply_func(no){
		
		console.log('no::'+no);
		
		$.ajax({
	      	url:'/reply/view_reply_info?no='+no+'&contentsId='+getUrlParameter('contents_id')+'',
	      	async: false,
	      	success:function(data){
	      		
	      		console.log(data);
	      		//replyCnt = $('.rep_conts').size();
	      		replyCnt = $('#replyCnt').val();
	      		console.log('댓글 수???'+replyCnt);

	      		var chg_no = data.no;
	      		
	      		//계속 변경되는 no값 - 아래에서 hidden으로 no값을 줌
	            $('#chg_no').val(chg_no);
	      		
	      		console.log('댓글 ejs');
	      		
	      		//var contents_id = data.data1[0].CONTENTS_ID;
	      		var contents_id = getUrlParameter('contents_id');
	      		console.log('contents_id::'+contents_id);
	      		
	      		var session_id = $('#sessionId').val();

	      		var replyInfo = data.reply;
	      		var likeInfo = data.likeInfo;
	      		
	      		console.log('replyInfo.length::'+replyInfo.length);
      			
      			if(no == 0){
      				for(var i=0; i<replyInfo.length; i++){
      					
    	      			console.log('i::'+i);
    	      			//프로필 
    	      			var profilePath =  replyInfo[i].PROFILE_PICTURE_PATH;
    	      			//console.log(profilePath);
    	      			var profileIdx = profilePath.indexOf('/');
    	      			//console.log('indexOf:::::'+profileIdx);
    	      			var profile = profilePath.substring(profileIdx);
    	      			
    	      			var replyHtml = '';
    	      			replyHtml += ''+
    	      						 '<div class="rep_conts">'+
    	      						 	 '<input type="hidden" id="test'+(i+1)+'" value="'+(i+1)+'">'+
    	      						 	 '<input type="hidden" id="contentsReplyId'+(i+1)+'" value="'+replyInfo[i].CONTENTS_REPLY_ID+'">'+
    	      						 	 '<input type="hidden" id="userId'+(i+1)+'" value="'+replyInfo[i].USER_ID+'">'+
    	      							 '<div class="profile"><img src="'+profile+'"></div>'+
    	      						 	 '<div class="right_info">'+
    	      						 		'<div class="nickname">'+replyInfo[i].NIKNAME+'</div>'+
    	      						 		'<div class="reply">'+replyInfo[i].REPLY+'</div>'+
    	      						 		'<div class="rep_date">'+replyInfo[i].REG_DATE+'</div>'+
    	      						 	 '</div>'+
    	      						 	 '<div class="rep_contents_footer">'+
    	      							 	'<div class="rep_delete" id="reqDel'+(i+1)+'">'+
    	      							 		'<div class="delete_bt" id="delBt'+(i+1)+'"><img src="/images/common/main/contents/del_icon.png"></div>'+
    	      							 	'</div>'+
    	      						 		'<div class="rep_like" id="reqLike'+(i+1)+'">'+
    	      						 			'<div class="like_bt" id="likeBt'+(i+1)+'"><img src="/img/mobile/main/reply/best_off.png"></div>'+replyInfo[i].RECOMMENDATION+
    	      						 		'</div>'+
    	      						 	 '</div>'+
    	      						 '</div>'+
    	      			             '';
    	      			$('.reply_contents').append(replyHtml);
    	      		}
      				
      				if(session_id == ''){  //세션이 없으면
    	    			
    	    		}else { 
    	    			for(var i in replyInfo) { 
    	    				for(var j in likeInfo) { 
    	    					//console.log('좋아요 컨텐츠 댓글 id:::::::'+likeInfo[j].CONTENTS_REPLY_ID );
    	    					//console.log('댓글  컨텐츠 댓글 id:::::::'+replyInfo[i].CONTENTS_REPLY_ID );
        						//console.log('i+1::'+(parseInt(i)+1));
        						//console.log('j+1::'+(parseInt(j)+1));
        						//console.log('세션 id::'+session_id);
        						//console.log('ㅇㅇㅇㅇ::'+likeInfo[j].USER_ID);
    	    					//좋아요 컨텐츠_댓글_id와 댓글 컨텐츠_댓글_id가 같고 좋아요플래그가 1이면 
    	    					if( ( likeInfo[j].CONTENTS_REPLY_ID  == replyInfo[i].CONTENTS_REPLY_ID ) && ( likeInfo[j].LIKE_FLAG == '1') ){
    	    					//if( ( session_id == likeInfo[j].USER_ID ) && ( likeInfo[j].LIKE_FLAG == '1') ){
    	    						$('#likeBt'+(parseInt(i)+1)+' img').attr('src','/img/mobile/main/reply/best_on.png');
    	    					}//if
    	    				}//for
    	    			}//for
    	    		}//if 
      				
      			}else {
      				var chgNo = parseInt(no) + 1;
          			chgNo = parseInt(chgNo);
          			console.log('chgNo::'+chgNo);
      				
		      		//for(var i=0; i<replyInfo.length; i++){
		      		for(var i=0; i<replyCnt; i++){
		      			
		      			console.log('i:2222:'+i);
		      			//프로필 
		      			var profilePath =  replyInfo[i].PROFILE_PICTURE_PATH;
		      			//console.log(profilePath);
		      			var profileIdx = profilePath.indexOf('/');
		      			//console.log('indexOf:::::'+profileIdx);
		      			var profile = profilePath.substring(profileIdx);
		      			
		      			//댓글 등록일
		      			//var rep_date = new Date(replyInfo[i].REG_DATE).format('yyyy.MM.dd HH:mm');
		      			
		      			var replyHtml = '';
		      			replyHtml += ''+
		      						 '<div class="rep_conts">'+
		      						 	 '<input type="hidden" id="test'+chgNo+'" value="'+chgNo+'">'+
		      						 	 '<input type="hidden" id="contentsReplyId'+chgNo+'" value="'+replyInfo[i].CONTENTS_REPLY_ID+'">'+
		      						 	 '<input type="hidden" id="userId'+chgNo+'" value="'+replyInfo[i].USER_ID+'">'+
		      							 '<div class="profile"><img src="'+profile+'"></div>'+
		      						 	 '<div class="right_info">'+
		      						 		'<div class="nickname">'+replyInfo[i].NIKNAME+'</div>'+
		      						 		'<div class="reply">'+replyInfo[i].REPLY+'</div>'+
		      						 		'<div class="rep_date">'+replyInfo[i].REG_DATE+'</div>'+
		      						 	 '</div>'+
		      						 	 '<div class="rep_contents_footer">'+
		      							 	'<div class="rep_delete" id="reqDel'+chgNo+'">'+
		      							 		'<div class="delete_bt" id="delBt'+chgNo+'"><img src="/images/common/main/contents/del_icon.png"></div>'+
		      							 	'</div>'+
		      						 		'<div class="rep_like" id="reqLike'+chgNo+'">'+
		      						 			'<div class="like_bt" id="likeBt'+chgNo+'"><img src="/img/mobile/main/reply/best_off.png"></div>'+replyInfo[i].RECOMMENDATION+
		      						 		'</div>'+
		      						 	 '</div>'+
		      						 '</div>'+
		      			             '';
		      			$('.reply_contents').append(replyHtml);
		      			
		      			if(session_id == ''){  //세션이 없으면
		    	    			
		    	    	}else { 
			      			for(var j in likeInfo) { 
		    					//console.log('좋아요 컨텐츠 댓글 id:::::::'+likeInfo[j].CONTENTS_REPLY_ID );
		    					//console.log('댓글  컨텐츠 댓글 id:::::::'+replyInfo[i].CONTENTS_REPLY_ID );
	    						//console.log('i+1::'+(parseInt(i)+1));
	    						//console.log('j+1::'+(parseInt(j)+1));
	    						//console.log('세션 id::'+session_id);
	    						//console.log('ㅇㅇㅇㅇ::'+likeInfo[j].USER_ID);
		    					//좋아요 컨텐츠_댓글_id와 댓글 컨텐츠_댓글_id가 같고 좋아요플래그가 1이면 
		    					if( ( likeInfo[j].CONTENTS_REPLY_ID  == replyInfo[i].CONTENTS_REPLY_ID ) && ( likeInfo[j].LIKE_FLAG == '1') ){
		    					//if( ( session_id == likeInfo[j].USER_ID ) && ( likeInfo[j].LIKE_FLAG == '1') ){
		    						$('#likeBt'+chgNo+' img').attr('src','/img/mobile/main/reply/best_on.png');
		    					}//if
		    				}//for
			      		}//if
	    				
			      		chgNo = chgNo+1;
		      		}
		      		
      			}//for
	      	
			}//end success
		});//end ajax  
	} 
	
   	//최신순정렬 클릭
   	$('.newlist').on('click', function(){
   		
   		console.log('최신순정렬 클릭');
   		
		newListChk = true;    		
   		
   		$('.reply_contents').empty(); //지우기
   		
   		//최신순 이미지 on으로 바꾸기 
   		$('.newlist_bt img').attr('src', '/img/mobile/main/reply/newlist_on.png');
   		//인기순 이미지로 off로 바꾸기 
   		$('.bestlist_bt img').attr('src', '/img/mobile/main/reply/bestlist_off.png');
   		
   		var contents_id = getUrlParameter('contents_id');
   		
   		var session_id = $('#sessionId').val();
   		
   		$.ajax({
   			url: '/reply/new_list?contentsId='+contents_id,
   			async: false,
   			//type: 'GET',
   			success: function(data){
   				
   				var replyInfo = data.reply;
   	      		var likeInfo = data.likeInfo;
   				
   				for(var i=0; i<replyInfo.length; i++){
   					
   					//프로필 
   					var profilePath =  replyInfo[i].PROFILE_PICTURE_PATH;
   					//console.log(profilePath);
   					var profileIdx = profilePath.indexOf('/');
   					//console.log('indexOf:::::'+profileIdx);
   					var profile = profilePath.substring(profileIdx);
   					
   					
   					//댓글 등록일
   					//var rep_date = new Date(replyInfo[i].REG_DATE).format('yyyy.MM.dd HH:mm');
   					
   					var replyHtml = '';
   					replyHtml += ''+
   								 '<div class="rep_conts">'+
   								 	 '<input type="hidden" id="contentsReplyId'+(i+1)+'" value="'+replyInfo[i].CONTENTS_REPLY_ID+'">'+
   								 	 '<input type="hidden" id="userId'+(i+1)+'" value="'+replyInfo[i].USER_ID+'">'+
   									 '<div class="profile"><img src="'+profile+'"></div>'+
   								 	 '<div class="right_info">'+
   								 		'<div class="nickname">'+replyInfo[i].NIKNAME+'</div>'+
   								 		'<div class="reply">'+replyInfo[i].REPLY+'</div>'+
   								 		'<div class="rep_date">'+replyInfo[i].REG_DATE+'</div>'+
   								 	 '</div>'+
   								 	 '<div class="rep_contents_footer">'+
   									 	'<div class="rep_delete" id="reqDel'+(i+1)+'">'+
   									 		'<div class="delete_bt" id="delBt'+(i+1)+'"><img src="/images/common/main/contents/del_icon.png"></div>'+
   									 	'</div>'+
   								 		'<div class="rep_like" id="reqLike'+(i+1)+'">'+
   								 			'<div class="like_bt" id="likeBt'+(i+1)+'"><img src="/img/mobile/main/reply/best_off.png"></div>'+replyInfo[i].RECOMMENDATION+
   								 		'</div>'+
   								 	 '</div>'+
   								 '</div>'+
   					             '';
   					$('.reply_contents').append(replyHtml);
   				}//for
   				
   				//댓글 flag 
   				if(session_id == ''){  //세션이 없으면
   					
   				}else { 
   					for(var i in replyInfo) { 
   						for(var j in likeInfo) { 
   							//console.log('좋아요 컨텐츠 댓글 id:::::::'+likeInfo[j].CONTENTS_REPLY_ID );
   							//console.log('댓글  컨텐츠 댓글 id:::::::'+replyInfo[i].CONTENTS_REPLY_ID );
   							//좋아요 컨텐츠_댓글_id와 댓글 컨텐츠_댓글_id가 같고 좋아요플래그가 1이면 
   							if( ( likeInfo[j].CONTENTS_REPLY_ID  == replyInfo[i].CONTENTS_REPLY_ID ) && ( likeInfo[j].LIKE_FLAG == '1') ){
   								//console.log('i+1::'+(parseInt(i)+1));
   								//console.log('j+1::'+(parseInt(j)+1));
   								$('#likeBt'+(parseInt(i)+1)+' img').attr('src','/img/mobile/main/reply/best_on.png');
   							}//if
   						}//for
   					}//for
   				}//if 
   				
   			}//success 
   		});//ajax
   	});
	
	//인기순정렬 클릭
	$('.bestlist').on('click', function(){
		
		bestListChk = true; 
		
		$('.reply_contents').empty(); //지우기
		
		//최신순 이미지 off로 바꾸기 
		$('.newlist_bt img').attr('src', '/img/mobile/main/reply/newlist_off.png');
		//인기순 이미지 on으로 바꾸기 
		$('.bestlist_bt img').attr('src', '/img/mobile/main/reply/bestlist_on.png');
		
		var contents_id = getUrlParameter('contents_id');
   		
   		var session_id = $('#sessionId').val();
		
		$.ajax({
			url: '/reply/best_list?contentsId='+contents_id,
			async: false,
			//type: 'GET',
			success: function(data){
				
				var replyInfo = data.reply;
   	      		var likeInfo = data.likeInfo;
				
				for(var i=0; i<replyInfo.length; i++){
					
					//프로필 
					var profilePath =  replyInfo[i].PROFILE_PICTURE_PATH;
					//console.log(profilePath);
					var profileIdx = profilePath.indexOf('/');
					//console.log('indexOf:::::'+profileIdx);
					var profile = profilePath.substring(profileIdx);
					
					var replyHtml = '';
					replyHtml += ''+
								 '<div class="rep_conts">'+
								 	 '<input type="hidden" id="contentsReplyId'+(i+1)+'" value="'+replyInfo[i].CONTENTS_REPLY_ID+'">'+
								 	 '<input type="hidden" id="userId'+(i+1)+'" value="'+replyInfo[i].USER_ID+'">'+
									 '<div class="profile"><img src="'+profile+'"></div>'+
								 	 '<div class="right_info">'+
								 		'<div class="nickname">'+replyInfo[i].NIKNAME+'</div>'+
								 		'<div class="reply">'+replyInfo[i].REPLY+'</div>'+
								 		'<div class="rep_date">'+replyInfo[i].REG_DATE+'</div>'+
								 	 '</div>'+
								 	 '<div class="rep_contents_footer">'+
									 	'<div class="rep_delete" id="reqDel'+(i+1)+'">'+
									 		'<div class="delete_bt" id="delBt'+(i+1)+'"><img src="/images/common/main/contents/del_icon.png"></div>'+
									 	'</div>'+
								 		'<div class="rep_like" id="reqLike'+(i+1)+'">'+
								 			'<div class="like_bt" id="likeBt'+(i+1)+'"><img src="/img/mobile/main/reply/best_off.png"></div>'+replyInfo[i].RECOMMENDATION+
								 		'</div>'+
								 	 '</div>'+
								 '</div>'+
					             '';
					$('.reply_contents').append(replyHtml);
				}//for
				
				//댓글 flag 
				if(session_id == ''){  //세션이 없으면
					
				}else { 
					for(var i in replyInfo) { 
						for(var j in likeInfo) { 
							//console.log('좋아요 컨텐츠 댓글 id:::::::'+likeInfo[j].CONTENTS_REPLY_ID );
							//console.log('댓글  컨텐츠 댓글 id:::::::'+replyInfo[i].CONTENTS_REPLY_ID );
							//좋아요 컨텐츠_댓글_id와 댓글 컨텐츠_댓글_id가 같고 좋아요플래그가 1이면 
							if( ( likeInfo[j].CONTENTS_REPLY_ID  == replyInfo[i].CONTENTS_REPLY_ID ) && ( likeInfo[j].LIKE_FLAG == '1') ){
								//console.log('i+1::'+(parseInt(i)+1));
								//console.log('j+1::'+(parseInt(j)+1));
								$('#likeBt'+(parseInt(i)+1)+' img').attr('src','/img/mobile/main/reply/best_on.png');
							}//if
						}//for
					}//for
				}//if 
				
				/* //댓글 추천 func
				reqLikeFunc();
				
				//댓글 삭제 func
				delReplyFunc(); */
				
			}//success 
		});//ajax
	});  	
			
    //댓글 달기, 추천하기, 삭제하기 func  			
    function click_func(){
    	
    	var session_id = $('#sessionId').val();
    	console.log('session_id:::::????'+session_id);
    	
    	var contents_id = getUrlParameter('contents_id');
    	
    	$('.reply_footer').on('click', '.submit_reply', function(e){//댓글 등록
    		
    		//댓글 
    		var reply = $('#replyContents').val();
    		if(reply==''){
    			alert('댓글을 입력해주세요.');
    			return false;
    		}
    		
    		if(session_id == ''){ //세션이 없으면
    			alert('로그인시 이용 가능한 서비스입니다.');
    			$('.reply_footer .replyContents').attr('disabled', 'disabled');
    			$('.reply_footer .replyContents').attr('placeholder', '로그인이 필요한 서비스입니다.');
    			
    			e.preventDefault();
    		}else {  //세션이 있으면 댓글 달기 가능
    		
    			var fd = new FormData();
    			
    			fd.append('reply', reply);
    			fd.append('contents_id', contents_id);
    			
    			$.ajax({
    				url : '/reply/insert_reply',
    				data : fd,
    				type : 'POST',
    				processData : false,
    				contentType : false,
    				success : function(){
    					console.log('댓글 성공!');
    					location.reload();
    				}
    			});
    		}
    	});
      	
      	$('.reply_contents').on('click', '.rep_like', function(e){
			console.log('추천하기 클릭');
			var id = $(this).attr('id').split('reqLike')[1];
			console.log('id::'+id);
			
			var contentsReplyId = $('#contentsReplyId'+id+'').val();
			console.log('댓글 인덱스');
			console.log(contentsReplyId);
			
			console.log('session_id::'+session_id);
			
			if(session_id == ''){  //세션이 없으면
				e.preventDefault();
				alert('로그인시 이용 가능한 서비스입니다.');
			}else{ //세션이 있으면 추천하기 가능
				
				console.log('추천하기');
				//return false;
				var fd = new FormData();
				
				fd.append('contents_reply_id', contentsReplyId);
				fd.append('user_id', session_id);
				
				$.ajax({
					url : '/reply/update_like',
					data : fd,
					type : 'POST',
					processData : false,
					contentType : false,
					success : function(data){
						console.log('추천 성공!');
						location.reload();
					}
				});
			} 
		});
      	
      	$('.reply_contents').on('click', '.rep_delete', function(e){
			console.log('댓글 삭제');
			
			var id = $(this).attr('id').split('reqDel')[1];
			console.log('id::'+id);
			
			var contentsReplyId = $('#contentsReplyId'+id+'').val();
			console.log('contentsReplyId::::::::::::'+contentsReplyId);
			
			if(session_id != ''){ 
				var session_user_id = session_id;
				
				var reply_user_id = $('#userId'+id+'').val();
				
				console.log('session_user_id:::::::::::::'+session_user_id);
				console.log('reply_user_id :::::::::::::'+reply_user_id );
				
				if(session_user_id != reply_user_id){
					alert('작성하신 글만 삭제할 수 있습니다.');
					return false;
				}else {
					
					if( confirm('댓글을 삭제하시겠습니까?') == true ){//삭제
						$.ajax({
							url : '/reply/delete_reply?contents_reply_id='+contentsReplyId,
							type : 'POST',
							success : function(){
								location.reload();
							}//end success
						});//end ajax
					}else {//취소
						return;
					}//if
					//var fd = new Form fd;
					
				}//if
			}else {
				e.preventDefault();
				alert('로그인시 이용 가능한 서비스입니다.');
			}//if 
		});
    	
    }
	
	//무한 스크롤 구현
    $('.reply_contents').scroll(function() {
		chg_no = $("#chg_no").val();
 		console.log(chg_no);
 		
		//          스크롤의 위치값        윈도우의 크기
		var scrollHeight = $('.reply_contents').scrollTop() + $('.reply_contents').height();
		//현재페이지(문서)의 높이
		var documentHeight = $(document).height();
		console.log('documentHeight:'+documentHeight);
		console.log('scrollHeight:'+scrollHeight);
		//스크롤 위치값과 현재문서 높이가 같으면 = 스크롤을 끝까지 내리면 
		//if( (documentHeight - scrollHeight) > 40 ) {
		if( newListChk == false && bestListChk == false ){
			if( (documentHeight - scrollHeight) > 190 ) {
				////댓글 컨텐츠 view 함수 호출
				reply_func(chg_no);
				console.log('받는 값 chg_no::::'+chg_no);
			}//if
		}//if
    });
	
    
	$('.reply_close').on('click', function(){	//댓글 닫기
		console.log('댓글 닫기');
		history.go(-1);
	});
	
	$('.reply_refresh').on('click', function(){	//refresh
		location.reload();
	});
	
});//end ready

///////////////////////////////////////////////////////////////////////////////////////

/*** date format ***/
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};
Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
/*** date format ***/




