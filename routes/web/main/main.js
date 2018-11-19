var fs =require('fs');
var mysql = require('mysql');
//client = Sql의 정보들을 지정하는 모듈이다.
var db = require('../../../db/db_base.js');

/*var client = mysql.createConnection({
    host: '14.63.163.96',
    port: '3306',
    user: 'np_6',
    password: 'neopadDb',
    database: 'ido'
});*/
/** 메인 get 요청 **/
exports.contents_view = function(req, res){	//web main 
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
			db.client.query('SELECT TB1.CONTENTS_ID, TB1.THUMBNAIL_CONTENTS, TB1.THUMBNAIL_IMAGE_PATH, SUBSTRING_INDEX(TB1.CATEGORY, "_", 1) AS CATEGORY, TB1.IMAGE_TYPE, DATE_FORMAT(TB1.REG_DATE, "%Y.%m.%d") REG_DATE'+
						' , TB2.SURVEY_ID'+
						' , TB3.SURVEY_TYPE, TB3.SECOND_SURVEY_TITLE, TB3.SECOND_SURVEY_IMAGE_PATH, TB3.SECOND_SURVEY_CROP_IMAGE'+
						' , TB4.SURVEY_IMAGE_PATH, TB4.SURVEY_CROP_IMAGE'+
						' , RCOUNT'+
						' FROM IDO_CONTENTS_TB TB1'+
						' JOIN SURVEY_TB TB2'+
						' ON TB1.CONTENTS_ID = TB2.CONTENTS_ID'+
						' JOIN SURVEY_TYPE_TB TB3'+
						' ON TB2.SURVEY_ID = TB3.SURVEY_ID'+
						' JOIN SURVEY_CONTENTS_TB TB4'+
						' ON TB3.SURVEY_TYPE_ID = TB4.SURVEY_TYPE_ID'+
						' JOIN'+
						' ( '+
						'  SELECT T1.CONTENTS_ID, COUNT(T2.CONTENTS_REPLY_ID) AS RCOUNT'+
						'  FROM IDO_CONTENTS_TB T1'+
						'  LEFT JOIN CONTENTS_REPLY_TB T2'+
						'  ON T1.CONTENTS_ID = T2.CONTENTS_ID'+
						'  GROUP BY T1.CONTENTS_ID'+
						' ) AS TB5'+
						' ON TB1.CONTENTS_ID = TB5.CONTENTS_ID'+
						' WHERE CONTENTS_TYPE=3'+ 
						' GROUP BY TB1.CONTENTS_ID'+
						' ORDER BY CONTENTS_ID'+ 
						' DESC LIMIT ?, 6', parseInt(reqNo) , function(error, rst){
				// +3한 no값과 쿼리에서 조회한 file값 
				var result = {"no":resNo, "contents":rst, "category":category};
				console.log(rst);
				//view단으로 이미지 데이터 응답
				res.json(result);
			});
		}else{
			db.client.query('SELECT TB1.CONTENTS_ID, TB1.THUMBNAIL_CONTENTS, TB1.THUMBNAIL_IMAGE_PATH, SUBSTRING_INDEX(TB1.CATEGORY, "_", 1) AS CATEGORY, TB1.IMAGE_TYPE, DATE_FORMAT(TB1.REG_DATE, "%Y.%m.%d") REG_DATE'+
						' , TB2.SURVEY_ID'+	
						' , TB3.SURVEY_TYPE, TB3.SECOND_SURVEY_TITLE, TB3.SECOND_SURVEY_IMAGE_PATH, TB3.SECOND_SURVEY_CROP_IMAGE'+
						' , TB4.SURVEY_IMAGE_PATH, TB4.SURVEY_CROP_IMAGE'+
						' , RCOUNT'+
						' FROM IDO_CONTENTS_TB TB1'+
						' JOIN SURVEY_TB TB2'+
						' ON TB1.CONTENTS_ID = TB2.CONTENTS_ID'+
						' JOIN SURVEY_TYPE_TB TB3'+
						' ON TB2.SURVEY_ID = TB3.SURVEY_ID'+
						' JOIN SURVEY_CONTENTS_TB TB4'+
						' ON TB3.SURVEY_TYPE_ID = TB4.SURVEY_TYPE_ID'+
						' JOIN'+
						' ( '+
						'  SELECT T1.CONTENTS_ID, COUNT(T2.CONTENTS_REPLY_ID) AS RCOUNT'+
						'  FROM IDO_CONTENTS_TB T1'+
						'  LEFT JOIN CONTENTS_REPLY_TB T2'+
						'  ON T1.CONTENTS_ID = T2.CONTENTS_ID'+
						'  GROUP BY T1.CONTENTS_ID'+
						' ) AS TB5'+
						' ON TB1.CONTENTS_ID = TB5.CONTENTS_ID'+
						' WHERE CONTENTS_TYPE=3'+ 
						' AND TB1.CATEGORY LIKE ?"%"'+ 
						' GROUP BY TB1.CONTENTS_ID'+
						' ORDER BY CONTENTS_ID'+ 
						' DESC LIMIT ?, 6', [category, parseInt(reqNo)] , function(error, rst){
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
		db.client.query('SELECT CATEGORY_ID, CTG_VALUE FROM CATEGORY_TB', function(err, rst){
			console.log(err);
			res.json(rst);
		});
	}
};

exports.view_origin_image = function(req, res){
	var surveyContentsId = req.param('surveyContentsId');
	db.client.query('SELECT TB1.SURVEY_TYPE, TB1.SECOND_SURVEY_IMAGE_PATH, TB1.IMAGE_NAME, TB1.IMAGE_ORIGIN, TB1.IMAGE_LINK_ADDR'+ 
					' ,TB2.SURVEY_IMAGE_PATH, TB2.SURVEY_CONTENTS, TB2.SURVEY_ORIGIN, TB2.SURVEY_LINK_ADDR'+
					' FROM SURVEY_TYPE_TB TB1'+
					' JOIN SURVEY_CONTENTS_TB TB2'+
					' ON TB1.SURVEY_TYPE_ID = TB2.SURVEY_TYPE_ID'+
					' WHERE TB2.SURVEY_CONTENTS_ID=?'+
					' GROUP BY TB1.SURVEY_TYPE_ID',[surveyContentsId], function(error, rst){
		if(error == null){
			console.log(rst);
			res.render('main/view_origin_image.ejs', { image: rst[0] });
		}
		
	});
}

/** 메인 post 요청 **/
exports.contents = function(req, res){
	
};

