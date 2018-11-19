var http = require('http');
var express = require('express')
  , router = express.Router();
var routes = require('./routes');

var main = require('./routes/web/main/main.js');
var m_main = require('./routes/mobile/main/contents/main_contents.js'); //mobile 서버
var m_survey = require('./routes/mobile/survey/m_survey.js'); //mobile 서버
var m_join = require('./routes/mobile/main/join/m_join.js'); //mobile 서버
var ido_login = require('./routes/web/main/user/login.js');
var user = require('./routes/web/main/user/manage_user.js') //유저관리
var partner = require('./routes/web/partner/partner.js');
var login = require('./routes/web/main/login/login.js') // 로그인 관련
var id_check = require('./routes/web/main/login/id_check.js') //id확인
var survey = require('./routes/web/survey/survey.js') //survey관련
var a_survey = require('./routes/web/survey/a_survey.js') //survey관련
//builder 관련
var upload = require('./routes/web/builder/upload.js') // 이미지 업로드 관련
var viewContents = require('./routes/web/contents/contents.js') //컨텐츠 띄우기.
var reply = require('./routes/web/main/reply/reply.js');	//메인 컨텐츠 댓글 관련
var path = require('path');
var login_partner = require('./routes/web/main/user/partner/login_partner.js');	//파트너 로그인 화면
var user_info = require('./routes/web/main/user/user_info.js') // 유저 정보 찾기 관련


var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
//삭
var allowCORS = function(req, res, next) {
	  res.header('Acess-Control-Allow-Origin', '*');
	  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	  (req.method === 'OPTIONS') ?
	    res.send(200) :
	    next();
};
var imagePath = 'resources/images/builder/contents/'; //********** 이미지 저장 경로를 바꾸고 싶으면 이쪽 path를 변경해주면 된다.
var realPath = '/images/builder/contents/';
var url = require('url');
var formidable = require('formidable');
//삭제	
var multer = require('multer');
var errorHandler = require('errorhandler');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var NaverStrategy = require('passport-naver').Strategy;
var KakaoStrategy = require('passport-kakao').Strategy;

var CORS = require('cors')();//크로
var base64_encode = require('base-64').encode;
var base64_decode = require('base-64').decode;
var Buffer = require('buffer').Buffer;
var mysql = require('mysql');
var client = mysql.createPool({
    host: '14.63.163.96',
    port: '3306',
    user: 'np_6',
    password: 'neopadDb',
    database: 'ido'
});

var fs =require('fs');	//fs 추가

var flash = require('connect-flash')
var app = express();

// all environments
app.set('port', process.env.PORT || 5555);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(allowCORS); //크로스 
app.use(CORS);// 크로스
app.use(methodOverride());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'resources')));
app.use('/upload', express.static(path.join(__dirname, 'resources'))); //upload부분은 path경로추가


/*app.get('/pp', function(req,res){
	fs.readFile('views/main/user/pp.html', function(error,data){
		res.writeHead(200,{'Content-Type':'text/html'});
		res.end(data);
	});
})*/


app.get('/agree1', function(req,res){
	res.send('<article class="terms" style="color:white;">'+
	        	'<h1>서비스이용 약관 </h1>'+ 
	        	'<h2> 제1조 (목적)</h2>'+ 
	        	'<p class="termcon"> 본 약관은 서비스이용자가 주식회사 아이두(이하 "회사"라 합니다.) 가 제공하는 온라인상의 인터넷서비스(이하 "서비스" 라고하며,'+
	        	'접속가능한 유,무선 단말기의 종류와는 상관없이 이용가능한 "회사"가 제공하는 모든 "서비스"를 의미합니다. 이하 같습니다. )에'+ 
	        	'회원으로 가입하고 이를 이용함에 있어 회사와 회원(본 약관에 동의하고 회원등록을 완료한 서비스 이용자를 말합니다. 이하 "회원 이라고'+
	        	'합니다.) 의 권리. 의무 및 책임사항을 규정함을 목적으로 합니다. </p>'+ 
	        	'<h2> 제2조 (목적)</h2>'+
	        	'<p class="termcon"> 본 약관은 서비스이용자가 주식회사 네오패드(이하 "회사"라 합니다.) 가 제공하는 온라인상의 인터네서비스(이하 "서비스" 라고하며,'+
	        	'접속가능한 유,무선 단말기의 종류와는 상관없이 이용가능한 "회사"가 제공하는 모든 "서비스"를 의미합니다. 이하 같습니다. )에'+ 
	        	'회원으로 가입하고 이를 이용함에 있어 회사와 회원(본 약관에 동의하고 회원등록을 완료한 서비스 이용자를 말합니다. 이하 "회원 이라고'+
	        	'합니다.) 의 권리. 의무 및 책임사항을 규정함을 목적으로 합니다. </p>'+ 
	    	'</article>')
})

