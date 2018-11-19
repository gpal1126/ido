//fs - FileSystem을 구현하기 위한 모듈
var fs =require('fs');
//mysql - 모듈을 사용하기 위해 require함.
var mysql = require('mysql');
//htmlPath 지정   
var htmlPath = 'resources/html/';
var imagePath = 'resources/images/';
var url = require('url');

//client = Sql의 정보들을 지정하는 모듈이다.
var db = require('../../../../db/db_base.js');

//모바일 index view
exports.m_index = function(req, res){
	res.render('main/mobile_index.ejs', { user: req.user });
	/*fs.readFile('resources/view/main/mobile_index.html', function(error,data){
		res.writeHead(200,{'Content-Type':'text/html'});
		res.end(data);
	});*/
}

exports.m_main = function(req, res){
	console.log('m_main들어옴');
	//view에서 요청받은 no값 - string
	var reqNo = req.param('no');
	var category = req.param('category');
	console.log(reqNo);
	//string -> int로 변환 - 쿼리에서 파라미터값으로 사용하기 위해
	reqNo = parseInt(reqNo);
	
	//다시 view단으로 응답할 no - 요청받은 no값에 +6씩 ex) 0, 3, 6
	var resNo = reqNo + 12;
	 if(category == 'undefined'){ 
	 	console.log('undefined')
		db.client.query('SELECT TB1.CONTENTS_ID, TB1.THUMBNAIL_CONTENTS, TB1.THUMBNAIL_IMAGE_PATH, SUBSTRING_INDEX(TB1.CATEGORY, "_", 1) AS CATEGORY, TB1.IMAGE_TYPE, DATE_FORMAT(TB1.REG_DATE, "%Y.%m.%d") REG_DATE,'+
					'TB2.SURVEY_ID,'+
					' TB3.SURVEY_TYPE, TB3.SECOND_SURVEY_TITLE, TB3.SECOND_SURVEY_IMAGE_PATH, TB3.SECOND_SURVEY_CROP_IMAGE, TB4.SURVEY_IMAGE_PATH, TB4.SURVEY_CROP_IMAGE'+
					' FROM IDO_CONTENTS_TB TB1'+
					' JOIN SURVEY_TB TB2'+
					' ON TB1.CONTENTS_ID = TB2.CONTENTS_ID'+
					' JOIN SURVEY_TYPE_TB TB3'+
					' ON TB2.SURVEY_ID = TB3.SURVEY_ID'+
					' JOIN SURVEY_CONTENTS_TB TB4'+
					' ON TB3.SURVEY_TYPE_ID = TB4.SURVEY_TYPE_ID'+
					' WHERE CONTENTS_TYPE=3'+ 
					' GROUP BY TB1.CONTENTS_ID'+
					' ORDER BY CONTENTS_ID'+ 
					' DESC LIMIT ?, 12', parseInt(reqNo) , function(error, rst){
			// +3한 no값과 쿼리에서 조회한 file값 
			var result = {"no":resNo, "contents":rst};
			console.log(rst);
			//console.log(rst);
			//view단으로 이미지 데이터 응답
			res.json(result);
		});
	 }else{
		db.client.query('SELECT TB1.CONTENTS_ID, TB1.THUMBNAIL_CONTENTS, TB1.THUMBNAIL_IMAGE_PATH, SUBSTRING_INDEX(TB1.CATEGORY, "_", 1) AS CATEGORY, TB1.IMAGE_TYPE, DATE_FORMAT(TB1.REG_DATE, "%Y.%m.%d") REG_DATE,'+
					'TB2.SURVEY_ID,'+	
					' TB3.SURVEY_TYPE, TB3.SECOND_SURVEY_TITLE, TB3.SECOND_SURVEY_IMAGE_PATH, TB3.SECOND_SURVEY_CROP_IMAGE, TB4.SURVEY_IMAGE_PATH, TB4.SURVEY_CROP_IMAGE'+
					' FROM IDO_CONTENTS_TB TB1'+
					' JOIN SURVEY_TB TB2'+
					' ON TB1.CONTENTS_ID = TB2.CONTENTS_ID'+
					' JOIN SURVEY_TYPE_TB TB3'+
					' ON TB2.SURVEY_ID = TB3.SURVEY_ID'+
					' JOIN SURVEY_CONTENTS_TB TB4'+
					' ON TB3.SURVEY_TYPE_ID = TB4.SURVEY_TYPE_ID'+
					' WHERE CONTENTS_TYPE=3'+ 
					' AND TB1.CATEGORY LIKE ?"%"'+ 
					' group by TB1.CONTENTS_ID'+
					' ORDER BY CONTENTS_ID'+ 
					' DESC LIMIT ?, 12', [category, parseInt(reqNo)] , function(error, rst){
			// +3한 no값과 쿼리에서 조회한 file값
			console.log(rst);
			var result = {"no":resNo, "contents":rst,"category":category};
			
			//view단으로 이미지 데이터 응답
			res.json(result);
		});
	 }

	//DB에서 file값 최신순으로 읽어오기 - view단에서 요청받은 no부터 6개씩   
	
};

