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
					var json = {"contents_id":test}
					$.ajax({
						url:'/upload/delete_contents',
						data : json,
						success:function(){
							console.log('ff');
							location.reload();
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
	
	$('#new_contents').click(function(){
		var partnerId = $('#partnerId').val();
		window.open("/upload/builder_thumbnail?contents_id=new&partnerId="+partnerId+"", "에디터 새창", "width=1100, height=1100, toolbar=no, menubar=no, scrollbars=no, resizable=yes, top=-600" );
	});

	$('#m_new_contents').click(function(){
		var partnerId = $('#partnerId').val();
		/*window.open("/upload/builder_thumbnail?contents_id=new&partnerId="+partnerId+"", "에디터 새창", "width=1100, height=1100, toolbar=no, menubar=no, scrollbars=no, resizable=yes, top=-600" );*/
		//location.href="/upload/m_reg_survey?contents_id=new&partnerId="+partnerId;
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

	
})