app.get('/agree2', function(req,res){
	res.send('<article class="terms" style="color:white;">'+
        	'<h1>개인정보취급방침 </h1> '+
        	'<h2> 제1조 (목적)</h2> '+
        	'<p class="termcon"> 본 약관은 서비스이용자가 주식회사 네오패드(이하 "회사"라 합니다.) 가 제공하는 온라인상의 인터넷서비스(이하 "서비스" 라고하며,'+
        	'접속가능한 유,무선 단말기의 종류와는 상관없이 이용가능한 "회사"가 제공하는 모든 "서비스"를 의미합니다. 이하 같습니다. )에 '+
        	'회원으로 가입하고 이를 이용함에 있어 회사와 회원(본 약관에 동의하고 회원등록을 완료한 서비스 이용자를 말합니다. 이하 "회원 이라고'+
        	'합니다.) 의 권리. 의무 및 책임사항을 규정함을 목적으로 합니다. </p> '+
        	'<h2> 제2조 (목적)</h2> '+
        	'<p class="termcon"> 본 약관은 서비스이용자가 주식회사 아이두(이하 "회사"라 합니다.) 가 제공하는 온라인상의 인터네서비스(이하 "서비스" 라고하며,'+
        	'접속가능한 유,무선 단말기의 종류와는 상관없이 이용가능한 "회사"가 제공하는 모든 "서비스"를 의미합니다. 이하 같습니다. )에' +
        	'회원으로 가입하고 이를 이용함에 있어 회사와 회원(본 약관에 동의하고 회원등록을 완료한 서비스 이용자를 말합니다. 이하 "회원 이라고'+
        	'합니다.) 의 권리. 의무 및 책임사항을 규정함을 목적으로 합니다. </p> '+
    	'</article>')
})
app.use(flash());	//flash 추가

app.get('/', routes.index);

// error handling middleware should be loaded after the loading the routes
if ('development' == app.get('env')) {
  app.use(errorHandler()); 
}


// [ Main ]
	//Mobile Main
app.get('/m_main', m_main.m_main);
//mobile_index view
app.get('/m_index', m_main.m_index);

//자세히 보기 페이지 mobile
app.get('/m_view_origin_image', m_main.m_view_origin_image);

app.route('/m_main_contents')
.get(m_main.contents);
app.route('/m_survey/:id')
.get(m_survey.viewSurvey)

app.route('/m_join/:id')
.get(m_join.joinUser_get);


	//Web Main
app.route('/main_contents/:id')
.get(main.contents_view)
.post(main.contents);
app.get('/checkSurvey', m_main.checkSurvey);

//자세히 보기 페이지 web
app.get('/view_origin_image', main.view_origin_image);

//Login
app.get('/main_login', login.login);
app.get('/m_main_login', login.m_login);
app.get('/logout', login.logout);

app.route('/ido_login').get(ido_login.login);
app.route('/m_login_mypage').get(ido_login.m_login_mypage);


// 회원가입부분
app.route('/sign_in')
.post(login.sign_in);
	// 회원가입 -> id_checheck
	app.get('/check_id/:id', id_check.check_id);

	
app.get('/partner/:id', partner.main);
// [ Builder ]
	// -upload
app.route('/upload/:id')
.get(upload.upload_form)
.post(upload.post_upload);

// [ User ]
app.route('/user/:id')
.get(user.manage_user)
.post(user.p_manager_user);

// [View Contents]
//pc
app.route('/view_contents')
.get(viewContents.contents);

//mobile - 모바일 컨텐츠
app.route('/m_contents')
.get(viewContents.m_contents);
//컨텐츠 ajax
app.route('/m_contents_view')
.get(viewContents.m_contents_view);

//컨텐츠 ajax
app.route('/a_contents_view')
.get(viewContents.a_contents_view);

//컨텐츠 검색 모바일 view
/*app.route('/m_search_contents_view')
.get(viewContents.m_search_contents_view);*/

//컨텐츠 검색 view
app.route('/search_contents_view')
.get(viewContents.search_contents_view);
//컨텐츠 검색
app.route('/search_contents')
.get(viewContents.search_contents);

app.get('/m_index/chart', function(req,res){
	console.log('--------------')
	console.log(req.param('data'))
	res.render('main/contents/chart.ejs', {data:req.param('data')});
})

// [ Survey ]
app.route('/survey/:id')
.get(survey.survey_form)
.post(survey.p_survey)


app.route('/a_survey/:id')
.get(a_survey.a_survey)

// [ Reply ]
app.route('/reply/:id')
.get(reply.get_reply)
.post(reply.post_reply);

// [ Login_partner ]
app.route('/login_partner/:id')
.get(login_partner.login_form)
.post(login_partner.login_partner);

// [ Login_partner ] 유저 정보 찾기
app.route('/user_info/:id')
.get(user_info.get_user_info)
//.post(user_info.post_user_info);


app.route('/admin')
.get(user.admin);

app.use('/', router); //라우터를 실행해주는 middleware
var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



