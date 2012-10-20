var http = require("http");
var fs = require("fs");
var url = require("url");
var httpServer = http.createServer(function(request, response) {
	var url_parts = url.parse(request.url, true);
	switch(url_parts.pathname){
		case '/':
			response.writeHeader(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin" : "*"});
			response.end(JSON.stringify(words[0]));
			break;
		case '/match':
		case '/match/':

			response.writeHeader(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin" : "*"});
			response.end(JSON.stringify((words[1][url_parts.query.id].correct == url_parts.query.guess)));
			break;
		default:
			response.writeHeader(404, {"Content-Type": "text/html", "Access-Control-Allow-Origin" : "*"});
			response.end('404');
			break;
	}

}).listen(process.env.PORT || 5000);

var words;
function getWords(){
	words = ['hello', 'world']
	http.get("http://pipes.yahoo.com/pipes/pipe.run?_id=98ceaa94c5515da31f4c85af3b71e33c&_render=json", function(res) {
			var data = '';

	    res.on('data', function (chunk){
	        data += chunk;
	    });

	    res.on('end',function(){
	       var obj = JSON.parse(data);
	       words = parse(obj)
	    })
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});;
}
var parse = function(obj) {
        var arr = [],
                shuffArr = [] ,
                maxItems = 10,
                minLength = 5,
                id = 0;

        for (var i = 0; i < obj.value.items.length; i++) {
                var items = obj.value.items[i]['y:title'].match(/([^\s][a-z]+)/g)

                for (var j = 0; j < items.length; j++) {
                        if ( items[j].length > minLength ) {
                                arr.push({ 'id': id, 'correct': items[j].toLowerCase().replace('-','') });
                                shuffArr.push({ 'id': id });
                                id++;
                        }

                        if ( arr.length >= maxItems )
                                break;
                };
                if ( arr.length >= maxItems )
                        break;
        };
        for (var i = 0; i < arr.length; i++) {
                var w = arr[i].correct.split(''),
                        shuffled = w.sort( function() {
                                return 0.5 - Math.random();
                        } ).join('');

                arr[i].word = shuffled;
                shuffArr[i].word = shuffled;
        };

      

        return [shuffArr,arr];
}


getWords();