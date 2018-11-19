//파트너 리스트 화면
exports.main = function(req, res){
	if(req.params.id == 'partner_office'){
		console.log('partner_office');
		console.log(req.user)
		if(typeof req.user =='undefined'){
			//partner login 페이지 띄워주기
			console.log('login 요청');
		}else{
			//session 값 확인
			console.log(req.user.emails);
			if(req.user.emails == 'admin@neopad.com'){
				console.log('admin')
				res.render('main/admin/admin.ejs');	
			}else{
				//파트너 유저 신청화면
				res.render('index.ejs', { user: req.user });	
			}
		}
	}
}