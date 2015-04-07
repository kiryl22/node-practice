var url = require('url'),
	cheerio = require('cheerio'),
	request = require('request'),
	async = require('async'),
	fs = require('fs'),
	argv = require('optimist').argv;

var rootUrl = argv.url,
	depth = argv.level,
	resultFileName = "results.json",
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
		//if(error) console.log("Unable to load:" + url);
		callback(null, parse(html,level));
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

				if(level == 0)
					return href;

				return function (cb) {
					crawl(href, level, cb);
					}
			}
		}).get();
	}
	return hrefs;
}

var split =function(funcs, cb){
	async.parallel(funcs, function(err){
		cb(err);
	});
}

var crawl = function(url, level, cb){
		async.waterfall([
			function(callback){
				loadPageUrls(url, --level, callback);
			},
			function(res, callback){

				if(level == 0){
					callback(null);
				}
				else{
					split(res, callback);
				}
			}
		], function (err) {
				cb(err); //will be executed when all splits are finished
		});
}

var saveResults = function(err){
	if (err) {
		console.log(err);
	}

	console.log("URLs found: " + urls.length);

	fs.writeFile(resultFileName, JSON.stringify(urls), function (error) {
		if (error) {
			console.log(error);
		} else {
			console.log("Saved to " + resultFileName);
			console.log('Done.');
		}
	});
}

if(checkArgs()){
	console.log('Start...');
	crawl(rootUrl, depth, saveResults)
}









