var fs = require('fs');
var mysql = require('mysql');
var imagePath = 'resources/images/';
var url = require('url');
var formidable = require('formidable');
var client = mysql.createConnection({
    host: '14.63.163.96',
    port: '3306',
    user: 'np_6',
    password: 'neopadDb',
    database: 'ido'
});
exports.registerPartner = function(req,res){
	console.log('파트너 유저 등록');
	if(typeof req.session.passport == 'undefined' || req.session.passport.user == null){ //session(passport)값 유, 무에 따라 로그인창 띄워주기
		console.log('로그인화면 뿌리기');
	}else{
		res.render('main/user/partner.ejs', {session : req.session.passport.user.emails});
	}
};


exports.check_businessNumber = function(req,res){ //사업자 등록번호 체크부분(Nice 신용평가원 조회)
	var userId = req.query.businessNumber.split('-')[3]; //유저 세션값
	console.log(userId);
	res.json(userId);
};