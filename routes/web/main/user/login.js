var partner = require('./partner/partner.js');
var mysql = require('mysql');
var base64_encode = require('base-64').encode;
var base64_decode = require('base-64').decode;
var Buffer = require('buffer').Buffer;
var formidable = require('formidable');
var fs = require('fs');
var imagePath = 'resources/images/user_profile/';

//db.client = Sql의 정보들을 지정하는 모듈이다.
var db = require('../../../../db/db_base.js');

/*
var client = mysql.createConnection({
    host: '14.63.163.96',
    port: '3306',
    user: 'np_6',
    password: 'neopadDb',
    database: 'ido'
});
*/

exports.login = function(req,res){	
	
	res.render('main/user/m_login.ejs',  { contentsId: req.param('contentsId') });	
};


//차트결과화면에서 로그인 요청시
exports.m_login_mypage = function(req,res){
	console.log('모바일 m_login_mypage');
	console.log(req.user)
        //console.log('req.user.emails::::::::::'+req.user.emails);
        if(typeof req.user.emails =='undefined'){
            console.log('회원가입 필요!!!!!!');
            res.render('index.ejs', { user: "회원가입이 필요합니다." });
        }else{
            console.log(req.user.emails);
            if(req.user.emails == 'admin@neopad.com'){
                console.log('admin')
                res.render('main/admin/admin.ejs'); 
            }else{
                var user_id = req.user.userId;
                    res.redirect('/user/m_myPage?userId='+user_id+'');
            }
        }
    
}