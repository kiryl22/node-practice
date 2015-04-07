var url = require('url'),
	cheerio = require('cheerio'),
	request = require('request'),
	async = require('async'),
	fs = require('fs'),
	argv = require('optimist').argv;

var rootUrl = argv.url,
	depth = argv.level,
	urls = []; //final array

var checkArgs = function () {
	if(!rootUrl || !depth) {
		console.log("Error: -url and -level required");
		return false;
	}
	return true;
}

var loadPageUrls = function(url, level, callback){
	request(url, function (error, response, html) {
		if(error){
			console.log(error);
			console.log(url);
			console.log('Continue...');
		}
		if(callback)
			callback(error, parse(html,level));
	});
}

var parse = function(html, level){
	var hrefs = [];
	if(html){
		var $ = cheerio.load(html);
		hrefs = $('a').map(function(e) {
			var href = $(this).attr('href');
			if(href && href.indexOf('http://') === 0 && urls.indexOf(href)=== -1){
			
					urls.push(href); //push to final array
					
					return function(cb){
						loadPage(href, level, cb);
					}
			}
		}).get();
	}
	return hrefs;
}

var split =function(funcs, cb){
	async.parallel(funcs, function(err, results){
		if(err){
			console.log(error);
		}
		cb(null, results);
	});
}

var loadPage = function(url, level, cb){
	if(level >= 0){
		async.waterfall([
			function(callback){
				loadPageUrls(url, --level, callback);
			},
			function(funcs, callback){

				if(level == 0){
					callback(null, null);
				}
				else{
					split(funcs, callback);
				}
			}
		], function (err, result) {
				cb(null, urls);
		});
	}
}

var saveResults = function(err, results){
	console.log("URLs found: " + results.length);
	fs.writeFile('results.json', JSON.stringify(results), function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log("Saved to results.json");
			console.log('Done.');
		}
	});
}

if(checkArgs()){
	console.log('Start...');
	loadPage(rootUrl, depth, saveResults)
}









