 /** 상위 이동 **/
$(function(){
    $('#topMoveBtn').click(function(){
		window.scroll(0, 0);	
	});
});

//카테고리 검색
function selectCategory(categoryId, value){
  console.log('categoryId:::::::::'+categoryId);
  console.log('value:::::::::'+value);
  $('.listwrap').empty();
  call_image(0, value);
}