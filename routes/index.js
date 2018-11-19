var ejs = require('ejs');
exports.index = function(req, res){
	if(req.user == undefined){ // 로그인 안했을 때 Main화면 그냥 보여줌
//		res.render('index2.ejs', { user: req.user });
		res.render('main/index.ejs', { user: req.user });
	}else{ //로그인시 session(req.user)값이 있으므로 index.ejs에 user값으로 같이 보냄.
		if(typeof req.user.emails =='undefined'){
			res.render('main/index.ejs', { user: "회원가입이 필요합니다." });
		}else{
			console.log(req.user.emails);
			if(req.user.emails == 'admin@neopad.com'){
				console.log('admin')
				res.render('main/admin/admin.ejs');	
			}else{
				res.render('main/index.ejs', { user: req.user });	
			}
		}
	}
  
};