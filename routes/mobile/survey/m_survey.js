//fs - FileSystem을 구현하기 위한 모듈
var fs =require('fs');
//mysql - 모듈을 사용하기 위해 require함.
var mysql = require('mysql');

//db.client = Sql의 정보들을 지정하는 모듈이다.
var db = require('../../../db/db_base.js');

var url = require('url');

//client = Sql의 정보들을 지정하는 모듈이다.
/*var client = mysql.createConnection({
    host: '14.63.163.96',
    port: '3306',
    user: 'np_6',
    password: 'neopadDb',
    database: 'ido'
});*/

//모바일 index view
exports.viewSurvey = function(req, res){
	var uri = req.params.id;
	if(req.params.id=="reg_survey"){	//설문만들기
		res.render('builder/survey/m_regSurvey.ejs', { user: req.user });
	}else if(req.params.id == "reg_survey_type"){	//설문유형 등록
		res.render('builder/survey/m_survey.ejs', { user: req.user });
	}else if(req.params.id == "update_survey_type"){//설문유형 수정 
		console.log('::'+req.param('surveyTypeId'));
		var surveyTypeId= req.param('surveyTypeId');
		console.log('surveyTypeId::'+surveyTypeId);
		db.client.query('SELECT TB1.SURVEY_TYPE_ID, SUBSTRING_INDEX(TB1.SURVEY_TYPE, "N", 1) AS SURVEY_TYPE, IF( INSTR(TB1.SURVEY_TYPE,"N")!=0, SUBSTRING( TB1.SURVEY_TYPE, INSTR(TB1.SURVEY_TYPE,"N")+1, 1), NULL) AS ANSWER_NUM, TB1.SECOND_SURVEY_TITLE, TB1.SECOND_SURVEY_IMAGE_PATH, TB1.SECOND_SURVEY_CROP_IMAGE, '+
				 		' TB1.IMAGE_NAME, TB1.IMAGE_ORIGIN, TB1.IMAGE_LINK_ADDR,'+
				 		' TB2.SURVEY_CONTENTS_ID, TB2.SURVEY_CONTENTS, TB2.SURVEY_ORIGIN, TB2.SURVEY_LINK_ADDR, TB2.SURVEY_IMAGE_PATH, TB2.SURVEY_CROP_IMAGE'+
				 		' FROM SURVEY_TYPE_TB TB1'+
				 		' JOIN SURVEY_CONTENTS_TB TB2'+
				 		' ON TB1.SURVEY_TYPE_ID = TB2.SURVEY_TYPE_ID'+
						' WHERE TB1.SURVEY_TYPE_ID = ?', surveyTypeId, function(err, rst){
			console.log(err);
			console.log(rst);
			res.render('builder/survey/m_update_survey.ejs', { user: req.user, survey: rst });
		});
		
	} 
}

