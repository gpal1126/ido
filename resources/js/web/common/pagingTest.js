
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
	
var curPageValue = new Value; 

var paging = {
	pageUtil : function(totalRecord, curPage){
		console.log('totalRecord::'+totalRecord);
		
		//var totalRecord	총 레코드수
		var recordSize=5;		//페이지당 보여질 레코드수	5개
		var totalPage;		//총 페이지수	
		var curPage;		//현재페이지
		var blockSize=5;		//블럭당 보여질 페이지수	5
		var startPage;		//블럭당 시작 페이지		1, 6, 11...
		var endPage;		//블럭당 마지막 페이지		5, 10, 15...
		var startRecordIdx; //curPos, 페이지당 시작 인덱스	0, 5, 10,...
		
		
		//총페이지 수
		totalPage = getTotalPage(totalRecord, recordSize);
		console.log('totalPage::'+totalPage);
		
		//if(curPage == undefined){
			//curPage = 1;
		//}else {
			//curPage = getCurPage(curPage);
			//curPage = curPageValue.getValue();
		//}
		//getCurPage(curPage);
		
		console.log('curPage::?????'+curPage);
		
		//블럭당 시작 페이지 
		startPage = getStartPage(curPage, blockSize); 
		
		//블럭당 마지막 페이지
		endPage = getEndPage(startPage, blockSize, totalPage);
		console.log('endPage::'+endPage);
		
		//페이지당 시작 인덱스
		startRecordIdx = getStartRecordIdx(curPage, recordSize);
		console.log('startRecordIdx::'+startRecordIdx);
		
		

		return {'recordSize':recordSize, 'totalPage':totalPage, 'curPage':curPage, 'blockSize':blockSize, 'startPage':startPage, 'endPage':endPage, 'startRecordIdx':startRecordIdx };
	}
}

/** 총페이지 수 **/
function getTotalPage(totalRecord, recordSize){
	totalPage = Math.ceil(totalRecord/recordSize);
	return totalPage;
}

/** 블럭당 시작 페이지 **/
function getStartPage(curPage, blockSize){
	startPage = curPage - ((curPage-1)%blockSize);;
	console.log('startPage::'+startPage);
	return startPage;
}

/** 블럭당 마지막 페이지 **/
function getEndPage(startPage, blockSize, totalPage){
	console.log('totalPage???'+totalPage);
	endPage = startPage+(blockSize-1);
	
	if(endPage > totalPage){
		endPage = totalPage;
	}
	
	return endPage;
}

/** 시작레코드 인덱스 **/
function getStartRecordIdx(curPage, recordSize){
	startRecordIdx = (curPage-1)*recordSize;
	return startRecordIdx;
}

/** pagination **/
function getPagination(startPage, endPage){
	console.log('페이징 뷰')
	var pagingHtml = '';
	pagingHtml += '◁ ';
	
	for(var i=startPage; i<=endPage; i++){
		console.log('i:'+i);
		
		pagingHtml += ''+
				  	 // '<a class="curPage" id="aTag'+i+'" href="javascript:getCurPage('+i+')">'+i+'</a>'+
				  	  //'<a class="curPage" id="aTag'+i+'" href="javascript:curPageValue.setValue('+i+')">'+i+'</a>'+
					  '<a class="curPage" id="aTag'+i+'" href="#">'+i+'</a>'+
				  	  '';
		
		if(i != endPage){
			pagingHtml += ' | ';
		}else {
			pagingHtml += '';
		}//if
		
	}//for
		
	pagingHtml += ' ▷';
	$('#paging').append(pagingHtml);
}

/** 현재페이지 **/
function getCurPage(curPage){
	curPageValue.setValue(curPage);
	var curPageVal = curPageValue.getValue();
	console.log('curPage::'+curPageVal);
	//return curPage;
	return curPageVal;
}