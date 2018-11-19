$(document).ready(function(){
	   
//파트너 신청현황
    $.ajax({
      url : '/user/inqure_app_user',
      success:function(data){
    	  var userCode ='';
    	  var paper = {};
    	  for(i in data){
			  if(data[i].USER_CODE == '1'){
				  userCode = '<a href="#">일반유저</a>';
			  }else if(data[i].USER_CODE == '2'){
				  userCode = '<button id="apply_'+i+'">신청중</button>';
			  }
			  paper.a = data[i].DOCUMENT.split('_')[0];
			  paper.b = data[i].DOCUMENT.split('_')[1];
			  paper.c = data[i].DOCUMENT.split('_')[2];
  
		  if(paper.a == 'n'){
			  business_license = '<input type="checkbox" id="business_license'+i+'">사업자 등록증'
		  }else{
		  	business_license = '<input type="checkbox" id="business_license'+i+'" checked>사업자 등록증'
		  }
		  if(paper.b == 'n'){
			  seal_certification = '<input type="checkbox" id="seal_certification'+i+'">인감증명서'
		  }else{
		  	seal_certification = '<input type="checkbox" id="seal_certification'+i+'" checked>인감증명서'
		  }
		  if(paper.c == 'n'){
			  internet_business_license = '<input type="checkbox" id=internet_business_license'+i+'>통신판매업'
		  }else{
		  	internet_business_license = '<input type="checkbox" id=internet_business_license'+i+' checked>통신판매업'
		  }
		  $('#admin_tb_1').append('<tr class="text-center"><th><input type="checkbox" id="partner'+i+'"></th>'
								  +'<th id="partnerId'+data[i].PARTNER_ID+'">'+data[i].PARTNER_ID+'</th>'
		                          +'<th>'+Base64.decode(data[i].USER_EMAIL)+'</th>'
		                          +'<th name="document">'+business_license+'    '+seal_certification+'    '+internet_business_license+'    '+'</th>'
		                          +'<th>'+userCode+'</th>'
		                          +'<th>'+data[i].REG_DATE+'</th></tr>');
    	  }
    	  

    	  
    	  
//전체선택(체크박스) 아래 각 유저당 선택 function
$("input[id*=partner]").change(function () {
	$(this).parent().parent().children().children().prop('checked', $(this).prop("checked"));
});

//신청중 클릭 : 신청중 -> 처리완료(파트너유저로 전환됨)
$('button[id*=apply_]').on('click',function(){
	var checkboxs = $(this).parent().parent().children('th[name="document"]').children();
	var partnerId = $(this).parent().parent().children('th[id*="partnerId"]').attr('id');
	var json = {partnerId:partnerId.split('partnerId')[1]}; //파트너 아이디 보냄.
	console.log(json);
	
	var count = 0;
	checkboxs.each(function(){
		if($(this).is(':checked') == true){
			count ++;
		}				})
	if(count == 3){
		if(confirm("신청완료처리 하시겠습니까?")){
			$.ajax({
				url:'/user/success_application',
				data : json,
				success:function(){
				}
			})
		}else{
	
		}
	}else{
		alert('서류를 확인해주세요.');
			}
		})
	  }
});
    
  //컨텐츠 관리
	  $.ajax({
	      url : '/user/inqure_app_contents',
	      success:function(data){
	    	  console.log(data);
	    	  for(i in data){
	    		  var contents_type = data[i].CONTENTS_TYPE;
	    		  if(contents_type==2){
	    			  contents_type = '신청중'
	    		  }
  	    	  $('#contents_tb_1').append('<tr class="text-center"><th><input type="checkbox" id="partner'+i+'"></th>'
											  +'<th>'+data[i].CONTENTS_ID+'</th>'
					                          +'<th>'+data[i].PARTNER_ID+'</th>'
					                          +'<th><a href="/view_contents?contentsId='+data[i].CONTENTS_ID+'"" rel="modal:open">'+data[i].TITLE+'</a></th>'
					                          +'<th>'+data[i].REG_DATE+'</th>'
					                          +'<th><button id="contents_'+data[i].CONTENTS_ID+'">'+contents_type+'</button></th></tr>');
  	    	  }
	    	  
	    	  
	    	  $('button[id*=contents_]').click(function(){
	    			console.log($(this).attr('id'));
	    			var result = confirm('컨텐츠 승인 신청을 하시겠습니까?');
	    			var contenstId = $(this).attr('id').split('_')[1];
	    			console.log(contenstId)
	    			if(result){
	    				$.ajax({
	    					url:'/user/request_contents_confirm?contentsId='+contenstId,
	    					type: 'GET',
	    					success:function(){
	    						console.log('갔다옴');
	    						 window.location.reload();
	    					}
	    				})
	    			}else{
	    			}
	    		})  	
	      }
	  });
	  
	  
//승인처리
	 

//체크박스 전체 체크 function
$("#checkAll").change(function () {
	$("input:checkbox").prop('checked', $(this).prop("checked"));
});

//파트너 관리
$.ajax({
	url : '/user/manage_partner',
	success : function(data){
		for(i in data){
			 $('#admin_tb_2').append('<tr class="text-center"><th><input type="checkbox" id="partner'+i+'"></th>'
					  +'<th id="partnerId'+data[i].PARTNER_ID+'">'+data[i].PARTNER_ID+'</th>'
	                  +'<th>'+Base64.decode(data[i].USER_EMAIL)+'</th>'
	                  +'<th></th>'
	                  +'<th>'+data[i].REG_DATE+'</th></tr>');
			}
		}
})


//부트스트랩 관련 js
$("div.bhoechie-tab-menu>div.list-group>a").click(function(e) {
	e.preventDefault();
	$(this).siblings('a.active').removeClass("active");
	$(this).addClass("active");
	var index = $(this).index();
	$("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
	$("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
	});
});

