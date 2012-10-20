
var http = require("http");
var fs = require("fs");
var url = require("url");
var httpServer = http.createServer(function(request, response) {
	var url_parts = url.parse(request.url, true);
	response.writeHeader(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin" : "*"});
	switch(url_parts.pathname){
		case '/register':
			users.push({
				name : url_parts.query.name,
				password : url_parts.query.password
			})
			response.end(JSON.stringify({
				success : true
			}));
			break;
		case '/login':
			var success = false; 
			for (var i = 0; i < users.length; i++) {
				if(url_parts.query.name === users[i].name &&
					url_parts.query.password === users[i].password){
					success = true;
					break;
				} 
			};
			response.end(JSON.stringify({
				success : success
			}));
			break;
		case '/update':
			var success = false; 
			for (var i = 0; i < users.length; i++) {
				if(url_parts.query.name === users[i].name &&
					url_parts.query.password === users[i].password &&
					url_parts.query.new_password){
					users[i].password = url_parts.query.new_password;
					success = true;
					break;
				} 
			};
			response.end(JSON.stringify({
				success : success
			}));
			break;
		default:
			response.end('404');
			break;
	}
	console.log(users)

}).listen(process.env.PORT || 5000);

var users= [];
