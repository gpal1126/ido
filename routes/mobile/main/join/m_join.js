//fs - FileSystem을 구현하기 위한 모듈
var fs =require('fs');
//mysql - 모듈을 사용하기 위해 require함.
var mysql = require('mysql');
//htmlPath 지정   

var survey_dom_path = 'views/builder/survey/';
var url = require('url');

//client = Sql의 정보들을 지정하는 모듈이다.
var client = mysql.createConnection({
    host: '14.63.163.96',
    port: '3306',
    user: 'np_6',
    password: 'neopadDb',
    database: 'ido'
});

//모바일 index view
exports.joinUser_get = function(req, res){
	if(req.params.id == 'join_user'){
		fs.readFile('views/mobile/main/join/join_user.html', function(error,data){
			res.writeHead(200,{'Content-Type':'text/html'});
			res.end(data);
		});
	}
}

