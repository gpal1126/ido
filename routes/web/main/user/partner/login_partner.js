var mysql = require('mysql');
var base64_encode = require('base-64').encode;
var Buffer = require('buffer').Buffer;
var fs = require('fs');
var client = mysql.createConnection({
    host: '14.63.163.96',
    port: '3306',
    user: 'np_6',
    password: 'neopadDb',
    database: 'ido'
});
//파트너 리스트 화면
exports.login_form = function(req, res){
	fs.readFile('views/main/user/login_partner.html', function(error,data){
		res.writeHead(200,{'Content-Type':'text/html'});
		res.end(data);
	});
}

//로그인
exports.login_partner = function(req,res){
	console.log('세션!!!');
	console.log(req.user);
	if(typeof req.user == undefined){ // 로그인 안했을 때 Main화면 그냥 보여줌
//		res.render('index2.ejs', { user: req.user });
		res.render('main/user/login_partner.ejs', { user: req.user });
		console.log('비로그인!!!');
	}else{ //로그인시 session(req.user)값이 있으므로 index.ejs에 user값으로 같이 보냄.
		console.log('로그인시도!!!');
		console.log(req.user);
		var user_id = req.user.userId;
		client.query('SELECT USER_TYPE FROM IDO_USER_TB WHERE USER_ID = ?',[user_id], function(err,rst){
			console.log('유저아이디:::::::::::::');
			var user_type = rst[0].USER_TYPE;
			console.log(user_type);
			if(typeof req.user.emails =='undefined'){
				res.render('main/user/login_partner.ejs', { user: '회원가입이 필요한 서비스입니다.' });
			}else{
				if(user_type==1){//일반유저
					res.json('파트너 회원만 이용하실 수 있는 서비스입니다.');
				}else{//파트너 빌더 리스트
					//res.render('l');
				}
			}
		});
		/*if(typeof req.user.emails =='undefined'){
			res.render('index.ejs', { user: "회원가입이 필요합니다." });
		}else{
			console.log(req.user.emails);
			if(req.user.emails == 'admin@neopad.com'){
				console.log('admin')
				res.render('main/admin/admin.ejs');	
			}else{
				res.render('index.ejs', { user: req.user });	
			}
		}*/
	}
}
