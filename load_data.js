var request=require('request');

var KEY = "926d2a79e82920b62f03b1cb57e532e6";
var URL = "http://api.themoviedb.org/2.1/Movie.getInfo/en/json/"+KEY;
          

exports.load_movie = function(id,cb) {
	request(URL+"/"+id,function(err,data) {
		cb(err,JSON.parse(data.body)[0]);
	});
}


/*                                 
node
var x=require("./load_data");
x.load_movie(600,console.log)
*/