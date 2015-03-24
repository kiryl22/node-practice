var request = require('request');
var argv = require('optimist').argv;
var cheerio = require('cheerio');
var stringformat = require('stringformat');
stringformat.extendString('format');

(function Main(argv) {
	var productName = argv.product ? argv.product : argv.p;
	
	if(productName) {
		var catalogUrl ="http://catalog.onliner.by/search?query=";
		var offersSelector = '.poffers';
		var nameSelector = '.pname a';
		var priceSelector = '.pprice a';
		var requestUrl = catalogUrl + productName;
		
		request(requestUrl, function (error, response, html) {
			if (!error && response.statusCode == 200) {
			
				var $ = cheerio.load(html);
				var offers = $(offersSelector);
				
				if(offers && offers.length > 0) {		
					var targetOffer = offers[0];
					var product = $(targetOffer).prev().find(nameSelector).text();
					var price = $(targetOffer).find(priceSelector).text();
					
					LogPrice(price, product)
				}
				else {
					console.log("No product offers found");	
				}	
			}
			else {
				console.log(error);	
			}
		})
	}else {
		console.log("Error: Product name required");
	}
})(argv);

function LogPrice(price, product) {
	var price = price.replace(/\n/g,'').replace(/ /g,'').replace('-',' - ').replace('руб','BR');
	var product = product.trim();
	console.log("\nProduct: {1}\nPrice: {0} ".format(price, product));
}