//안드로이드 메인
exports.contents = function(req,res){
	console.log('Android 들어옴');
	//view에서 요청받은 no값 - string
	var reqNo = req.param('no');
	var category = req.param('category');
	console.log(reqNo);
	//string -> int로 변환 - 쿼리에서 파라미터값으로 사용하기 위해
	reqNo = parseInt(reqNo);
	
	//다시 view단으로 응답할 no - 요청받은 no값에 +6씩 ex) 0, 3, 6
	var resNo = reqNo + 12;
	 if(category == 'undefined'){ 
	 	console.log('undefined')
		db.client.query('SELECT TB1.CONTENTS_ID, TB1.THUMBNAIL_CONTENTS, TB1.THUMBNAIL_IMAGE_PATH, SUBSTRING_INDEX(TB1.CATEGORY, "_", 1) AS CATEGORY, TB1.IMAGE_TYPE, DATE_FORMAT(TB1.REG_DATE, "%Y.%m.%d") REG_DATE,'+
					'TB2.SURVEY_ID,'+
					' TB3.SURVEY_TYPE, TB3.SECOND_SURVEY_TITLE, TB3.SECOND_SURVEY_IMAGE_PATH, TB3.SECOND_SURVEY_CROP_IMAGE, TB4.SURVEY_IMAGE_PATH, TB4.SURVEY_CROP_IMAGE'+
					' FROM IDO_CONTENTS_TB TB1'+
					' JOIN SURVEY_TB TB2'+
					' ON TB1.CONTENTS_ID = TB2.CONTENTS_ID'+
					' JOIN SURVEY_TYPE_TB TB3'+
					' ON TB2.SURVEY_ID = TB3.SURVEY_ID'+
					' JOIN SURVEY_CONTENTS_TB TB4'+
					' ON TB3.SURVEY_TYPE_ID = TB4.SURVEY_TYPE_ID'+
					' WHERE CONTENTS_TYPE=3'+ 
					' GROUP BY TB1.CONTENTS_ID'+
					' ORDER BY CONTENTS_ID'+ 
					' DESC LIMIT ?, 12', parseInt(reqNo) , function(error, rst){
			// +3한 no값과 쿼리에서 조회한 file값 
			var result = {"no":resNo, "contents":rst};
			
			//view단으로 이미지 데이터 응답
			var json111 = {'CONTENTS_ID': 254, 'THUMBNAIL_CONTENTS': null,'THUMBNAIL_IMAGE_PATH': null, 'CATEGORY': 'fashion_bag',  'IMAGE_TYPE': 'N',
				    'REG_DATE': '2016.10.05',
				    'SURVEY_TYPE': '1',
				    'SECOND_SURVEY_TITLE': '당신의 선택은?',
				    'SECOND_SURVEY_IMAGE_PATH': null,
				    'SECOND_SURVEY_CROP_IMAGE': null,
				    'SURVEY_IMAGE_PATH': '/images/builder/survey/1/second_answer_origin/image_1_20160922214452.jpeg',
				    'SURVEY_CROP_IMAGE': '/images/builder/survey/1/second_answer/image_1_20160922214452.png' }
			var acc = JSON.stringify(rst);
			console.log(rst)
			res.end(acc);
		});
	 }else{
		db.client.query('SELECT TB1.CONTENTS_ID, TB1.THUMBNAIL_CONTENTS, TB1.THUMBNAIL_IMAGE_PATH, SUBSTRING_INDEX(TB1.CATEGORY, "_", 1) AS CATEGORY, TB1.IMAGE_TYPE, DATE_FORMAT(TB1.REG_DATE, "%Y.%m.%d") REG_DATE,'+
					'TB2.SURVEY_ID,'+
					' TB3.SURVEY_TYPE, TB3.SECOND_SURVEY_TITLE, TB3.SECOND_SURVEY_IMAGE_PATH, TB3.SECOND_SURVEY_CROP_IMAGE, TB4.SURVEY_IMAGE_PATH, TB4.SURVEY_CROP_IMAGE'+
					' FROM IDO_CONTENTS_TB TB1'+
					' JOIN SURVEY_TB TB2'+
					' ON TB1.CONTENTS_ID = TB2.CONTENTS_ID'+
					' JOIN SURVEY_TYPE_TB TB3'+
					' ON TB2.SURVEY_ID = TB3.SURVEY_ID'+
					' JOIN SURVEY_CONTENTS_TB TB4'+
					' ON TB3.SURVEY_TYPE_ID = TB4.SURVEY_TYPE_ID'+
					' WHERE CONTENTS_TYPE=3'+ 
					' AND TB1.CATEGORY LIKE ?"%"'+ 
					' group by TB1.CONTENTS_ID'+
					' ORDER BY CONTENTS_ID'+ 
					' DESC LIMIT ?, 12', [category, parseInt(reqNo)] , function(error, rst){

			//view단으로 이미지 데이터 응답 안드로이드로 보내기 위함 
			
			console.log(rst)
			var acc = JSON.stringify(rst);
			//console.log(acc);
			res.end(acc);
		});
	 }
	
};



exports.checkSurvey = function(req,res){
	db.client.query('SELECT CONTENTS_ID FROM SURVEY_TB', function(error, rst){
		res.json(rst);
	});
};

//원본 이미지 보기위해
exports.view_origin_image = function(req,res){
	var surveyContentsId = req.param('surveyContentsId');
	db.client.query('SELECT TB1.SURVEY_TYPE, TB1.SECOND_SURVEY_IMAGE_PATH, TB1.IMAGE_NAME, TB1.IMAGE_ORIGIN, TB1.IMAGE_LINK_ADDR'+ 
					' ,TB2.SURVEY_IMAGE_PATH, TB2.SURVEY_CONTENTS, TB2.SURVEY_ORIGIN, TB2.SURVEY_LINK_ADDR'+
					' FROM SURVEY_TYPE_TB TB1'+
					' JOIN SURVEY_CONTENTS_TB TB2'+
					' ON TB1.SURVEY_TYPE_ID = TB2.SURVEY_TYPE_ID'+
					' WHERE TB2.SURVEY_CONTENTS_ID=?'+
					' GROUP BY TB1.SURVEY_TYPE_ID',[surveyContentsId], function(error, rst){
		if(error == null){
			res.render('main/view_origin_image.ejs', { image: rst[0] });
		}
		
	});
}