app.get('/join_check_survey',function(req,res){
	var userId = req.query.userId;
	var surveyId = req.query.surveyId;
	client.query('SELECT ANSWER FROM SURVEY_ANSWER_TB WHERE USER_ID=? AND SURVEY_ID =?',[userId, surveyId], function(error,result){
		console.log('result[0]::::');
		console.log(result[0]);
		if(typeof result[0] == 'undefined'){
			//처음 참여일 경우
			res.json('join_ok')
		}else{
			//참여했을 경우
			res.json('join_no')
		}
		
	})
})


app.get('/hangul',function(req, res){
	fs.readFile('views/hangul.html', function(error,data){
		res.writeHead(200,{'Content-Type':'text/html'});
		res.end(data);
	});
})




///////////////////////////////로그인 쪽 - 추후에 학습후 다른곳으로 옮기자


//Passport 로컬
passport.use(new LocalStrategy({
	usernameField : 'userid',
	passwordField : 'password',
	passReqToCallback : true
},
function(req, userid, password, done) {
	console.log('일단 여기로 들어옴')
	var email = userid;
	var buf = new Buffer(email); //이메일값을 buffer로 바꿈
	var incoding_data = base64_encode(buf); //이메일값이 인코딩 되어서 들어감
	console.log(incoding_data)
	console.log(password)
	client.query('select * from IDO_USER_TB where user_email = ? and password = ?', [incoding_data, password], function(e,r){
		if(r[0] == undefined){ //값이 없으면 로그인 실패
			return done(null,false);
		}else{ //값이 있으면 fail
			var dec_email = base64_decode(r[0].USER_EMAIL);
			
			var profilePic = r[0].PROFILE_PICTURE_PATH.split('resources')[1];
			/*if(typeof profilePic == 'undefined'){
				profilePic = '/images/common/main/noprofile.png'
			}*/
			 var user = {'emails':dec_email, 'userId':r[0].USER_ID, "nickname":r[0].NIKNAME, "profileImg":profilePic, 'userCode':r[0].USER_CODE};
			 return done(null,user);
		}
	});	
}));



passport.serializeUser(function(user, done) {
	console.log('serializeUser');
	
	  done(null, user); //세션에 userID값만 저장한다.
	});

	passport.deserializeUser(function(user, done) {
		console.log('deserializeUser')
		 done(null, user); //req.user <--- 여기 안에 userid값이 저장되고 콜백함.
	});

//Passport FaceBook
passport.use(new FacebookStrategy({
	clientID: '508794649269040',
    clientSecret: '10f047768363b9208dd1c6ec90dc449d',
    callbackURL: "http://www.ido.center/auth/facebook/callback",
    profileFields: ['id', 'name', 'photos', 'emails']
  },
  function(accessToken, refreshToken, profile, done) {
	  console.log(profile);
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

passport.use(new NaverStrategy({
    clientID: "zUxl6Kbm07hl8YYqnWfX",
    clientSecret: "RvsWCxmHyc",
    callbackURL: "http://www.ido.center/auth/naver/callback"
},
function(accessToken, refreshToken, profile, done) {
	console.log(profile);
    process.nextTick(function () {
      return done(null, profile);
    });
}
));


//Local 로그인
app.post('/login',
		  passport.authenticate('local', { failureRedirect: '/login_error', failureFlash: true }),
		  function(req, res) {
		    res.redirect('/main_login');
		  });

//Local 로그인
app.post('/m_login/:id',
		  passport.authenticate('local', { failureRedirect: '/login_error', failureFlash: true }),
		  function(req, res) {
			console.log(req.params);
			if(req.params.id == 'mypage'){
				res.redirect('/m_login_mypage')
			}else if(req.params.id == 'contentsId'){
				console.log('컨텐츠 아이디 들어옴')
				res.redirect('/m_index')
			}else if(req.params.id =='app'){
				console.log(req.user)
				res.json(req.user)
			}else{
				console.log('--------들어옴')
				res.redirect('/m_main_login');	
			}
		    
		  });

//로그인 에러 페이지
app.get('/login_error', function(req, res){
	console.log('진짜 여기로 들어오나?')
	
	console.log(typeof req.user)
	if( typeof req.user == 'undefined'){	//웹일 경우
		/*fs.readFile('views/main/user/login_error.html', function(error,data){
			res.writeHead(200,{'Content-Type':'text/html'});
			res.end(data);
		});*/
		
		res.render('main/user/m_login_partner.ejs');	
	}else {	//안드로이드일 경우
		console.log('여기는 안드로이드 에러')
		res.json(req.user)
	}

}); 

//FaceBook 로그인
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
		  passport.authenticate('facebook', { failureRedirect: '/', failureFlash: true }),
		  function(req, res){
	 		res.redirect('/check_id/facebook');
		});
	
//Naver 로그인
app.get('/auth/naver', passport.authenticate('naver'));
app.get('/auth/naver/callback',
		  passport.authenticate('naver', { failureRedirect: '/', failureFlash: true }),
		  function(req, res){
			res.redirect('/check_id/naver');
		});


function ensureAuthenticated(req, res, next) {
	console.log(req.isAuthenticated());
	  if (req.isAuthenticated()) { return next(); }
	  res.redirect('/');
	}