var partner = require('./partner/partner.js');
var mysql = require('mysql');
var base64_encode = require('base-64').encode;
var base64_decode = require('base-64').decode;
var Buffer = require('buffer').Buffer;
var nodemailer = require('nodemailer');	//이메일 발송	npm install nodemailer@0.7.1

//db.client = Sql의 정보들을 지정하는 모듈이다.
var db = require('../../../../db/db_base.js');

exports.get_user_info = function(req,res){
	if(req.params.id == 'find_pwd_form'){
		res.render('main/user/find_pwd.ejs');	
	}else if(req.params.id == 'find_pwd'){	//비밀번호 찾기
		var query = req.query;
		var email = req.query.email;
		var buf = new Buffer(email); //이메일값을 buffer로 바꿈
		var encoding_email = base64_encode(buf); //이메일값이 디코딩
		console.log('encoding_email:::'+encoding_email);
		db.client.query('SELECT PASSWORD FROM IDO_USER_TB WHERE USER_EMAIL=?', [ encoding_email ],function(err, rst){
			console.log(err);
			console.log(rst);
			if(rst[0] !== undefined){
				var smtpTransport = nodemailer.createTransport('SMTP', {
					service: 'gmail',
					host: 'smtp.gmail.com',
					port: 465,
					secure: true,
					auth: {
						user: 'neopad21@gmail.com',	//회사 계정 이메일
						pass: 'infobee21'	//회사 계정 비밀번호
						// https://www.google.com/settings/security/lesssecureapps 보안설정 사용으로 변경해야됨 
						// https://accounts.google.com/DisplayUnlockCaptcha 액세스 허용
					}
				});
				
				var mailOptions = {
						from: '네오패드<neopad@neopad.com>',
						to: email,
						subject: '아이두 회원계정 정보',
						text: '아이두 회원님의 비밀번호는 '+rst[0].PASSWORD+'입니다.'
				}
				
				smtpTransport.sendMail(mailOptions, function(error, res){
					if(error){
						console.log(error);
					}else {
						console.log('Message sent:'+res.message);
					}
					smtpTransport.close();
				});
				
				console.log(rst[0].PASSWORD);
				res.json(rst[0].PASSWORD);
			} else{
				console.log('not_find');
				res.json('not_find');
			}
		});
	}
};

