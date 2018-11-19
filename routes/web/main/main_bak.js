var fs =require('fs');
var mysql = require('mysql');
var client = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '1234',
	database : 'ido'
});

/** 메인 get 요청 **/
exports.contents_view = function(req, res){
	if(req.params.id == 'contents'){
		console.log('main들어옴');
		//view에서 요청받은 no값 - string
		var reqNo = req.param('no');
		var category = req.param('category');
		
		console.log(reqNo);
		//string -> int로 변환 - 쿼리에서 파라미터값으로 사용하기 위해
		reqNo = parseInt(reqNo);
		
		//다시 view단으로 응답할 no - 요청받은 no값에 +6씩 ex) 0, 3, 6
		var resNo = reqNo + 6;
		console.log(category);
		if(category == 'undefined'){
			client.query('SELECT CONTENTS_ID, TITLE, THUMBNAIL_CONTENTS, THUMBNAIL_IMAGE_PATH, CATEGORY, IMAGE_TYPE, DATE_FORMAT(REG_DATE, "%Y.%m.%d") REG_DATE FROM ido_contents_tb  WHERE contents_type=3 ORDER BY CONTENTS_ID DESC LIMIT ?, 6', parseInt(reqNo) , function(error, rst){
				// +3한 no값과 쿼리에서 조회한 file값 
				var result = {"no":resNo, "contents":rst, "category":category};
				console.log(rst);
				//view단으로 이미지 데이터 응답
				res.json(result);
			});
		}else{
			client.query('SELECT CONTENTS_ID, TITLE, THUMBNAIL_CONTENTS, THUMBNAIL_IMAGE_PATH, CATEGORY, IMAGE_TYPE, DATE_FORMAT(REG_DATE, "%Y.%m.%d") REG_DATE FROM ido_contents_tb where contents_type=3 and category like ?"%" ORDER BY CONTENTS_ID DESC LIMIT ?, 6', [category, parseInt(reqNo)] , function(error, rst){
			// +3한 no값과 쿼리에서 조회한 file값
				console.log(rst);
				var result = {"no":resNo, "contents":rst,"category":category};
				
				//view단으로 이미지 데이터 응답
				res.json(result);
			});
		}
		//DB에서 file값 최신순으로 읽어오기 - view단에서 요청받은 no부터 6개씩  
		
	}else if(req.params.id == 'category'){	//메인에 카테고리 뿌리기
		console.log('카테고리 가져오기');
		client.query('SELECT CATEGORY_ID, CTG_VALUE FROM CATEGORY_TB', function(err, rst){
			console.log(err);
			res.json(rst);
		});
	}
};

/** 메인 post 요청 **/
exports.contents = function(req, res){
	
};

