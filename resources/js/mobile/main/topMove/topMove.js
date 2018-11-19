$('#topMoveBtn').click(function(){ //상위 이동
	window.scroll(0, 0);	
});
function selectCategory(categoryId, value){
	console.log('categoryId:::::::::'+categoryId);
   	console.log('value:::::::::'+value);
   	$('#category').val(value);	//카테고리값 set
   	$('.left').empty();
   	$('.right').empty();
   	$('.wrap1').css('display','none');
   	$('.side_button_container').css('display','none');
   	$('.header').css({'position':'fixed'}); //헤더 고정
   	$('.flexslider').css('padding-top','45px');	//상단 배너 padding-top
   	$('#btnControl').attr('checked', false);
   	call_image(0, value);
}